// Webbshop.tsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  companyLogin,
  companyLogout,
  getCompany,
  getProducts,
  type ApiCompany,
} from "@/lib/api";

import { CartItem, Product } from "../components/webshop/types";
import { mapProduct } from "../components/webshop/utils";
import { ShopHero } from "../components/webshop/ShopHero";
import { ProductFilters } from "../components/webshop/ProductFilters";
import { ProductCard } from "../components/webshop/ProductCard";
import { AccountCard } from "../components/webshop/AccountCard";
import { CartSummary } from "../components/webshop/CartSummary";

export default function Webbshop() {
  const [category, setCategory] = useState("Alla");
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [account, setAccount] = useState<ApiCompany | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingAccount, setLoadingAccount] = useState(true);

  // Funktion för att ladda/uppdatera produktlistan
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const data = await getProducts();
      console.log("Hämtade produkter från API:", data[0]); // Debug: kontrollera priset här
      setProducts(data.map(mapProduct));
    } catch (error) {
      console.error("Kunde inte hämta produkter:", error);
      toast.error("Kunde inte hämta produkter.");
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // Vid första sidladdning
  useEffect(() => {
    async function init() {
      try {
        const company = await getCompany();
        setAccount(company);
      } catch {
        setAccount(null);
      } finally {
        setLoadingAccount(false);
      }
      await fetchProducts();
    }
    init();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchCategory = category === "Alla" || product.category === category;
      const matchQuery =
        !normalizedQuery ||
        `${product.name} ${product.brand}`.toLowerCase().includes(normalizedQuery);
      return matchCategory && matchQuery;
    });
  }, [products, category, query]);

  const handleLogin = async (id: string) => {
    if (!id.trim()) {
      toast.error("Ange ditt kund-ID.");
      return;
    }
    try {
      const result = await companyLogin(id.trim());
      setAccount(result.company);
      setCart([]);
      toast.success(`Inloggad som ${result.company.name}`);
      
      // HÄMTA OM PRODUKTERNA DIREKT EFTER ATT SESSIONEN SATTS
      await fetchProducts();
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : "Kunde inte logga in.");
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await companyLogout();
      setAccount(null);
      setCart([]);
      toast.success("Du är utloggad.");
      
      // HÄMTA OM GRUNDPRISER EFTER UTLOGGNING
      await fetchProducts();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Kunde inte logga ut.");
    }
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    toast.success(`${product.name} lades i varukorgen`);
  };

  const isLoading = loadingProducts || loadingAccount;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <ShopHero />

        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
            <div>
              <ProductFilters
                category={category}
                onSelectCategory={setCategory}
                query={query}
                onQueryChange={setQuery}
              />

              {isLoading ? (
                <div className="mt-10 text-center text-foreground">Hämtar produkter...</div>
              ) : (
                <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onAdd={addToCart} />
                  ))}
                </div>
              )}

              {!isLoading && filteredProducts.length === 0 && (
                <p className="mt-10 text-center text-muted-foreground">
                  Inga produkter matchar din sökning.
                </p>
              )}
            </div>

            <aside className="h-fit space-y-4 lg:sticky lg:top-24">
              <AccountCard
                account={account}
                loading={loadingAccount}
                onLogin={handleLogin}
                onLogout={handleLogout}
              />
              <CartSummary cart={cart} isLoggedIn={Boolean(account)} />
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}