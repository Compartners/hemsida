import { ArrowDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[#111724] pb-24 pt-40 text-white md:pb-28 md:pt-48 lg:pb-36">
      {/* Soft background */}
      <div className="pointer-events-none absolute right-[-180px] top-[-140px] h-[620px] w-[620px] rounded-full bg-[#0B72FE]/12 blur-[170px]" />

      <div className="pointer-events-none absolute bottom-[-300px] left-[20%] h-[560px] w-[760px] rounded-full bg-[#2CCEC2]/8 blur-[180px]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_38%,rgba(255,255,255,0.035),transparent_27%)]" />

      <div className="relative mx-auto grid w-full max-w-[1240px] gap-16 px-5 md:px-8 lg:grid-cols-[1fr_0.58fr] lg:items-center">
        {/* Copy */}
        <div className="max-w-[870px]">
          <div className="mb-6 flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2CCEC2]" />

            Om Compartners
          </div>

          <h1 className="text-[52px] font-semibold leading-[0.94] tracking-[-0.065em] sm:text-[64px] md:text-[78px] lg:text-[88px]">
            Teknik blir enklare
            <br />
            när någon tar ansvar.
          </h1>

          <p className="mt-7 max-w-[690px] text-[17px] leading-8 text-white/58 md:text-[19px]">
            Vi hjälper företag att få telefoni, smart teknik och support
            att fungera som en sammanhängande del av verksamheten —
            inte som ännu fler system att hantera.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#var-historia"
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
              Lär känna oss

              <ArrowDown
                size={16}
                className="transition-transform group-hover:translate-y-1"
              />
            </a>

            <Link
              to="/tjanster"
              className="
                group inline-flex min-h-[52px] items-center justify-center gap-2
                rounded-full
                border border-white/15
                bg-white/[0.05]
                px-6
                text-sm font-medium text-white
                backdrop-blur-xl
                transition
                hover:bg-white/[0.09]
              "
            >
              Våra tjänster

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Principles */}
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 pt-6">
            {[
              "Oberoende",
              "Personligt",
              "Enkelt",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-xs text-white/40"
              >
                <span className="h-1 w-1 rounded-full bg-[#2CCEC2]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Human / relationship visual */}
        <div className="relative hidden min-h-[430px] lg:block">
          {/* Main soft panel */}
          <div
            className="
              absolute inset-x-[5%] top-[7%] bottom-[5%]
              overflow-hidden
              rounded-[32px]
              border border-white/10
              bg-white/[0.035]
              backdrop-blur-sm
            "
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_30%,rgba(44,206,194,0.12),transparent_38%)]" />

            <div className="absolute bottom-8 left-8 right-8">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/25">
                Människor före system
              </span>

              <p className="mt-3 max-w-[300px] text-[26px] font-semibold leading-[1.12] tracking-[-0.04em] text-white">
                En partner som lär känna verksamheten.
              </p>
            </div>
          </div>

          {/* Floating tag */}
          <div
            className="
              absolute right-[-2%] top-[19%]
              rounded-[18px]
              border border-white/10
              bg-white/[0.07]
              px-5 py-4
              shadow-[0_20px_60px_rgba(0,0,0,0.18)]
              backdrop-blur-xl
            "
          >
            <span className="block font-mono text-[9px] uppercase tracking-[0.13em] text-white/30">
              Vårt sätt
            </span>

            <span className="mt-2 block text-sm font-semibold text-white/80">
              Personligt ansvar
            </span>
          </div>

          {/* Connection detail */}

        </div>
      </div>
    </section>
  );
}