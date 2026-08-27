from django.contrib import admin
from django.utils.crypto import get_random_string
from decimal import Decimal, ROUND_HALF_UP
from django.db.models import F
from .models import Company, Product, Order, OrderItem



@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = (
        "name", "company_code", "organization_number",
        "price_markup", "has_phone_policy", "created_at",
    )
    search_fields = ("name", "company_code", "organization_number")
    list_filter = ("has_phone_policy",)
    list_editable = ("price_markup", "has_phone_policy")
    filter_horizontal = ("allowed_phones",)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        ("Företag", {"fields": ("name", "organization_number")}),
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


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name", "brand", "product_type", "base_price", "price", "availability", "active"
    )
    search_fields = ("name", "external_id", "brand", "gtin", "mpn")
    list_filter = ("product_type", "active", "availability", "brand")
    list_editable = ("price", "active")
    list_per_page = 50

    actions = [
        "mark_as_phone",
        "mark_as_accessory",
        "set_price_equal_to_base",
    ]

    @admin.action(description="Sätt markerade som: Telefon (phone)")
    def mark_as_phone(self, request, queryset):
        count = queryset.update(product_type="phone")
        self.message_user(request, f"Ändrade {count} produkter till Telefon.")

    @admin.action(description="Sätt markerade som: Tillbehör (accessory)")
    def mark_as_accessory(self, request, queryset):
        count = queryset.update(product_type="accessory")
        self.message_user(request, f"Ändrade {count} produkter till Tillbehör.")

    @admin.action(description="Sätt utpris = Samma som inköpspris (base_price)")
    def set_price_equal_to_base(self, request, queryset):
        updated = queryset.update(price=F("base_price"))
        self.message_user(request, f"Uppdaterade priset på {updated} produkter.")

    @admin.action(description="Sätt utpris = Samma som inköpspris (base_price)")
    def set_price_equal_to_base(self, request, queryset):
        updated = queryset.update(price=F("base_price"))
        self.message_user(request, f"Uppdaterade priset på {updated} produkter.")

    @admin.action(description="Sätt utpris = Inköp x 1.20 (+20%% påslag)")
    def set_price_markup_20_percent(self, request, queryset):
        count = 0
        for product in queryset:
            if product.base_price:
                product.price = (product.base_price * Decimal("1.20")).quantize(
                    Decimal("0.01"), rounding=ROUND_HALF_UP
                )
                product.save(update_fields=["price"])
                count += 1
        self.message_user(request, f"Räknade om priset (+20 procent) på {count} produkter.")

    @admin.action(description="Sätt utpris = Inköp x 0.80 (-20%% rabatt)")
    def set_price_factor_0_8(self, request, queryset):
        count = 0
        for product in queryset:
            if product.base_price:
                product.price = (product.base_price * Decimal("0.80")).quantize(
                    Decimal("0.01"), rounding=ROUND_HALF_UP
                )
                product.save(update_fields=["price"])
                count += 1
        self.message_user(request, f"Räknade om priset (x 0.80) på {count} produkter.")



class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1
    autocomplete_fields = ("product",)
    fields = ("product", "quantity", "unit_price")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id", "order_number", "company", "organization_number",
        "ordered_by", "status", "created_at",
    )
    search_fields = (
        "order_number", "company__name", "company__company_code",
        "organization_number", "ordered_by",
    )
    list_filter = ("status", "created_at")
    list_editable = ("status",)
    autocomplete_fields = ("company",)
    readonly_fields = ("created_at", "updated_at")
    inlines = [OrderItemInline]

    fieldsets = (
        ("Order", {"fields": ("order_number", "company", "status")}),
        ("Beställare", {"fields": ("organization_number", "ordered_by", "comment")}),
        ("Information", {"fields": ("created_at", "updated_at")}),
    )




