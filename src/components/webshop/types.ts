import type { ShopCategory } from "@/lib/api";

export type Product = {
  id: number;
  name: string;
  brand: string;

  // Visningsnamn, t.ex. "Skal & fodral"
  category: string;

  // Rådata för filtrering
  productType: "phone" | "accessory";
  shopCategory: ShopCategory;
  modelFamily: string;

  price: number;
  image?: string;

  mpn: string;
  gtin: string;

  bullets: string[];
  stock: boolean;
};

export type CartItem = {
  product: Product;
  qty: number;
};

export type ProductTypeFilter =
  | "all"
  | "phone"
  | "accessory";

export type SortOption =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "name-asc";