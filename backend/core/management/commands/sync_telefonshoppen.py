"""
Django management command: synkar Product-tabellen mot Telefonshoppens
Google Shopping-feed.
"""

import re
from collections import Counter
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP

import requests
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from lxml import etree

from core.models import Product

FEED_URL = "https://www.telefonshoppen.se/agent/Google_SE_products_gFqENyX4rji3.xml"
NS = {"g": "http://base.google.com/ns/1.0"}

PRICE_MULTIPLIER = Decimal("0.8")

# ============================================================
# ALLOWLIST & FILTER
# ============================================================

ALLOWED_PHONE_GROUPS = [
    "apple iphone",
    "samsung galaxy",
]

# Modellkrav för telefoner samt modellanpassade skydd (skal/glas)
ALLOWED_MODEL_KEYWORDS = [
    "iphone 17",
    "iphone 16",
    "iphone 15",
    "galaxy s25",
    "galaxy s24",
    "galaxy a56",
    "galaxy a36",
]

# 1. Modellanpassade tillbehör (MÅSTE nämna en modell ovan)
MODEL_SPECIFIC_ACCESSORIES = [
    "skal",
    "fodral",
    "skärmskydd",
    "härdat glas",
    "case",
    "cover",
    "wallet",
    "plånbok",
]

# 2. Generella ström- och laddtillbehör (Kräver INTE modell i namnet!)
UNIVERSAL_ACCESSORIES = [
    "laddare",
    "charger",
    "adapter",
    "strömadapter",
    "kabel",
    "cable",
    "powerbank",
    "magsafe-laddare",
    "magsafe charger",
    "usb-c till lightning",
    "usb-c-kabel",
]

# Tillåtna varumärken för universella laddare (för att undvika skräp)
ALLOWED_CHARGER_BRANDS = [
    "apple",
    "samsung",
    "belkin",
    "anker",
    "linocell",
    "champion",
    "deltaco",
    "sbs",
    "cellularline",
]

MAX_TOTAL_PRODUCTS = 800
MAX_EXPECTED_ITEMS = 5000
MAX_DEACTIVATIONS_WITHOUT_CONFIRM = 500


class Command(BaseCommand):
    help = "Synkar telefoner, skydd och laddare från Telefonshoppens XML-feed."

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true", help="Testkör utan att spara.")
        parser.add_argument("--limit", type=int, default=None, help="Begränsa antal rader.")
        parser.add_argument("--force", action="store_true", help="Tvinga igenom inaktiveringar.")
        parser.add_argument("--breakdown", action="store_true", help="Visa träffstatistik.")

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        limit = options["limit"]
        force = options["force"]
        breakdown = options["breakdown"]

        self.stdout.write("Hämtar feed...")
        try:
            response = requests.get(FEED_URL, timeout=30)
            response.raise_for_status()
        except requests.RequestException as e:
            raise CommandError(f"Kunde inte hämta feeden: {e}")

        root = etree.fromstring(response.content)
        items = root.findall(".//item")
        total_in_feed = len(items)

        self.stdout.write(f"{total_in_feed} rader i feeden totalt.")

        if total_in_feed > MAX_EXPECTED_ITEMS:
            raise CommandError(f"Feeden innehåller {total_in_feed} rader, max är {MAX_EXPECTED_ITEMS}.")

        if limit:
            items = items[:limit]

        existing_products = {p.external_id: p for p in Product.objects.all()}
        seen_external_ids = set()
        to_create = []
        to_update = []
        skipped_rows = 0
        duplicate_rows = 0
        skip_reasons = Counter()
        match_reasons = Counter()

        for item in items:
            parsed, reason = self._parse_item(item, match_reasons if breakdown else None)

            if parsed is None:
                skipped_rows += 1
                skip_reasons[reason] += 1
                continue

            external_id = parsed["external_id"]
            if external_id in seen_external_ids:
                duplicate_rows += 1
                continue

            seen_external_ids.add(external_id)

            if external_id in existing_products:
                to_update.append((existing_products[external_id], parsed))
            else:
                to_create.append(parsed)

        total_matched = len(to_create) + len(to_update)

        deactivate_qs = Product.objects.none()
        if not limit:
            deactivate_qs = Product.objects.filter(
                active=True,
                product_type__in=["phone", "accessory"],
            ).exclude(external_id__in=seen_external_ids)

        deactivate_count = deactivate_qs.count()

        # Sammanfattning
        self.stdout.write("")
        self.stdout.write(self.style.MIGRATE_HEADING("Sammanfattning:"))
        self.stdout.write(f"  Nya produkter:         {len(to_create)}")
        self.stdout.write(f"  Uppdateras:            {len(to_update)}")
        self.stdout.write(f"  Hoppas över:           {skipped_rows}")
        self.stdout.write(f"  Dubbletter i feeden:   {duplicate_rows}")
        self.stdout.write(f"  Skulle inaktiveras:    {deactivate_count}")

        if breakdown and match_reasons:
            self.stdout.write("")
            self.stdout.write(self.style.MIGRATE_HEADING("Matchningar per kategori:"))
            for reason, count in match_reasons.most_common():
                self.stdout.write(f"  {count:>5}  {reason}")

        if dry_run:
            self.stdout.write("")
            self.stdout.write(self.style.WARNING("DRY RUN — inget sparat."))
            self._preview(to_create[:30], "Förhandsvisning (nya)")
            return

        if not limit and total_matched > MAX_TOTAL_PRODUCTS:
            raise CommandError(
                f"Matchade {total_matched} produkter, mer än MAX ({MAX_TOTAL_PRODUCTS}). "
                f"Kör med --breakdown för att se fördelning."
            )

        if deactivate_count > MAX_DEACTIVATIONS_WITHOUT_CONFIRM and not force:
            raise CommandError(
                f"Skulle inaktivera {deactivate_count} produkter (> {MAX_DEACTIVATIONS_WITHOUT_CONFIRM}). "
                f"Kör med --force för att godkänna."
            )

        with transaction.atomic():
            created = 0
            updated = 0

            for parsed in to_create:
                Product.objects.create(
                    external_id=parsed["external_id"],
                    name=parsed["name"],
                    product_type=parsed["product_type"],
                    base_price=parsed["base_price"],
                    price=parsed["price"],
                    brand=parsed["brand"],
                    gtin=parsed["gtin"],
                    mpn=parsed["mpn"],
                    image_url=parsed["image_url"],
                    product_url=parsed["product_url"],
                    availability=parsed["availability"],
                    active=True,
                )
                created += 1

            for existing, parsed in to_update:
                for field in (
                    "name", "product_type", "base_price", "price",
                    "brand", "gtin", "mpn", "image_url", "product_url", "availability",
                ):
                    setattr(existing, field, parsed[field])
                existing.active = True
                existing.save()
                updated += 1

            deactivated = 0
            if not limit:
                deactivated = deactivate_qs.update(active=False)

        self.stdout.write(self.style.SUCCESS(
            f"Klart! Nya: {created}, uppdaterade: {updated}, inaktiverade: {deactivated}."
        ))

    def _preview(self, parsed_rows, heading):
        if not parsed_rows:
            return
        self.stdout.write("")
        self.stdout.write(self.style.MIGRATE_HEADING(heading + ":"))
        for p in parsed_rows:
            self.stdout.write(
                f"  [{p['product_type']:>9}] {p['name']} — "
                f"Bas: {p['base_price']} SEK -> Utpris: {p['price']} SEK"
            )

    def _parse_item(self, item, match_reasons=None):
        def text(tag):
            el = item.find(tag, NS) if ":" in tag else item.find(tag)
            if el is None or el.text is None:
                return ""
            return el.text.strip()

        external_id = text("g:id")
        if not external_id:
            return None, "saknar external_id"

        name = text("title")
        if not name:
            return None, "saknar title"

        category = text("g:google_product_category")
        product_type_field = text("g:product_type")
        adwords_grouping = text("g:adwords_grouping")
        brand = text("g:brand")

        # Avgör produkttyp och allowlist-godkännande
        product_type, match_key = self._classify_and_filter(
            name=name,
            category=category,
            product_type_field=product_type_field,
            adwords_grouping=adwords_grouping,
            brand=brand,
        )

        if not product_type:
            return None, "utanför allowlist/okänd kategori"

        if match_reasons is not None and match_key:
            match_reasons[match_key] += 1

        price_raw = text("g:price")
        base_price = self._parse_price(price_raw)
        if base_price is None or base_price <= 0:
            return None, f"ogiltigt pris ({price_raw!r})"

        calculated_price = (base_price * PRICE_MULTIPLIER).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )

        return {
            "external_id": external_id,
            "name": name,
            "product_type": product_type,
            "base_price": base_price,
            "price": calculated_price,
            "brand": brand,
            "gtin": text("g:gtin"),
            "mpn": text("g:mpn"),
            "image_url": text("g:image_link"),
            "product_url": text("link"),
            "availability": text("g:availability"),
        }, None

    @staticmethod
    def _classify_and_filter(name, category, product_type_field, adwords_grouping, brand):
        name_lower = name.lower()
        group_lower = adwords_grouping.lower()
        type_lower = product_type_field.lower()
        brand_lower = brand.lower()

        # 1. TELEFONER
        if "telefon" in category.lower() or "mobiltelefon" in type_lower or "phone" in group_lower:
            # Kontrollera att det är en faktisk telefon och inte ett skal
            is_case = any(w in name_lower for w in ["skal", "case", "cover", "fodral", "skydd"])
            if not is_case and any(g in group_lower for g in ALLOWED_PHONE_GROUPS):
                for model in ALLOWED_MODEL_KEYWORDS:
                    if model in name_lower:
                        return "phone", f"phone: {model}"

        # 2. UNIVERSELLA LADDARE & ADAPTRAR (Kräver ej telefonmodell i namn)
        is_universal = any(w in name_lower or w in type_lower for w in UNIVERSAL_ACCESSORIES)
        if is_universal:
            # Godkänn om märket är tillåtet, eller om namnet tydligt anger Apple/Samsung
            if any(b in brand_lower or b in name_lower for b in ALLOWED_CHARGER_BRANDS):
                return "accessory", "accessory: universal laddare/adapter"

        # 3. MODELLSPECIFIKA SKAL & SKYDD
        is_model_accessory = any(w in name_lower or w in type_lower for w in MODEL_SPECIFIC_ACCESSORIES)
        if is_model_accessory:
            for model in ALLOWED_MODEL_KEYWORDS:
                if model in name_lower:
                    return "accessory", f"accessory: skydd ({model})"

        return None, None

    @staticmethod
    def _parse_price(raw):
        if not raw:
            return None
        cleaned = raw.replace("SEK", "").replace("\xa0", "").replace(" ", "").strip()
        if "," in cleaned and "." in cleaned:
            cleaned = cleaned.replace(".", "").replace(",", ".")
        else:
            cleaned = cleaned.replace(",", ".")
        cleaned = re.sub(r"[^0-9.\-]", "", cleaned)
        try:
            return Decimal(cleaned)
        except InvalidOperation:
            return None