import { useState, useMemo, FormEvent } from "react";
import { X, Sparkles, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CartItem, Product } from "./types";
import { formatPrice } from "./utils";
import { ApiCompany, createOrder } from "@/lib/api";

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  allProducts: Product[];
  account: ApiCompany | null;
  onAddToCart: (product: Product) => void;
  onOrderSuccess: () => void;
};

export function CheckoutModal({
  isOpen,
  onClose,
  cart,
  allProducts,
  account,
  onAddToCart,
  onOrderSuccess,
}: CheckoutModalProps) {
  const [orderedBy, setOrderedBy] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Beräkna varukorgspriser
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.qty, 0),
    [cart]
  );
  const totalWithVat = subtotal * 1.25;

  // Hitta relevanta tillbehör för mersälj (laddare, skydd etc.)
  const upsellProducts = useMemo(() => {
    const cartProductIds = new Set(cart.map((item) => item.product.id));
    const hasPhoneInCart = cart.some(
      (item) => item.product.productType === "phone" || item.product.category === "Telefoner"
    );

    return allProducts
      .filter((product) => {
        if (cartProductIds.has(product.id) || !product.stock) return false;
        
        const isAccessory =
          product.productType === "accessory" || product.category === "Tillbehör";

        if (hasPhoneInCart) {
          const name = product.name.toLowerCase();
          const isEssential =
            name.includes("laddare") ||
            name.includes("adapter") ||
            name.includes("20w") ||
            name.includes("25w") ||
            name.includes("skal") ||
            name.includes("glas") ||
            name.includes("kabel");
          return isAccessory && isEssential;
        }

        return isAccessory;
      })
      .slice(0, 3);
  }, [cart, allProducts]);

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!orderedBy.trim()) {
      toast.error("Vänligen ange vem som beställer.");
      return;
    }

    if (cart.length === 0) {
      toast.error("Varukorgen är tom.");
      return;
    }

    setSubmitting(true);
    try {
      // Skicka genom säkra apiFetch via createOrder
      await createOrder({
        ordered_by: orderedBy.trim(),
        organization_number: account?.organization_number || "",
        comment: comment.trim(),
        items: cart.map((item) => ({
          product_id: item.product.id,
          product: item.product.id, // Skickar med båda formaten för att passa serializer
          quantity: item.qty,
          unit_price: item.product.price,
        })),
      });

      toast.success("Tack för din beställning! Ordern har registrerats.");
      onOrderSuccess();
      onClose();
    } catch (err) {
      console.error("Order error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Kunde inte slutföra beställningen. Kontrollera att du är inloggad."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground sm:text-lg">Kassa & Beställning</h2>
              <p className="text-xs text-muted-foreground">{account?.name} ({account?.company_code})</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Innehåll */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          
          {/* 1. Översikt över valda artiklar */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Valda artiklar i ordern
            </h3>
            <div className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-muted/20 px-4 py-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary">{item.qty}×</span>
                    <span className="font-medium text-foreground line-clamp-1">{item.product.name}</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-foreground shrink-0">
                    {formatPrice(item.product.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Mersälj */}
          {upsellProducts.length > 0 && (
            <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <h4 className="text-sm font-semibold text-foreground">
                  Glöm inte tillbehören! Snabbladdare & skydd
                </h4>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {upsellProducts.map((accessory) => (
                  <div
                    key={accessory.id}
                    className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-3 shadow-sm transition hover:border-primary/40"
                  >
                    <div>
                      <div className="aspect-video w-full rounded-lg bg-zinc-50 dark:bg-zinc-900/40 p-2 mb-2 flex items-center justify-center">
                        {accessory.image ? (
                          <img
                            src={accessory.image}
                            alt={accessory.name}
                            className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                          />
                        ) : (
                          <span className="text-[10px] text-muted-foreground">Original</span>
                        )}
                      </div>
                      <p className="line-clamp-2 text-xs font-medium text-foreground leading-snug" title={accessory.name}>
                        {accessory.name}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/40">
                      <span className="text-xs font-bold text-foreground">
                        {formatPrice(accessory.price)}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          onAddToCart(accessory);
                          toast.success(`${accessory.name} lades till!`);
                        }}
                        className="h-7 px-2 text-[11px] gap-1 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <Plus className="h-3 w-3" />
                        Lägg till
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Formulär */}
          <form id="order-form" onSubmit={handleSubmitOrder} className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Beställningsuppgifter
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Beställare / Referensnamn *
                </label>
                <Input
                  required
                  placeholder="t.ex. Johan Andersson"
                  value={orderedBy}
                  onChange={(e) => setOrderedBy(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Organisationsnummer
                </label>
                <Input
                  disabled
                  value={account?.organization_number || "Ej angivet"}
                  className="h-9 text-sm bg-muted text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Kostnadsställe / Märkning / Kommentar (valfritt)
              </label>
              <Textarea
                placeholder="t.ex. Kostnadsställe IT, levereras till våning 3..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="text-sm resize-none"
                rows={2}
              />
            </div>
          </form>

        </div>

        {/* Footer */}
        <div className="border-t border-border/80 bg-card/60 p-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-muted-foreground">Totalt exkl. moms:</span>
                <span className="text-lg font-bold text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Inkl. 25% moms: {formatPrice(totalWithVat)}
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
                Fortsätt handla
              </Button>
              <Button
                form="order-form"
                type="submit"
                disabled={submitting || cart.length === 0}
                className="gap-1.5 shadow-md"
              >
                {submitting ? "Skickar order..." : "Bekräfta beställning"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}