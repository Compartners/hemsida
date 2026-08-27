import { FormEvent, useState } from "react";
import { LogIn, LogOut, ShieldCheck, Building2, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiCompany } from "@/lib/api";

type AccountCardProps = {
  account: ApiCompany | null;
  loading: boolean;
  onLogin: (customerId: string) => Promise<void>;
  onLogout: () => Promise<void>;
  onOpenOrderHistory?: () => void; // <-- Ny prop
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

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!customerId.trim()) return;
    setLoggingIn(true);
    try {
      await onLogin(customerId);
      setCustomerId("");
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
      {loading ? (
        <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground animate-pulse">
          <Building2 className="h-4 w-4" />
          Kontrollerar företagskonto...
        </div>
      ) : account ? (
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>{account.name}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Kund-ID: <span className="font-mono font-medium text-foreground">{account.company_code}</span>
              </p>
            </div>
            {account.has_phone_policy && (
              <Badge variant="secondary" className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3 w-3" />
                Policy
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={onOpenOrderHistory}
            >
              <Receipt className="h-3.5 w-3.5" />
              Historik
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground hover:text-destructive"
              onClick={onLogout}
            >
              <LogOut className="h-3.5 w-3.5" />
              Logga ut
            </Button>
          </div>
        </div>
      ) : (
        <form className="space-y-3" onSubmit={handleLoginSubmit}>
          <div>
            <label
              htmlFor="customer-id"
              className="block text-sm font-medium text-foreground"
            >
              Företagsinloggning
            </label>
            <p className="text-xs text-muted-foreground">
              Logga in med ditt kund-ID för avtalspriser.
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              id="customer-id"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="t.ex. CP-XXXX"
              autoComplete="off"
              disabled={loggingIn}
              className="h-9 text-sm"
            />
            <Button
              type="submit"
              size="sm"
              disabled={loggingIn || !customerId.trim()}
              className="h-9 shrink-0 gap-1.5"
            >
              <LogIn className="h-3.5 w-3.5" />
              {loggingIn ? "Loggar in..." : "Logga in"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}