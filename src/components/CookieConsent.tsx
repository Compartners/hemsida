import { useEffect, useState } from "react";

const GA_ID = "G-XN2K55FT9R";
const STORAGE_KEY = "compartners-cookie-consent-v1";
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;

type Consent = {
  analytics: boolean;
  savedAt: number;
};

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const value = JSON.parse(raw) as Partial<Consent>;

    if (
      typeof value.analytics !== "boolean" ||
      typeof value.savedAt !== "number" ||
      value.savedAt > Date.now() ||
      Date.now() - value.savedAt >= MAX_AGE
    ) {
      return null;
    }

    return value as Consent;
  } catch {
    return null;
  }
}

function setAnalyticsDisabled(disabled: boolean) {
  Object.assign(window, {
    [`ga-disable-${GA_ID}`]: disabled,
  });
}

function startAnalytics() {
  setAnalyticsDisabled(false);

  // Undvik dubbel initiering, även med React StrictMode.
  if (document.getElementById("compartners-google-analytics")) return;

  const analyticsWindow = window as AnalyticsWindow;

  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.gtag = function (..._args: unknown[]) {
    analyticsWindow.dataLayer!.push(arguments);
  };

  analyticsWindow.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  analyticsWindow.gtag("js", new Date());
  analyticsWindow.gtag("config", GA_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement("script");
  script.id = "compartners-google-analytics";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

function removeAnalyticsCookies() {
  // Rensa GA-kakor för aktuell värd och överordnade domäner.
  const hostParts = window.location.hostname.split(".");
  const domains = hostParts.map((_, index) =>
    hostParts.slice(index).join(".")
  );

  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();

    if (name !== "_ga" && !name.startsWith("_ga_")) continue;

    const expired = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;

    document.cookie = expired;

    for (const domain of domains) {
      document.cookie = `${expired}; Domain=${domain}`;
      document.cookie = `${expired}; Domain=.${domain}`;
    }
  }
}

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(readConsent);
  const [open, setOpen] = useState(() => readConsent() === null);

  useEffect(() => {
    if (consent?.analytics) {
      startAnalytics();
    } else {
      setAnalyticsDisabled(true);
      removeAnalyticsCookies();
    }
  }, [consent]);

  function saveConsent(analytics: boolean) {
    const next: Consent = {
      analytics,
      savedAt: Date.now(),
    };

    // Stoppa insamling direkt om ett tidigare ja återkallas.
    if (!analytics) {
      setAnalyticsDisabled(true);
      removeAnalyticsCookies();
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Valet gäller ändå under det aktuella sidbesöket.
    }

    const needsReload = consent?.analytics === true && !analytics;

    setConsent(next);
    setOpen(false);

    // Tar bort den redan laddade Analytics-koden ur sidan.
    if (needsReload) {
      window.location.reload();
    }
  }

    if (!open) {
    return (
      <button
        type="button"
        className="fixed bottom-3 left-3 z-[9999] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-[#111724] shadow-md transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
        onClick={() => setOpen(true)}
      >
        Cookieinställningar
      </button>
    );
  }

  return (
    <section
      className="fixed inset-x-3 bottom-3 z-[10000] mx-auto flex max-h-[calc(100dvh-24px)] max-w-[1100px] flex-col gap-5 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 text-[#111724] shadow-[0_12px_50px_rgba(17,23,36,0.18)] sm:inset-x-5 sm:bottom-5 sm:max-h-[calc(100dvh-40px)] sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-7"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-description"
    >
      <div className="max-w-[650px]">
        <span className="text-[11px] font-bold tracking-[0.14em] text-slate-500">
          DIN INTEGRITET
        </span>

        <h2
          id="cookie-title"
          className="mb-2.5 mt-2 text-2xl font-semibold leading-tight"
        >
          Du väljer dina cookies
        </h2>

        <p
          id="cookie-description"
          className="text-sm leading-relaxed text-slate-600"
        >
          Med ditt godkännande använder vi Google Analytics för att
          förstå hur webbplatsen används och förbättra den. Du kan
          använda sidan utan statistikkakor och ändra ditt val när
          som helst via Cookieinställningar.
        </p>

        <details className="mt-3 text-sm text-slate-600">
          <summary className="cursor-pointer underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500">
            Mer om cookies
          </summary>

          <p className="mt-3 leading-relaxed">
            Statistik är valfritt. Google Analytics använder kakorna
            _ga och _ga_XN2K55FT9R för att skilja besökare och
            sammanföra besök till sessioner. Livslängden beror på
            inställningarna i Google Analytics.
          </p>

          <p className="mt-3 leading-relaxed">
            Ditt cookieval sparas i webbläsarens lokala lagring i
            upp till sex månader.
          </p>
        </details>
      </div>

      <div className="grid shrink-0 gap-2.5 sm:min-w-[190px]">
        <button
          type="button"
          className="rounded-lg border border-[#111724] bg-[#111724] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#293449] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
          onClick={() => saveConsent(false)}
        >
          Avvisa statistik
        </button>

        <button
          type="button"
          className="rounded-lg border border-[#111724] bg-[#111724] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#293449] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
          onClick={() => saveConsent(true)}
        >
          Godkänn statistik
        </button>

        {consent && (
          <button
            type="button"
            className="rounded px-2 py-2 text-xs text-slate-600 underline underline-offset-4 hover:text-[#111724] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
            onClick={() => setOpen(false)}
          >
            Stäng utan att ändra
          </button>
        )}
      </div>
    </section>
  );
}