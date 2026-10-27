import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const solutions = [
  {
    title: "Växel & företagstelefoni",
    text: "Vi väljer växelplattform och operatör efter er verksamhet, oavsett telefonoperatör.",
    href: "/tjanster#telefoni",
    visual: "phone",
    accent: "#0B72FE",
  },
  {
    title: "Transkribering",
    text: "Samtal till anteckningar. Samtal skrivs ut automatiskt, så ni slipper anteckna och kan söka i det som sagts.",
    href: "/tjanster#transkribering",
    visual: "transcript",
    accent: "#148C96",
  },
  {
    title: "Körjournaler",
    text: "En elektronisk körjournal sköter rapporteringen åt er, så inget krångel och inga försvunna dokument.",
    href: "/tjanster#korjournal",
    visual: "route",
    accent: "#536CC8",
  },
  {
    title: "Support",
    text: "Personlig support och löpande förvaltning. Ni ringer en person som redan känner er lösning.",
    href: "/tjanster#support",
    visual: "support",
    accent: "#168878",
  },
] as const;

type Visual = (typeof solutions)[number]["visual"];
type AccentStyle = CSSProperties & { "--service-accent": string };

// Dekorativa linjeillustrationer. Inga bildfiler eller extra beroenden.
function ServiceIllustration({ kind }: { kind: Visual }) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="-mr-[10px] -mt-3 h-[105px] w-[175px] max-w-[65%] text-[color:var(--service-accent)] transition-transform duration-[450ms] ease-[ease] min-[641px]:h-[120px] min-[641px]:w-[200px] [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-y-[3px] motion-reduce:transform-none motion-reduce:transition-none"
    >
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {kind === "phone" && (
          <>
            <path  d="M43 77C20 41 70 14 125 24s71 53 26 68" strokeDasharray="2 7" opacity=".22" />
            <rect x="68" y="21" width="52" height="79" rx="14" fill="rgba(255,255,255,0.62)" />
            <path d="M86 29h16M89 91h10" opacity=".35" />
            <path  d="m82 45 6-3 6 10-5 4c3 6 5 8 11 11l4-5 10 6-3 6c-2 5-12 1-19-6S77 47 82 45Z" />
            <g className="transition-opacity duration-500 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-50 motion-reduce:transition-none">
              <path d="M130 44c7 5 7 15 0 20" opacity=".6" />
              <path d="M140 35c13 10 13 28 0 38" opacity=".3" />
            </g>
            <circle cx="47" cy="76" r="5" fill="currentColor" stroke="white" strokeWidth="3" />
          </>
        )}
        {kind === "transcript" && (
          <>
            <rect x="94" y="19" width="61" height="83" rx="12" fill="rgba(255,255,255,0.62)" />
            <path className="[stroke-dasharray:40] [stroke-dashoffset:0] transition-[stroke-dashoffset] duration-700 [@media(hover:hover)_and_(pointer:fine)]:group-hover:[stroke-dashoffset:-40] motion-reduce:transition-none" d="M108 39h30" />
            <path className="[stroke-dasharray:40] [stroke-dashoffset:0] transition-[stroke-dashoffset] duration-700 delay-[120ms] [@media(hover:hover)_and_(pointer:fine)]:group-hover:[stroke-dashoffset:-40] motion-reduce:transition-none" d="M108 51h30" opacity=".55" />
            <path className="[stroke-dasharray:40] [stroke-dashoffset:0] transition-[stroke-dashoffset] duration-700 delay-[240ms] [@media(hover:hover)_and_(pointer:fine)]:group-hover:[stroke-dashoffset:-40] motion-reduce:transition-none" d="M108 63h20" opacity=".35" />
            <path className="transition-opacity duration-500 delay-[360ms] [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-60 motion-reduce:transition-none" d="m110 81 5 5 12-12" />
            <rect x="34" y="43" width="74" height="38" rx="19" fill="rgba(255,255,255,0.62)" />
            {[45, 54, 63, 72, 81, 90, 99].map((x, i) => (
              <path key={x} className="origin-center [transform-box:fill-box] transition-transform duration-[650ms] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-y-[0.4] motion-reduce:transform-none motion-reduce:transition-none" d={`M${x} ${62 - [4, 9, 6, 12, 7, 9, 3][i]}v${[8, 18, 12, 24, 14, 18, 6][i]}`} />
            ))}
          </>
        )}
        {kind === "route" && (
          <>
            <path d="M42 91h116M42 101h116" opacity=".09" />
            <path className="transition-[stroke-dashoffset] duration-[1800ms] ease-linear [@media(hover:hover)_and_(pointer:fine)]:group-hover:[stroke-dashoffset:-36] motion-reduce:transition-none" d="M46 81V53c0-9 7-16 16-16h18c9 0 16 7 16 16v13c0 9 7 16 16 16h21c10 0 18-8 18-18V43" strokeDasharray="3 6" opacity=".6" />
            <circle cx="46" cy="81" r="6" fill="rgba(255,255,255,0.62)" />
            <path  d="M163 34c0 10-12 21-12 21s-12-11-12-21a12 12 0 0 1 24 0Z" fill="rgba(255,255,255,0.62)" />
            <circle cx="151" cy="34" r="4" />
            <g className="transition-transform duration-500 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none">
              <path d="m67 70 5-12h25l7 12 5 4v13H62V74l5-4Z" fill="rgba(255,255,255,0.62)" />
              <path d="M69 71h32M78 59l-2 12M92 59l4 12M69 79h5m23 0h5" opacity=".55" />
              <path d="M69 87v5m33-5v5" strokeWidth="4" />
            </g>
          </>
        )}
        {kind === "support" && (
          <>
            <circle  cx="91" cy="59" r="40" strokeDasharray="2 7" opacity=".2" />
            <path d="M66 63V53a25 25 0 0 1 50 0v10" strokeWidth="2" />
            <rect x="60" y="53" width="13" height="26" rx="6" fill="rgba(255,255,255,0.62)" />
            <rect x="109" y="53" width="13" height="26" rx="6" fill="rgba(255,255,255,0.62)" />
            <path  d="M116 79v3c0 7-6 12-13 12H93" />
            <rect x="84" y="90" width="16" height="7" rx="3.5" fill="currentColor" stroke="none" />
            <g className="transition-transform duration-500 [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none">
              <path d="M130 25h24a8 8 0 0 1 8 8v12a8 8 0 0 1-8 8h-16l-9 7v-8a8 8 0 0 1-7-8V33a8 8 0 0 1 8-8Z" fill="rgba(255,255,255,0.62)" />
              <path d="m133 39 5 5 11-11" />
            </g>
          </>
        )}
      </g>
    </svg>
  );
}

export default function ServicesPreview() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    const elements = Array.from(section.querySelectorAll<HTMLElement>("[data-sp-reveal]"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("opacity-0", "translate-y-[2px]");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.58 });
    // Redan synligt innehåll förblir synligt. Endast kommande innehåll tonas in.
    elements.forEach((element) => {
      if (element.getBoundingClientRect().top >= window.innerHeight) {
        element.classList.add("opacity-0", "translate-y-[2px]");
        observer.observe(element);
      }
    });
    const showAll = () => {
      if (preference.matches) {
        observer.disconnect();
        elements.forEach((element) => element.classList.remove("opacity-0", "translate-y-[2px]"));
      }
    };
    preference.addEventListener("change", showAll);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", showAll);
      elements.forEach((element) => element.classList.remove("opacity-0", "translate-y-[22px]"));
    };
  }, []);

  const revealClasses = "transition-[opacity,transform] duration-700 ease-[cubic-bezier(.2,.65,.3,1)] motion-reduce:!opacity-100 motion-reduce:!transform-none motion-reduce:transition-none";

  return (
    <section
      ref={sectionRef}
      id="tjanster"
      aria-labelledby="services-preview-title"
className="bg-white text-[#171C25]"    >
      <div className="relative isolate m-5 min-h-max overflow-x-clip rounded-lg bg-gray-100/50 p-8">

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bg-black inset-0 -z-10 opacity-0 bg-[radial-gradient(ellipse_at_6%_46%,#50b7fa30,transparent_44%),radial-gradient(ellipse_at_94%_55%,#8d9dec2b,transparent_43%),radial-gradient(ellipse_at_53%_95%,#57d8c829,transparent_45%)]"
      >
        <div className="absolute left-[8%] top-[31%] size-[420px] rounded-full bg-[radial-gradient(circle,#70c9f538,transparent_70%)] blur-[54px]" />
        <div className="absolute bottom-[3%] right-[4%] size-[420px] rounded-full bg-[radial-gradient(circle,#69d9c938,transparent_70%)] blur-[54px]" />
      </div>

      <div className="mx-auto w-full max-w-[1240px] px-5 min-[641px]:px-8">
        <div data-sp-reveal className={revealClasses}>
          <h2 id="services-preview-title" className="m-0 text-[clamp(42px,5.3vw,68px)] font-semibold leading-[1.04] tracking-[-0.055em]">
            Flera tjänster.<br /><span className="text-black">En kontakt.</span>
          </h2>
          <p className="mb-0 mt-4 text-base leading-7">
            Smarta lösningar för arbetsdagen. Med människor bakom som känner er verksamhet.
          </p>
        </div>

        <div className="mt-[30px] grid grid-cols-1 gap-[14px] min-[641px]:mt-11 min-[641px]:grid-cols-2 min-[641px]:gap-[18px]">
          {solutions.map((solution) => (
            <div className={revealClasses}>
              <Link
                to={solution.href}
                className="group relative isolate flex h-full min-h-[300px] flex-col overflow-hidden rounded-[28px] border border-[#ffffffb8] bg-[linear-gradient(145deg,#ffffff80_0%,#ffffff40_48%,#ffffff55_100%)] px-6 pb-[25px] pt-[23px] text-inherit no-underline shadow-[0_12px_32px_-16px_#324c6a29,0_2px_6px_#324c6a06,inset_0_1px_0_#fffffff2,inset_1px_0_0_#ffffff9c,inset_-1px_0_0_#ffffff40,inset_0_-1px_0_#ffffff8c] backdrop-blur-[24px] backdrop-saturate-[145%] transition-[transform,border-color,box-shadow] duration-[350ms] ease-[ease] min-[641px]:min-h-[310px] min-[641px]:px-8 min-[641px]:pb-[30px] min-[641px]:pt-7 lg:min-h-[332px] [@supports_not_((backdrop-filter:blur(1px))_or_(-webkit-backdrop-filter:blur(1px)))]:bg-[linear-gradient(145deg,#fffffff2,#edf4faf2)] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1 [@media(hover:hover)_and_(pointer:fine)]:hover:border-[#fffffff2] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_22px_46px_-20px_#324c6a38,0_4px_12px_#324c6a08,inset_0_1px_0_#fff,inset_1px_0_0_#ffffffbf,inset_-1px_0_0_#ffffff66,inset_0_-1px_0_#ffffffb3] focus-visible:outline-3 focus-visible:outline-offset-[5px] focus-visible:outline-[#0B72FE] motion-reduce:transform-none motion-reduce:transition-none"
                style={{ "--service-accent": solution.accent } as AccentStyle}
                onPointerMove={(event) => {
                  if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
                  const card = event.currentTarget;
                  const bounds = card.getBoundingClientRect();
                  card.style.setProperty("--glass-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
                  card.style.setProperty("--glass-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
                }}
                onPointerLeave={(event) => {
                  event.currentTarget.style.removeProperty("--glass-x");
                  event.currentTarget.style.removeProperty("--glass-y");
                }}
              >
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_var(--glass-x,75%)_var(--glass-y,12%),#ffffffc7_0%,#ffffff24_34%,transparent_65%),radial-gradient(ellipse_at_100%_0%,var(--service-accent),transparent_62%)] opacity-15 transition-opacity duration-[350ms] [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-25 group-focus-visible:opacity-25 motion-reduce:transition-none" />
                <span aria-hidden="true" className="pointer-events-none absolute -inset-x-[70%] -inset-y-full -z-10 -translate-x-[65%] bg-[linear-gradient(110deg,transparent_45%,#ffffff70_50%,transparent_55%)] transition-transform duration-[950ms] ease-[ease] [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-[65%] motion-reduce:transition-none motion-reduce:opacity-0" />
                <span aria-hidden="true" className="pointer-events-none absolute inset-[5px] -z-10 rounded-[23px] border border-[#ffffff38] bg-[linear-gradient(155deg,#ffffff42,transparent_34%,transparent_72%,#ffffff1a)] shadow-[inset_0_1px_10px_#ffffff2b]" />

                <div className="mb-3 flex h-24 items-start justify-between min-[641px]:h-28">
                  <span className="pt-2 font-mono text-[11px] tracking-[0.08em] text-[#7E8998]" aria-hidden="true"></span>
                  <ServiceIllustration kind={solution.visual} />
                </div>
                <h3 className="m-0 text-[clamp(24px,2.5vw,29px)] font-semibold leading-[1.15] tracking-[-0.04em]">{solution.title}</h3>
                <p className="mb-6 mt-[13px] max-w-[440px] text-[15px] leading-[1.8] text-[#556070]">{solution.text}</p>
                <div className="mt-auto flex items-center justify-between gap-5 border-t border-[#ffffffa6] pt-5 text-[13px] font-semibold">
                  <span>Utforska lösningen</span>
                  <span className="grid size-[30px] shrink-0 place-items-center rounded-full border border-[#ffffffb8] bg-[#ffffff4d] shadow-[inset_0_1px_0_#ffffffe6,0_2px_6px_#324c6a08] transition-[color,background-color,border-color,transform] duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:-rotate-[35deg] [@media(hover:hover)_and_(pointer:fine)]:group-hover:border-[var(--service-accent)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:bg-[var(--service-accent)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-white motion-reduce:transform-none motion-reduce:transition-none">
                    <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div data-sp-reveal className={`mt-8 flex justify-center ${revealClasses}`}>
          <Link to="/tjanster" className="inline-flex min-h-[50px] items-center justify-center gap-4 rounded-full bg-[#171C25] px-6 text-[13px] font-semibold text-white no-underline transition-[background-color,transform] duration-[250ms] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#2D3A4B] focus-visible:outline-3 focus-visible:outline-offset-[5px] focus-visible:outline-[#0B72FE] motion-reduce:transform-none motion-reduce:transition-none">
            Utforska alla tjänster<ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
      </div>
    </section>
  );
}
