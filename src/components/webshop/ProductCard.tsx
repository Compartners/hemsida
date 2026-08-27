import { Check, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "./types";
import { formatPrice } from "./utils";

type ProductCardProps = {
  product: Product;
  onAdd: (product: Product) => void;
};

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      
      {/* Bildcontainer med tonad bakgrund och mix-blend för vita bilder */}
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-zinc-50/80 p-5 dark:bg-zinc-900/40">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105 dark:mix-blend-normal"
          />
        ) : (
          <span className="font-display text-2xl font-bold tracking-tight text-muted-foreground/30">
            {product.brand || "ComPartners"}
          </span>
        )}

        {/* Lagerstatus-badge i bildens hörn */}
        <div className="absolute top-2.5 right-2.5">
          {product.stock ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <Check className="h-3 w-3" />
              I lager
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-600 dark:text-rose-400">
              <X className="h-3 w-3" />
              Slut
            </span>
          )}
        </div>
      </div>

      {/* Kortinnehåll */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {product.brand}
        </p>

        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-foreground" title={product.name}>
          {product.name}
        </h3>

        {/* Egenskaper / Kulpunkter */}
        <ul className="mt-3 flex-1 space-y-1 text-xs text-muted-foreground">
          {product.bullets && product.bullets.length > 0 ? (
            product.bullets.slice(0, 2).map((bullet, idx) => (
              <li key={idx} className="line-clamp-1 flex items-center gap-1.5">
                <span className="h-1 w-1 shrink-0 rounded-full bg-primary/80" aria-hidden="true" />
                {bullet}
              </li>
            ))
          ) : (
            <li className="text-[11px] text-muted-foreground/70">Originalprodukt</li>
          )}
        </ul>

        {/* Pris & Köpknapp */}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/50 pt-3">
          <div>
            <p className="font-display text-base font-bold text-foreground sm:text-lg">
              {formatPrice(product.price)}
            </p>
            <p className="text-[10px] text-muted-foreground">exkl. moms</p>
          </div>

          <Button
            size="sm"
            disabled={!product.stock}
            onClick={() => onAdd(product)}
            className="h-8 gap-1 px-3 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            {product.stock ? "Köp" : "Slut"}
          </Button>
        </div>
      </div>

    </article>
  );
}