import { ApiProduct } from "@/lib/api";
import { Product } from "./types";

export const CATEGORIES = ["Alla", "Mobiler", "Surfplattor", "Tillbehör"] as const;

export function formatPrice(value: number) {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(value);
}

export function mapProduct(product: ApiProduct): Product {
  const productType = product.product_type;

  return {
    id: product.id,
    name: product.name,
    brand: product.brand || "Okänt varumärke",
    category: productType === "phone" ? "Mobiler" : "Tillbehör",
    // Använder backend-beräknat pris i första hand, fallback till base_price
    price: Number((product as any).price ?? product.base_price),
    image: product.image_url || undefined,
    bullets: [product.mpn, product.gtin, product.availability].filter(Boolean) as string[],
    stock:
      product.availability !== "out_of_stock" &&
      product.availability !== "out of stock",
    productType,
  };
}