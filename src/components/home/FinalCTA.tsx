import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section
      id="kontakt"
      className="relative overflow-hidden bg-[#050607] py-24 text-center text-white md:py-28 lg:py-36"
    >
      {/* Bottom glow */}
      <div className="pointer-events-none absolute bottom-[-330px] left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(18,180,240,0.22),transparent_66%)]" />

      {/* Tiny signal accents */}
      <div className="pointer-events-none absolute left-[8%] top-[24%] hidden h-px w-[160px] bg-gradient-to-r from-transparent via-[#12B4F0]/30 to-transparent lg:block" />

      <div className="pointer-events-none absolute bottom-[22%] right-[8%] hidden h-px w-[180px] bg-gradient-to-r from-transparent via-[#2CCEC2]/25 to-transparent lg:block" />

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-5 md:px-8">
        <div className="mx-auto max-w-[900px]">
          <div className="mb-5 flex items-center justify-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2CCEC2]" />
            Nästa steg
          </div>

          <h2 className="m-0 text-[42px] font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-[52px] md:text-[64px] lg:text-[74px]">
            Osäker på vilken lösning
            <br className="hidden sm:block" />
            {" "}
            ni faktiskt behöver?
          </h2>

          <p className="mx-auto mt-6 max-w-[620px] text-[16px] leading-7 text-white/55 md:text-[17px] md:leading-8">
            Börja med ett samtal. Vi går igenom nuläget,
            era behov och ser vad som går att förenkla.
          </p>

          <a
            href="mailto:info@compartners.se"
            className="
              group
              mt-8
              inline-flex
              min-h-[52px]
              items-center
              justify-center
              gap-2.5

              rounded-full

              bg-gradient-to-r
              from-[#0B72FE]
              via-[#12B4F0]
              to-[#2CCEC2]

              px-6

              text-sm
              font-semibold
              text-white

              shadow-[0_18px_46px_rgba(11,114,254,0.24)]

              transition-all
              duration-300

              hover:-translate-y-0.5
              hover:shadow-[0_22px_58px_rgba(11,114,254,0.34)]
            "
          >
            Prata med Compartners

            <ArrowRight
              size={17}
              strokeWidth={1.8}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </section>
  );
}