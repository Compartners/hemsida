// Webbshop.tsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import { ShoppingBag, XCircle, Sparkles, ShieldCheck, Flame } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
  <div className="min-h-screen bg-[#F4F7FA] text-[#171C25]">
    <Navbar />

    <main>
      {/* =====================================================
          SHOP HERO
      ===================================================== */}
      <ShopHero />

      {/* =====================================================
          SHOP CONTENT
      ===================================================== */}
      <section className="py-10 md:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8">

          {/* Top intro */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-[#7D8794]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0B72FE]" />

                Företagswebbshop
              </div>

              <h1 className="text-[32px] font-semibold leading-[1] tracking-[-0.045em] text-[#171C25] md:text-[40px]">
                Utrustning för arbetsdagen.
              </h1>

              <p className="mt-3 max-w-[620px] text-sm leading-6 text-[#667181]">
                Mobiler, tillbehör och företagsanpassade produkter —
                samlat på ett ställe.
              </p>
            </div>

            {account && (
              <div className="flex items-center gap-2 rounded-full border border-[#DDE6EC] bg-white px-4 py-2 text-xs text-[#667181]">
                <span className="h-2 w-2 rounded-full bg-[#2CCEC2]" />

                Inloggad som

                <strong className="font-semibold text-[#171C25]">
                  {account.name}
                </strong>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">

            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}
            <div className="space-y-7 lg:col-span-9">

              {/* Filters */}
              <div
                className="
                  rounded-[24px]
                  border border-[#E3E9EF]
                  bg-white
                  p-4
                  shadow-[0_12px_40px_rgba(19,31,49,0.04)]
                  sm:p-5
                "
              >
                <ProductFilters
                  category={category}
                  onSelectCategory={setCategory}
                  query={query}
                  onQueryChange={setQuery}
                />
              </div>

              {/* =====================================================
                  FEATURED PRODUCTS
              ===================================================== */}
              {!query &&
                category === "Alla" &&
                topSellingPhones.length > 0 && (
                  <section
                    className="
                      relative
                      overflow-hidden
                      rounded-[28px]
                      border border-[#DDE6EC]
                      bg-white
                      p-5
                      shadow-[0_16px_50px_rgba(19,31,49,0.05)]
                      sm:p-6
                    "
                  >
                    {/* subtle brand glow */}
                    <div className="pointer-events-none absolute right-[-130px] top-[-150px] h-[330px] w-[330px] rounded-full bg-[#12B4F0]/10 blur-[100px]" />

                    <div className="relative mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-[13px] bg-gradient-to-br from-[#0B72FE]/10 to-[#2CCEC2]/15">
                          <Flame
                            size={18}
                            strokeWidth={1.8}
                            className="text-[#0B72FE]"
                          />
                        </div>

                        <div>
                          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#8A96A3]">
                            Populärt just nu
                          </div>

                          <h2 className="mt-1 text-lg font-semibold tracking-[-0.025em] text-[#171C25]">
                            Mest sålda telefoner
                          </h2>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setCategory("Telefoner")}
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-[#171C25]"
                      >
                        Visa alla telefoner

                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </button>
                    </div>

                    <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                      {topSellingPhones.map((phone) => (
                        <ProductCard
                          key={`featured-${phone.id}`}
                          product={phone}
                          onAdd={addToCart}
                        />
                      ))}
                    </div>
                  </section>
                )}

              {/* =====================================================
                  RESULT HEADER
              ===================================================== */}
              <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#7D8794]">
                  <span>
                    Visar{" "}
                    <strong className="font-semibold text-[#171C25]">
                      {filteredProducts.length}
                    </strong>{" "}
                    produkter
                    {query && (
                      <>
                        {" "}
                        för{" "}
                        <strong className="font-medium text-[#171C25]">
                          “{query}”
                        </strong>
                      </>
                    )}
                  </span>

                  {(query || category !== "Alla") && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="
                        inline-flex items-center gap-1.5
                        rounded-full
                        border border-[#E3E9EF]
                        bg-white
                        px-3 py-1.5
                        text-xs font-medium
                        text-[#667181]
                        transition
                        hover:border-[#C9D6DF]
                        hover:text-[#171C25]
                      "
                    >
                      <XCircle size={13} />

                      Återställ
                    </button>
                  )}
                </div>

                {account?.has_phone_policy && (
                  <div
                    className="
                      inline-flex w-fit items-center gap-2
                      rounded-full
                      border border-[#2CCEC2]/20
                      bg-[#2CCEC2]/10
                      px-3 py-1.5
                      text-xs font-medium
                      text-[#168E85]
                    "
                  >
                    <ShieldCheck size={14} />

                    Företagspolicy aktiv
                  </div>
                )}
              </div>

              {/* =====================================================
                  PRODUCTS
              ===================================================== */}
              {loadingProducts ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="
                        rounded-[22px]
                        border border-[#E3E9EF]
                        bg-white
                        p-4
                      "
                    >
                      <div className="aspect-square w-full animate-pulse rounded-[16px] bg-[#EEF2F5]" />

                      <div className="mt-5 h-4 w-3/4 animate-pulse rounded-full bg-[#EEF2F5]" />

                      <div className="mt-2 h-3 w-1/2 animate-pulse rounded-full bg-[#EEF2F5]" />

                      <div className="mt-7 flex items-center justify-between">
                        <div className="h-5 w-20 animate-pulse rounded-full bg-[#EEF2F5]" />

                        <div className="h-9 w-9 animate-pulse rounded-[12px] bg-[#EEF2F5]" />
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
                <div
                  className="
                    flex min-h-[360px] flex-col
                    items-center justify-center
                    rounded-[28px]
                    border border-dashed border-[#D5DEE5]
                    bg-white
                    px-5
                    text-center
                  "
                >
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-[#F4F7FA] text-[#7D8794]">
                    <Sparkles
                      size={22}
                      strokeWidth={1.6}
                    />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold tracking-[-0.025em] text-[#171C25]">
                    Inga produkter hittades
                  </h3>

                  <p className="mt-2 max-w-[420px] text-sm leading-6 text-[#7D8794]">
                    {query
                      ? `Vi hittade inga produkter som matchar “${query}”. Prova ett annat sökord.`
                      : "Det finns inga tillgängliga produkter i den här kategorin just nu."}
                  </p>

                  {(query || category !== "Alla") && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="
                        mt-6
                        inline-flex min-h-[44px]
                        items-center justify-center
                        rounded-full
                        bg-[#171C25]
                        px-5
                        text-sm font-semibold
                        text-white
                        transition
                        hover:bg-[#2D3444]
                      "
                    >
                      Visa alla produkter
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* =====================================================
                ACCOUNT + CART
            ===================================================== */}
            <aside
              id="cart-sidebar"
              className="space-y-5 lg:col-span-3 lg:sticky lg:top-6"
            >
              <AccountCard
                account={account}
                loading={loadingAccount}
                onLogin={handleLogin}
                onLogout={handleLogout}
                onOpenOrderHistory={() =>
                  setIsOrderHistoryOpen(true)
                }
              />

              <CartSummary
                cart={cart}
                isLoggedIn={Boolean(account)}
                onClearCart={clearCart}
                onOpenCheckout={() =>
                  setIsCheckoutOpen(true)
                }
              />

              {/* reassurance */}
              <div className="rounded-[20px] border border-[#E3E9EF] bg-white p-5">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck
                    size={17}
                    strokeWidth={1.7}
                    className="text-[#2CCEC2]"
                  />

                  <span className="text-sm font-semibold text-[#171C25]">
                    För företagskunder
                  </span>
                </div>

                <p className="mt-3 text-xs leading-5 text-[#7D8794]">
                  Logga in med ert kund-ID för att se era villkor,
                  företagspolicy och genomföra beställningar.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* =====================================================
          MOBILE CART
      ===================================================== */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
          <button
            type="button"
            onClick={() => {
              if (account) {
                setIsCheckoutOpen(true);
              } else {
                toast.error(
                  "Logga in med ert kund-ID för att beställa."
                );
              }
            }}
            className="
              flex min-h-[56px] w-full
              items-center justify-between
              rounded-full
              bg-[#171C25]
              px-5
              text-sm font-semibold
              text-white
              shadow-[0_20px_60px_rgba(0,0,0,0.25)]
              transition
              active:scale-[0.98]
            "
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag size={18} />

              <span>
                Varukorg ({totalCartItems} st)
              </span>
            </div>

            <span className="text-white/60">
              Till kassan →
            </span>
          </button>
        </div>
      )}

      {/* =====================================================
          MODALS
      ===================================================== */}
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

      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
      />
    </main>

    <Footer />
  </div>
);
}