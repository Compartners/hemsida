import { getProducts, type ApiProduct } from "@/lib/api";

export type Product = {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  image?: string;
  bullets: string[];
  stock: boolean;
  productType: "phone" | "accessory";
};

export function mapProduct(product: ApiProduct): Product {
  const productType = product.product_type;

  // Kontrollera om varan är slut i lager
  const rawAvailability = (product.availability || "").toLowerCase();
  const isOutOfStock =
    rawAvailability.includes("out") ||
    rawAvailability.includes("slut") ||
    rawAvailability === "0";

  return {
    id: product.id,
    name: product.name,
    brand: product.brand || "Okänt varumärke",

    // Sätts till "Telefoner" för att matcha ProductFilters och sektionen med toppsäljare
    category: productType === "phone" ? "Telefoner" : "Tillbehör",

    // Använder beräknat kundpris med påslag i första hand, annars base_price
    price: Number(product.price ?? product.base_price ?? 0),

    image: product.image_url || undefined,

    bullets: [
      product.mpn ? `Art.nr: ${product.mpn}` : "",
      product.gtin ? `EAN: ${product.gtin}` : "",
    ].filter(Boolean),

    stock: !isOutOfStock,

    productType,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const data = await getProducts();
  return data.map(mapProduct);
}