import { ArrowUpRight } from "lucide-react";

const cases = [
  {
    category: "FÖRETAGSTELEFONI",
    title: "En enklare vardag börjar med rätt lösning.",
    text: "Här lyfter vi ett riktigt kundcase med fokus på vad som blev enklare för verksamheten.",
  },
  {
    category: "SUPPORT",
    title: "Personlig hjälp när den faktiskt behövs.",
    text: "Ett framtida case kring snabb återkoppling, personlig kontakt och löpande support.",
  },
  {
    category: "SMART TEKNOLOGI",
    title: "Teknik som frigör tid i vardagen.",
    text: "Här kan vi visa hur AI, automation eller smartare kommunikation skapar konkret affärsnytta.",
  },
];

export default function CustomerCases() {
  return (
    <section
      id="kundcase"
      className="bg-white py-20 md:py-24 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1240px] px-5 md:px-8">
        {/* Heading */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-20">
          <div>
            <div className="mb-5 flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#7D8794]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0B72FE]" />
              Kundcase
            </div>

            <h2 className="m-0 text-[42px] font-semibold leading-[0.98] tracking-[-0.055em] text-[#171C25] sm:text-[50px] md:text-[60px] lg:text-[68px]">
              Teknik är bara värdefull
              <br className="hidden sm:block" />
              {" "}
              när den fungerar i vardagen.
            </h2>
          </div>

          <p className="m-0 max-w-[520px] text-[16px] leading-7 text-[#667181] md:text-[17px] md:leading-8">
            Våra case ska inte handla om teknik för teknikens skull.
            De ska visa vad som faktiskt blev enklare, tydligare eller bättre
            för kunden.
          </p>
        </div>

        {/* Cases */}
        <div className="mt-14 grid gap-3 md:mt-16 lg:grid-cols-3">
          {cases.map((item, index) => (
            <article
              key={item.title}
              className="
                group
                relative
                flex
                min-h-[380px]
                flex-col
                overflow-hidden
                rounded-[24px]
                border border-[#E3E9EF]
                bg-[#F4F7FA]
                p-7

                transition-all
                duration-300

                hover:-translate-y-1
                hover:border-[#D4DEE6]
                hover:shadow-[0_24px_60px_rgba(19,31,49,0.08)]

                md:p-8
              "
            >
              {/* Top */}
              <div className="flex items-center justify-between text-[#7D8794]">
                <span className="font-mono text-[10px]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <ArrowUpRight
                  size={18}
                  strokeWidth={1.6}
                  className="transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#171C25]"
                />
              </div>

              {/* Content */}
              <div className="mt-auto pt-16">
                <div className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.13em] text-[#0B72FE]">
                  {item.category}
                </div>

                <h3 className="mb-3 text-[25px] font-semibold leading-[1.1] tracking-[-0.04em] text-[#171C25]">
                  {item.title}
                </h3>

                <p className="m-0 leading-7 text-[#667181]">
                  {item.text}
                </p>
              </div>

              {/* Glow */}
              <div className="pointer-events-none absolute bottom-[-90px] right-[-90px] h-[230px] w-[230px] rounded-full bg-[#12B4F0]/10 opacity-0 blur-[70px] transition-opacity duration-500 group-hover:opacity-100" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}