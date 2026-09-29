const steps = [
  {
    number: "01",
    title: "Kartlägg",
    text: "Vi går igenom nuläget: människorna, systemen och vad som skaver.",
  },
  {
    number: "02",
    title: "Förenkla",
    text: "Vi väljer rätt lösningar och samlar dem i en helhet som är enkel att använda.",
  },
  {
    number: "03",
    title: "Förstärk",
    text: "Vi bygger vidare med automation och AI där det sparar tid eller minskar manuellt arbete.",
  },
];

export default function MethodSection() {
  return (
    <section className="relative overflow-hidden bg-[#050607] py-20 text-white md:py-24 lg:py-32">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-[-180px] top-[20%] h-[520px] w-[520px] rounded-full bg-[#12B4F0]/10 blur-[130px]" />

      <div className="relative mx-auto grid w-full max-w-[1240px] gap-16 px-5 md:px-8 lg:grid-cols-2 lg:gap-24">
        {/* Left */}
        <div>
          <div className="mb-5 flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2CCEC2]" />
            Vårt sätt att arbeta
          </div>

          <h2 className="m-0 text-[48px] font-semibold leading-[0.94] tracking-[-0.06em] sm:text-[58px] md:text-[72px] lg:text-[88px]">
            Koppla ihop.
            <br />
            Förenkla.
            <br />

            <span className="bg-gradient-to-r from-[#0B72FE] via-[#12B4F0] to-[#2CCEC2] bg-clip-text text-transparent">
              Förstärk.
            </span>
          </h2>
        </div>

        {/* Right */}
        <div className="border-t border-white/10">
          {steps.map((step) => (
            <article
              key={step.number}
              className="grid gap-4 border-b border-white/10 py-6 sm:grid-cols-[42px_140px_1fr] sm:gap-5 md:py-7"
            >
              <span className="font-mono text-[10px] text-white/45">
                {step.number}
              </span>

              <h3 className="m-0 text-[17px] font-medium tracking-[-0.02em] text-white">
                {step.title}
              </h3>

              <p className="m-0 text-sm leading-6 text-white/70 sm:col-auto col-span-full">
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}