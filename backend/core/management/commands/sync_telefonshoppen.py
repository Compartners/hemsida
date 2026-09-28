"""
Django management command: synkar Product-tabellen mot Telefonshoppens
Google Shopping-feed.

Den här versionen stödjer den nya PriceClass-modellen.

Prislogik:
    base_price = priset från Telefonshoppens feed

    pricing_mode == "manual":
        Product.price lämnas helt orört.

    pricing_mode == "auto" + price_class:
        Product.price räknas om via Product.price_class.calculate_price(base_price).

    pricing_mode == "auto" utan price_class:
        Product.price använder den gamla fallback-logiken:
        base_price * DEFAULT_PRICE_MULTIPLIER

Det innebär att ni kan införa nya prisklasser stegvis utan att behöva
prissätta hela sortimentet på en gång.

Kör exempelvis:
    python manage.py sync_telefonshoppen --dry-run --breakdown
    python manage.py sync_telefonshoppen
    python manage.py sync_telefonshoppen --force
"""

import re
from collections import Counter
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP

import requests
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.db.models import Q
from lxml import etree

from core.models import Product


FEED_URL = "https://www.telefonshoppen.se/agent/Google_SE_products_gFqENyX4rji3.xml"
FEED_SOURCE = "telefonshoppen"
LEGACY_FEED_DOMAIN = "telefonshoppen.se"

NS = {"g": "http://base.google.com/ns/1.0"}

# Fallback för produkter som ännu inte har fått en PriceClass.
# När en produkt har PriceClass används den istället.
DEFAULT_PRICE_MULTIPLIER = Decimal("0.8")


# ============================================================
# ALLOWLIST & KLASSIFICERING
# ============================================================

ALLOWED_PHONE_GROUPS = [
    "apple iphone",
    "samsung galaxy",
]

ALLOWED_PHONE_BRANDS = {
    "apple",
    "samsung",
}

# Nyckeln matchas mot produktnamnet.
# Värdet sparas i Product.model_family.
ALLOWED_MODEL_FAMILIES = {
    "iphone 17": "iPhone 17",
    "iphone 16": "iPhone 16",
    "iphone 15": "iPhone 15",
    "galaxy s25": "Galaxy S25",
    "galaxy s24": "Galaxy S24",
    "galaxy a56": "Galaxy A56",
    "galaxy a36": "Galaxy A36",
}

# Ordningen spelar roll: mer specifika regler före bredare.
ACCESSORY_RULES = [
    (
        "screen_protector",
        [
            "skärmskydd",
            "skarmskydd",
            "härdat glas",
            "hardat glas",
            "tempered glass",
            "screen protector",
            "displayglas",
        ],
    ),
    (
        "case",
        [
            "skal",
            "fodral",
            "case",
            "cover",
            "wallet",
            "plånbok",
            "planbok",
            "bumper",
        ],
    ),
    (
        "powerbank",
        [
            "powerbank",
            "power bank",
        ],
    ),
    (
        "charger",
        [
            "laddare",
            "charger",
            "strömadapter",
            "stromadapter",
            "power adapter",
            "magsafe-laddare",
            "magsafe laddare",
            "magsafe charger",
            "adapter",
        ],
    ),
    (
        "cable",
        [
            "kabel",
            "cable",
            "usb-c till lightning",
            "usb c till lightning",
            "usb-c-kabel",
            "usb c kabel",
            "lightning cable",
        ],
    ),
]

# Skal/skydd måste vara kopplade till en tillåten telefonmodell.
MODEL_SPECIFIC_CATEGORIES = {
    "case",
    "screen_protector",
}

# Dessa får vara generella.
UNIVERSAL_CATEGORIES = {
    "charger",
    "cable",
    "powerbank",
}

ALLOWED_ACCESSORY_BRANDS = {
    "apple",
    "samsung",
    "belkin",
    "anker",
    "linocell",
    "champion",
    "deltaco",
    "sbs",
    "cellularline",
}


# ============================================================
# SÄKERHETSGRÄNSER
# ============================================================

MAX_TOTAL_PRODUCTS = 800
MAX_EXPECTED_ITEMS = 5000
MAX_DEACTIVATIONS_WITHOUT_CONFIRM = 500


REQUIRED_PRODUCT_FIELDS = {
    "external_id",
    "name",
    "source",
    "product_type",
    "shop_category",
    "model_family",
    "feed_category",
    "feed_product_type",
    "base_price",
    "price",
    "pricing_mode",
    "price_class",
    "brand",
    "gtin",
    "mpn",
    "image_url",
    "product_url",
    "availability",
    "active",
    "updated_at",
}


class Command(BaseCommand):
    help = (
        "Synkar godkända telefoner, skal, skärmskydd, laddare, kablar "
        "och powerbanks från Telefonshoppens XML-feed."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Testkör hela syncen utan att spara något.",
        )
        parser.add_argument(
            "--limit",
            type=int,
            default=None,
            help=(
                "Begränsa antal feedrader som analyseras. "
                "Inaktiverar aldrig med --limit."
            ),
        )
        parser.add_argument(
            "--force",
            action="store_true",
            help="Tillåt fler inaktiveringar än säkerhetsgränsen.",
        )
        parser.add_argument(
            "--breakdown",
            action="store_true",
            help="Visa matchningar och orsaker till överhoppade produkter.",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        limit = options["limit"]
        force = options["force"]
        breakdown = options["breakdown"]

        self._validate_product_model()

        if limit is not None and limit <= 0:
            raise CommandError("--limit måste vara större än 0.")

        items = self._fetch_feed()
        total_in_feed = len(items)

        self.stdout.write(f"{total_in_feed} rader i feeden totalt.")

        if total_in_feed > MAX_EXPECTED_ITEMS:
            raise CommandError(
                f"Feeden innehåller {total_in_feed} rader, "
                f"max är {MAX_EXPECTED_ITEMS}."
            )

        if limit is not None:
            items = items[:limit]
            self.stdout.write(
                self.style.WARNING(
                    f"--limit aktivt: analyserar endast {len(items)} rader. "
                    "Inga produkter kommer att inaktiveras."
                )
            )

        # select_related gör att price_class kan användas under hela syncen
        # utan en extra databasfråga per produkt.
        existing_products = {
            product.external_id: product
            for product in Product.objects.select_related("price_class").all()
        }

        seen_external_ids = set()
        to_create = []
        to_update = []

        skipped_rows = 0
        duplicate_rows = 0
        collision_rows = 0

        skip_reasons = Counter()
        match_reasons = Counter()

        for item in items:
            parsed, reason = self._parse_item(
                item,
                match_reasons if breakdown else None,
            )

            if parsed is None:
                skipped_rows += 1
                skip_reasons[reason] += 1
                continue

            external_id = parsed["external_id"]

            if external_id in seen_external_ids:
                duplicate_rows += 1
                continue

            seen_external_ids.add(external_id)
            existing = existing_products.get(external_id)

            if existing is None:
                to_create.append(parsed)
                continue

            # Skydda manuella produkter eller produkter från andra källor
            # som råkar ha samma external_id.
            if not self._belongs_to_telefonshoppen(existing):
                collision_rows += 1
                skip_reasons["external_id-krock med annan källa"] += 1
                continue

            to_update.append((existing, parsed))

        total_matched = len(to_create) + len(to_update)

        deactivate_qs = Product.objects.none()

        if limit is None:
            deactivate_qs = (
                Product.objects.filter(active=True)
                .filter(
                    Q(source=FEED_SOURCE)
                    | Q(product_url__icontains=LEGACY_FEED_DOMAIN)
                )
                .exclude(external_id__in=seen_external_ids)
            )

        deactivate_count = deactivate_qs.count()

        self._print_summary(
            to_create=to_create,
            to_update=to_update,
            skipped_rows=skipped_rows,
            duplicate_rows=duplicate_rows,
            collision_rows=collision_rows,
            deactivate_count=deactivate_count,
            match_reasons=match_reasons,
            skip_reasons=skip_reasons,
            breakdown=breakdown,
        )

        if dry_run:
            self.stdout.write("")
            self.stdout.write(
                self.style.WARNING("DRY RUN — inget sparat.")
            )
            self._preview_new(to_create[:30])
            self._preview_updates(to_update[:30])
            return

        if limit is None and total_matched > MAX_TOTAL_PRODUCTS:
            raise CommandError(
                f"Matchade {total_matched} produkter, mer än MAX "
                f"({MAX_TOTAL_PRODUCTS}). Kör med --breakdown "
                "för att se fördelning."
            )

        if (
            deactivate_count > MAX_DEACTIVATIONS_WITHOUT_CONFIRM
            and not force
        ):
            raise CommandError(
                f"Skulle inaktivera {deactivate_count} produkter "
                f"(> {MAX_DEACTIVATIONS_WITHOUT_CONFIRM}). "
                "Kör med --force om detta verkligen är avsikten."
            )

        created, updated, deactivated = self._save_changes(
            to_create=to_create,
            to_update=to_update,
            deactivate_qs=deactivate_qs,
            allow_deactivation=(limit is None),
        )

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                f"Klart! Nya: {created}, uppdaterade: {updated}, "
                f"inaktiverade: {deactivated}."
            )
        )

    # ========================================================
    # HÄMTA / VALIDERING
    # ========================================================

    def _fetch_feed(self):
        self.stdout.write("Hämtar feed...")

        try:
            response = requests.get(
                FEED_URL,
                timeout=(10, 30),
                headers={
                    "User-Agent": "Compartners-Telefonshoppen-Sync/3.0",
                },
            )
            response.raise_for_status()
        except requests.RequestException as exc:
            raise CommandError(
                f"Kunde inte hämta feeden: {exc}"
            ) from exc

        parser = etree.XMLParser(
            resolve_entities=False,
            no_network=True,
            recover=False,
        )

        try:
            root = etree.fromstring(
                response.content,
                parser=parser,
            )
        except etree.XMLSyntaxError as exc:
            raise CommandError(
                f"Feeden innehåller ogiltig XML: {exc}"
            ) from exc

        return root.findall(".//item")

    @staticmethod
    def _validate_product_model():
        actual_fields = {
            field.name
            for field in Product._meta.get_fields()
        }

        missing = sorted(
            REQUIRED_PRODUCT_FIELDS - actual_fields
        )

        if missing:
            raise CommandError(
                "Product saknar fält som syncen kräver: "
                + ", ".join(missing)
                + ". Uppdatera models.py och kör "
                "makemigrations/migrate först."
            )

        price_class_field = Product._meta.get_field("price_class")

        if not price_class_field.is_relation:
            raise CommandError(
                "Product.price_class är inte en ForeignKey. "
                "Kör migrationen till den nya PriceClass-modellen först."
            )

        related_model = price_class_field.related_model

        if (
            related_model is None
            or related_model.__name__ != "PriceClass"
        ):
            raise CommandError(
                "Product.price_class pekar inte på PriceClass."
            )

    # ========================================================
    # PARSNING
    # ========================================================

    def _parse_item(self, item, match_reasons=None):
        external_id = self._text(item, "g:id")
        if not external_id:
            return None, "saknar external_id"

        name = self._text(item, "title")
        if not name:
            return None, "saknar title"

        category = self._text(
            item,
            "g:google_product_category",
        )
        product_type_field = self._text(
            item,
            "g:product_type",
        )
        adwords_grouping = self._text(
            item,
            "g:adwords_grouping",
        )
        brand = self._text(
            item,
            "g:brand",
        )

        (
            product_type,
            shop_category,
            model_family,
            match_key,
            reject_reason,
        ) = self._classify_and_filter(
            name=name,
            category=category,
            product_type_field=product_type_field,
            adwords_grouping=adwords_grouping,
            brand=brand,
        )

        if not product_type:
            return (
                None,
                reject_reason
                or "utanför allowlist/okänd kategori",
            )

        if match_reasons is not None and match_key:
            match_reasons[match_key] += 1

        price_raw = self._text(
            item,
            "g:price",
        )

        base_price = self._parse_price(
            price_raw
        )

        if base_price is None or base_price <= 0:
            return (
                None,
                f"ogiltigt pris ({price_raw!r})",
            )

        fallback_auto_price = (
            base_price * DEFAULT_PRICE_MULTIPLIER
        ).quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP,
        )

        return {
            "external_id": external_id,
            "name": name,
            "source": FEED_SOURCE,
            "product_type": product_type,
            "shop_category": shop_category,
            "model_family": model_family,
            "feed_category": category,
            "feed_product_type": product_type_field,
            "base_price": base_price,
            "fallback_auto_price": fallback_auto_price,
            "brand": brand,
            "gtin": self._text(item, "g:gtin"),
            "mpn": self._text(item, "g:mpn"),
            "image_url": self._text(
                item,
                "g:image_link",
            ),
            "product_url": self._text(
                item,
                "link",
            ),
            "availability": self._text(
                item,
                "g:availability",
            ),
        }, None

    # ========================================================
    # KLASSIFICERING
    # ========================================================

    @classmethod
    def _classify_and_filter(
        cls,
        name,
        category,
        product_type_field,
        adwords_grouping,
        brand,
    ):
        name_n = cls._normalize(name)
        category_n = cls._normalize(category)
        type_n = cls._normalize(product_type_field)
        group_n = cls._normalize(adwords_grouping)
        brand_n = cls._normalize(brand)

        model_family = cls._find_model_family(name)

        accessory_category = cls._find_accessory_category(
            name=name,
            product_type_field=product_type_field,
        )

        # ----------------------------------------------------
        # 1. MODELLSPECIFIKA TILLBEHÖR
        # ----------------------------------------------------

        if accessory_category in MODEL_SPECIFIC_CATEGORIES:
            if not model_family:
                return (
                    None,
                    None,
                    None,
                    None,
                    (
                        "modellspecifikt tillbehör för "
                        "ej tillåten modell"
                    ),
                )

            return (
                "accessory",
                accessory_category,
                model_family,
                f"{accessory_category}: {model_family}",
                None,
            )

        # ----------------------------------------------------
        # 2. UNIVERSELLA TILLBEHÖR
        # ----------------------------------------------------

        if accessory_category in UNIVERSAL_CATEGORIES:
            brand_allowed = any(
                allowed_brand in brand_n
                or allowed_brand in name_n
                for allowed_brand in ALLOWED_ACCESSORY_BRANDS
            )

            if not brand_allowed:
                return (
                    None,
                    None,
                    None,
                    None,
                    (
                        f"{accessory_category}: "
                        "varumärke ej i allowlist"
                    ),
                )

            return (
                "accessory",
                accessory_category,
                "",
                f"{accessory_category}: universal",
                None,
            )

        # ----------------------------------------------------
        # 3. TELEFONER
        # ----------------------------------------------------

        feed_signal = " ".join(
            [
                category_n,
                type_n,
                group_n,
            ]
        )

        product_signal = " ".join(
            [
                name_n,
                group_n,
                brand_n,
            ]
        )

        phone_signal = any(
            signal in feed_signal
            for signal in (
                "mobiltelefon",
                "telefon",
                "smartphone",
                "mobile phone",
                "iphone",
                "galaxy",
            )
        )

        if phone_signal:
            if not model_family:
                return (
                    None,
                    None,
                    None,
                    None,
                    "telefonmodell ej i allowlist",
                )

            allowed_phone_group = any(
                group in product_signal
                for group in ALLOWED_PHONE_GROUPS
            )

            allowed_phone_brand = any(
                allowed_brand in brand_n
                or allowed_brand in name_n
                for allowed_brand in ALLOWED_PHONE_BRANDS
            )

            if not (
                allowed_phone_group
                or allowed_phone_brand
            ):
                return (
                    None,
                    None,
                    None,
                    None,
                    (
                        "telefonserie/varumärke "
                        "ej i allowlist"
                    ),
                )

            return (
                "phone",
                "phone",
                model_family,
                f"phone: {model_family}",
                None,
            )

        return (
            None,
            None,
            None,
            None,
            "utanför allowlist/okänd kategori",
        )

    @classmethod
    def _find_model_family(cls, name):
        normalized_name = cls._normalize(name)

        sorted_models = sorted(
            ALLOWED_MODEL_FAMILIES.items(),
            key=lambda item: len(item[0]),
            reverse=True,
        )

        for needle, label in sorted_models:
            if cls._contains_phrase(
                normalized_name,
                needle,
            ):
                return label

        return ""

    @classmethod
    def _find_accessory_category(
        cls,
        name,
        product_type_field,
    ):
        text = cls._normalize(
            f"{name} {product_type_field}"
        )

        for shop_category, keywords in ACCESSORY_RULES:
            for keyword in keywords:
                if cls._normalize(keyword) in text:
                    return shop_category

        return ""

    @staticmethod
    def _contains_phrase(text, phrase):
        pattern = (
            r"(?<![a-z0-9])"
            + re.escape(phrase)
            + r"(?![a-z0-9])"
        )

        return re.search(
            pattern,
            text,
        ) is not None

    @staticmethod
    def _normalize(value):
        value = (value or "").casefold()
        value = (
            value
            .replace("–", "-")
            .replace("—", "-")
        )
        value = re.sub(
            r"\s+",
            " ",
            value,
        )

        return value.strip()

    # ========================================================
    # PRIS
    # ========================================================

    @staticmethod
    def _calculate_sync_price(product, parsed):
        """
        Returnerar det pris som ska användas efter sync.

        MANUAL:
            Behåll befintligt Product.price.

        AUTO + PRICE CLASS:
            Räkna via PriceClass från det NYA feedpriset.

        AUTO utan PRICE CLASS:
            Använd gammal fallback (feedpris * 0.8).
        """

        if product.pricing_mode == "manual":
            return product.price

        if (
            product.price_class_id
            and product.price_class
            and product.price_class.active
        ):
            return product.price_class.calculate_price(
                parsed["base_price"]
            )

        return parsed["fallback_auto_price"]

    @staticmethod
    def _pricing_description(product, parsed):
        if product.pricing_mode == "manual":
            return (
                "MANUELLT — "
                f"{product.price} SEK behålls"
            )

        if (
            product.price_class_id
            and product.price_class
        ):
            if product.price_class.active:
                calculated = (
                    product.price_class.calculate_price(
                        parsed["base_price"]
                    )
                )

                return (
                    f"PRISKLASS '{product.price_class.name}' — "
                    f"{product.price} SEK -> {calculated} SEK"
                )

            return (
                f"PRISKLASS '{product.price_class.name}' är inaktiv — "
                f"fallback -> {parsed['fallback_auto_price']} SEK"
            )

        return (
            "FALLBACK — "
            f"{product.price} SEK -> "
            f"{parsed['fallback_auto_price']} SEK"
        )

    # ========================================================
    # SPARA
    # ========================================================

    def _save_changes(
        self,
        to_create,
        to_update,
        deactivate_qs,
        allow_deactivation,
    ):
        with transaction.atomic():
            created = 0
            updated = 0

            # ------------------------------------------------
            # NYA PRODUKTER
            # ------------------------------------------------

            for parsed in to_create:
                # Nya produkter har ännu ingen PriceClass.
                # Därför får de fallback-priset tills en klass
                # tilldelats i admin.
                Product.objects.create(
                    external_id=parsed["external_id"],
                    name=parsed["name"],
                    source=parsed["source"],
                    product_type=parsed["product_type"],
                    shop_category=parsed["shop_category"],
                    model_family=parsed["model_family"],
                    feed_category=parsed["feed_category"],
                    feed_product_type=parsed["feed_product_type"],
                    base_price=parsed["base_price"],
                    price=parsed["fallback_auto_price"],
                    pricing_mode="auto",
                    price_class=None,
                    brand=parsed["brand"],
                    gtin=parsed["gtin"],
                    mpn=parsed["mpn"],
                    image_url=parsed["image_url"],
                    product_url=parsed["product_url"],
                    availability=parsed["availability"],
                    active=True,
                )

                created += 1

            # ------------------------------------------------
            # BEFINTLIGA PRODUKTER
            # ------------------------------------------------

            for existing, parsed in to_update:
                # Feeddata uppdateras alltid.
                existing.name = parsed["name"]
                existing.source = FEED_SOURCE
                existing.product_type = parsed["product_type"]
                existing.shop_category = parsed["shop_category"]
                existing.model_family = parsed["model_family"]
                existing.feed_category = parsed["feed_category"]
                existing.feed_product_type = parsed["feed_product_type"]
                existing.base_price = parsed["base_price"]

                # PriceClass ersätter den gamla logiken där "price_class
                # != None" betydde manuellt pris.
                #
                # Nu betyder:
                #   manual                -> behåll price
                #   auto + PriceClass     -> räkna via PriceClass
                #   auto utan PriceClass  -> fallback * 0.8
                if existing.pricing_mode != "manual":
                    existing.price = self._calculate_sync_price(
                        existing,
                        parsed,
                    )
                    existing.pricing_mode = "auto"

                existing.brand = parsed["brand"]
                existing.gtin = parsed["gtin"]
                existing.mpn = parsed["mpn"]
                existing.image_url = parsed["image_url"]
                existing.product_url = parsed["product_url"]
                existing.availability = parsed["availability"]
                existing.active = True

                existing.save(
                    update_fields=[
                        "name",
                        "source",
                        "product_type",
                        "shop_category",
                        "model_family",
                        "feed_category",
                        "feed_product_type",
                        "base_price",
                        "price",
                        "pricing_mode",
                        "brand",
                        "gtin",
                        "mpn",
                        "image_url",
                        "product_url",
                        "availability",
                        "active",
                        "updated_at",
                    ]
                )

                updated += 1

            deactivated = 0

            if allow_deactivation:
                deactivated = deactivate_qs.update(
                    active=False
                )

        return (
            created,
            updated,
            deactivated,
        )

    # ========================================================
    # UTSKRIFT / DRY RUN
    # ========================================================

    def _print_summary(
        self,
        to_create,
        to_update,
        skipped_rows,
        duplicate_rows,
        collision_rows,
        deactivate_count,
        match_reasons,
        skip_reasons,
        breakdown,
    ):
        self.stdout.write("")
        self.stdout.write(
            self.style.MIGRATE_HEADING(
                "Sammanfattning:"
            )
        )

        self.stdout.write(
            f"  Nya produkter:         {len(to_create)}"
        )
        self.stdout.write(
            f"  Uppdateras:            {len(to_update)}"
        )
        self.stdout.write(
            f"  Hoppas över:           {skipped_rows}"
        )
        self.stdout.write(
            f"  Dubbletter i feeden:   {duplicate_rows}"
        )
        self.stdout.write(
            f"  ID-krockar:            {collision_rows}"
        )
        self.stdout.write(
            f"  Skulle inaktiveras:    {deactivate_count}"
        )

        pricing_counts = Counter()

        for existing, parsed in to_update:
            if existing.pricing_mode == "manual":
                pricing_counts["manuellt pris"] += 1

            elif (
                existing.price_class_id
                and existing.price_class
                and existing.price_class.active
            ):
                pricing_counts[
                    f"prisklass: {existing.price_class.name}"
                ] += 1

            elif (
                existing.price_class_id
                and existing.price_class
                and not existing.price_class.active
            ):
                pricing_counts[
                    "inaktiv prisklass -> fallback"
                ] += 1

            else:
                pricing_counts[
                    "utan prisklass -> fallback"
                ] += 1

        if pricing_counts:
            self.stdout.write("")
            self.stdout.write(
                self.style.MIGRATE_HEADING(
                    "Prissättning för befintliga produkter:"
                )
            )

            for reason, count in pricing_counts.most_common():
                self.stdout.write(
                    f"  {count:>5}  {reason}"
                )

        if breakdown and match_reasons:
            self.stdout.write("")
            self.stdout.write(
                self.style.MIGRATE_HEADING(
                    "Matchningar per kategori:"
                )
            )

            for reason, count in match_reasons.most_common():
                self.stdout.write(
                    f"  {count:>5}  {reason}"
                )

        if breakdown and skip_reasons:
            self.stdout.write("")
            self.stdout.write(
                self.style.MIGRATE_HEADING(
                    "Överhoppat per orsak:"
                )
            )

            for reason, count in skip_reasons.most_common():
                self.stdout.write(
                    f"  {count:>5}  {reason}"
                )

    def _preview_new(self, parsed_rows):
        if not parsed_rows:
            return

        self.stdout.write("")
        self.stdout.write(
            self.style.MIGRATE_HEADING(
                "Förhandsvisning — nya produkter:"
            )
        )

        for parsed in parsed_rows:
            model = (
                parsed["model_family"]
                or "universal"
            )

            self.stdout.write(
                f"  [{parsed['product_type']:>9}] "
                f"[{parsed['shop_category']:<16}] "
                f"[{model}] "
                f"{parsed['name']} — "
                f"Feed: {parsed['base_price']} SEK -> "
                f"Fallback: "
                f"{parsed['fallback_auto_price']} SEK"
            )

    def _preview_updates(self, rows):
        if not rows:
            return

        self.stdout.write("")
        self.stdout.write(
            self.style.MIGRATE_HEADING(
                "Förhandsvisning — uppdateringar:"
            )
        )

        for existing, parsed in rows:
            price_text = self._pricing_description(
                existing,
                parsed,
            )

            self.stdout.write(
                f"  [{parsed['shop_category']:<16}] "
                f"{parsed['name']} — "
                f"Feed: {existing.base_price} -> "
                f"{parsed['base_price']} SEK — "
                f"{price_text}"
            )

    # ========================================================
    # HJÄLPFUNKTIONER
    # ========================================================

    @staticmethod
    def _belongs_to_telefonshoppen(product):
        source = (
            getattr(
                product,
                "source",
                "",
            )
            or ""
        ).casefold()

        product_url = (
            getattr(
                product,
                "product_url",
                "",
            )
            or ""
        ).casefold()

        return (
            source == FEED_SOURCE
            or LEGACY_FEED_DOMAIN in product_url
        )

    @staticmethod
    def _text(item, tag):
        element = (
            item.find(tag, NS)
            if ":" in tag
            else item.find(tag)
        )

        if (
            element is None
            or element.text is None
        ):
            return ""

        return element.text.strip()

    @staticmethod
    def _parse_price(raw):
        if not raw:
            return None

        cleaned = (
            raw
            .replace("SEK", "")
            .replace("sek", "")
            .replace("\xa0", "")
            .replace(" ", "")
            .strip()
        )

        if (
            "," in cleaned
            and "." in cleaned
        ):
            # Svenskt format, t.ex. 12.499,00
            cleaned = (
                cleaned
                .replace(".", "")
                .replace(",", ".")
            )
        else:
            cleaned = cleaned.replace(
                ",",
                ".",
            )

        cleaned = re.sub(
            r"[^0-9.\-]",
            "",
            cleaned,
        )

        try:
            return Decimal(cleaned)
        except (
            InvalidOperation,
            ValueError,
        ):
            return None