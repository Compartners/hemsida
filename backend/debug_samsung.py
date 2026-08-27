import requests
from lxml import etree

FEED_URL = "https://www.telefonshoppen.se/agent/Google_SE_products_gFqENyX4rji3.xml"
NS = {"g": "http://base.google.com/ns/1.0"}

print("Hämtar feed...")
res = requests.get(FEED_URL, timeout=30)
root = etree.fromstring(res.content)

def get_txt(item, tag):
    el = item.find(tag, NS) if ":" in tag else item.find(tag)
    return el.text.strip() if el is not None and el.text else ""

samsung_candidates = []

for item in root.findall(".//item"):
    title = get_txt(item, "title")
    brand = get_txt(item, "g:brand")
    
    # Leta efter alla artiklar som nämner Samsung eller Galaxy i titel/märke
    if "samsung" in title.lower() or "samsung" in brand.lower():
        cat = get_txt(item, "g:google_product_category")
        prod_type = get_txt(item, "g:product_type")
        grouping = get_txt(item, "g:adwords_grouping")
        
        # Sortera bort skal och skärmskydd för att hitta själva hårdvaran/telefonerna
        if not any(acc in title.lower() or acc in prod_type.lower() for acc in ["skal", "fodral", "skydd", "glas"]):
            samsung_candidates.append({
                "title": title,
                "category": cat,
                "product_type": prod_type,
                "adwords_grouping": grouping,
            })

print(f"\nHittade {len(samsung_candidates)} potentiella Samsung-enheter:\n")
for c in samsung_candidates[:15]:
    print(f"Titel:            {c['title']}")
    print(f"Kategori:         {c['category']}")
    print(f"Product Type:     {c['product_type']}")
    print(f"AdWords Grouping: {c['adwords_grouping']}")
    print("-" * 50)