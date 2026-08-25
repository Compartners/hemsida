import {
  getProducts,
  type ApiProduct,
} from "@/lib/api";

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

  return {
    id: product.id,
    name: product.name,
    brand: product.brand || "Okänt varumärke",

    category:
      productType === "phone"
        ? "Mobiler"
        : "Tillbehör",

    price: Number(product.base_price),

    image: product.image_url || undefined,

    bullets: [
      product.mpn,
      product.gtin,
      product.availability,
    ].filter(Boolean),

    stock:
      product.availability !== "out_of_stock" &&
      product.availability !== "out of stock",

    productType,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const data = await getProducts();

  return data.map(mapProduct);
}