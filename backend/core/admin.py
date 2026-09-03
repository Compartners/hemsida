from django.contrib import admin
from django.utils.crypto import get_random_string
from decimal import Decimal, ROUND_HALF_UP
from django.db.models import F
from .models import Company, Product, Order, OrderItem



@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = (
        "name", "company_code", "organization_number",
        "price_markup", "has_phone_policy", "created_at", "email",
    )
    search_fields = ("name", "company_code", "organization_number")
    list_filter = ("has_phone_policy",)
    list_editable = ("price_markup", "has_phone_policy")
    filter_horizontal = ("allowed_phones",)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        ("Företag", {"fields": ("name", "organization_number", "email")}),
        ("Kundåtkomst", {"fields": (
            "company_code", "price_markup", "has_phone_policy", "allowed_phones",
        )}),
        ("Information", {"fields": ("created_at", "updated_at")}),
    )

    actions = ["generate_company_codes"]

    @admin.action(description="Generera nya företagsnycklar")
    def generate_company_codes(self, request, queryset):
        for company in queryset:
            company.company_code = self._generate_unique_code()
            company.save(update_fields=["company_code"])
        self.message_user(request, f"Genererade nya nycklar för {queryset.count()} företag.")

    @staticmethod
    def _generate_unique_code():
        while True:
            code = (
                "CP-"
                + get_random_string(4, allowed_chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789")
                + "-"
                + get_random_string(6, allowed_chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789")
            )
            if not Company.objects.filter(company_code=code).exists():
                return code


from decimal import Decimal, ROUND_HALF_UP

from django.contrib import admin
from django.db.models import F

from .models import Product, Company, Order, OrderItem


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "brand",
        "product_type",
        "base_price",
        "price",
        "availability",
        "active",
    )

    search_fields = (
        "name",
        "external_id",
        "brand",
        "gtin",
        "mpn",
    )

    list_filter = (
        "product_type",
        "active",
        "availability",
        "brand",
    )

    # Gör att pris och aktiv kan ändras direkt från produktlistan
    list_editable = (
        "price",
        "active",
    )

    list_per_page = 50

    actions = [
        "mark_as_phone",
        "mark_as_accessory",
        "set_price_equal_to_base",
        "set_price_markup_10_percent",
        "set_price_markup_20_percent",
        "set_price_markup_30_percent",
        "set_price_discount_10_percent",
        "set_price_discount_20_percent",
        "set_price_discount_30_percent",
    ]

    # ---------------------------------------------------------
    # PRODUKTTYP
    # ---------------------------------------------------------

    @admin.action(description="Sätt markerade som: Telefon")
    def mark_as_phone(self, request, queryset):
        count = queryset.update(product_type="phone")

        self.message_user(
            request,
            f"Ändrade {count} produkter till Telefon.",
        )

    @admin.action(description="Sätt markerade som: Tillbehör")
    def mark_as_accessory(self, request, queryset):
        count = queryset.update(product_type="accessory")

        self.message_user(
            request,
            f"Ändrade {count} produkter till Tillbehör.",
        )

    # ---------------------------------------------------------
    # PRISSÄTTNING
    # ---------------------------------------------------------

    @admin.action(description="Sätt utpris = inköpspris")
    def set_price_equal_to_base(self, request, queryset):
        updated = queryset.update(
            price=F("base_price")
        )

        self.message_user(
            request,
            f"Uppdaterade priset på {updated} produkter.",
        )

    @admin.action(description="Sätt utpris = inköp +10 %%")
    def set_price_markup_10_percent(self, request, queryset):
        self._apply_price_factor(
            request,
            queryset,
            Decimal("1.10"),
            "+10 %",
        )

    @admin.action(description="Sätt utpris = inköp +20 %%")
    def set_price_markup_20_percent(self, request, queryset):
        self._apply_price_factor(
            request,
            queryset,
            Decimal("1.20"),
            "+20 %",
        )

    @admin.action(description="Sätt utpris = inköp +30 %%")
    def set_price_markup_30_percent(self, request, queryset):
        self._apply_price_factor(
            request,
            queryset,
            Decimal("1.30"),
            "+30 %",
        )

    @admin.action(description="Sätt utpris = inköp -10 %%")
    def set_price_discount_10_percent(self, request, queryset):
        self._apply_price_factor(
            request,
            queryset,
            Decimal("0.90"),
            "-10 %",
        )

    @admin.action(description="Sätt utpris = inköp -20 %%")
    def set_price_discount_20_percent(self, request, queryset):
        self._apply_price_factor(
            request,
            queryset,
            Decimal("0.80"),
            "-20 %",
        )

    @admin.action(description="Sätt utpris = inköp -30 %%")
    def set_price_discount_30_percent(self, request, queryset):
        self._apply_price_factor(
            request,
            queryset,
            Decimal("0.70"),
            "-30 %",
        )

    # ---------------------------------------------------------
    # HJÄLPFUNKTION FÖR PRISSÄTTNING
    # ---------------------------------------------------------

    def _apply_price_factor(
        self,
        request,
        queryset,
        factor,
        description,
    ):
        count = 0

        for product in queryset:
            if product.base_price is None:
                continue

            product.price = (
                product.base_price * factor
            ).quantize(
                Decimal("0.01"),
                rounding=ROUND_HALF_UP,
            )

            product.save(
                update_fields=["price"]
            )

            count += 1

        self.message_user(
            request,
            f"Räknade om priset ({description}) på {count} produkter.",
        )






class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1
    autocomplete_fields = ("product",)
    fields = ("product", "quantity", "unit_price")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order_number",
        "company",
        "organization_number",
        "ordered_by",
        "customer_email",
        "status",
        "created_at",
    )

    search_fields = (
        "order_number",
        "company__name",
        "company__company_code",
        "company__email",
        "organization_number",
        "ordered_by",
    )

    list_filter = ("status", "created_at")
    list_editable = ("status",)

    autocomplete_fields = ("company",)

    readonly_fields = (
        "customer_email",
        "created_at",
        "updated_at",
    )

    inlines = [OrderItemInline]

    fieldsets = (
        (
            "Order",
            {
                "fields": (
                    "order_number",
                    "company",
                    "status",
                )
            },
        ),
        (
            "Beställare",
            {
                "fields": (
                    "organization_number",
                    "ordered_by",
                    "customer_email",
                    "comment",
                )
            },
        ),
        (
            "Information",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    @admin.display(
        description="Kundens e-post"
    )
    def customer_email(self, obj):
        if obj.company and obj.company.email:
            return obj.company.email
        return "Ingen e-postadress angiven"





