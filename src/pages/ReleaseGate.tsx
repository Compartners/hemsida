import { useEffect, useState, type ReactNode } from "react";

// Svensk tid: 29 oktober 2026 kl. 08.00.
const RELEASE_AT = new Date("2026-10-29T08:00:00+01:00").getTime();

function getTimeLeft() {
  return Math.max(0, Math.ceil((RELEASE_AT - Date.now()) / 1000));
}

function CountdownUnit({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center">
      <span className="text-[clamp(40px,10vw,88px)] font-medium leading-none tracking-[-0.06em] text-white tabular-nums">
        {String(value).padStart(2, "0")}
      </span>

      <span className="mt-4 text-[10px] uppercase tracking-[0.18em] text-white/40 sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export default function ReleaseGate({
  children,
}: {
  children: ReactNode;
}) {
  const [secondsLeft, setSecondsLeft] = useState(getTimeLeft);

  useEffect(() => {
    if (Date.now() >= RELEASE_AT) {
      setSecondsLeft(0);
      return;
    }

    const update = () => setSecondsLeft(getTimeLeft);

    const interval = window.setInterval(update, 1000);

    // Uppdatera direkt när besökaren återvänder till fliken.
    document.addEventListener("visibilitychange", update);
    window.addEventListener("focus", update);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("focus", update);
    };
  }, []);

  const days = Math.floor(secondsLeft / 86400);
  const hours = Math.floor((secondsLeft % 86400) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return (
    <>
      <style>
        {`
          @keyframes release-content-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes release-site-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .release-content {
            animation: release-content-in 1000ms ease-out both;
          }

          .release-site {
            animation: release-site-in 900ms ease-out both;
          }

          @media (prefers-reduced-motion: reduce) {
            .release-content,
            .release-site {
              animation: none;
            }

            .release-signal {
              display: none;
            }
          }
        `}
      </style>

      {secondsLeft === 0 ? (
        <div className="release-site">{children}</div>
      ) : (
        <main className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden bg-[#05080C] text-white">
          {/* Bakgrund */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute -left-40 top-[15%] h-[500px] w-[500px] rounded-full bg-[#0B72FE]/10 blur-[140px]" />

            <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#2CCEC2]/[0.07] blur-[140px]" />

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.035),transparent_65%)]" />
          </div>

          {/* Logotyp */}
          <header className="flex justify-center px-6 pt-10 sm:pt-14">
          </header>

          {/* Lansering */}
          <div className="release-content mx-auto flex w-full max-w-[940px] flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:py-20">
            <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2">
              <span className="size-1.5 rounded-full bg-[#3BBBA0]" />

              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/60">
                Premiär 29 oktober · 08.00
              </span>
            </div>

            <h1 className="m-0 text-[clamp(44px,7.5vw,86px)] font-semibold leading-[1.02] tracking-[-0.06em]">
              Snart kopplar vi på
              <br />

              <span className="bg-gradient-to-r from-[#1694FC] via-[#12B4F0] to-[#61CFAE] bg-clip-text text-transparent">
                något nytt.
              </span>
            </h1>

            <p className="mb-0 mt-6 max-w-[430px] text-[15px] leading-7 text-white/50 sm:text-base">
              Vi förbereder vår nya hemsida.
              <br />
              Välkommen tillbaka när vi kopplar på.
            </p>

            {/* Nedräkning */}
            <div
              role="timer"
              aria-label={`${days} dagar, ${hours} timmar, ${minutes} minuter och ${seconds} sekunder till lansering`}
              className="mt-12 grid w-full max-w-[560px] grid-cols-4 gap-3 sm:mt-16 sm:gap-8"
            >
              <CountdownUnit value={days} label="Dagar" />
              <CountdownUnit value={hours} label="Timmar" />
              <CountdownUnit value={minutes} label="Minuter" />
              <CountdownUnit value={seconds} label="Sekunder" />
            </div>

            {/* Signal som kopplar ihop två punkter */}
            <svg
              viewBox="0 0 400 40"
              fill="none"
              aria-hidden="true"
              className="mt-10 h-10 w-full max-w-[360px] sm:mt-12"
            >
              <path
                d="M20 20H380"
                stroke="white"
                strokeOpacity=".1"
              />

              <circle
                cx="20"
                cy="20"
                r="4"
                fill="#0D1927"
                stroke="#1694FC"
                strokeOpacity=".6"
              />

              <circle
                cx="380"
                cy="20"
                r="4"
                fill="#10201B"
                stroke="#61CFAE"
                strokeOpacity=".6"
              />

              <g className="release-signal" opacity="0">
                <animateMotion
                  path="M20 20H380"
                  dur="5s"
                  repeatCount="indefinite"
                />

                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.1;0.85;1"
                  dur="5s"
                  repeatCount="indefinite"
                />

                <circle r="9" opacity=".12">
                  <animate
                    attributeName="fill"
                    values="#1694FC;#61CFAE"
                    dur="5s"
                    repeatCount="indefinite"
                  />
                </circle>

                <circle r="3">
                  <animate
                    attributeName="fill"
                    values="#1694FC;#61CFAE"
                    dur="5s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            </svg>
          </div>

          <footer className="px-6 pb-7 text-center text-[11px] tracking-wide text-white/30">
            Compartners · Kommunikation som hänger ihop.
          </footer>
        </main>
      )}
    </>
  );
}