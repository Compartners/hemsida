from decimal import Decimal

from io import StringIO

from django.contrib import admin, messages
from django.core.management import call_command
from django.shortcuts import redirect
from django.urls import path
from django.utils.crypto import get_random_string

from .models import (
    Company,
    PriceClass,
    Product,
    Order,
    OrderItem,
)


# ============================================================
# COMPANY
# ============================================================


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "company_code",
        "organization_number",
        "price_markup",
        "has_phone_policy",
        "created_at",
        "email",
    )

    search_fields = (
        "name",
        "company_code",
        "organization_number",
    )

    list_filter = (
        "has_phone_policy",
    )

    list_editable = (
        "price_markup",
        "has_phone_policy",
    )

    filter_horizontal = (
        "allowed_phones",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Företag",
            {
                "fields": (
                    "name",
                    "organization_number",
                    "email",
                )
            },
        ),
        (
            "Kundåtkomst",
            {
                "fields": (
                    "company_code",
                    "price_markup",
                    "has_phone_policy",
                    "allowed_phones",
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

    actions = [
        "generate_company_codes",
    ]

    @admin.action(
        description="Generera nya företagsnycklar"
    )
    def generate_company_codes(
        self,
        request,
        queryset,
    ):
        for company in queryset:
            company.company_code = (
                self._generate_unique_code()
            )

            company.save(
                update_fields=["company_code"]
            )

        self.message_user(
            request,
            (
                f"Genererade nya nycklar för "
                f"{queryset.count()} företag."
            ),
        )

    @staticmethod
    def _generate_unique_code():
        while True:
            code = (
                "CP-"
                + get_random_string(
                    4,
                    allowed_chars=(
                        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
                    ),
                )
                + "-"
                + get_random_string(
                    6,
                    allowed_chars=(
                        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
                    ),
                )
            )

            if not Company.objects.filter(
                company_code=code
            ).exists():
                return code


# ============================================================
# PRICE CLASS
# ============================================================


@admin.register(PriceClass)
class PriceClassAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "cost_mode",
        "cost_value",
        "price_mode",
        "price_value",
        "product_count",
        "active",
        "sort_order",
    )

    list_editable = (
        "cost_value",
        "price_value",
        "active",
        "sort_order",
    )

    list_filter = (
        "active",
        "cost_mode",
        "price_mode",
    )

    search_fields = (
        "name",
        "description",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Prisklass",
            {
                "fields": (
                    "name",
                    "description",
                    "active",
                    "sort_order",
                )
            },
        ),
        (
            "Compartners inköpskostnad",
            {
                "fields": (
                    "cost_mode",
                    "cost_value",
                ),
                "description": (
                    "Bestäm hur Compartners verkliga "
                    "inköpskostnad ska räknas från feedpriset."
                ),
            },
        ),
        (
            "Försäljningspris",
            {
                "fields": (
                    "price_mode",
                    "price_value",
                ),
                "description": (
                    "Bestäm hur utpriset ska räknas "
                    "från den beräknade inköpskostnaden."
                ),
            },
        ),
        (
            "Information",
            {
                "classes": ("collapse",),
                "fields": (
                    "created_at",
                    "updated_at",
                ),
            },
        ),
    )

    actions = [
        "recalculate_products",
    ]

    @admin.display(
        description="Produkter"
    )
    def product_count(self, obj):
        return obj.products.count()

    @admin.action(
        description=(
            "Räkna om priser för produkter "
            "i markerade prisklasser"
        )
    )
    def recalculate_products(
        self,
        request,
        queryset,
    ):
        updated = 0

        products = Product.objects.filter(
            price_class__in=queryset,
            pricing_mode="auto",
        ).select_related(
            "price_class"
        )

        for product in products.iterator():
            product.recalculate_price()

            product.save(
                update_fields=[
                    "price",
                    "updated_at",
                ]
            )

            updated += 1

        self.message_user(
            request,
            (
                f"Räknade om priset på "
                f"{updated} produkter."
            ),
        )

    def save_model(
        self,
        request,
        obj,
        form,
        change,
    ):
        """
        Sparar prisklassen först.

        Vi räknar inte automatiskt om hundratals produkter här,
        eftersom du kan vilja justera flera saker innan omräkning.
        Använd admin-actionen när regeln är färdig.
        """

        super().save_model(
            request,
            obj,
            form,
            change,
        )


# ============================================================
# PRODUCT
# ============================================================


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    def get_urls(self):
        urls = super().get_urls()

        custom_urls = [
            path(
                "sync-telefonshoppen/",
                self.admin_site.admin_view(
                    self.sync_telefonshoppen
                ),
                name="sync_telefonshoppen",
            ),
        ]

        return custom_urls + urls

    def sync_telefonshoppen(self, request):
        output = StringIO()

        try:
            call_command(
                "sync_telefonshoppen",
                stdout=output,
                stderr=output,
            )

            self.message_user(
                request,
                "Produktdata från Telefonshoppen har hämtats.",
                messages.SUCCESS,
            )

        except Exception as exc:
            self.message_user(
                request,
                f"Importen misslyckades: {exc}",
                messages.ERROR,
            )

        return redirect(
            "admin:core_product_changelist"
        )

    list_display = (
        "name",
        "brand",
        "product_type",
        "shop_category",
        "model_family",
        "base_price",
        "effective_cost_admin",
        "price_class",
        "price",
        "pricing_mode",
        "availability",
        "active",
    )

    search_fields = (
        "name",
        "external_id",
        "brand",
        "model_family",
        "gtin",
        "mpn",
        "feed_category",
        "feed_product_type",
    )

    list_filter = (
        "active",
        "source",
        "product_type",
        "shop_category",
        "brand",
        "model_family",
        "price_class",
        "pricing_mode",
        "availability",
    )

    list_editable = (
        "price_class",
        "pricing_mode",
        "active",
    )

    list_select_related = (
        "price_class",
    )

    list_per_page = 50

    ordering = (
        "brand",
        "name",
    )

    readonly_fields = (
        "effective_cost_admin",
        "calculated_price_admin",
        "feed_category",
        "feed_product_type",
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Produkt",
            {
                "fields": (
                    "name",
                    "external_id",
                    "source",
                    "active",
                )
            },
        ),
        (
            "Klassificering",
            {
                "fields": (
                    "product_type",
                    "shop_category",
                    "brand",
                    "model_family",
                )
            },
        ),
        (
            "Pris",
            {
                "fields": (
                    "base_price",
                    "price_class",
                    "effective_cost_admin",
                    "pricing_mode",
                    "calculated_price_admin",
                    "price",
                )
            },
        ),
        (
            "Produktinformation",
            {
                "fields": (
                    "gtin",
                    "mpn",
                    "availability",
                    "image_url",
                    "product_url",
                )
            },
        ),
        (
            "Originaldata från Telefonshoppen",
            {
                "classes": ("collapse",),
                "fields": (
                    "feed_category",
                    "feed_product_type",
                ),
            },
        ),
        (
            "Information",
            {
                "classes": ("collapse",),
                "fields": (
                    "created_at",
                    "updated_at",
                ),
            },
        ),
    )

    actions = [
        "mark_as_phone",
        "mark_as_accessory",
        "recalculate_prices",
        "set_auto_pricing",
        "set_manual_pricing",
        "activate_products",
        "deactivate_products",
    ]

    @admin.display(
    description="Beräknat inköp",
    ordering="base_price",
)
    def effective_cost_admin(self, obj):
        if not obj or obj.base_price is None:
            return "-"

        value = obj.effective_cost

        if value is None:
            return "-"

        return f"{value:.2f} kr"


    @admin.display(
        description="Beräknat utpris"
    )
    def calculated_price_admin(self, obj):
        if not obj or obj.base_price is None:
            return "-"

        value = obj.calculated_auto_price

        if value is None:
            return "-"

        return f"{value:.2f} kr"

    # ---------------------------------------------------------
    # PRODUKTTYP
    # ---------------------------------------------------------

    @admin.action(
        description="Sätt markerade som Telefon"
    )
    def mark_as_phone(
        self,
        request,
        queryset,
    ):
        count = queryset.update(
            product_type="phone",
            shop_category="phone",
        )

        self.message_user(
            request,
            f"Ändrade {count} produkter till Telefon.",
        )

    @admin.action(
        description="Sätt markerade som Tillbehör"
    )
    def mark_as_accessory(
        self,
        request,
        queryset,
    ):
        count = queryset.update(
            product_type="accessory",
        )

        self.message_user(
            request,
            f"Ändrade {count} produkter till Tillbehör.",
        )

    # ---------------------------------------------------------
    # PRIS
    # ---------------------------------------------------------

    @admin.action(
        description="Räkna om pris från vald prisklass"
    )
    def recalculate_prices(
        self,
        request,
        queryset,
    ):
        updated = 0
        skipped = 0

        queryset = queryset.select_related(
            "price_class"
        )

        for product in queryset.iterator():
            if product.pricing_mode != "auto":
                skipped += 1
                continue

            if not product.price_class:
                skipped += 1
                continue

            product.recalculate_price()

            product.save(
                update_fields=[
                    "price",
                    "updated_at",
                ]
            )

            updated += 1

        self.message_user(
            request,
            (
                f"Räknade om {updated} produkter. "
                f"Hoppade över {skipped} produkter."
            ),
        )

    @admin.action(
        description="Prissättning: Automatisk"
    )
    def set_auto_pricing(
        self,
        request,
        queryset,
    ):
        updated = 0

        queryset = queryset.select_related(
            "price_class"
        )

        for product in queryset.iterator():
            product.pricing_mode = "auto"

            if product.price_class:
                product.recalculate_price()

            product.save(
                update_fields=[
                    "pricing_mode",
                    "price",
                    "updated_at",
                ]
            )

            updated += 1

        self.message_user(
            request,
            (
                f"{updated} produkter använder nu "
                f"automatisk prissättning."
            ),
        )

    @admin.action(
        description="Prissättning: Manuell"
    )
    def set_manual_pricing(
        self,
        request,
        queryset,
    ):
        count = queryset.update(
            pricing_mode="manual",
        )

        self.message_user(
            request,
            (
                f"{count} produkter använder nu "
                f"manuell prissättning."
            ),
        )

    # ---------------------------------------------------------
    # AKTIV / INAKTIV
    # ---------------------------------------------------------

    @admin.action(
        description="Aktivera markerade produkter"
    )
    def activate_products(
        self,
        request,
        queryset,
    ):
        count = queryset.update(
            active=True,
        )

        self.message_user(
            request,
            f"Aktiverade {count} produkter.",
        )

    @admin.action(
        description="Inaktivera markerade produkter"
    )
    def deactivate_products(
        self,
        request,
        queryset,
    ):
        count = queryset.update(
            active=False,
        )

        self.message_user(
            request,
            f"Inaktiverade {count} produkter.",
        )


# ============================================================
# ORDER
# ============================================================


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

    autocomplete_fields = (
        "product",
    )

    fields = (
        "product",
        "quantity",
        "unit_price",
    )


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

    list_filter = (
        "status",
        "created_at",
    )

    list_editable = (
        "status",
    )

    autocomplete_fields = (
        "company",
    )

    readonly_fields = (
        "customer_email",
        "created_at",
        "updated_at",
    )

    inlines = [
        OrderItemInline,
    ]

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
        if (
            obj.company
            and obj.company.email
        ):
            return obj.company.email

        return "Ingen e-postadress angiven"