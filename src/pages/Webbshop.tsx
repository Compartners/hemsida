// Webbshop.tsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import { ShoppingBag, XCircle, Sparkles, ShieldCheck, Flame } from "lucide-react";
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
import { CheckoutModal } from "../components/webshop/CheckoutModal";
import { OrderHistoryModal } from "../components/webshop/OrderHistoryModal";

/**
 * Beräknar prioritet för att hitta månadens toppsäljare
 */
function getProductPriority(product: Product): number {
  const name = product.name.toLowerCase();
  let score = 0;

  // 1. Topprankade iPhone-modeller
  if (name.includes("iphone 17 pro")) score += 1000;
  else if (name.includes("iphone 17")) score += 950;
  else if (name.includes("iphone 16 pro")) score += 900;
  else if (name.includes("iphone 16")) score += 850;
  else if (name.includes("iphone 15 pro")) score += 800;
  else if (name.includes("iphone 15")) score += 750;

  // 2. Topprankade Samsung Galaxy-modeller
  if (name.includes("galaxy s25 ultra")) score += 980;
  else if (name.includes("galaxy s25")) score += 920;
  else if (name.includes("galaxy s24 ultra")) score += 880;
  else if (name.includes("galaxy s24")) score += 840;
  else if (name.includes("galaxy a56")) score += 720;
  else if (name.includes("galaxy a36")) score += 700;

  // 3. Populära laddare & tillbehör
  if (name.includes("20w") || name.includes("25w") || name.includes("45w")) score += 500;
  if (name.includes("magsafe")) score += 400;

  // Prioritera telefoner framför tillbehör
  if (product.productType === "phone" || product.category === "Telefoner" || product.category === "Mobiler") {
    score += 300;
  }

  // Produkter i lager rankas alltid högst
  if (product.stock) {
    score += 2000;
  }

  return score;
}

export default function Webbshop() {
  const [category, setCategory] = useState("Alla");
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [account, setAccount] = useState<ApiCompany | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

  // Hämta produktkatalogen
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const data = await getProducts();
      setProducts(data.map(mapProduct));
    } catch (error) {
      console.error("Kunde inte hämta produkter:", error);
      toast.error("Kunde inte hämta produkter.");
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // Initiera kundsession och katalog
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

  // 1. Mest sålda flaggskeppstelefoner (Top 4 i lager)
  const topSellingPhones = useMemo(() => {
    return products
      .filter(
        (p) =>
          (p.productType === "phone" || p.category === "Telefoner" || p.category === "Mobiler") &&
          p.stock
      )
      .sort((a, b) => getProductPriority(b) - getProductPriority(a))
      .slice(0, 4);
  }, [products]);

  const topPhoneIds = useMemo(
    () => new Set(topSellingPhones.map((p) => p.id)),
    [topSellingPhones]
  );

  // 2. Standardkatalog (Filtrerad och exkluderar toppsäljarna om man är på "Alla" utan sökning)
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const isSearching = normalizedQuery.length > 0;

    return products
      .filter((product) => {
        // Om kunden inte söker: dölj slutsålda artiklar
        if (!isSearching && !product.stock) {
          return false;
        }

        // På "Alla"-fliken utan sökning: slipp dubbletter från highlight-sektionen
        if (!isSearching && category === "Alla" && topPhoneIds.has(product.id)) {
          return false;
        }

        const matchCategory = category === "Alla" || product.category === category;
        const matchQuery =
          !isSearching ||
          `${product.name} ${product.brand}`.toLowerCase().includes(normalizedQuery);

        return matchCategory && matchQuery;
      })
      .sort((a, b) => getProductPriority(b) - getProductPriority(a));
  }, [products, category, query, topPhoneIds]);

  const totalCartItems = useMemo(
    () => cart.reduce((total, item) => total + item.qty, 0),
    [cart]
  );

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

  const clearCart = () => {
    if (cart.length === 0) return;
    setCart([]);
    toast.info("Varukorgen har tömts.");
  };

  const resetFilters = () => {
    setCategory("Alla");
    setQuery("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 selection:text-primary">
      <Navbar />

      <main className="pb-24 lg:pb-16">
        <ShopHero />

        <section className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            
            {/* ============================================================
                HUVUDSEKTION (9 kolumner på desktop)
            ============================================================ */}
            <div className="space-y-8 lg:col-span-9">
              
              {/* Filterfält och sökruta */}
              <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
                <ProductFilters
                  category={category}
                  onSelectCategory={setCategory}
                  query={query}
                  onQueryChange={setQuery}
                />
              </div>

              {/* ============================================================
                  MEST SÅLDA PRODUKTER SENASTE MÅNADEN (TOPP-TELEFONER)
                  Visas på startsidan när ingen sökning görs
              ============================================================ */}
              {!query && category === "Alla" && topSellingPhones.length > 0 && (
                <div className="rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/5 via-card to-card p-5 sm:p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Flame className="h-4 w-4" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-foreground sm:text-lg">
                          Mest sålda telefoner senaste månaden
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          De populäraste företagsmodellerna just nu
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setCategory("Telefoner")}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Visa alla telefoner &rarr;
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    {topSellingPhones.map((phone) => (
                      <ProductCard
                        key={`featured-${phone.id}`}
                        product={phone}
                        onAdd={addToCart}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Statusrad och resultaträknare */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>
                    Visar{" "}
                    <strong className="font-semibold text-foreground">
                      {filteredProducts.length}
                    </strong>{" "}
                    produkter {query ? `för "${query}"` : "(övrigt sortiment)"}
                  </span>
                  {(query || category !== "Alla") && (
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs text-primary hover:bg-primary/10 transition-colors"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Återställ
                    </button>
                  )}
                </div>

                {account?.has_phone_policy && (
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Företagspolicy aktiv
                  </div>
                )}
              </div>

              {/* Standard Produktgrid: 4 artiklar per rad */}
              {loadingProducts ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
                    >
                      <div className="aspect-square w-full animate-pulse rounded-xl bg-muted" />
                      <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-muted" />
                      <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-muted" />
                      <div className="mt-6 flex items-center justify-between pt-2">
                        <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                        <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAdd={addToCart}
                    />
                  ))}
                </div>
              ) : (
                /* Tom sökning / Inga matchningar */
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-16 px-4 text-center">
                  <div className="rounded-full bg-muted p-3 text-muted-foreground">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    Inga produkter hittades
                  </h3>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    {query
                      ? `Inga produkter i eller utanför lager matchade "${query}". Prova ett annat sökord.`
                      : "Det finns inga tillgängliga produkter i lager i denna kategori just nu."}
                  </p>
                  {(query || category !== "Alla") && (
                    <button
                      onClick={resetFilters}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
                    >
                      Visa alla produkter i lager
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ============================================================
                SIDOPANEL: KONTO & VARUKORG (3 kolumner på desktop, Sticky)
            ============================================================ */}
            <aside
              id="cart-sidebar"
              className="space-y-6 lg:col-span-3 lg:sticky lg:top-24"
            >
              <AccountCard
                account={account}
                loading={loadingAccount}
                onLogin={handleLogin}
                onLogout={handleLogout}
                onOpenOrderHistory={() => setIsOrderHistoryOpen(true)}
              />
              <CartSummary
                cart={cart}
                isLoggedIn={Boolean(account)}
                onClearCart={clearCart}
                onOpenCheckout={() => setIsCheckoutOpen(true)}
              />
            </aside>

          </div>
        </section>

        {/* Flytande snabbknapp till varukorgen på mobil */}
        {totalCartItems > 0 && (
          <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
            <button
              onClick={() => {
                if (account) {
                  setIsCheckoutOpen(true);
                } else {
                  toast.error("Logga in med ert kund-ID för att beställa.");
                }
              }}
              className="w-full flex items-center justify-between rounded-2xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-xl transition active:scale-[0.98]"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5" />
                <span>Varukorg ({totalCartItems} st)</span>
              </div>
              <span>Till kassan &rarr;</span>
            </button>
          </div>
        )}

        {/* Kassa Modal Popup med inbyggt mersälj */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cart={cart}
          allProducts={products}
          account={account}
          onAddToCart={addToCart}
          onOrderSuccess={() => {
            setCart([]);
            setIsCheckoutOpen(false);
          }}
        />

        {/* Orderhistorik Modal Popup */}
        <OrderHistoryModal
          isOpen={isOrderHistoryOpen}
          onClose={() => setIsOrderHistoryOpen(false)}
        />
      </main>

      <Footer />
    </div>
  );
}