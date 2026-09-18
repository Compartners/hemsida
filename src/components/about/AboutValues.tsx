const values = [
  {
    number: "01",
    title: "Koppla ihop",
    text: "Vi börjar med att förstå människor, arbetssätt, system och behov.",
  },
  {
    number: "02",
    title: "Förenkla",
    text: "Vi minskar onödig komplexitet och samlar det som hör ihop.",
  },
  {
    number: "03",
    title: "Förstärk",
    text: "När grunden fungerar använder vi teknik, data och AI för att skapa mer effekt.",
  },
];

export default function AboutValues() {
  return (
    <section className="relative overflow-hidden bg-[#F4F7FA] py-20 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1240px] px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-24">
          <div>
            <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#7D8794]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0B72FE]" />

              Vårt sätt att tänka
            </div>

            <h2 className="text-[42px] font-semibold leading-[0.98] tracking-[-0.055em] text-[#171C25] sm:text-[52px] md:text-[64px]">
              En enkel princip
              <br />
              genom hela resan.
            </h2>
          </div>

          <p className="max-w-[520px] text-[16px] leading-8 text-[#667181]">
            Vi försöker inte börja med den mest avancerade lösningen.
            Vi börjar med det som behöver fungera bättre.
          </p>
        </div>

        <div className="mt-14 grid gap-3 md:mt-16 lg:grid-cols-3">
          {values.map((value) => (
            <article
              key={value.number}
              className="
                group relative min-h-[310px] overflow-hidden
                rounded-[24px] border border-[#DFE6EB] bg-white p-7
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-[0_24px_60px_rgba(19,31,49,0.08)]
              "
            >
              <span className="font-mono text-[10px] text-[#8A96A3]">
                {value.number}
              </span>

              {/* signal */}
              <div className="absolute right-7 top-7 flex items-end gap-1">
                <span className="h-2 w-1 rounded-full bg-[#0B72FE]/25" />
                <span className="h-4 w-1 rounded-full bg-[#12B4F0]/40" />
                <span className="h-6 w-1 rounded-full bg-[#2CCEC2]/60" />
              </div>

              <div className="mt-24">
                <h3 className="text-[27px] font-semibold tracking-[-0.045em] text-[#171C25]">
                  {value.title}
                </h3>

                <p className="mt-4 max-w-[350px] leading-7 text-[#667181]">
                  {value.text}
                </p>
              </div>

              <div
                className="
                  absolute bottom-0 left-7 right-7 h-px origin-left scale-x-0
                  bg-gradient-to-r from-[#0B72FE] via-[#12B4F0] to-[#2CCEC2]
                  transition-transform duration-500 group-hover:scale-x-100
                "
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}