# serializers.py
from decimal import Decimal
from rest_framework import serializers
from .models import Company, Product, Order, OrderItem


# serializers.py
from decimal import Decimal
from rest_framework import serializers
from .models import Company, Product, Order, OrderItem


class ProductSerializer(serializers.ModelSerializer):
    price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "external_id",
            "product_type",
            "price",
            "base_price",
            "brand",
            "gtin",
            "mpn",
            "image_url",
            "product_url",
            "availability",
            "active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def _get_current_company(self, request):
        if not request:
            return None

        if not hasattr(request, "_cached_company"):
            company_id = request.session.get("company_id")
            if company_id:
                try:
                    request._cached_company = Company.objects.get(pk=company_id)
                except Company.DoesNotExist:
                    request._cached_company = None
            else:
                request._cached_company = None
        return request._cached_company

    def get_price(self, obj):
        request = self.context.get("request")
        company = self._get_current_company(request)

        if company:
            # Räknar ut påslaget för produkten
            calculated = company.calculate_price(obj.base_price)
            return float(calculated)

        return float(obj.base_price)


class CompanySerializer(serializers.ModelSerializer):
    allowed_phones = ProductSerializer(many=True, read_only=True)
    allowed_phone_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Product.objects.filter(product_type="phone"),
        source="allowed_phones",
        write_only=True,
        required=False,
    )

    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "company_code",
            "organization_number",
            "price_markup",
            "has_phone_policy",
            "allowed_phones",
            "allowed_phone_ids",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, attrs):
        has_phone_policy = attrs.get(
            "has_phone_policy",
            getattr(self.instance, "has_phone_policy", False),
        )
        allowed_phones = attrs.get("allowed_phones")

        if has_phone_policy and allowed_phones is not None and not allowed_phones:
            raise serializers.ValidationError(
                {
                    "allowed_phone_ids": (
                        "Minst en telefon måste vara tillåten "
                        "när telefonpolicy är aktiverad."
                    )
                }
            )
        return attrs


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(active=True),
        source="product",
        write_only=True,
    )

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_id",
            "quantity",
            "unit_price",
        ]
        read_only_fields = ["id", "unit_price"]


class OrderSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "company",
            "organization_number",
            "ordered_by",
            "comment",
            "status",
            "order_number",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "company",
            "status",
            "order_number",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        request = self.context["request"]
        company_id = request.session.get("company_id")

        if not company_id:
            raise serializers.ValidationError("Ingen inloggad företagskund hittades.")

        company = Company.objects.get(pk=company_id)

        order = Order.objects.create(
            company=company,
            organization_number=company.organization_number,
            **validated_data,
        )

        for item_data in items_data:
            product = item_data["product"]

            if company.has_phone_policy and product.product_type == "phone":
                if not company.allowed_phones.filter(pk=product.pk).exists():
                    raise serializers.ValidationError(
                        {
                            "items": f"{product.name} är inte tillåten för detta företag."
                        }
                    )

            # Sätter korrekt enhetspris med företagets påslag
            actual_unit_price = company.calculate_price(product.base_price)

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item_data["quantity"],
                unit_price=actual_unit_price,
            )

        return order