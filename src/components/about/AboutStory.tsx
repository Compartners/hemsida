export default function AboutStory() {
  return (
    <section
      id="var-historia"
      className="bg-white py-20 md:py-24 lg:py-32"
    >
      <div className="mx-auto grid w-full max-w-[1240px] gap-14 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        {/* Left */}
        <div>
          <div className="mb-5 flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#7D8794]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0B72FE]" />

            Vilka vi är
          </div>

          <p className="max-w-[340px] text-[15px] leading-7 text-[#7D8794]">
            Oberoende rådgivning, personlig relation och teknik som ska
            fungera i vardagen.
          </p>
        </div>

        {/* Right */}
        <div>
          <h2 className="max-w-[790px] text-[40px] font-semibold leading-[1.02] tracking-[-0.055em] text-[#171C25] sm:text-[48px] md:text-[58px]">
            Vi tror inte att fler system automatiskt betyder en smartare
            verksamhet.
          </h2>

          <div className="mt-10 grid gap-8 border-t border-[#E3E9EF] pt-8 md:grid-cols-2">
            <p className="m-0 text-[16px] leading-8 text-[#667181]">
              Vår roll är att förstå verksamheten först. Därefter kan vi
              hjälpa till att välja, koppla ihop och utveckla lösningar
              som faktiskt skapar värde.
            </p>

            <p className="m-0 text-[16px] leading-8 text-[#667181]">
              Det gäller oavsett om behovet handlar om företagstelefoni,
              AI, mobilitet eller att helt enkelt få bättre hjälp när
              något behöver förändras.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}