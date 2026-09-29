import { Link } from "react-router-dom";
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

  <div className="relative mx-auto grid w-full max-w-[1240px] gap-16 px-5 md:px-8 lg:grid-cols-[1fr_0.58fr] lg:items-center">
    {/* Copy */}
    <div className="max-w-[870px]">
      <div className="mb-6 flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">
        <span className="h-1.5 w-1.5 rounded-full bg-[#2CCEC2]" />
        Tjänster
      </div>

      <h1 className="m-0 text-[52px] font-semibold leading-[0.94] tracking-[-0.065em] sm:text-[64px] md:text-[78px] lg:text-[88px]">
        Växel, transkribering
        <br />
        och körjournaler.
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
          Prata med oss

          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </a>
      </div>

      <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 pt-6">
        {[
          "Operatörsoberoende",
          "Flera växelplattformar",
          "Fast kontaktperson",
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

    {/* Visual */}
    <div className="relative hidden min-h-[430px] lg:block">
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
            Operatörsoberoende
          </span>

          <p className="mt-3 max-w-[300px] text-[26px] font-semibold leading-[1.12] tracking-[-0.04em] text-white">
            Vi väljer lösning efter er verksamhet, inte efter operatör.
          </p>
        </div>
      </div>

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
          Fast kontaktperson
        </span>
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

            {/* Visual */}
            <div className="relative min-h-[460px] overflow-hidden rounded-[28px] bg-[#F4F7FA] md:min-h-[560px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(11,114,254,0.10),transparent_35%)]" />

              <div className="absolute left-[25%] top-[37%] w-px h-[7%] bg-gradient-to-r from-[#0B72FE] to-[#12B4F0]" />
              <div className="absolute left-[70%] top-[55%] w-px h-[15%] bg-gradient-to-r from-[#0B72FE] to-[#12B4F0]" />

              <div className="absolute left-[12%] top-[20%] rounded-[18px] border border-[#E3E9EF] bg-white p-5 shadow-[0_20px_60px_rgba(19,31,49,0.08)]">
                <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#8A96A3]">
                  Inkommande
                </span>

                <div className="mt-3 flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#2CCEC2]" />
                  <span className="text-sm font-semibold text-[#171C25]">
                    Kundsamtal
                  </span>
                </div>
              </div>

              <div className="absolute left-[25%] top-[44%] h-px w-[35%] bg-gradient-to-r from-[#0B72FE] to-[#12B4F0]" />
              <div className="absolute left-[70%] top-[70%] h-px w-[2%] bg-gradient-to-r from-[#0B72FE] to-[#12B4F0]" />

              <div className="absolute left-[57%] top-[38%] grid h-24 w-24 place-items-center rounded-[24px] border border-[#DDE6EC] bg-white shadow-[0_20px_60px_rgba(19,31,49,0.08)]">
                <Phone
                  size={28}
                  strokeWidth={1.5}
                  className="text-[#0B72FE]"
                />
              </div>

              <div className="absolute bottom-[17%] right-[9%] rounded-[18px] border border-[#E3E9EF] bg-white p-5 shadow-[0_20px_60px_rgba(19,31,49,0.08)]">
                <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#8A96A3]">
                  Rätt person
                </span>

                <p className="mt-2 text-sm font-semibold text-[#171C25]">
                  Säljteam
                </p>
              </div>
            </div>
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
            {/* Visual */}
            <div className="relative min-h-[430px] overflow-hidden rounded-[28px] border border-white/10 bg-[#080D15] md:min-h-[520px]">
              <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#12B4F0]/10 blur-[100px]" />

              <span className="absolute left-[12%] top-[23%] rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 font-mono text-[10px] tracking-[0.1em] text-white/55">
                SAMTAL
              </span>

              <div className="absolute left-[23%] top-[35%] h-px w-[27%] bg-gradient-to-r from-[#0B72FE] to-[#12B4F0]/30" />

              <div className="absolute left-1/2 top-1/2 flex h-[58px] -translate-x-1/2 -translate-y-1/2 items-end gap-2">
                <span className="h-[18px] w-[10px] rounded-full bg-[#0B72FE]" />
                <span className="h-[36px] w-[10px] rounded-full bg-[#12B4F0]" />
                <span className="h-[56px] w-[10px] rounded-full bg-[#2CCEC2]" />
              </div>

              <div className="absolute left-[55%] top-[56%] h-px w-[23%] bg-gradient-to-r from-[#12B4F0] to-[#2CCEC2]/30" />

              <span className="absolute bottom-[19%] right-[9%] rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 font-mono text-[10px] tracking-[0.1em] text-white/55">
                TEXT
              </span>
            </div>

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

            {/* Visual */}
            <div className="relative min-h-[460px] overflow-hidden rounded-[28px] bg-white md:min-h-[560px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(44,206,194,0.12),transparent_32%)]" />

              <div className="absolute left-[13%] top-[20%] grid h-20 w-20 place-items-center rounded-[22px] border border-[#E3E9EF] bg-white shadow-[0_20px_60px_rgba(19,31,49,0.08)]">
                <Car
                  size={25}
                  strokeWidth={1.6}
                  className="text-[#0B72FE]"
                />
              </div>

              <div className="absolute left-[28%] top-[35%] h-px w-[42%] bg-gradient-to-r from-[#0B72FE] via-[#12B4F0] to-[#2CCEC2]" />

              <div className="absolute right-[12%] top-[28%] rounded-[18px] border border-[#E3E9EF] bg-[#F8FAFB] px-5 py-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#8A96A3]">
                  Körjournal
                </span>

                <p className="mt-2 text-sm font-semibold text-[#171C25]">
                  Automatiskt
                </p>
              </div>

              <div className="absolute bottom-[17%] left-[20%] right-[20%] rounded-[20px] border border-[#E3E9EF] bg-white p-5 shadow-[0_20px_60px_rgba(19,31,49,0.06)]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#171C25]">
                    Arbetsdagen
                  </span>

                  <span className="h-2 w-2 rounded-full bg-[#2CCEC2]" />
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#E9EEF2]">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[#0B72FE] to-[#2CCEC2]" />
                </div>
              </div>
            </div>
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
            {/* Visual */}
            <div className="relative min-h-[460px] overflow-hidden rounded-[28px] bg-[#171C25] md:min-h-[560px]">
              <div className="absolute left-[-100px] top-[-80px] h-[350px] w-[350px] rounded-full bg-[#0B72FE]/15 blur-[100px]" />
              <div className="absolute bottom-[-100px] right-[-100px] h-[350px] w-[350px] rounded-full bg-[#2CCEC2]/10 blur-[100px]" />

              <div className="absolute left-[12%] right-[12%] top-[18%] rounded-[24px] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-white/10">
                    <Headphones
                      size={20}
                      strokeWidth={1.7}
                      className="text-[#2CCEC2]"
                    />
                  </div>

                  <div>
                    <span className="block text-xs text-white/40">
                      Compartners
                    </span>

                    <strong className="block text-sm font-semibold text-white">
                      Personlig support
                    </strong>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-[19%] left-[12%] right-[12%]">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">
                  En kontakt
                </span>

                <p className="mt-3 max-w-[360px] text-[26px] font-semibold leading-[1.1] tracking-[-0.04em] text-white">
                  Någon som redan känner er verksamhet.
                </p>
              </div>
            </div>

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