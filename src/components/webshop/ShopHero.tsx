import { Truck, PackageCheck, ShoppingCart } from "lucide-react";

const HERO_FEATURES = [
  { icon: Truck, text: "Expressfrakt – skickas samma dag" },
  { icon: PackageCheck, text: "Konfigurerade enheter direkt till användaren" },
  { icon: ShoppingCart, text: "Samlad månadsfaktura per kostnadsställe" },
];

export function ShopHero() {
  return (
    <section className="bg-blue-950 text-background pt-20">
      <div className="mx-auto max-w-6xl px-4 py-16 pt-24">
        <h1 className="max-w-2xl text-4xl font-semibold text-white sm:text-5xl">
          Webbshop för företag – hårdvara till avtalspris
        </h1>
        <p className="mt-4 max-w-xl text-white text-background/75">
          Sortimentet hämtas från Telefonshoppens produktfeed. Priser, lager och avtalsregler hanteras av ComPartners.
        </p>

        <div className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
          {HERO_FEATURES.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-3 rounded-xl border border-background/10 bg-background/5 px-4 py-3 text-white text-background/80"
            >
              <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}