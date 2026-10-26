import { useEffect, useRef, type ReactNode } from "react";
import {
  ArrowRight,
  Car,
  Check,
  FileText,
  Headphones,
  Phone,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ContactSection from "@/components/contact/ContactSection";
import Seo from "@/components/SEO";

const serviceNav = [
  {
    number: "01",
    label: "Växel & telefoni",
    href: "#telefoni",
  },
  {
    number: "02",
    label: "Transkribering",
    href: "#transkribering",
  },
  {
    number: "03",
    label: "Körjournaler",
    href: "#korjournal",
  },
  {
    number: "04",
    label: "Support",
    href: "#support",
  },
];

export default function Tjanster() {
  return (
    <>
      <style>{illustrationStyles}</style>
      <Navbar />

      <Seo
        title="Växel, transkribering, körjournaler & support | Compartners"
        description="Operatörsoberoende företagstelefoni, transkribering av samtal, elektroniska körjournaler och personlig support från Compartners."
        canonical="https://compartners.se/tjanster"
      />

      <main>
        {/* =====================================================
            HERO
        ===================================================== */}
        {/* =====================================================
    HERO
===================================================== */}
<section className="relative overflow-hidden bg-[#111724] pb-24 pt-40 text-white md:pb-28 md:pt-48 lg:pb-36">
  {/* Soft background */}
  <div className="pointer-events-none absolute right-[-180px] top-[-140px] h-[620px] w-[620px] rounded-full bg-[#0B72FE]/12 blur-[170px]" />
  <div className="pointer-events-none absolute bottom-[-300px] left-[20%] h-[560px] w-[760px] rounded-full bg-[#2CCEC2]/8 blur-[180px]" />
  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_38%,rgba(255,255,255,0.035),transparent_27%)]" />

  <div className="relative mx-auto grid w-full max-w-[1240px] gap-10 px-5 md:px-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-8">
    {/* Copy */}
    <div className="max-w-[870px]">
      <div className="mb-6 flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">
        
      </div>

      <h1 className="m-0 text-[40px] font-semibold leading-[1.02] tracking-[-0.055em] sm:text-[60px] md:text-[72px] lg:text-[64px] xl:text-[72px]">
        <span className="block">Växel,</span>
        <span className="block">transkribering</span>
        <span className="block">och körjournaler.</span>
      </h1>

      <p className="mt-7 max-w-[690px] text-[17px] leading-8 text-white/58 md:text-[19px]">
        Oberoende av operatör, med en fast kontaktperson som känner
        er verksamhet.
      </p>

      <div className="mt-8">
        <a
          href="#kontakt"
          className="
            group inline-flex min-h-[52px] items-center justify-center gap-2
            rounded-full
            bg-gradient-to-r from-[#0B72FE] via-[#12B4F0] to-[#2CCEC2]
            px-6
            text-sm font-semibold text-white
            shadow-[0_18px_46px_rgba(11,114,254,0.24)]
            transition-all duration-300
            hover:-translate-y-0.5
          "
        >
          Prata med en företagsrådgivare

          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </a>
      </div>
    </div>

    {/* Gemensam kontaktpunkt för de fyra tjänsterna */}
    <div className="cp-hero-visual">
      <svg viewBox="0 0 460 400" fill="none" aria-hidden="true" focusable="false">
        <circle className="cp-hero-orbit" cx="230" cy="202" r="151" />
        <circle className="cp-hero-orbit cp-hero-orbit-inner" cx="230" cy="202" r="104" />

        <g className="cp-hero-connections">
          <path d="M126 100H155Q180 100 180 125V155Q180 180 200 189" />
          <path d="M334 100H305Q280 100 280 125V155Q280 180 260 189" />
          <path d="M126 298H155Q180 298 180 273V249Q180 224 200 215" />
          <path d="M334 298H305Q280 298 280 273V249Q280 224 260 215" />
        </g>
        <g className="cp-hero-streams">
          <path pathLength={1} d="M126 100H155Q180 100 180 125V155Q180 180 200 189" />
          <path pathLength={1} d="M334 100H305Q280 100 280 125V155Q280 180 260 189" />
          <path pathLength={1} d="M126 298H155Q180 298 180 273V249Q180 224 200 215" />
          <path pathLength={1} d="M334 298H305Q280 298 280 273V249Q280 224 260 215" />
        </g>

        <g className="cp-hero-nodes">
          <rect x="68" y="71" width="58" height="58" rx="18" />
          <rect x="334" y="71" width="58" height="58" rx="18" />
          <rect x="68" y="269" width="58" height="58" rx="18" />
          <rect x="334" y="269" width="58" height="58" rx="18" />
        </g>
        <g className="cp-hero-icons">
          <Phone x={85} y={88} width={24} height={24} strokeWidth={1.5} />
          <FileText x={351} y={88} width={24} height={24} strokeWidth={1.5} />
          <Car x={85} y={286} width={24} height={24} strokeWidth={1.5} />
          <Headphones x={351} y={286} width={24} height={24} strokeWidth={1.5} />
        </g>
        <g className="cp-hero-labels" textAnchor="middle">
          <text x="97" y="151">Telefoni</text>
          <text x="363" y="151">Transkribering</text>
          <text x="97" y="349">Körjournaler</text>
          <text x="363" y="349">Support</text>
        </g>

        <circle className="cp-hero-pulse" cx="230" cy="202" r="48" />
        <circle className="cp-hero-hub" cx="230" cy="202" r="39" />
        <g className="cp-hero-person">
          <circle cx="230" cy="193" r="8" />
          <path d="M214 219V216C214 207 221 204 230 204C239 204 246 207 246 216V219" />
        </g>
        <circle className="cp-hero-status" cx="258" cy="175" r="4" />
      </svg>
      <div className="cp-hero-caption">
        <span>Flera tjänster. En kontakt.</span>
        <p>Vi håller ihop helheten.</p>
      </div>
    </div>
  </div>
</section>

        {/* =====================================================
            SERVICE NAV
        ===================================================== */}
        <section className="border-b border-[#E3E9EF] bg-white">
          <div className="mx-auto grid w-full max-w-[1240px] px-5 md:grid-cols-2 md:px-8 lg:grid-cols-4">
            {serviceNav.map((item) => (
              <a
                key={item.number}
                href={item.href}
                className="
                  group flex min-h-[92px] items-center justify-between
                  border-b border-[#E3E9EF] py-5
                  transition-colors hover:text-[#0B72FE]
                  md:px-5
                  lg:border-b-0 lg:border-r
                  lg:first:pl-0
                  lg:last:border-r-0
                "
              >
                <div>
                  <span className="mb-1 block font-mono text-[9px] text-[#8A96A3]">
                    {item.number}
                  </span>

                  <span className="text-sm font-semibold text-[#171C25] transition-colors group-hover:text-[#0B72FE]">
                    {item.label}
                  </span>
                </div>

                <ArrowRight
                  size={15}
                  strokeWidth={1.7}
                  className="text-[#8A96A3] transition-transform group-hover:translate-x-1"
                />
              </a>
            ))}
          </div>
        </section>

        {/* =====================================================
            TELEFONI
        ===================================================== */}
        <section
          id="telefoni"
          className="scroll-mt-20 bg-white py-20 md:py-24 lg:py-32"
        >
          <div className="mx-auto grid w-full max-w-[1240px] gap-14 px-5 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-24">
            {/* Copy */}
            <div>
              <div className="mb-5 flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#7D8794]">
                <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#0B72FE]/10 text-[#0B72FE]">
                  <Phone size={15} strokeWidth={1.8} />
                </span>
                01 / Växel & telefoni
              </div>

              <h2 className="text-[42px] font-semibold leading-[0.98] tracking-[-0.055em] text-[#171C25] sm:text-[50px] md:text-[60px] lg:text-[68px]">
                Växel och telefoni, oavsett operatör.
              </h2>

              <p className="mt-6 max-w-[570px] text-[16px] leading-7 text-[#667181] md:text-[17px] md:leading-8">
                Vi använder flera olika växelplattformar och väljer den som
                passar er, inte den vi råkar sälja. Operatören väljer vi
                tillsammans utifrån hur ni arbetar.
              </p>

              <div className="mt-8 grid gap-3">
                {[
                  "Mobila växlar",
                  "Flera växelplattformar, vi väljer den som passar",
                  "Företagsabonnemang oavsett operatör",
                  "En kontakt genom hela processen",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-[#4E5968]"
                  >
                    <Check
                      size={16}
                      strokeWidth={2}
                      className="shrink-0 text-[#2CCEC2]"
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <ServiceIllustration kind="telefoni" />
          </div>
        </section>

        {/* =====================================================
            TRANSKRIBERING
        ===================================================== */}
        <section
          id="transkribering"
          className="scroll-mt-20 bg-[#111724] py-20 text-white md:py-24 lg:py-32"
        >
          <div className="mx-auto grid w-full max-w-[1240px] gap-14 px-5 md:px-8 lg:grid-cols-2 lg:items-center lg:gap-24">
            <ServiceIllustration kind="transkribering" dark />

            {/* Copy */}
            <div>
              <div className="mb-5 flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">
                <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#2CCEC2]/10 text-[#2CCEC2]">
                  <FileText size={15} strokeWidth={1.8} />
                </span>
                02 / Transkribering
              </div>

              <h2 className="text-[42px] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-[50px] md:text-[60px] lg:text-[68px]">
                Samtal som blir text.
              </h2>

              {/* GISSNING: kontrollera texten och punkterna mot vad ni levererar */}
              <p className="mt-6 max-w-[570px] text-[16px] leading-7 text-white/55 md:text-[17px] md:leading-8">
                Slipp anteckna under samtalen. Vi skriver ut det som sagts,
                så att ni kan söka, dela och följa upp.
              </p>

              <div className="mt-8 grid gap-3">
                {[
                  "Samtal skrivs ut automatiskt",
                  "Sökbart i efterhand",
                  "Sammanfattning av det som sagts",
                  "Tydligare nästa steg efter samtalet",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-white/70"
                  >
                    <Check
                      size={16}
                      strokeWidth={2}
                      className="shrink-0 text-[#2CCEC2]"
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            KÖRJOURNALER
        ===================================================== */}
        <section
          id="korjournal"
          className="scroll-mt-20 bg-[#F4F7FA] py-20 md:py-24 lg:py-32"
        >
          <div className="mx-auto grid w-full max-w-[1240px] gap-14 px-5 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-24">
            {/* Copy */}
            <div>
              <div className="mb-5 flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#7D8794]">
                <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#0B72FE]/10 text-[#0B72FE]">
                  <Car size={15} strokeWidth={1.8} />
                </span>

                03 / Körjournaler
              </div>

              <h2 className="text-[42px] font-semibold leading-[0.98] tracking-[-0.055em] text-[#171C25] sm:text-[50px] md:text-[60px] lg:text-[68px]">
                Körjournal utan pappersarbete.
              </h2>

              <p className="mt-6 max-w-[570px] text-[16px] leading-7 text-[#667181] md:text-[17px] md:leading-8">
                En elektronisk körjournal sköter rapporteringen åt er. Inga
                försvunna dokument, inget krångel.
              </p>

              <div className="mt-8 grid gap-3">
                {[
                  "Elektronisk körjournal",
                  "Rapportering som sköter sig själv",
                  "Slut på pappersblad och försvunna dokument",
                  "Personlig kontakt vid frågor",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-[#4E5968]"
                  >
                    <Check
                      size={16}
                      strokeWidth={2}
                      className="shrink-0 text-[#2CCEC2]"
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <ServiceIllustration kind="korjournal" />
          </div>
        </section>

        {/* =====================================================
            SUPPORT
        ===================================================== */}
        <section
          id="support"
          className="scroll-mt-20 bg-white py-20 md:py-24 lg:py-32"
        >
          <div className="mx-auto grid w-full max-w-[1240px] gap-14 px-5 md:px-8 lg:grid-cols-2 lg:items-center lg:gap-24">
            <ServiceIllustration kind="support" dark />

            {/* Copy */}
            <div>
              <div className="mb-5 flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#7D8794]">
                <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#2CCEC2]/10 text-[#159F95]">
                  <Headphones size={15} strokeWidth={1.8} />
                </span>
                04 / Support
              </div>

              <h2 className="text-[42px] font-semibold leading-[0.98] tracking-[-0.055em] text-[#171C25] sm:text-[50px] md:text-[60px] lg:text-[68px]">
                Bara ett
                <br />
                samtal bort.
              </h2>

              <p className="mt-6 max-w-[570px] text-[16px] leading-7 text-[#667181] md:text-[17px] md:leading-8">
                När något ska ändras eller inte fungerar ska ni inte börja
                om. Er kontaktperson känner redan lösningen och verksamheten.
              </p>

              <div className="mt-8 grid gap-3">
                {[
                  "Personlig kontakt",
                  "Hjälp vid förändringar och frågor",
                  "Löpande förvaltning",
                  "Support som känner er lösning",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-[#4E5968]"
                  >
                    <Check
                      size={16}
                      strokeWidth={2}
                      className="shrink-0 text-[#2CCEC2]"
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ===================================================== */}
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
// Animationer och illustrationer, samlade i samma fil.
const illustrationStyles = `

/* Hero — samma formspråk som tjänsteillustrationerna. */
.cp-hero-visual{position:relative;min-width:0;width:100%;max-width:480px;justify-self:center;align-self:center}
.cp-hero-visual>svg{display:block;width:100%;height:auto;overflow:visible;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.cp-hero-orbit{stroke:#a3c7e8;opacity:.08}
.cp-hero-orbit-inner{opacity:.05}
.cp-hero-connections{stroke:#31445b}
.cp-hero-streams{stroke:#2ccec2;stroke-dasharray:.16 .84}
.cp-hero-streams path{animation:cp-hero-flow 10s ease-in-out infinite;opacity:0}
.cp-hero-streams path:nth-child(2){animation-delay:2.5s}
.cp-hero-streams path:nth-child(3){animation-delay:5s}
.cp-hero-streams path:nth-child(4){animation-delay:7.5s}
.cp-hero-nodes{fill:#162130;stroke:#35485d}
.cp-hero-icons{color:#8cbff7}
.cp-hero-labels{fill:#a1afc1;stroke:none;font-family:inherit;font-size:12px;letter-spacing:.1px}
.cp-hero-hub{fill:#192e3b;stroke:#2ccec2;stroke-opacity:.65}
.cp-hero-person{stroke:#b7e7e3;stroke-width:1.7}
.cp-hero-status{fill:#2ccec2;stroke:#111724;stroke-width:3}
.cp-hero-pulse{stroke:#2ccec2;transform-origin:230px 202px;animation:cp-hero-breathe 5s ease-in-out infinite}
.cp-hero-caption{text-align:center;margin-top:-4px}
.cp-hero-caption>span{font-family:ui-monospace,monospace;font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:#8094aa}
.cp-hero-caption>p{font-size:19px;line-height:1.4;letter-spacing:-.03em;margin:10px 0 0;color:#dce6ef}
@keyframes cp-hero-flow{0%,5%{stroke-dashoffset:1;opacity:0}10%{opacity:1}30%{stroke-dashoffset:0;opacity:1}38%,100%{stroke-dashoffset:0;opacity:0}}
@keyframes cp-hero-breathe{0%,100%{transform:scale(1);opacity:.08}50%{transform:scale(1.08);opacity:.25}}
@media(max-width:1023px){.cp-hero-visual{max-width:390px;margin-top:4px}}
@media(max-width:479px){.cp-hero-visual{max-width:340px}.cp-hero-labels{font-size:15px}}
@media(prefers-reduced-motion:reduce){.cp-hero-streams path,.cp-hero-pulse{animation:none!important}.cp-hero-streams{display:none}.cp-hero-pulse{opacity:.15}}
/* Compartners — scoped, dependency-free illustration styles */
.cp-illustration{--cp-bg:#f4f7fa;--cp-paper:#fff;--cp-ink:#33445a;--cp-line:#cedae4;--cp-blue:#0b72fe;--cp-teal:#19bbae;--cp-soft:#e7f4f6;position:relative;display:grid;place-items:center;isolation:isolate;overflow:hidden;min-height:380px;border-radius:28px;background:var(--cp-bg)}
.cp-illustration--dark{--cp-bg:#111b29;--cp-paper:#142131;--cp-ink:#cedce9;--cp-line:#34495e;--cp-blue:#55a3ff;--cp-teal:#2ccec2;--cp-soft:#152d36}
.cp-illustration svg{display:block;width:100%;max-width:540px;height:auto;overflow:visible;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.cp-illustration .cp-halo{fill:var(--cp-soft);opacity:.55;stroke:none}
.cp-illustration .cp-paper{fill:var(--cp-paper);stroke:var(--cp-ink)}
.cp-illustration .cp-ink{stroke:var(--cp-ink)}
.cp-illustration .cp-structure{stroke:var(--cp-line)}
.cp-illustration .cp-accent{stroke:var(--cp-blue)}
.cp-illustration .cp-flow{stroke:var(--cp-teal);stroke-dasharray:.12 .88;animation:cp-flow 7s ease-in-out infinite}
.cp-illustration .cp-signal,.cp-illustration .cp-dots{fill:var(--cp-teal)}
.cp-illustration .cp-handset{transform-box:fill-box;transform-origin:center;animation:cp-ring 7s ease-in-out infinite}
.cp-illustration .cp-destination{animation:cp-destination 7s ease-in-out infinite}
.cp-illustration .cp-wave path{transform-box:fill-box;transform-origin:center;animation:cp-wave 3.6s ease-in-out infinite}
.cp-illustration .cp-wave path:nth-child(2n){animation-delay:-.6s}.cp-illustration .cp-wave path:nth-child(3n){animation-delay:-1.4s}
.cp-illustration .cp-text-lines path{transform-box:fill-box;transform-origin:left;animation:cp-write 8s ease-in-out infinite}
.cp-illustration .cp-text-lines path:nth-child(2){animation-delay:.35s}.cp-illustration .cp-text-lines path:nth-child(3){animation-delay:.7s}.cp-illustration .cp-text-lines path:nth-child(4){animation-delay:1.05s}
.cp-illustration .cp-badge{fill:var(--cp-paper);stroke:var(--cp-teal)}
.cp-illustration .cp-check{stroke:var(--cp-teal);stroke-dasharray:30;stroke-dashoffset:0;animation:cp-check 8s ease-in-out infinite}
.cp-illustration .cp-route-base{stroke:var(--cp-line);stroke-width:2}
.cp-illustration .cp-route{stroke:var(--cp-blue);stroke-width:2;stroke-dasharray:1;animation:cp-route 9s ease-in-out infinite}
.cp-illustration .cp-map{opacity:.55}.cp-illustration .cp-pin{animation:cp-destination 9s ease-in-out infinite}
.cp-illustration .cp-dots circle{animation:cp-dot 5s ease-in-out infinite}.cp-illustration .cp-dots circle:nth-child(2){animation-delay:.18s}.cp-illustration .cp-dots circle:nth-child(3){animation-delay:.36s}
.cp-illustration[data-paused="true"] *{animation-play-state:paused!important}
@keyframes cp-flow{0%,12%{stroke-dashoffset:1;opacity:0}18%{opacity:1}55%,65%{stroke-dashoffset:0;opacity:1}78%,100%{stroke-dashoffset:0;opacity:0}}
@keyframes cp-ring{0%,5%,15%,100%{transform:rotate(0)}7%,11%{transform:rotate(-7deg)}9%,13%{transform:rotate(7deg)}}
@keyframes cp-destination{0%,42%,80%,100%{opacity:.6}52%,68%{opacity:1}}
@keyframes cp-wave{0%,100%{transform:scaleY(.6)}25%{transform:scaleY(1)}50%{transform:scaleY(.45)}75%{transform:scaleY(.8)}}
@keyframes cp-write{0%,8%{transform:scaleX(.2);opacity:.35}32%,82%{transform:scaleX(1);opacity:1}100%{transform:scaleX(.2);opacity:.35}}
@keyframes cp-check{0%,35%{stroke-dashoffset:30;opacity:.3}52%,90%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:30;opacity:.3}}
@keyframes cp-route{0%,10%{stroke-dashoffset:1}60%,87%{stroke-dashoffset:0}100%{stroke-dashoffset:1}}
@keyframes cp-dot{0%,45%,75%,100%{opacity:.45;transform:translateY(0)}58%{opacity:1;transform:translateY(-2px)}}
@media(min-width:768px){.cp-illustration{min-height:480px}}
@media(max-width:480px){.cp-illustration{min-height:290px;border-radius:22px}}
@media(prefers-reduced-motion:reduce){.cp-illustration *{animation:none!important;transform:none!important}.cp-illustration .cp-flow{display:none}.cp-illustration .cp-route,.cp-illustration .cp-check{stroke-dashoffset:0}}
`;


export type ServiceKind = "telefoni" | "transkribering" | "korjournal" | "support";
type Props = { kind: ServiceKind; dark?: boolean; className?: string };

/** Decorative illustrations: service meaning is provided by the adjacent heading. */
export function ServiceIllustration({ kind, dark = false, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.paused = String(!entry.isIntersecting);
    }, { rootMargin: "80px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} aria-hidden="true" className={`cp-illustration ${dark ? "cp-illustration--dark" : ""} ${className}`}>
      {artwork[kind]}
    </div>
  );
}

const artwork: Record<ServiceKind, ReactNode> = {
  telefoni: (
    <svg viewBox="0 0 420 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <circle className="cp-halo" cx="210" cy="150" r="96"/>
  <g className="cp-structure"><path d="M108 150H170M250 150H278Q290 150 290 138V86H316M250 150H316M250 150H278Q290 150 290 162V214H316"/></g>
  <path className="cp-flow" pathLength={1} d="M108 150H170M250 150H278Q290 150 290 138V86H316"/>
  <rect className="cp-paper" x="62" y="120" width="46" height="60" rx="12"/>
  <g className="cp-ink"><path d="M78 132H92M80 168H90"/><path d="M171 129Q171 116 184 116H236Q249 116 249 129V171Q249 184 236 184H184Q171 184 171 171Z"/></g>
  <g className="cp-accent cp-handset"><path d="M196 133L202 131L209 143L204 147Q209 156 216 159L220 154L232 160L230 167Q214 175 199 154Q192 143 196 133Z"/></g>
  <g className="cp-destination"><circle className="cp-paper" cx="330" cy="86" r="19"/><g className="cp-accent"><circle cx="330" cy="82" r="5"/><path d="M321 95Q321 88 330 88Q339 88 339 95"/></g></g>
  <g className="cp-structure"><circle cx="330" cy="150" r="19"/><circle cx="330" cy="146" r="5"/><path d="M321 159Q321 152 330 152Q339 152 339 159"/><circle cx="330" cy="214" r="19"/><circle cx="330" cy="210" r="5"/><path d="M321 223Q321 216 330 216Q339 216 339 223"/></g>
  <circle className="cp-signal" cx="108" cy="150" r="3"/>
</svg>
  ),
  transkribering: (
    <svg viewBox="0 0 420 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <circle className="cp-halo" cx="210" cy="150" r="96"/>
  <path className="cp-structure" d="M72 150H179M202 150H231"/>
  <g className="cp-wave cp-accent"><path d="M89 140V160"/><path d="M102 129V171"/><path d="M115 111V189"/><path d="M128 125V175"/><path d="M141 136V164"/><path d="M154 119V181"/><path d="M167 138V162"/></g>
  <g className="cp-ink"><path d="M194 144L200 150L194 156"/></g>
  <path className="cp-paper" d="M246 86H300L326 112V207Q326 216 317 216H246Q237 216 237 207V95Q237 86 246 86Z"/>
  <path className="cp-structure" d="M300 86V106Q300 112 306 112H326"/>
  <g className="cp-text-lines cp-ink"><path d="M254 133H293"/><path d="M254 148H308"/><path d="M254 163H302"/><path d="M254 178H283"/></g>
  <g className="cp-confirm"><circle className="cp-badge" cx="318" cy="205" r="17"/><path className="cp-check" d="M311 205L316 210L325 200"/></g>
</svg>
  ),
  korjournal: (
    <svg viewBox="0 0 420 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <circle className="cp-halo" cx="210" cy="150" r="96"/>
  <g className="cp-map cp-structure"><path d="M62 101H146M192 101H360M62 202H121M172 202H360M112 66V122M112 165V234M300 66V126M300 176V234"/></g>
  <path className="cp-route-base" d="M91 173H150Q166 173 166 157V132Q166 116 182 116H247Q264 116 264 132V166Q264 182 280 182H329"/>
  <path className="cp-route" pathLength={1} d="M91 173H150Q166 173 166 157V132Q166 116 182 116H247Q264 116 264 132V166Q264 182 280 182H329"/>
  <circle className="cp-paper" cx="91" cy="173" r="7"/>
  <g className="cp-pin cp-accent"><path className="cp-paper" d="M329 181S345 166 345 155A16 16 0 0 0 313 155C313 166 329 181 329 181Z"/><circle cx="329" cy="155" r="5"/></g>
  <g className="cp-car"><rect className="cp-paper" x="188" y="94" width="48" height="43" rx="12"/><g className="cp-ink"><path d="M198 117L201 108H223L226 117V127H198V117ZM199 117H225M202 127V130M222 127V130"/><path d="M203 122H206M218 122H221"/></g></g>
  <g className="cp-confirm"><rect className="cp-paper" x="171" y="210" width="78" height="28" rx="14"/><path className="cp-check" d="M186 224L190 228L197 220"/><path className="cp-structure" d="M208 224H233"/></g>
</svg>
  ),
  support: (
    <svg viewBox="0 0 420 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <circle className="cp-halo" cx="210" cy="150" r="96"/>
  <g className="cp-headset cp-ink"><path d="M151 152V135A53 53 0 0 1 257 135V152"/><path d="M159 122A46 46 0 0 1 249 122"/><rect className="cp-paper" x="139" y="143" width="25" height="44" rx="11"/><rect className="cp-paper" x="244" y="143" width="25" height="44" rx="11"/><path d="M257 187V195Q257 210 241 210H218"/><rect className="cp-paper" x="201" y="204" width="23" height="12" rx="6"/></g>
  <path className="cp-accent" d="M151 156V174M257 156V174"/>
  <g className="cp-reply"><path className="cp-paper" d="M267 94H315Q325 94 325 104V131Q325 141 315 141H289L277 152V141H267Q257 141 257 131V104Q257 94 267 94Z"/><g className="cp-dots"><circle cx="278" cy="118" r="2.5"/><circle cx="291" cy="118" r="2.5"/><circle cx="304" cy="118" r="2.5"/></g></g>
  <g className="cp-confirm"><circle className="cp-badge" cx="204" cy="153" r="19"/><path className="cp-check" d="M196 153L202 159L213 147"/></g>
</svg>
  ),
};
