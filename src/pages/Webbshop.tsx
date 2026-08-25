import { Link } from "react-router-dom";
import { Check, LogIn, PackageCheck, ShoppingCart, Truck, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ============================================================
   📦 PRODUKTDATA (dummy) — flytta gärna till en egen fil senare,
   t.ex. src/lib/products.ts, och byt bara ut denna import.
   ============================================================ */
export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  listPrice?: number;
  image?: string;
  badge?: string;
  bullets: string[];
  stock: boolean;
  businessOnly?: boolean;
};

export function formatPrice(value: number) {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(value);
}

export const categories = ["Alla", "Mobiler", "Surfplattor", "Tillbehör"];

export const products: Product[] = [
  {
    id: "iphone-15",
    name: "iPhone 15",
    brand: "Apple",
    category: "Mobiler",
    price: 9990,
    listPrice: 10990,
    badge: "Populär",
    bullets: ["128 GB", "5G", "2 års garanti"],
    stock: true,
  },
  {
    id: "galaxy-s24",
    name: "Galaxy S24",
    brand: "Samsung",
    category: "Mobiler",
    price: 8990,
    bullets: ["256 GB", "5G", "AI-kamera"],
    stock: true,
  },
  {
    id: "ipad-air",
    name: "iPad Air",
    brand: "Apple",
    category: "Surfplattor",
    price: 7990,
    bullets: ["64 GB", "Wi-Fi", "M-chip"],
    stock: true,
  },
  {
    id: "airpods-pro",
    name: "AirPods Pro",
    brand: "Apple",
    category: "Tillbehör",
    price: 2490,
    bullets: ["Aktiv brusreducering", "USB-C"],
    stock: false,
  },
];

export const businessOnlyProducts: Product[] = [
  {
    id: "iphone-15-fleet",
    name: "iPhone 15 – flottavtal",
    brand: "Apple",
    category: "Mobiler",
    price: 8490,
    bullets: ["128 GB", "Förkonfigurerad MDM", "Endast företagskund"],
    stock: true,
    businessOnly: true,
  },
];

export const businessAccounts: Record<
  string,
  { company: string; discountLabel: string }
> = {
  CP1001: { company: "Nordisk Plåt AB", discountLabel: "Avtal Silver" },
  CP2045: { company: "Byggpartner Sverige AB", discountLabel: "Avtal Guld" },
  CP3300: { company: "Konsult & Co", discountLabel: "Avtal Platinum" },
};

export const businessPrices: Record<string, Record<string, number>> = {
  CP1001: { "iphone-15": 8990, "galaxy-s24": 7990 },
  CP2045: { "iphone-15": 8490, "ipad-air": 6990 },
  CP3300: { "iphone-15": 7990, "galaxy-s24": 6990, "ipad-air": 6490 },
};
/* ============================================================
   Slut på dummy-data
   ============================================================ */

function ProductCard({
  product,
  price,
  onAdd,
}: {
  product: Product;
  price: number;
  onAdd: (p: Product) => void;
}) {
  const hasBusinessPrice = price < product.price;
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow hover:shadow-lifted">
      <div className="relative flex h-44 items-center justify-center bg-muted/60 p-4">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-auto object-contain"
          />
        ) : (
          <span className="font-display text-4xl font-semibold text-muted-foreground/40">
            {product.brand}
          </span>
        )}
        {product.badge ? <Badge className="absolute left-3 top-3">{product.badge}</Badge> : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.brand}</p>
        <h3 className="mt-1 font-semibold leading-snug">{product.name}</h3>
        <ul className="mt-3 flex-1 space-y-1 text-sm text-muted-foreground">
          {product.bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="font-display text-lg font-semibold">{formatPrice(price)}</p>
            {hasBusinessPrice ? (
              <p className="text-xs text-muted-foreground">
                <span className="line-through">{formatPrice(product.price)}</span>{" "}
                <span className="font-medium text-primary">ditt avtalspris</span>
              </p>
            ) : product.listPrice ? (
              <p className="text-xs text-muted-foreground line-through">
                {formatPrice(product.listPrice)}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">exkl. moms</p>
            )}
          </div>
          <Button size="sm" disabled={!product.stock} onClick={() => onAdd(product)}>
            {product.stock ? "Lägg i varukorg" : "Bevaka"}
          </Button>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          {product.stock ? (
            <>
              <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> I lager – skickas
              samma dag
            </>
          ) : (
            <>
              <X className="h-3.5 w-3.5" aria-hidden="true" /> Tillfälligt slut
            </>
          )}
        </p>
      </div>
    </article>
  );
}

export default function Webbshop() {
  const [category, setCategory] = useState<string>("Alla");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [account, setAccount] = useState<{
    id: string;
    company: string;
    discountLabel: string;
  } | null>(null);

  const priceFor = (product: Product) =>
    (account ? businessPrices[account.id]?.[product.id] : undefined) ?? product.price;

  const catalog = useMemo(
    () => (account ? [...businessOnlyProducts, ...products] : products),
    [account],
  );

  const filtered = useMemo(
    () =>
      catalog.filter(
        (p) =>
          (category === "Alla" || p.category === category) &&
          (p.name + p.brand).toLowerCase().includes(query.toLowerCase()),
      ),
    [catalog, category, query],
  );

  const total = cart.reduce((sum, item) => sum + priceFor(item.product) * item.qty, 0);

  const login = () => {
    const id = customerId.trim().toUpperCase();
    const found = businessAccounts[id];
    if (!found) {
      toast.error("Okänt kund-ID. Prova demo-ID: CP1001, CP2045 eller CP3300.");
      return;
    }
    setAccount({ id, ...found });
    toast.success(`Inloggad som ${found.company}`);
  };

  const logout = () => {
    setAccount(null);
    setCustomerId("");
    setCart((prev) => prev.filter((i) => !i.product.businessOnly));
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      return existing
        ? prev.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { product, qty: 1 }];
    });
    toast.success(`${product.name} lades i varukorgen`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        {/* Mörk ytsektion — mappad mot era befintliga tokens */}
        <section className="bg-blue-950 text-background pt-20">
          <div className="mx-auto max-w-6xl px-4 py-16 pt-24">
            <h1 className="max-w-2xl text-4xl font-semibold sm:text-5xl text-white">
              Webbshop för företag – hårdvara till avtalspris
            </h1>
            <p className="mt-4 max-w-xl text-background/75 text-white">
              Skiss på hur en framtida shop kan se ut. Sortimentet hämtas från Telefonshoppens
              produktfeed, men priser, lager och fakturering styrs av ert avtal hos ComPartners.
            </p>
            <div className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
              {[
                { icon: Truck, text: "Expressfrakt – skickas samma dag" },
                { icon: PackageCheck, text: "Konfigurerade enheter direkt till användaren" },
                { icon: ShoppingCart, text: "Samlad månadsfaktura per kostnadsställe" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3  text-white rounded-xl border border-background/10 bg-background/5 px-4 py-3 text-background/80"
                >
                  <item.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <Button
                      key={c}
                      size="sm"
                      variant={category === c ? "default" : "outline"}
                      onClick={() => setCategory(c)}
                    >
                      {c}
                    </Button>
                  ))}
                </div>
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Sök produkt…"
                  className="w-full sm:w-56"
                  aria-label="Sök produkt"
                />
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} price={priceFor(p)} onAdd={addToCart} />
                ))}
              </div>

              {filtered.length === 0 ? (
                <p className="mt-10 text-center text-muted-foreground">
                  Inga produkter matchar din sökning.
                </p>
              ) : null}
            </div>

            <aside className="h-fit space-y-4 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                {account ? (
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      <LogIn className="h-4 w-4 text-primary" aria-hidden="true" />
                      {account.company}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Kund-ID {account.id} · {account.discountLabel}
                    </p>
                    <Button variant="outline" size="sm" className="w-full" onClick={logout}>
                      Logga ut
                    </Button>
                  </div>
                ) : (
                  <form
                    className="space-y-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      login();
                    }}
                  >
                    <label htmlFor="customer-id" className="block text-sm font-medium">
                      Är du företagskund? Logga in med ditt kund-ID
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="customer-id"
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        placeholder="t.ex. CP1001"
                        autoComplete="off"
                      />
                      <Button type="submit" size="sm">
                        Logga in
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Demo-ID: CP1001, CP2045, CP3300 – visar era avtalspriser och avtalsmodeller.
                    </p>
                  </form>
                )}
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                  <ShoppingCart className="h-4 w-4 text-primary" aria-hidden="true" />
                  Varukorg
                </h2>

                {cart.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Din varukorg är tom. Lägg till produkter för att se totalen.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3 text-sm">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between gap-3">
                        <span className="text-muted-foreground">
                          {item.qty} × {item.product.name}
                        </span>
                        <span className="whitespace-nowrap font-medium">
                          {formatPrice(priceFor(item.product) * item.qty)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between border-t border-border pt-3 font-semibold">
                      <span>Totalt exkl. moms</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                )}

                <Button
                  className="mt-5 w-full"
                  disabled={cart.length === 0}
                  onClick={() => toast.info("Kassan är inte aktiverad i den här skissen.")}
                >
                  Till kassan
                </Button>
                <p className="mt-4 text-xs text-muted-foreground">
                  Vill ni ha egna företagspriser och inloggning per kostnadsställe?{" "}
                  <Link to="/kontakt" className="font-medium text-primary">
                    Hör av er
                  </Link>
                  .
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}