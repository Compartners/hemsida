import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { CartItem } from "./types";
import { formatPrice } from "./utils";

type CartSummaryProps = {
  cart: CartItem[];
  isLoggedIn: boolean;
  onClearCart?: () => void;
  onOpenCheckout?: () => void;
};

export function CartSummary({
  cart,
  isLoggedIn,
  onClearCart,
  onOpenCheckout,
}: CartSummaryProps) {
  const total = cart.reduce(
    (sum, item) =>
      sum + item.product.price * item.qty,
    0
  );

  const totalItems = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  return (
    <div className="rounded-[22px] border border-[#E3E9EF] bg-white p-5 shadow-[0_12px_40px_rgba(19,31,49,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EEF2F5] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-[12px] bg-[#0B72FE]/10 text-[#0B72FE]">
            <ShoppingCart size={16} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#171C25]">
              Varukorg
            </h2>

            <span className="text-[10px] text-[#8A96A3]">
              {totalItems} artiklar
            </span>
          </div>
        </div>

        {cart.length > 0 && onClearCart && (
          <button
            type="button"
            onClick={onClearCart}
            title="Töm varukorg"
            className="inline-flex items-center gap-1 text-[10px] font-medium text-[#8A96A3] transition hover:text-red-500"
          >
            <Trash2 size={12} />
            Töm
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="py-9 text-center">
          <p className="text-sm text-[#8A96A3]">
            Din varukorg är tom.
          </p>
        </div>
      ) : (
        <>
          <div className="max-h-[250px] space-y-3 overflow-y-auto py-4 pr-1">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-[#0B72FE]">
                    {item.qty}×
                  </span>

                  <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-[#4E5968]">
                    {item.product.name}
                  </p>
                </div>

                <span className="shrink-0 text-xs font-semibold text-[#171C25]">
                  {formatPrice(
                    item.product.price * item.qty
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#EEF2F5] pt-4">
            <div className="flex items-end justify-between">
              <span className="text-xs text-[#667181]">
                Totalt exkl. moms
              </span>

              <span className="text-lg font-semibold tracking-[-0.03em] text-[#171C25]">
                {formatPrice(total)}
              </span>
            </div>

            <p className="mt-1 text-right text-[10px] text-[#9BA6B0]">
              Moms tillkommer
            </p>
          </div>
        </>
      )}

      <button
        type="button"
        disabled={
          cart.length === 0 ||
          !isLoggedIn
        }
        onClick={onOpenCheckout}
        className="
          group mt-5 flex min-h-[44px] w-full
          items-center justify-center gap-2
          rounded-full
          bg-gradient-to-r from-[#0B72FE] via-[#12B4F0] to-[#2CCEC2]
          px-4 text-xs font-semibold text-white
          transition-all
          hover:-translate-y-0.5
          disabled:cursor-not-allowed
          disabled:bg-none
          disabled:bg-[#E4E9ED]
          disabled:text-[#8A96A3]
        "
      >
        {!isLoggedIn
          ? "Logga in för att beställa"
          : "Till kassan"}

        <ArrowRight
          size={14}
          className="transition-transform group-hover:translate-x-1"
        />
      </button>

      <p className="mt-4 text-center text-[10px] leading-5 text-[#8A96A3]">
        Behöver ni en anpassad lösning?{" "}
        <Link
          to="/#kontakt"
          className="font-semibold text-[#171C25] hover:underline"
        >
          Prata med oss
        </Link>
      </p>
    </div>
  );
}