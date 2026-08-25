import { FormEvent, useState } from "react";
import { LogIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiCompany } from "@/lib/api";

type AccountCardProps = {
  account: ApiCompany | null;
  loading: boolean;
  onLogin: (customerId: string) => Promise<void>;
  onLogout: () => Promise<void>;
};

export function AccountCard({ account, loading, onLogin, onLogout }: AccountCardProps) {
  const [customerId, setCustomerId] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      await onLogin(customerId);
      setCustomerId("");
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      {loading ? (
        <p className="text-sm text-foreground">Kontrollerar inloggning...</p>
      ) : account ? (
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <LogIn className="h-4 w-4 text-primary" aria-hidden="true" />
            {account.name}
          </p>
          <p className="text-xs text-foreground">Kund-ID {account.company_code}</p>
          {account.has_phone_policy && (
            <Badge variant="secondary" className="mt-1">
              Telefonpolicy aktiv
            </Badge>
          )}
          <Button variant="outline" size="sm" className="w-full" onClick={onLogout}>
            Logga ut
          </Button>
        </div>
      ) : (
        <form className="space-y-3" onSubmit={handleLoginSubmit}>
          <label htmlFor="customer-id" className="block text-sm font-medium text-foreground">
            Är du företagskund? Logga in med ditt kund-ID
          </label>
          <div className="flex gap-2">
            <Input
              id="customer-id"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="t.ex. CP1001"
              autoComplete="off"
              disabled={loggingIn}
            />
            <Button type="submit" size="sm" disabled={loggingIn}>
              {loggingIn ? "Loggar in..." : "Logga in"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Ange det kund-ID som du fått av ComPartners.
          </p>
        </form>
      )}
    </div>
  );
}