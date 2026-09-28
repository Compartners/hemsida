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

    organization_number = models.CharField(
        max_length=20,
        blank=True,
    )

    email = models.EmailField(
        blank=True,
        verbose_name="E-post",
        help_text="E-postadress som används för orderbekräftelser.",
    )

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

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        verbose_name = "Företag"
        verbose_name_plural = "Företag"
        ordering = ["name"]

    def __str__(self):
        return self.name

    def calculate_price(self, product_or_price) -> Decimal:
        """
        Beräknar kundens slutpris:

        Compartners grundpris
        + företagets fasta price_markup.

        Kan ta emot både en Product-instans och ett rått pris.
        """

        if hasattr(product_or_price, "price"):
            target_price = (
                product_or_price.price
                if product_or_price.price is not None
                else product_or_price.base_price
            )
        else:
            target_price = Decimal(str(product_or_price))

        markup = self.price_markup or Decimal("0.00")

        final_price = target_price + markup

        return final_price.quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP,
        )


from decimal import Decimal, ROUND_HALF_UP

from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models


class PriceClass(models.Model):
    COST_MODE_CHOICES = [
        ("feed", "Använd feedpris"),
        ("fixed", "Fast inköpspris"),
        ("discount", "Rabatt från feedpris"),
    ]

    PRICE_MODE_CHOICES = [
        ("fixed_markup", "Fast påslag i kronor"),
        ("percentage", "Procentpåslag"),
        ("fixed_price", "Fast utpris"),
    ]

    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Namn",
        help_text="Exempel: Laddare avtal, Skal standard, Premiumtillbehör.",
    )

    description = models.TextField(
        blank=True,
        verbose_name="Beskrivning",
    )

    # ---------------------------------------------------------
    # INKÖPSKOSTNAD
    # ---------------------------------------------------------

    cost_mode = models.CharField(
        max_length=20,
        choices=COST_MODE_CHOICES,
        default="feed",
        verbose_name="Inköpsmodell",
    )

    cost_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[MinValueValidator(Decimal("0.00"))],
        verbose_name="Inköpsvärde",
        help_text=(
            "Vid fast inköpspris anges kronor. "
            "Vid rabatt anges procent, t.ex. 35 för 35 % rabatt."
        ),
    )

    # ---------------------------------------------------------
    # FÖRSÄLJNINGSPRIS
    # ---------------------------------------------------------

    price_mode = models.CharField(
        max_length=20,
        choices=PRICE_MODE_CHOICES,
        default="fixed_markup",
        verbose_name="Försäljningsmodell",
    )

    price_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[MinValueValidator(Decimal("0.00"))],
        verbose_name="Prisvärde",
        help_text=(
            "Vid fast påslag anges kronor. "
            "Vid procentpåslag anges procent. "
            "Vid fast utpris anges slutpriset."
        ),
    )

    active = models.BooleanField(
        default=True,
        db_index=True,
        verbose_name="Aktiv",
    )

    sort_order = models.PositiveIntegerField(
        default=100,
        verbose_name="Sortering",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        verbose_name = "Prisklass"
        verbose_name_plural = "Prisklasser"
        ordering = ["sort_order", "name"]

    def __str__(self):
        return self.name

    def clean(self):
        super().clean()

        if (
            self.cost_mode == "discount"
            and self.cost_value > Decimal("100.00")
        ):
            raise ValidationError(
                {
                    "cost_value": (
                        "Rabatten kan inte vara högre än 100 %."
                    )
                }
            )

    def calculate_cost(self, feed_price):
        """
        Räknar fram Compartners verkliga/beräknade inköpskostnad.
        """

        feed_price = Decimal(str(feed_price))

        if self.cost_mode == "fixed":
            cost = self.cost_value

        elif self.cost_mode == "discount":
            discount_factor = (
                Decimal("1.00")
                - (
                    self.cost_value
                    / Decimal("100.00")
                )
            )

            cost = feed_price * discount_factor

        else:
            cost = feed_price

        return cost.quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP,
        )

    def calculate_price(self, feed_price):
        """
        Räknar först fram verklig inköpskostnad och därefter
        Compartners försäljningspris.
        """

        cost = self.calculate_cost(feed_price)

        if self.price_mode == "fixed_markup":
            price = cost + self.price_value

        elif self.price_mode == "percentage":
            multiplier = (
                Decimal("1.00")
                + (
                    self.price_value
                    / Decimal("100.00")
                )
            )

            price = cost * multiplier

        elif self.price_mode == "fixed_price":
            price = self.price_value

        else:
            price = cost

        return price.quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP,
        )


class Product(models.Model):
    PRODUCT_TYPE_CHOICES = [
        ("phone", "Telefon"),
        ("accessory", "Tillbehör"),
    ]

    SHOP_CATEGORY_CHOICES = [
        ("phone", "Telefon"),
        ("case", "Skal & fodral"),
        ("screen_protector", "Skärmskydd"),
        ("charger", "Laddare"),
        ("cable", "Kablar"),
        ("powerbank", "Powerbanks"),
    ]

    SOURCE_CHOICES = [
        ("manual", "Manuell"),
        ("telefonshoppen", "Telefonshoppen"),
    ]

    PRICING_MODE_CHOICES = [
        ("auto", "Automatisk prissättning"),
        ("manual", "Manuellt pris"),
    ]

    # ---------------------------------------------------------
    # GRUNDDATA
    # ---------------------------------------------------------

    name = models.CharField(
        max_length=255,
        verbose_name="Produktnamn",
    )

    external_id = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Externt ID",
    )

    source = models.CharField(
        max_length=50,
        choices=SOURCE_CHOICES,
        default="manual",
        db_index=True,
        verbose_name="Källa",
    )

    # ---------------------------------------------------------
    # KLASSIFICERING
    # ---------------------------------------------------------

    product_type = models.CharField(
        max_length=20,
        choices=PRODUCT_TYPE_CHOICES,
        default="phone",
        db_index=True,
        verbose_name="Produkttyp",
    )

    shop_category = models.CharField(
        max_length=30,
        choices=SHOP_CATEGORY_CHOICES,
        blank=True,
        default="",
        db_index=True,
        verbose_name="Webshopkategori",
    )

    model_family = models.CharField(
        max_length=100,
        blank=True,
        default="",
        db_index=True,
        verbose_name="Modellfamilj",
    )

    # ---------------------------------------------------------
    # ORIGINALDATA FRÅN FEED
    # ---------------------------------------------------------

    feed_category = models.CharField(
        max_length=500,
        blank=True,
        default="",
        verbose_name="Feedkategori",
    )

    feed_product_type = models.CharField(
        max_length=500,
        blank=True,
        default="",
        verbose_name="Feed product type",
    )

    # ---------------------------------------------------------
    # PRIS
    # ---------------------------------------------------------

    base_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Feedpris",
        help_text=(
            "Priset från Telefonshoppens feed. "
            "Det behöver inte vara Compartners verkliga inköpspris."
        ),
    )

    price_class = models.ForeignKey(
        PriceClass,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="products",
        verbose_name="Prisklass",
        help_text=(
            "Prisklassen bestämmer verklig inköpskostnad "
            "och automatiskt utpris."
        ),
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Compartners grundpris",
        help_text=(
            "Grundpris före företagets kundspecifika påslag. "
            "Vid automatisk prissättning räknas detta fram "
            "från vald prisklass."
        ),
    )

    pricing_mode = models.CharField(
        max_length=10,
        choices=PRICING_MODE_CHOICES,
        default="auto",
        db_index=True,
        verbose_name="Prissättning",
    )

    # ---------------------------------------------------------
    # PRODUKTMETADATA
    # ---------------------------------------------------------

    brand = models.CharField(
        max_length=100,
        blank=True,
        default="",
        db_index=True,
        verbose_name="Varumärke",
    )

    gtin = models.CharField(
        max_length=50,
        blank=True,
        default="",
    )

    mpn = models.CharField(
        max_length=100,
        blank=True,
        default="",
    )

    image_url = models.URLField(
        max_length=2000,
        blank=True,
        default="",
    )

    product_url = models.URLField(
        max_length=2000,
        blank=True,
        default="",
    )

    availability = models.CharField(
        max_length=50,
        blank=True,
        default="",
        db_index=True,
        verbose_name="Lagerstatus",
    )

    active = models.BooleanField(
        default=True,
        db_index=True,
        verbose_name="Aktiv",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        verbose_name = "Produkt"
        verbose_name_plural = "Produkter"
        ordering = ["name"]

        indexes = [
            models.Index(
                fields=["active", "product_type"],
                name="product_active_type_idx",
            ),
            models.Index(
                fields=["active", "shop_category"],
                name="product_active_cat_idx",
            ),
            models.Index(
                fields=["brand", "model_family"],
                name="product_brand_model_idx",
            ),
        ]

    def __str__(self):
        return f"{self.name} ({self.display_price} SEK)"

    # ---------------------------------------------------------
    # PRISBERÄKNING
    # ---------------------------------------------------------

    @property
    def effective_cost(self):
        """
        Compartners beräknade verkliga inköpskostnad.

        Utan prisklass används feedpriset.
        """

        if self.price_class and self.price_class.active:
            return self.price_class.calculate_cost(
                self.base_price
            )

        return self.base_price.quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP,
        )

    @property
    def calculated_auto_price(self):
        """
        Beräknat automatiskt försäljningspris.

        Om produkten saknar prisklass används befintligt price
        om det finns, annars feedpriset. Det gör övergången från
        den gamla prislogiken säkrare.
        """

        if self.price_class and self.price_class.active:
            return self.price_class.calculate_price(
                self.base_price
            )

        if self.price is not None:
            return self.price

        return self.base_price

    @property
    def display_price(self):
        """
        Det pris som ska användas som Compartners grundpris.
        """

        if self.pricing_mode == "manual":
            return (
                self.price
                if self.price is not None
                else self.base_price
            )

        return self.calculated_auto_price

    @property
    def is_feed_product(self):
        return self.source == "telefonshoppen"

    @property
    def is_manual_price(self):
        return self.pricing_mode == "manual"

    def recalculate_price(self):
        """
        Uppdaterar price-fältet från prisklassen.

        Manuella produkter lämnas orörda.
        """

        if self.pricing_mode != "auto":
            return self.price

        if not self.price_class:
            return self.price

        self.price = self.price_class.calculate_price(
            self.base_price
        )

        return self.price

    def save(self, *args, **kwargs):
        """
        När en automatisk produkt har en prisklass håller vi
        price synkat med prisklassens beräkning.
        """

        if (
            self.pricing_mode == "auto"
            and self.price_class_id
        ):
            self.recalculate_price()

        super().save(*args, **kwargs)

class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Väntar"),
        ("processing", "Behandlas"),
        ("completed", "Slutförd"),
        ("cancelled", "Avbruten"),
    ]

    company = models.ForeignKey(
        Company,
        on_delete=models.PROTECT,
        related_name="orders",
    )

    organization_number = models.CharField(
        max_length=20,
    )

    ordered_by = models.CharField(
        max_length=255,
    )

    comment = models.TextField(
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
        db_index=True,
    )

    order_number = models.CharField(
        max_length=50,
        unique=True,
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        verbose_name = "Order"
        verbose_name_plural = "Ordrar"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order #{self.id} - {self.company.name}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="order_items",
    )

    quantity = models.PositiveIntegerField(
        default=1,
    )

    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    class Meta:
        verbose_name = "Orderrad"
        verbose_name_plural = "Orderrader"

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"