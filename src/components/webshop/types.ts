// types.ts
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

export type CartItem = {
  product: Product;
  qty: number;
};