import { useEffect, useState } from "react";
import { X, Receipt, Package, Calendar, User, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getCompanyOrders, type ApiOrder } from "@/lib/api";
import { formatPrice } from "./utils";

type OrderHistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function OrderHistoryModal({ isOpen, onClose }: OrderHistoryModalProps) {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    async function loadOrders() {
      setLoading(true);
      try {
        const data = await getCompanyOrders();
        setOrders(data);
      } catch (err) {
        console.error("Order history error:", err);
        toast.error("Kunde inte hämta orderhistorik.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleExpand = (id: number) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const calculateOrderTotal = (order: ApiOrder) => {
    if (order.total_amount) return Number(order.total_amount);
    return order.items.reduce(
      (sum, item) => sum + Number(item.unit_price) * item.quantity,
      0
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Receipt className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground sm:text-lg">Orderhistorik</h2>
              <p className="text-xs text-muted-foreground">Tidigare beställningar för ert företag</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollbart innehåll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="h-7 w-7 animate-spin text-primary mb-3" />
              <p className="text-sm">Hämtar era beställningar...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted p-3 text-muted-foreground mb-3">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Inga tidigare ordrar hittades</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                När ni lägger er första beställning via webbshopen kommer den att visas här.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const orderTotal = calculateOrderTotal(order);
              const formattedDate = new Date(order.created_at).toLocaleDateString("sv-SE", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-border/80 bg-muted/10 overflow-hidden transition hover:border-primary/30"
                >
                  {/* Order-sammanfattning (klickbar) */}
                  <div
                    onClick={() => toggleExpand(order.id)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer gap-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-foreground">
                          Order #{order.id}
                        </span>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          {order.items.reduce((a, b) => a + b.quantity, 0)} artiklar
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formattedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          Beställare: <strong className="text-foreground font-medium">{order.ordered_by}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
                      <div className="text-left sm:text-right">
                        <p className="text-sm font-bold text-foreground">{formatPrice(orderTotal)}</p>
                        <p className="text-[10px] text-muted-foreground">exkl. moms</p>
                      </div>
                      <div className="text-muted-foreground">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanderade artiklar */}
                  {isExpanded && (
                    <div className="border-t border-border/60 bg-background/50 px-4 py-3 text-xs space-y-3">
                      <div>
                        <p className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] mb-2">
                          Artiklar i denna beställning
                        </p>
                        <div className="divide-y divide-border/40">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-primary">{item.quantity}×</span>
                                <span className="font-medium text-foreground">{item.product?.name || "Produkt"}</span>
                              </div>
                              <span className="font-mono text-muted-foreground">
                                {formatPrice(Number(item.unit_price) * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.comment && (
                        <div className="rounded-xl bg-muted/40 p-2.5 text-[11px] text-muted-foreground border border-border/40">
                          <span className="font-semibold text-foreground">Märkning / Kommentar:</span> {order.comment}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border/80 bg-card/60 p-4 sm:px-6 flex justify-end">
          <Button variant="outline" onClick={onClose} size="sm">
            Stäng
          </Button>
        </div>

      </div>
    </div>
  );
}