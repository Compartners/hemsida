"""
Django management command: synkar Product-tabellen mot Telefonshoppens
Google Shopping-feed.

Testa säkert först:
    python manage.py sync_telefonshoppen --dry-run
    python manage.py sync_telefonshoppen --dry-run --limit 20

Kör på riktigt:
    python manage.py sync_telefonshoppen
"""

import re
from collections import Counter
from decimal import Decimal, InvalidOperation

import requests
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from lxml import etree

from core.models import Product

FEED_URL = "https://www.telefonshoppen.se/agent/Google_SE_products_gFqENyX4rji3.xml"

NS = {"g": "http://base.google.com/ns/1.0"}

CATEGORY_MAP = {
    "Mobiltelefontillbehör": "accessory",
    "Mobiltillbehör": "accessory",
    "Mobiltelefoner": "phone",
}

MOBILE_PRODUCT_TYPE_KEYWORDS = {
    # Endast använda på g:product_type-strängar som redan börjar med "Mobil",
    # så bredare ord som "Tillbehör" är säkra här (kan inte råka matcha
    # spelkonsoler, tv-tillbehör etc. eftersom vi redan vet att grenen är Mobil).
    "Tillbehör": "accessory",
    "Skal": "accessory",
    "Fodral": "accessory",
    "Laddare": "accessory",
    "Skärmskydd": "accessory",
    "Mobiltelefoner": "phone",
}

MAX_EXPECTED_ITEMS = 5000
MAX_DEACTIVATIONS_WITHOUT_CONFIRM = 200


class Command(BaseCommand):
    help = "Synkar telefoner och tillbehör från Telefonshoppens XML-feed."

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Hämta och parsa feeden, visa vad som SKULLE hända, men spara inget.",
        )
        parser.add_argument(
            "--limit",
            type=int,
            default=None,
            help="Bearbeta bara de första N raderna i feeden (för snabb testkörning).",
        )
        parser.add_argument(
            "--force",
            action="store_true",
            help="Kör igenom även om antalet inaktiveringar överstiger säkerhetsgränsen.",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        limit = options["limit"]
        force = options["force"]

        self.stdout.write("Hämtar feed...")

        try:
            response = requests.get(FEED_URL, timeout=30)
            response.raise_for_status()
        except requests.RequestException as e:
            raise CommandError(f"Kunde inte hämta feeden: {e}")

        root = etree.fromstring(response.content)
        items = root.findall(".//item")

        total_in_feed = len(items)

        self.stdout.write(
            f"{total_in_feed} rader i feeden totalt."
        )

        if total_in_feed > MAX_EXPECTED_ITEMS:
            raise CommandError(
                f"Feeden innehåller {total_in_feed} rader, mer än väntade "
                f"{MAX_EXPECTED_ITEMS}. Avbryter utan att röra databasen."
            )

        if limit:
            items = items[:limit]
            self.stdout.write(
                f"--limit {limit}: bearbetar bara {len(items)} rader."
            )

        # ---------------------------------------------------------
        # Befintliga produkter i databasen
        # ---------------------------------------------------------

        existing_products = {
            product.external_id: product
            for product in Product.objects.all()
        }

        # ---------------------------------------------------------
        # Bearbeta feed
        # ---------------------------------------------------------

        seen_external_ids = set()

        to_create = []
        to_update = []

        skipped_rows = 0
        duplicate_rows = 0
        skip_reasons = Counter()

        for item in items:
            parsed, reason = self._parse_item(item)

            if parsed is None:
                skipped_rows += 1
                skip_reasons[reason] += 1
                continue

            external_id = parsed["external_id"]

            # Samma produkt kan förekomma flera gånger i feeden.
            if external_id in seen_external_ids:
                duplicate_rows += 1
                continue

            seen_external_ids.add(external_id)

            # Finns redan i databasen -> uppdatera
            if external_id in existing_products:
                to_update.append(
                    (
                        existing_products[external_id],
                        parsed,
                    )
                )

            # Finns inte -> skapa
            else:
                to_create.append(parsed)

        # ---------------------------------------------------------
        # Inaktivering
        # ---------------------------------------------------------

        deactivate_qs = Product.objects.none()

        if not limit:
            deactivate_qs = (
                Product.objects
                .filter(
                    active=True,
                    product_type__in=["phone", "accessory"],
                )
                .exclude(
                    external_id__in=seen_external_ids
                )
            )

        deactivate_count = deactivate_qs.count()

        # ---------------------------------------------------------
        # Sammanfattning
        # ---------------------------------------------------------

        self.stdout.write("")
        self.stdout.write(
            self.style.MIGRATE_HEADING("Sammanfattning:")
        )

        self.stdout.write(
            f"  Nya produkter:         {len(to_create)}"
        )

        self.stdout.write(
            f"  Uppdateras:            {len(to_update)}"
        )

        self.stdout.write(
            f"  Hoppas över (fel rad): {skipped_rows}"
        )

        if skip_reasons:
            for reason, count in skip_reasons.most_common():
                self.stdout.write(f"      - {reason}: {count}")

        self.stdout.write(
            f"  Dubbletter i feeden:   {duplicate_rows}"
        )

        self.stdout.write(
            f"  Skulle inaktiveras:    {deactivate_count}"
        )

        # ---------------------------------------------------------
        # Dry run
        # ---------------------------------------------------------

        if dry_run:
            self.stdout.write("")
            self.stdout.write(
                self.style.WARNING(
                    "DRY RUN — inget har sparats. "
                    "Kör utan --dry-run för att verkställa."
                )
            )

            self._preview(
                to_create[:10],
                "Exempel på nya produkter",
            )

            return

        # ---------------------------------------------------------
        # Säkerhetskontroll
        # ---------------------------------------------------------

        if (
            deactivate_count > MAX_DEACTIVATIONS_WITHOUT_CONFIRM
            and not force
        ):
            raise CommandError(
                f"Skulle inaktivera {deactivate_count} produkter, mer än "
                f"säkerhetsgränsen ({MAX_DEACTIVATIONS_WITHOUT_CONFIRM}). "
                f"Om det verkligen stämmer, kör igen med --force."
            )

        # ---------------------------------------------------------
        # Spara
        # ---------------------------------------------------------

        with transaction.atomic():

            created = 0
            updated = 0

            # Skapa nya
            for parsed in to_create:
                Product.objects.create(
                    external_id=parsed["external_id"],
                    name=parsed["name"],
                    product_type=parsed["product_type"],
                    base_price=parsed["base_price"],
                    brand=parsed["brand"],
                    gtin=parsed["gtin"],
                    mpn=parsed["mpn"],
                    image_url=parsed["image_url"],
                    product_url=parsed["product_url"],
                    availability=parsed["availability"],
                    active=True,
                )

                created += 1

            # Uppdatera befintliga
            for existing, parsed in to_update:

                for field in (
                    "name",
                    "product_type",
                    "base_price",
                    "brand",
                    "gtin",
                    "mpn",
                    "image_url",
                    "product_url",
                    "availability",
                ):
                    setattr(
                        existing,
                        field,
                        parsed[field],
                    )

                existing.active = True

                existing.save()

                updated += 1

            # Inaktivera produkter som inte längre finns i feeden
            deactivated = 0

            if not limit:
                deactivated = deactivate_qs.update(
                    active=False
                )

        # ---------------------------------------------------------
        # Klart
        # ---------------------------------------------------------

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                f"Klart. Nya: {created}, "
                f"uppdaterade: {updated}, "
                f"hoppade över: {skipped_rows}, "
                f"dubbletter: {duplicate_rows}, "
                f"inaktiverade: {deactivated}."
            )
        )

    def _preview(self, parsed_rows, heading):
        if not parsed_rows:
            return
        self.stdout.write("")
        self.stdout.write(self.style.MIGRATE_HEADING(heading + ":"))
        for p in parsed_rows:
            self.stdout.write(
                f"  [{p['product_type']:>9}] {p['name']} — {p['base_price']} SEK "
                f"({p['external_id']})"
            )

    def _parse_item(self, item):
        def text(tag):
            el = item.find(tag, NS) if ":" in tag else item.find(tag)
            if el is None or el.text is None:
                return ""
            return el.text.strip()

        external_id = text("g:id")
        if not external_id:
            return None, "saknar external_id (g:id)"

        category = text("g:google_product_category")
        product_type_field = text("g:product_type")

        product_type = self._classify(category)
        if product_type is None and product_type_field.startswith("Mobil"):
            # product_type-fältet används bara som fallback när det tydligt
            # ligger under mobil-grenen, t.ex. "Mobil > Mobiltelefoner > ..."
            # eller "Mobil > Skal och fodral > ...". Detta undviker att
            # produkter som PS5-spel eller spelkontroller (som också kan
            # innehålla ordet "tillbehör" i sin egen kategori) råkar matchas.
            product_type = self._classify(
                product_type_field, MOBILE_PRODUCT_TYPE_KEYWORDS
            )

        if product_type is None:
            return None, f"okänd kategori ({category or product_type_field or 'tom'})"

        name = text("title")
        if not name:
            return None, "saknar title"

        price_raw = text("g:price")
        base_price = self._parse_price(price_raw)
        if base_price is None:
            return None, f"kunde inte tolka pris ({price_raw!r})"
        if base_price <= 0:
            return None, "pris <= 0"

        return {
            "external_id": external_id,
            "name": name,
            "product_type": product_type,
            "base_price": base_price,
            "brand": text("g:brand"),
            "gtin": text("g:gtin"),
            "mpn": text("g:mpn"),
            "image_url": text("g:image_link"),
            "product_url": text("link"),
            "availability": text("g:availability"),
        }, None

    @staticmethod
    def _classify(category_text, mapping=None):
        if not category_text:
            return None
        for keyword, product_type in (mapping or CATEGORY_MAP).items():
            if keyword in category_text:
                return product_type
        return None

    @staticmethod
    def _parse_price(raw):
        if not raw:
            return None
        # Ta bort valutakod, vanliga och icke-brytande mellanslag (tusentalsavgränsare),
        # och normalisera decimalkomma till punkt.
        cleaned = (
            raw.replace("SEK", "")
            .replace("\xa0", "")
            .replace(" ", "")
            .strip()
        )
        # Om både punkt och komma finns antar vi att komma är decimaltecken
        # och punkt är tusentalsavgränsare (t.ex. "1.599,00").
        if "," in cleaned and "." in cleaned:
            cleaned = cleaned.replace(".", "").replace(",", ".")
        else:
            cleaned = cleaned.replace(",", ".")

        cleaned = re.sub(r"[^0-9.\-]", "", cleaned)

        if not cleaned:
            return None

        try:
            return Decimal(cleaned)
        except InvalidOperation:
            return None