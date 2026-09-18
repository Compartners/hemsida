import { Check, Plus, X } from "lucide-react";
import { Product } from "./types";
import { formatPrice } from "./utils";

type ProductCardProps = {
  product: Product;
  onAdd: (product: Product) => void;
};

export function ProductCard({
  product,
  onAdd,
}: ProductCardProps) {
  return (
    <article
      className="
        group flex h-full flex-col overflow-hidden
        rounded-[22px] border border-[#E3E9EF]
        bg-white
        transition-all duration-300
        hover:-translate-y-1
        hover:border-[#D4DEE6]
        hover:shadow-[0_22px_55px_rgba(19,31,49,0.08)]
      "
    >
      {/* Image */}
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[#F8FAFB] p-6">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="
              h-full w-full object-contain mix-blend-multiply
              transition-transform duration-500
              group-hover:scale-[1.04]
            "
          />
        ) : (
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#A0ABB5]">
            {product.brand || "Compartners"}
          </span>
        )}

        {/* Stock */}
        <div className="absolute right-3 top-3">
          {product.stock ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2CCEC2]/20 bg-white/90 px-2.5 py-1 text-[10px] font-medium text-[#168E85] backdrop-blur">
              <Check size={11} strokeWidth={2} />
              I lager
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white/90 px-2.5 py-1 text-[10px] font-medium text-red-500 backdrop-blur">
              <X size={11} strokeWidth={2} />
              Slut
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-[#8A96A3]">
          {product.brand}
        </p>

        <h3
          title={product.name}
          className="mt-2 line-clamp-2 text-[15px] font-semibold leading-[1.4] tracking-[-0.02em] text-[#171C25]"
        >
          {product.name}
        </h3>

        <ul className="mt-4 flex-1 space-y-2">
          {product.bullets?.length ? (
            product.bullets.slice(0, 2).map((bullet, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-[11px] text-[#7D8794]"
              >
                <span className="h-1 w-1 shrink-0 rounded-full bg-[#12B4F0]" />
                <span className="line-clamp-1">
                  {bullet}
                </span>
              </li>
            ))
          ) : (
            <li className="text-[11px] text-[#A0ABB5]">
              Originalprodukt
            </li>
          )}
        </ul>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#EEF2F5] pt-4">
          <div>
            <p className="text-lg font-semibold tracking-[-0.035em] text-[#171C25]">
              {formatPrice(product.price)}
            </p>

            <p className="mt-0.5 text-[10px] text-[#8A96A3]">
              exkl. moms
            </p>
          </div>

          <button
            type="button"
            disabled={!product.stock}
            onClick={() => onAdd(product)}
            className="
              inline-flex min-h-[38px] items-center justify-center gap-1.5
              rounded-full
              bg-[#171C25]
              px-4
              text-xs font-semibold text-white
              transition-all duration-300
              hover:bg-[#2D3444]
              disabled:cursor-not-allowed
              disabled:bg-[#E4E9ED]
              disabled:text-[#9BA6B0]
            "
          >
            <Plus size={14} />

            {product.stock ? "Lägg till" : "Slut"}
          </button>
        </div>
      </div>
    </article>
  );
}