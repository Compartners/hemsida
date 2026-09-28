import { Mail, Phone } from "lucide-react";

import hovdingen from "../../assets/hovdingen.png";


export default function AboutTeam() {
  return (
    <section className="bg-white py-20 md:py-24 lg:py-32">
      <div className="mx-auto grid w-full max-w-[1240px] gap-14 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-24">
        {/* Image */}
        <div className="relative min-h-[480px] overflow-hidden rounded-[28px] bg-[#E8EDF0] md:min-h-[620px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(11,114,254,0.10),transparent_35%)]" />

          <div className="absolute inset-0 grid place-items-center">
  <img
    src={hovdingen}
    alt="Hovdingen"
    className="h-full w-full object-contain"
  />
</div>

          <div className="absolute bottom-5 left-5 right-5 rounded-[20px] border border-white/60 bg-white/85 p-5 shadow-lg backdrop-blur-xl md:bottom-7 md:left-7 md:right-auto md:max-w-[310px]">
            <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-[#8A96A3]">
              Människorna bakom
            </span>

            <p className="mt-2 text-sm font-semibold leading-6 text-[#171C25]">
              Personliga relationer börjar med riktiga människor.
            </p>
          </div>
        </div>

        {/* Copy */}
        <div>
          <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#7D8794]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0B72FE]" />

            Människorna bakom
          </div>

          <h2 className="text-[42px] font-semibold leading-[0.98] tracking-[-0.055em] text-[#171C25] sm:text-[50px] md:text-[60px] lg:text-[68px]">
            Teknik är en del av jobbet.
            <br />
            Relationer är resten.
          </h2>

          <p className="mt-6 max-w-[570px] text-[16px] leading-8 text-[#667181]">
            Vi vill att det ska vara tydligt vem du pratar med och enkelt
            att få hjälp. Därför bygger vi relationer som fortsätter långt
            efter att en lösning har installerats.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="tel:0102102700"
              className="inline-flex items-center gap-2 rounded-full border border-[#E3E9EF] bg-[#F8FAFB] px-4 py-2.5 text-sm font-medium text-[#171C25]"
            >
              <Phone size={15} className="text-[#0B72FE]" />
              010-210 27 00
            </a>

            <a
              href="mailto:info@compartners.se"
              className="inline-flex items-center gap-2 rounded-full border border-[#E3E9EF] bg-[#F8FAFB] px-4 py-2.5 text-sm font-medium text-[#171C25]"
            >
              <Mail size={15} className="text-[#0B72FE]" />
              info@compartners.se
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}