# serializers.py
from decimal import Decimal
from rest_framework import serializers
from .models import Company, Product, Order, OrderItem
from .emails import send_order_notification_email

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
            calculated = company.calculate_price(obj)
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
        items_data = validated_data.pop("items", [])
        org_nr_from_data = validated_data.pop("organization_number", None)

        request = self.context.get("request")
        company = None
        if request and request.session.get("company_id"):
            company = Company.objects.filter(pk=request.session["company_id"]).first()

        final_org_nr = (
            company.organization_number
            if company and company.organization_number
            else (org_nr_from_data or "")
        )

        # 1. Skapa ordern
        order = Order.objects.create(
            company=company,
            organization_number=final_org_nr,
            **validated_data,
        )

        # 2. Skapa artiklarna
        for item_data in items_data:
            product = item_data.get("product") or item_data.get("product_id")
            if isinstance(product, int):
                product = Product.objects.get(pk=product)

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item_data.get("quantity", 1),
                unit_price=item_data.get("unit_price", product.price or product.base_price),
            )

        # 3. Skicka ordernotis-mailet till er (med try/except så ordern inte kraschar om SMTP temporärt strular)
        try:
            send_order_notification_email(order)
        except Exception as e:
            logger.error(f"Kunde inte skicka ordermail för order #{order.id}: {e}")

        return order