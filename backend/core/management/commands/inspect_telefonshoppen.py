"""
Django management command: inspektera Telefonshoppens Google Shopping-feed
UTAN att röra databasen. Bra för att se vilka kategorier som faktiskt
finns i feeden innan man bestämmer vad sync-kommandot ska plocka med.

Kör:
    python manage.py inspect_telefonshoppen

Filtrera på ett sökord i kategori/product_type (case-insensitive):
    python manage.py inspect_telefonshoppen --contains mobil

Visa exempel-produkter för en viss kategori-sträng:
    python manage.py inspect_telefonshoppen --show "Mobiltelefoner"
"""

from collections import Counter

import requests
from django.core.management.base import BaseCommand, CommandError
from lxml import etree

FEED_URL = "https://www.telefonshoppen.se/agent/Google_SE_products_gFqENyX4rji3.xml"

NS = {"g": "http://base.google.com/ns/1.0"}


class Command(BaseCommand):
    help = (
        "Läser Telefonshoppens feed och visar en översikt över vilka "
        "g:google_product_category- och g:product_type-värden som finns, "
        "med antal produkter för varje. Sparar/ändrar ingenting."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--contains",
            type=str,
            default=None,
            help="Visa bara kategorier/product_type som innehåller denna text (case-insensitive).",
        )
        parser.add_argument(
            "--show",
            type=str,
            default=None,
            help="Visa exempel-produkter (namn + pris) för en exakt kategori- eller product_type-sträng.",
        )
        parser.add_argument(
            "--show-limit",
            type=int,
            default=15,
            help="Max antal exempel-produkter att visa med --show (default 15).",
        )

    def handle(self, *args, **options):
        contains = options["contains"]
        show = options["show"]
        show_limit = options["show_limit"]

        self.stdout.write("Hämtar feed...")

        try:
            response = requests.get(FEED_URL, timeout=30)
            response.raise_for_status()
        except requests.RequestException as e:
            raise CommandError(f"Kunde inte hämta feeden: {e}")

        root = etree.fromstring(response.content)
        items = root.findall(".//item")

        self.stdout.write(f"{len(items)} rader i feeden totalt.\n")

        category_counts = Counter()
        product_type_counts = Counter()

        # För --show: samla exempel per exakt sträng
        examples_by_category = {}
        examples_by_product_type = {}

        for item in items:
            category = self._text(item, "g:google_product_category")
            product_type = self._text(item, "g:product_type")
            name = self._text(item, "title")
            price = self._text(item, "g:price")

            category_counts[category or "(tom)"] += 1
            product_type_counts[product_type or "(tom)"] += 1

            if show and category == show:
                examples_by_category.setdefault(category, []).append((name, price))
            if show and product_type == show:
                examples_by_product_type.setdefault(product_type, []).append((name, price))

        if show:
            self._print_examples(
                "g:google_product_category",
                show,
                examples_by_category.get(show, []),
                show_limit,
            )
            self._print_examples(
                "g:product_type",
                show,
                examples_by_product_type.get(show, []),
                show_limit,
            )
            return

        self._print_counter(
            "g:google_product_category — antal produkter per värde",
            category_counts,
            contains,
        )
        self._print_counter(
            "g:product_type — antal produkter per värde",
            product_type_counts,
            contains,
        )

        self.stdout.write("")
        self.stdout.write(
            "Tips: kör med --show \"<exakt kategori-sträng>\" för att se "
            "exempel-produkter i den kategorin."
        )

    def _print_counter(self, heading, counter, contains):
        self.stdout.write(self.style.MIGRATE_HEADING(heading + ":"))

        rows = counter.most_common()
        if contains:
            needle = contains.lower()
            rows = [(k, v) for k, v in rows if needle in k.lower()]

        if not rows:
            self.stdout.write("  (inga träffar)")
        else:
            for value, count in rows:
                self.stdout.write(f"  {count:>5}  {value}")

        self.stdout.write("")

    def _print_examples(self, field_name, value, examples, limit):
        self.stdout.write(
            self.style.MIGRATE_HEADING(f"Exempel där {field_name} == {value!r}:")
        )
        if not examples:
            self.stdout.write("  (inga träffar)")
        else:
            for name, price in examples[:limit]:
                self.stdout.write(f"  {price:>12}  {name}")
            if len(examples) > limit:
                self.stdout.write(f"  ... och {len(examples) - limit} till")
        self.stdout.write(f"  Totalt: {len(examples)} produkter")
        self.stdout.write("")

    @staticmethod
    def _text(item, tag):
        el = item.find(tag, NS) if ":" in tag else item.find(tag)
        if el is None or el.text is None:
            return ""
        return el.text.strip()