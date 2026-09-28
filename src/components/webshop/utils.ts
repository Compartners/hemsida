import type {
  ApiProduct,
  ShopCategory,
} from "@/lib/api";

import type { Product } from "./types";


/* ============================================================
   CATEGORY LABELS
   ============================================================ */

export const SHOP_CATEGORY_LABELS: Record<
  Exclude<ShopCategory, "">,
  string
> = {
  phone: "Telefoner",
  case: "Skal & fodral",
  screen_protector: "Skärmskydd",
  charger: "Laddare",
  cable: "Kablar",
  powerbank: "Powerbanks",
};


export function getCategoryLabel(
  shopCategory: ShopCategory,
  productType: "phone" | "accessory"
): string {
  if (
    shopCategory &&
    SHOP_CATEGORY_LABELS[shopCategory]
  ) {
    return SHOP_CATEGORY_LABELS[shopCategory];
  }

  return productType === "phone"
    ? "Telefoner"
    : "Tillbehör";
}


/* ============================================================
   PRICE
   ============================================================ */

export function formatPrice(
  value: number
) {
  return new Intl.NumberFormat(
    "sv-SE",
    {
      style: "currency",
      currency: "SEK",
      maximumFractionDigits: 0,
    }
  ).format(value);
}


/* ============================================================
   STOCK
   ============================================================ */

function isProductInStock(
  availability?: string
): boolean {
  const value = (
    availability || ""
  )
    .trim()
    .toLowerCase();

  if (!value) {
    return true;
  }

  const outOfStockSignals = [
    "out of stock",
    "out_of_stock",
    "sold out",
    "unavailable",
    "slut i lager",
    "slut",
  ];

  if (
    outOfStockSignals.some(
      (signal) =>
        value.includes(signal)
    )
  ) {
    return false;
  }

  return (
    value !== "0" &&
    value !== "false"
  );
}


/* ============================================================
   PRODUCT MAPPER
   ============================================================ */

export function mapProduct(
  product: ApiProduct
): Product {
  const productType =
    product.product_type;

  const shopCategory: ShopCategory =
    product.shop_category || "";

  const brand =
    product.brand?.trim() ||
    "Okänt varumärke";

  const modelFamily =
    product.model_family?.trim() ||
    "";

  const mpn =
    product.mpn?.trim() || "";

  const gtin =
    product.gtin?.trim() || "";

  return {
    id: product.id,

    name: product.name,

    brand,

    category: getCategoryLabel(
      shopCategory,
      productType
    ),

    productType,

    shopCategory,

    modelFamily,

    // Backend-priset används i första hand.
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
      isProductInStock(
        product.availability
      ),
  };
}