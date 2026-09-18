import { useEffect, useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Loader2,
  Package,
  Receipt,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  getCompanyOrders,
  type ApiOrder,
} from "@/lib/api";

import { formatPrice } from "./utils";

type OrderHistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function OrderHistoryModal({
  isOpen,
  onClose,
}: OrderHistoryModalProps) {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const [expandedOrderId, setExpandedOrderId] =
    useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    async function loadOrders() {
      setLoading(true);

      try {
        const data = await getCompanyOrders();
        setOrders(data);
      } catch (error) {
        console.error(
          "Order history error:",
          error
        );

        toast.error(
          "Kunde inte hämta orderhistorik."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleExpand = (id: number) => {
    setExpandedOrderId(
      expandedOrderId === id ? null : id
    );
  };

  const calculateOrderTotal = (
    order: ApiOrder
  ) => {
    if (order.total_amount) {
      return Number(order.total_amount);
    }

    return order.items.reduce(
      (sum, item) =>
        sum +
        Number(item.unit_price) *
          item.quantity,
      0
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Stäng orderhistorik"
        onClick={onClose}
        className="absolute inset-0 bg-[#050607]/70 backdrop-blur-sm"
      />

      <div className="relative flex max-h-[90vh] w-full max-w-[800px] flex-col overflow-hidden rounded-[28px] border border-[#E3E9EF] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.30)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E3E9EF] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-[13px] bg-[#0B72FE]/10 text-[#0B72FE]">
              <Receipt size={17} />
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-[-0.025em] text-[#171C25]">
                Orderhistorik
              </h2>

              <p className="mt-0.5 text-xs text-[#8A96A3]">
                Tidigare beställningar för ert företag
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-[#7D8794] transition hover:bg-[#F4F7FA] hover:text-[#171C25]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3 overflow-y-auto p-6">
          {loading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-[#7D8794]">
              <Loader2
                size={26}
                className="animate-spin text-[#0B72FE]"
              />

              <p className="mt-4 text-sm">
                Hämtar era beställningar...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-[#F4F7FA] text-[#7D8794]">
                <Package size={22} />
              </div>

              <h3 className="mt-5 text-sm font-semibold text-[#171C25]">
                Inga tidigare beställningar
              </h3>

              <p className="mt-2 max-w-[340px] text-xs leading-5 text-[#8A96A3]">
                När ni lägger er första beställning
                kommer den att visas här.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const expanded =
                expandedOrderId === order.id;

              const total =
                calculateOrderTotal(order);

              const date =
                new Date(
                  order.created_at
                ).toLocaleDateString("sv-SE", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

              const quantity =
                order.items.reduce(
                  (sum, item) =>
                    sum + item.quantity,
                  0
                );

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-[18px] border border-[#E3E9EF] transition hover:border-[#D2DDE5]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      toggleExpand(order.id)
                    }
                    className="flex w-full flex-col gap-4 p-4 text-left transition hover:bg-[#F8FAFB] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="font-mono text-xs text-[#171C25]">
                          Order #{order.id}
                        </strong>

                        <span className="rounded-full bg-[#0B72FE]/10 px-2 py-1 text-[9px] font-semibold text-[#0B72FE]">
                          {quantity} artiklar
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#7D8794]">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          {date}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <User size={12} />
                          {order.ordered_by}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="sm:text-right">
                        <strong className="block text-sm text-[#171C25]">
                          {formatPrice(total)}
                        </strong>

                        <span className="text-[9px] text-[#8A96A3]">
                          exkl. moms
                        </span>
                      </div>

                      {expanded ? (
                        <ChevronUp
                          size={16}
                          className="text-[#8A96A3]"
                        />
                      ) : (
                        <ChevronDown
                          size={16}
                          className="text-[#8A96A3]"
                        />
                      )}
                    </div>
                  </button>

                  {expanded && (
                    <div className="border-t border-[#E3E9EF] bg-[#F8FAFB] px-4 py-4">
                      <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#8A96A3]">
                        Artiklar
                      </p>

                      <div className="divide-y divide-[#E3E9EF]">
                        {order.items.map(
                          (item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-4 py-2.5"
                            >
                              <div className="text-xs text-[#4E5968]">
                                <span className="mr-2 font-semibold text-[#0B72FE]">
                                  {item.quantity}×
                                </span>

                                {item.product
                                  ?.name ||
                                  "Produkt"}
                              </div>

                              <span className="shrink-0 font-mono text-[10px] text-[#667181]">
                                {formatPrice(
                                  Number(
                                    item.unit_price
                                  ) *
                                    item.quantity
                                )}
                              </span>
                            </div>
                          )
                        )}
                      </div>

                      {order.comment && (
                        <div className="mt-4 rounded-[12px] border border-[#E3E9EF] bg-white p-3 text-[11px] leading-5 text-[#667181]">
                          <strong className="text-[#171C25]">
                            Märkning / kommentar:
                          </strong>{" "}
                          {order.comment}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-end border-t border-[#E3E9EF] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] rounded-full border border-[#E3E9EF] px-5 text-xs font-semibold text-[#667181] transition hover:border-[#CBD6DE] hover:text-[#171C25]"
          >
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
}