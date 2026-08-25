import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CartItem } from "./types";
import { formatPrice } from "./utils";

type CartSummaryProps = {
  cart: CartItem[];
  isLoggedIn: boolean;
};

export function CartSummary({ cart, isLoggedIn }: CartSummaryProps) {
  const total = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
        <ShoppingCart className="h-4 w-4 text-primary" aria-hidden="true" />
        Varukorg
      </h2>

      {cart.length === 0 ? (
        <p className="mt-4 text-sm text-foreground">
          Din varukorg är tom. Lägg till produkter för att se totalen.
        </p>
      ) : (
        <div className="mt-4 space-y-3 text-sm">
          {cart.map((item) => (
            <div key={item.product.id} className="flex justify-between gap-3">
              <span className="text-foreground">
                {item.qty} × {item.product.name}
              </span>
              <span className="whitespace-nowrap font-medium">
                {formatPrice(item.product.price * item.qty)}
              </span>
            </div>
          ))}

          <div className="flex justify-between border-t border-border pt-3 font-semibold text-foreground">
            <span>Totalt exkl. moms</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      )}

      <Button
        className="mt-5 w-full"
        disabled={cart.length === 0 || !isLoggedIn}
        onClick={() => toast.info("Kassan kopplas till order-API:t i nästa steg.")}
      >
        {!isLoggedIn ? "Logga in för att beställa" : "Till kassan"}
      </Button>

      <p className="mt-4 text-xs text-foreground">
        Vill ni ha egna företagspriser och inloggning per kostnadsställe?{" "}
        <Link to="/kontakt" className="font-medium text-primary">
          Hör av er
        </Link>
        .
      </p>
    </div>
  );
}