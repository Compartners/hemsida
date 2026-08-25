from django.db import models


class Company(models.Model):
    name = models.CharField(max_length=255)

    company_code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        help_text="Nyckeln kunden loggar in med.",
    )

    organization_number = models.CharField(
        max_length=20,
        blank=True,
    )

    price_markup = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0,
    )

    has_phone_policy = models.BooleanField(
        default=False,
    )

    allowed_phones = models.ManyToManyField(
        "Product",
        blank=True,
        related_name="allowed_for_companies",
        limit_choices_to={"product_type": "phone"},
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Företag"
        verbose_name_plural = "Företag"
        ordering = ["name"]

    def __str__(self):
        return self.name


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
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    brand = models.CharField(max_length=100, blank=True)
    gtin = models.CharField(max_length=50, blank=True)
    mpn = models.CharField(max_length=100, blank=True)
    image_url = models.URLField(blank=True)
    product_url = models.URLField(blank=True)
    availability = models.CharField(max_length=50, blank=True)
    active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Produkt"
        verbose_name_plural = "Produkter"
        ordering = ["name"]

    def __str__(self):
        return self.name


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