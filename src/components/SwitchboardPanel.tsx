import { useEffect, useState } from "react";

export type TeamMember = {
  name: string;
  init: string;
  status: string;
};

const DEFAULT_TEAM: TeamMember[] = [
  { name: "Elias", init: "E", status: "pratar med Nordisk Plåt AB" },
  { name: "Viktor", init: "V", status: "ledig — redo att svara" },
  { name: "Adam", init: "A", status: "skriver offert" },
  { name: "Noah", init: "N", status: "ledig — redo att svara" },
];

function formatClock(d: Date) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

export type SwitchboardPanelProps = {
  /** Personerna som visas i listan. */
  team?: TeamMember[];

  /** Hur ofta aktiv person byts. */
  rotateIntervalMs?: number;

  /** Rubrik högst upp i växeln. */
  title?: string;

  /** Text längst ner i växeln. */
  footerText?: string;
};

/**
 * 50/50 växeltavla.
 *
 * Vänster:
 * - Rubrik
 * - Beskrivning
 *
 * Höger:
 * - Animerad växeltavla
 * - Teammedlemmar
 * - Live-klocka
 * - Samtalstimer
 *
 * Använder projektets tema-variabler (bg-primary, text-foreground osv)
 * istället för hårdkodade hex-färger, så den följer med när du byter tema.
 */
export default function SwitchboardPanel({
  team = DEFAULT_TEAM,
  rotateIntervalMs = 3200,
  title = "växeln — just nu",
  footerText = "inkommande samtal besvaras live",
}: SwitchboardPanelProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [clock, setClock] = useState(() => formatClock(new Date()));

  useEffect(() => {
    if (team.length === 0) return;

    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % team.length);
      setSeconds(0);
    }, rotateIntervalMs);

    return () => clearInterval(id);
  }, [team.length, rotateIntervalMs]);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setClock(formatClock(new Date()));
    }, 30_000);

    return () => clearInterval(id);
  }, []);

  const callTime = `${String(Math.floor(seconds / 60)).padStart(
    2,
    "0"
  )}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <>
      <style>{`
        @keyframes switchboard-pulse {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 0 0 hsl(var(--primary) / 0.5);
          }

          50% {
            opacity: 0.6;
            box-shadow: 0 0 0 6px hsl(var(--primary) / 0);
          }
        }

        .switchboard-dot {
          animation: switchboard-pulse 1.6s infinite ease-in-out;
        }
      `}</style>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        {/* ============================================================
            VÄNSTER — TEXT
        ============================================================ */}

        <div className="flex flex-col justify-center">
          <span className="mb-5 font-mono text-[11.5px] uppercase tracking-[0.08em] text-primary">
            alltid någon som svarar
          </span>

          <h2 className="max-w-xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Inga samtal
            <br />
            lämnas åt slumpen.
          </h2>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Se vem som är tillgänglig, vem som pratar och vem som
            är redo att svara — direkt i växeln.
          </p>
        </div>

        {/* ============================================================
            HÖGER — VÄXELTAVLA
        ============================================================ */}

        <div className="rounded-[4px] border border-border bg-card p-6 text-card-foreground shadow-card">
          {/* Header */}
          <div className="mb-1 flex items-center justify-between border-b border-border pb-[18px] font-mono text-[11.5px] uppercase tracking-[0.06em] text-muted-foreground">
            <span>{title}</span>

            <span className="text-foreground">
              {clock}
            </span>
          </div>

          {/* Team */}
          {team.map((member, i) => {
            const isActive = i === activeIndex;

            return (
              <div
                key={member.name}
                className={[
                  "flex items-center gap-3.5 px-1 py-4",
                  "transition-colors duration-500",
                  i !== team.length - 1 ? "border-b border-border" : "",
                  isActive ? "bg-primary/[0.07]" : "bg-transparent",
                ].join(" ")}
              >
                {/* Initial */}
                <div
                  className={[
                    "flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[2px]",
                    "font-display text-[14px] font-bold",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground",
                  ].join(" ")}
                >
                  {member.init}
                </div>

                {/* Name + status */}
                <div className="min-w-0 flex-1">
                  <div className="font-display text-[15px] font-bold text-foreground">
                    {member.name}
                  </div>

                  <div
                    className={[
                      "mt-[3px] truncate font-mono text-[11.5px]",
                      isActive ? "text-primary" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {member.status}
                  </div>
                </div>

                {/* Call timer */}
                <div className="shrink-0 font-mono text-[11.5px] text-muted-foreground">
                  {isActive ? callTime : "—"}
                </div>
              </div>
            );
          })}

          {/* Footer */}
          <div className="mt-[22px] flex items-center gap-2 border-t border-border pt-[18px] font-mono text-[11.5px] text-muted-foreground">
            <span className="switchboard-dot h-[7px] w-[7px] shrink-0 rounded-full bg-primary" />

            <span>{footerText}</span>
          </div>
        </div>
      </section>
    </>
  );
}