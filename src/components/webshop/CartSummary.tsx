import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const total = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <h2 className="flex items-center gap-2 font-semibold text-foreground">
          <ShoppingCart className="h-4 w-4 text-primary" aria-hidden="true" />
          Varukorg
          {cart.length > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {cart.reduce((a, b) => a + b.qty, 0)}
            </span>
          )}
        </h2>

        {cart.length > 0 && onClearCart && (
          <button
            type="button"
            onClick={onClearCart}
            className="flex items-center gap-1 text-xs text-muted-foreground transition hover:text-destructive"
            title="Töm varukorg"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Töm
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="py-6 text-center text-sm text-muted-foreground">
          Din varukorg är tom.
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="max-h-60 space-y-2.5 overflow-y-auto pr-1 text-sm">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-start justify-between gap-2 text-xs"
              >
                <span className="line-clamp-2 text-foreground">
                  <span className="font-semibold text-foreground">{item.qty}×</span>{" "}
                  {item.product.name}
                </span>
                <span className="shrink-0 font-medium text-foreground">
                  {formatPrice(item.product.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-border/60 pt-3">
            <div className="flex justify-between text-sm font-semibold text-foreground">
              <span>Totalt exkl. moms</span>
              <span className="text-base text-primary">{formatPrice(total)}</span>
            </div>
            <p className="mt-0.5 text-right text-[11px] text-muted-foreground">
              Moms tillkommer i kassan
            </p>
          </div>
        </div>
      )}

      <Button
        className="mt-5 w-full gap-2 shadow-sm"
        disabled={cart.length === 0 || !isLoggedIn}
        onClick={onOpenCheckout}
      >
        {!isLoggedIn ? "Logga in för att beställa" : "Till kassan"}
        <ArrowRight className="h-4 w-4" />
      </Button>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Vill ni ha egna priser per kostnadsställe?{" "}
        <Link to="/kontakt" className="font-medium text-primary hover:underline">
          Hör av er
        </Link>
      </p>
    </div>
  );
}