import { FormEvent, useState } from "react";
import {
  Building2,
  LogIn,
  LogOut,
  Receipt,
  ShieldCheck,
} from "lucide-react";

import { ApiCompany } from "@/lib/api";

type AccountCardProps = {
  account: ApiCompany | null;
  loading: boolean;
  onLogin: (customerId: string) => Promise<void>;
  onLogout: () => Promise<void>;
  onOpenOrderHistory?: () => void;
};

export function AccountCard({
  account,
  loading,
  onLogin,
  onLogout,
  onOpenOrderHistory,
}: AccountCardProps) {
  const [customerId, setCustomerId] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLoginSubmit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (!customerId.trim()) return;

    setLoggingIn(true);

    try {
      await onLogin(customerId.trim());
      setCustomerId("");
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="rounded-[22px] border border-[#E3E9EF] bg-white p-5 shadow-[0_12px_40px_rgba(19,31,49,0.04)]">
      {loading ? (
        <div className="flex animate-pulse items-center gap-3 py-2 text-sm text-[#7D8794]">
          <div className="grid h-9 w-9 place-items-center rounded-[12px] bg-[#F4F7FA]">
            <Building2 size={16} />
          </div>

          Kontrollerar företagskonto...
        </div>
      ) : account ? (
        <div>
          {/* Logged in */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[13px] bg-[#0B72FE]/10 text-[#0B72FE]">
                <Building2 size={17} />
              </div>

              <div>
                <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-[#8A96A3]">
                  Företagskonto
                </span>

                <strong className="mt-1 block text-sm font-semibold text-[#171C25]">
                  {account.name}
                </strong>

                <span className="mt-1 block text-[11px] text-[#7D8794]">
                  Kund-ID:{" "}
                  <span className="font-mono font-medium text-[#171C25]">
                    {account.company_code}
                  </span>
                </span>
              </div>
            </div>

            {account.has_phone_policy && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#2CCEC2]/10 px-2 py-1 text-[9px] font-semibold text-[#168E85]">
                <ShieldCheck size={11} />
                Policy
              </span>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 border-t border-[#EEF2F5] pt-4">
            <button
              type="button"
              onClick={onOpenOrderHistory}
              className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-full border border-[#E3E9EF] text-xs font-semibold text-[#667181] transition hover:border-[#CBD6DE] hover:text-[#171C25]"
            >
              <Receipt size={14} />
              Historik
            </button>

            <button
              type="button"
              onClick={() => void onLogout()}
              className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-full border border-[#E3E9EF] text-xs font-semibold text-[#7D8794] transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
            >
              <LogOut size={14} />
              Logga ut
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleLoginSubmit}
          className="space-y-4"
        >
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-[12px] bg-[#0B72FE]/10 text-[#0B72FE]">
                <Building2 size={16} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#171C25]">
                  Företagsinloggning
                </h2>

                <p className="mt-0.5 text-[11px] text-[#7D8794]">
                  Se era priser och villkor.
                </p>
              </div>
            </div>

            <label
              htmlFor="customer-id"
              className="mb-2 block text-xs font-medium text-[#667181]"
            >
              Kund-ID
            </label>

            <input
              id="customer-id"
              value={customerId}
              onChange={(event) =>
                setCustomerId(event.target.value)
              }
              placeholder="t.ex. CP-XXXX"
              autoComplete="off"
              disabled={loggingIn}
              className="
                h-[44px] w-full rounded-[13px]
                border border-[#E3E9EF]
                bg-[#F8FAFB]
                px-4 text-sm text-[#171C25]
                outline-none
                placeholder:text-[#A0ABB5]
                transition
                focus:border-[#12B4F0]/50
                focus:bg-white
              "
            />
          </div>

          <button
            type="submit"
            disabled={loggingIn || !customerId.trim()}
            className="
              flex min-h-[42px] w-full items-center justify-center gap-2
              rounded-full
              bg-[#171C25]
              text-xs font-semibold text-white
              transition
              hover:bg-[#2D3444]
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <LogIn size={14} />

            {loggingIn
              ? "Loggar in..."
              : "Logga in"}
          </button>
        </form>
      )}
    </div>
  );
}