import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "./types";
import { formatPrice } from "./utils"

type ProductCardProps = {
  product: Product;
  onAdd: (product: Product) => void;
};

export function ProductCard({ product, onAdd }: ProductCardProps) {
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
          <span className="font-display text-4xl font-semibold text-foreground/40">
            {product.brand}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs uppercase tracking-wider text-foreground">{product.brand}</p>
        <h3 className="mt-1 font-semibold leading-snug text-foreground">{product.name}</h3>

        <ul className="mt-3 flex-1 space-y-1 text-sm text-foreground">
          {product.bullets.length > 0 ? (
            product.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                {bullet}
              </li>
            ))
          ) : (
            <li className="text-xs text-foreground">Produktinformation saknas</li>
          )}
        </ul>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="font-display text-lg font-semibold text-foreground">
              {formatPrice(product.price)}
            </p>
            <p className="text-xs text-foreground">exkl. moms</p>
          </div>

          <Button size="sm" disabled={!product.stock} onClick={() => onAdd(product)}>
            {product.stock ? "Lägg i varukorg" : "Bevaka"}
          </Button>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-foreground">
          {product.stock ? (
            <>
              <Check className="h-3.5 w-3.5 rounded-full bg-green-500 text-primary" aria-hidden="true" />
              I lager
            </>
          ) : (
            <>
              <X className="h-3.5 w-3.5 rounded-full bg-red-500 text-background" aria-hidden="true" />
              Tillfälligt slut
            </>
          )}
        </p>
      </div>
    </article>
  );
}