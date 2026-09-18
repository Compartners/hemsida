import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  Plus,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";

import { toast } from "sonner";

import {
  ApiCompany,
  createOrder,
} from "@/lib/api";

import {
  CartItem,
  Product,
} from "./types";

import { formatPrice } from "./utils";

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
  const [orderedBy, setOrderedBy] =
    useState("");

  const [comment, setComment] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          item.product.price *
            item.qty,
        0
      ),
    [cart]
  );

  const totalWithVat =
    subtotal * 1.25;

  const upsellProducts = useMemo(() => {
    const cartProductIds =
      new Set(
        cart.map(
          (item) => item.product.id
        )
      );

    const hasPhoneInCart =
      cart.some(
        (item) =>
          item.product.productType ===
            "phone" ||
          item.product.category ===
            "Telefoner"
      );

    return allProducts
      .filter((product) => {
        if (
          cartProductIds.has(product.id) ||
          !product.stock
        ) {
          return false;
        }

        const isAccessory =
          product.productType ===
            "accessory" ||
          product.category ===
            "Tillbehör";

        if (hasPhoneInCart) {
          const name =
            product.name.toLowerCase();

          const essential =
            name.includes("laddare") ||
            name.includes("adapter") ||
            name.includes("20w") ||
            name.includes("25w") ||
            name.includes("skal") ||
            name.includes("glas") ||
            name.includes("kabel");

          return (
            isAccessory &&
            essential
          );
        }

        return isAccessory;
      })
      .slice(0, 3);
  }, [cart, allProducts]);

  if (!isOpen) return null;

  const handleSubmitOrder = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (!orderedBy.trim()) {
      toast.error(
        "Vänligen ange vem som beställer."
      );
      return;
    }

    if (cart.length === 0) {
      toast.error(
        "Varukorgen är tom."
      );
      return;
    }

    setSubmitting(true);

    try {
      await createOrder({
        ordered_by: orderedBy.trim(),
        organization_number:
          account?.organization_number ||
          "",
        comment: comment.trim(),

        items: cart.map((item) => ({
          product_id:
            item.product.id,

          product:
            item.product.id,

          quantity: item.qty,

          unit_price:
            item.product.price,
        })),
      });

      toast.success(
        "Tack för din beställning! Ordern har registrerats."
      );

      setOrderedBy("");
      setComment("");

      onOrderSuccess();
      onClose();
    } catch (error) {
      console.error(
        "Order error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Kunde inte slutföra beställningen."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        onClick={onClose}
        aria-label="Stäng kassan"
        className="absolute inset-0 bg-[#050607]/70 backdrop-blur-sm"
      />

      <div className="relative flex max-h-[95vh] w-full max-w-[1000px] flex-col overflow-hidden rounded-[28px] border border-[#E3E9EF] bg-white shadow-[0_35px_110px_rgba(0,0,0,0.32)]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E3E9EF] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-[13px] bg-[#0B72FE]/10 text-[#0B72FE]">
              <ShoppingBag size={17} />
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-[-0.025em] text-[#171C25]">
                Kassa & beställning
              </h2>

              <p className="mt-0.5 text-xs text-[#8A96A3]">
                {account?.name}
                {account?.company_code &&
                  ` · ${account.company_code}`}
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

        {/* Scroll */}
        <div className="flex-1 space-y-7 overflow-y-auto p-6">

          {/* Cart products */}
          <section>
            <p className="mb-3 font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-[#8A96A3]">
              Valda artiklar
            </p>

            <div className="divide-y divide-[#E3E9EF] rounded-[18px] border border-[#E3E9EF] bg-[#F8FAFB] px-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="min-w-0 text-sm">
                    <span className="mr-2 font-semibold text-[#0B72FE]">
                      {item.qty}×
                    </span>

                    <span className="text-[#4E5968]">
                      {item.product.name}
                    </span>
                  </div>

                  <span className="shrink-0 text-xs font-semibold text-[#171C25]">
                    {formatPrice(
                      item.product.price *
                        item.qty
                    )}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Upsell */}
          {upsellProducts.length > 0 && (
            <section className="rounded-[22px] border border-[#E3E9EF] bg-[#F8FAFB] p-5">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles
                  size={16}
                  className="text-[#0B72FE]"
                />

                <h3 className="text-sm font-semibold text-[#171C25]">
                  Komplettera beställningen
                </h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {upsellProducts.map(
                  (product) => (
                    <article
                      key={product.id}
                      className="flex flex-col rounded-[16px] border border-[#E3E9EF] bg-white p-3"
                    >
                      <div className="flex aspect-video items-center justify-center rounded-[12px] bg-[#F8FAFB] p-2">
                        {product.image ? (
                          <img
                            src={
                              product.image
                            }
                            alt={
                              product.name
                            }
                            className="h-full w-full object-contain mix-blend-multiply"
                          />
                        ) : (
                          <span className="font-mono text-[9px] uppercase text-[#9BA6B0]">
                            Original
                          </span>
                        )}
                      </div>

                      <p className="mt-3 line-clamp-2 text-xs font-medium leading-5 text-[#171C25]">
                        {product.name}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                        <span className="text-xs font-semibold text-[#171C25]">
                          {formatPrice(
                            product.price
                          )}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            onAddToCart(
                              product
                            );

                            toast.success(
                              `${product.name} lades till!`
                            );
                          }}
                          className="inline-flex h-8 items-center gap-1 rounded-full bg-[#0B72FE]/10 px-3 text-[10px] font-semibold text-[#0B72FE] transition hover:bg-[#0B72FE] hover:text-white"
                        >
                          <Plus size={12} />
                          Lägg till
                        </button>
                      </div>
                    </article>
                  )
                )}
              </div>
            </section>
          )}

          {/* Details */}
          <form
            id="order-form"
            onSubmit={handleSubmitOrder}
            className="space-y-5"
          >
            <p className="font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-[#8A96A3]">
              Beställningsuppgifter
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Beställare / referensnamn *">
                <input
                  required
                  value={orderedBy}
                  onChange={(event) =>
                    setOrderedBy(
                      event.target.value
                    )
                  }
                  placeholder="t.ex. Johan Andersson"
                  className={inputClasses}
                />
              </Field>

              <Field label="Organisationsnummer">
                <input
                  disabled
                  value={
                    account?.organization_number ||
                    "Ej angivet"
                  }
                  className={`${inputClasses} cursor-not-allowed bg-[#F4F7FA] text-[#8A96A3]`}
                />
              </Field>
            </div>

            <Field label="Kostnadsställe / märkning / kommentar">
              <textarea
                rows={3}
                value={comment}
                onChange={(event) =>
                  setComment(
                    event.target.value
                  )
                }
                placeholder="t.ex. Kostnadsställe IT, levereras till våning 3..."
                className={`${inputClasses} min-h-[100px] resize-none py-3`}
              />
            </Field>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E3E9EF] bg-[#F8FAFB] px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-[#7D8794]">
                  Totalt exkl. moms
                </span>

                <strong className="text-xl tracking-[-0.03em] text-[#171C25]">
                  {formatPrice(
                    subtotal
                  )}
                </strong>
              </div>

              <p className="mt-1 text-[10px] text-[#8A96A3]">
                Inkl. 25% moms:{" "}
                {formatPrice(
                  totalWithVat
                )}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="min-h-[44px] rounded-full border border-[#E3E9EF] bg-white px-5 text-xs font-semibold text-[#667181] transition hover:border-[#CBD6DE] hover:text-[#171C25]"
              >
                Fortsätt handla
              </button>

              <button
                form="order-form"
                type="submit"
                disabled={
                  submitting ||
                  cart.length === 0
                }
                className="
                  group inline-flex min-h-[44px] items-center justify-center gap-2
                  rounded-full
                  bg-gradient-to-r from-[#0B72FE] via-[#12B4F0] to-[#2CCEC2]
                  px-5
                  text-xs font-semibold text-white
                  transition
                  hover:-translate-y-0.5
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {submitting
                  ? "Skickar order..."
                  : "Bekräfta beställning"}

                {!submitting && (
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClasses = `
  h-[46px]
  w-full
  rounded-[13px]
  border
  border-[#E3E9EF]
  bg-white
  px-4
  text-sm
  text-[#171C25]
  outline-none
  placeholder:text-[#9BA6B0]
  transition
  focus:border-[#12B4F0]/60
`;

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-medium text-[#667181]">
        {label}
      </span>

      {children}
    </label>
  );
}