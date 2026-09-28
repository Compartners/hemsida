import {
  getProducts,
  type ApiProduct,
  type ProductFilters,
  type ShopCategory,
} from "@/lib/api";


/* ============================================================
   PRODUCT TYPE
   ============================================================ */

export type Product = {
  id: number;

  name: string;

  brand: string;

  /**
   * Svenskt visningsnamn.
   *
   * Ex:
   * Telefoner
   * Skal & fodral
   * Skärmskydd
   * Laddare
   */
  category: string;

  /**
   * Rå produkttyp från Django.
   *
   * Ska användas för logik/filter istället
   * för det svenska category-fältet.
   */
  productType:
    | "phone"
    | "accessory";

  /**
   * Rå webshopkategori från Django.
   */
  shopCategory: ShopCategory;

  /**
   * Ex:
   * iPhone 15
   * iPhone 16
   * Galaxy S24
   * Galaxy S25
   *
   * Tom sträng för generella tillbehör.
   */
  modelFamily: string;

  price: number;

  image?: string;

  mpn: string;

  gtin: string;

  bullets: string[];

  stock: boolean;
};


/* ============================================================
   CATEGORY LABEL
   ============================================================ */

export function getCategoryLabel(
  shopCategory: ShopCategory,
  productType:
    | "phone"
    | "accessory"
): string {
  const labels: Record<
    Exclude<ShopCategory, "">,
    string
  > = {
    phone: "Telefoner",

    case: "Skal & fodral",

    screen_protector:
      "Skärmskydd",

    charger:
      "Laddare",

    cable:
      "Kablar",

    powerbank:
      "Powerbanks",
  };

  if (
    shopCategory &&
    labels[shopCategory]
  ) {
    return labels[
      shopCategory
    ];
  }

  // Fallback för äldre produkter
  // som ännu saknar shop_category.
  if (
    productType === "phone"
  ) {
    return "Telefoner";
  }

  return "Tillbehör";
}


/* ============================================================
   STOCK
   ============================================================ */

function productIsInStock(
  availability?: string
): boolean {
  const value = (
    availability || ""
  )
    .trim()
    .toLowerCase();

  if (!value) {
    // Om Telefonshoppen inte anger något
    // låter vi produkten vara synlig.
    return true;
  }

  const outOfStockValues = [
    "out of stock",
    "out_of_stock",
    "sold out",
    "unavailable",
    "slut i lager",
    "slut",
  ];

  if (
    outOfStockValues.some(
      (status) =>
        value.includes(status)
    )
  ) {
    return false;
  }

  if (
    value === "0" ||
    value === "false"
  ) {
    return false;
  }

  return true;
}


/* ============================================================
   PRODUCT MAPPER
   ============================================================ */

export function mapProduct(
  product: ApiProduct
): Product {
  const productType =
    product.product_type;

  const shopCategory:
    ShopCategory =
      product.shop_category || "";

  const brand =
    product.brand?.trim() ||
    "Okänt varumärke";

  const modelFamily =
    product.model_family?.trim() ||
    "";

  const mpn =
    product.mpn?.trim() ||
    "";

  const gtin =
    product.gtin?.trim() ||
    "";

  return {
    id: product.id,

    name: product.name,

    brand,

    // Svensk UI-label
    category:
      getCategoryLabel(
        shopCategory,
        productType
      ),

    // Råa filtervärden
    productType,

    shopCategory,

    modelFamily,

    /**
     * Django-priset prioriteras.
     *
     * Backend ansvarar för prissättningen,
     * inklusive eventuellt företagspåslag.
     *
     * base_price används enbart som fallback.
     */
    price: Number(
      product.price ??
      product.base_price ??
      0
    ),

    image:
      product.image_url ||
      undefined,

    mpn,

    gtin,

    bullets: [
      mpn
        ? `Art.nr: ${mpn}`
        : "",

      gtin
        ? `EAN: ${gtin}`
        : "",
    ].filter(Boolean),

    stock:
      productIsInStock(
        product.availability
      ),
  };
}


/* ============================================================
   FETCH PRODUCTS
   ============================================================ */

/**
 * Kan köras precis som tidigare:
 *
 *   fetchProducts()
 *
 * Eller med filter:
 *
 *   fetchProducts({
 *     productType: "accessory",
 *     shopCategory: "charger"
 *   })
 */
export async function fetchProducts(
  filters: ProductFilters = {}
): Promise<Product[]> {
  const data =
    await getProducts(filters);

  return data.map(
    mapProduct
  );
}