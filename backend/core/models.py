from decimal import Decimal, ROUND_HALF_UP
from django.db import models

from decimal import Decimal, ROUND_HALF_UP
from django.db import models


class Company(models.Model):
    name = models.CharField(max_length=255)
    company_code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        help_text="Nyckeln kunden loggar in med.",
    )
    organization_number = models.CharField(max_length=20, blank=True)
    price_markup = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
        help_text="Fast påslag i kronor (SEK) per produkt (t.ex. 250.00).",
    )
    has_phone_policy = models.BooleanField(
        default=False,
        verbose_name="Har sortimentspolicy",
        help_text="Om aktiv visas endast de produkter som valts nedan.",
    )
    allowed_phones = models.ManyToManyField(
        "Product",
        blank=True,
        related_name="allowed_for_companies",
        verbose_name="Valt sortiment (telefoner & tillbehör)",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Företag"
        verbose_name_plural = "Företag"
        ordering = ["name"]

    def __str__(self):
        return self.name

    def calculate_price(self, product_or_price) -> Decimal:
        """
        Beräknar slutpris för kunden baserat på utpris/inköpspris + fast påslag i kronor.
        Hanterar både Product-instans och råa Decimal-värden.
        """
        if hasattr(product_or_price, "price"):
            target_price = (
                product_or_price.price
                if product_or_price.price is not None
                else product_or_price.base_price
            )
        else:
            target_price = Decimal(str(product_or_price))

        if self.price_markup and self.price_markup > Decimal("0.00"):
            final_price = target_price + self.price_markup
            return final_price.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

        return target_price.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


class Product(models.Model):
    PRODUCT_TYPE_CHOICES = [
        ("phone", "Telefon"),
        ("accessory", "Tillbehör"),
    ]

    name = models.CharField(max_length=255)
    external_id = models.CharField(max_length=100, unique=True)
    product_type = models.CharField(
        max_length=20, choices=PRODUCT_TYPE_CHOICES, default="phone", db_index=True
    )
    base_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        help_text="Inköps-/feedpris från leverantören."
    )
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Ditt grundläggande utpris (t.ex. inköp x 0.8)."
    )
    brand = models.CharField(max_length=100, blank=True)
    gtin = models.CharField(max_length=50, blank=True)
    mpn = models.CharField(max_length=100, blank=True)
    image_url = models.URLField(max_length=2000, blank=True)
    product_url = models.URLField(max_length=2000, blank=True)
    availability = models.CharField(max_length=50, blank=True)
    active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Produkt"
        verbose_name_plural = "Produkter"
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.price or self.base_price} SEK)"


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Väntar"),
        ("processing", "Behandlas"),
        ("completed", "Slutförd"),
        ("cancelled", "Avbruten"),
    ]

    company = models.ForeignKey(Company, on_delete=models.PROTECT, related_name="orders")
    organization_number = models.CharField(max_length=20)
    ordered_by = models.CharField(max_length=255)
    comment = models.TextField(blank=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="pending", db_index=True
    )
    order_number = models.CharField(max_length=50, unique=True, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Order"
        verbose_name_plural = "Ordrar"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order #{self.id} - {self.company.name}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name="order_items")
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = "Orderrad"
        verbose_name_plural = "Orderrader"

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"