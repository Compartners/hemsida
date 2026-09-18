type ValueType = "independent" | "personal" | "simple";

type Value = {
  number: string;
  title: string;
  text: string;
  type: ValueType;
};

const values: Value[] = [
  {
    number: "01",
    title: "Oberoende",
    text: "Vi utgår från vad som passar er verksamhet, inte från en förutbestämd lösning.",
    type: "independent",
  },
  {
    number: "02",
    title: "Personligt",
    text: "En kontakt som lär känna er verksamhet och finns kvar även efter implementationen.",
    type: "personal",
  },
  {
    number: "03",
    title: "Enkelt",
    text: "Vi samlar fler delar i en tydligare helhet och tar ansvar för att det fungerar i praktiken.",
    type: "simple",
  },
];


/* =========================================================
   SIGNAL GRAPHICS
========================================================= */

const SignalGraphic = ({ type }: { type: ValueType }) => {
  if (type === "independent") {
    return (
      <div
        className="
          relative
          h-[88px]
          w-full
          overflow-hidden
          rounded-[18px]
          border border-[#E8EDF1]
          bg-[#F8FAFB]
        "
      >
        {/* Incoming paths */}
        <span className="absolute left-5 top-[22px] h-px w-[78px] bg-[#CCD5DD]" />
        <span className="absolute left-5 top-[43px] h-px w-[78px] bg-[#CCD5DD]" />
        <span className="absolute left-5 top-[64px] h-px w-[78px] bg-[#CCD5DD]" />

        {/* Dots */}
        <span className="absolute left-4 top-[19px] h-[7px] w-[7px] rounded-full border border-[#AAB6C0] bg-white" />
        <span className="absolute left-4 top-[40px] h-[7px] w-[7px] rounded-full border border-[#AAB6C0] bg-white" />
        <span className="absolute left-4 top-[61px] h-[7px] w-[7px] rounded-full border border-[#AAB6C0] bg-white" />

        {/* Selected path */}
        <span
          className="
            absolute
            left-[98px]
            top-[43px]
            h-px
            w-[86px]

            bg-gradient-to-r
            from-[#0B72FE]
            via-[#12B4F0]
            to-[#2CCEC2]
          "
        />

        <span className="absolute left-[94px] top-[39px] h-[9px] w-[9px] rounded-full bg-[#0B72FE] shadow-[0_0_14px_rgba(11,114,254,0.35)]" />

        <span className="absolute left-[180px] top-[39px] h-[9px] w-[9px] rounded-full bg-[#2CCEC2] shadow-[0_0_14px_rgba(44,206,194,0.35)]" />

        {/* Fade */}
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[#F8FAFB] to-transparent" />
      </div>
    );
  }


  if (type === "personal") {
    return (
      <div
        className="
          relative
          h-[88px]
          w-full
          overflow-hidden
          rounded-[18px]
          border border-[#E8EDF1]
          bg-[#F8FAFB]
        "
      >
        {/* Connection */}
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-px
            w-[110px]
            -translate-x-1/2
            -translate-y-1/2

            bg-gradient-to-r
            from-[#0B72FE]
            via-[#12B4F0]
            to-[#2CCEC2]
          "
        />

        {/* Person 1 */}
        <div
          className="
            absolute
            left-[calc(50%-70px)]
            top-1/2
            grid
            h-11
            w-11
            -translate-x-1/2
            -translate-y-1/2
            place-items-center

            rounded-full
            border border-[#C9D5DF]
            bg-white
          "
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[#0B72FE]" />
        </div>

        {/* Person 2 */}
        <div
          className="
            absolute
            left-[calc(50%+70px)]
            top-1/2
            grid
            h-11
            w-11
            -translate-x-1/2
            -translate-y-1/2
            place-items-center

            rounded-full
            border border-[#C9D5DF]
            bg-white
          "
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[#2CCEC2]" />
        </div>

        {/* Signal point */}
        <span className="absolute left-1/2 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#12B4F0] shadow-[0_0_14px_rgba(18,180,240,0.5)]" />

        {/* subtle rings */}
        <span className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#12B4F0]/15" />
      </div>
    );
  }


  return (
    <div
      className="
        relative
        h-[88px]
        w-full
        overflow-hidden
        rounded-[18px]
        border border-[#E8EDF1]
        bg-[#F8FAFB]
      "
    >
      {/* Inputs */}
      <span className="absolute left-5 top-[20px] h-px w-[74px] bg-[#C9D3DB]" />
      <span className="absolute left-5 top-[43px] h-px w-[74px] bg-[#C9D3DB]" />
      <span className="absolute left-5 top-[66px] h-px w-[74px] bg-[#C9D3DB]" />

      <span className="absolute left-4 top-[17px] h-[7px] w-[7px] rounded-full bg-[#C3CDD5]" />
      <span className="absolute left-4 top-[40px] h-[7px] w-[7px] rounded-full bg-[#C3CDD5]" />
      <span className="absolute left-4 top-[63px] h-[7px] w-[7px] rounded-full bg-[#C3CDD5]" />

      {/* Merge */}
      <div className="absolute left-[92px] top-[20px] h-[47px] w-[36px] rounded-r-[18px] border-b border-r border-t border-[#CBD5DD]" />

      {/* Single output */}
      <span
        className="
          absolute
          left-[128px]
          top-[43px]
          h-px
          w-[78px]

          bg-gradient-to-r
          from-[#0B72FE]
          via-[#12B4F0]
          to-[#2CCEC2]
        "
      />

      <span className="absolute left-[202px] top-[39px] h-[9px] w-[9px] rounded-full bg-[#2CCEC2] shadow-[0_0_14px_rgba(44,206,194,0.4)]" />

      <div className="absolute right-0 top-0 h-full w-14 bg-gradient-to-l from-[#F8FAFB] to-transparent" />
    </div>
  );
};


/* =========================================================
   SECTION
========================================================= */

const WhyCompartners = () => {
  return (
    <section
      id="varfor"
      className="bg-white py-20 md:py-24 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1240px] px-5 md:px-8">

        {/* Heading */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-20">
          <div>
            <div className="mb-5 flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#7D8794]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0B72FE]" />

              Varför Compartners
            </div>

            <h2 className="m-0 text-[42px] font-semibold leading-[0.98] tracking-[-0.055em] text-[#171C25] sm:text-[50px] md:text-[60px] lg:text-[68px]">
              En partner för 
              <br />
              er kommunikation.
            </h2>
          </div>

          <p className="m-0 max-w-[520px] text-[16px] leading-7 text-[#667181] md:text-[17px] md:leading-8">
            Teknik ska göra vardagen enklare. Därför börjar vi inte
            i produkten — vi börjar i er verksamhet, era behov och
            hur ni faktiskt arbetar.
          </p>
        </div>


        {/* Values */}
        <div className="mt-14 grid gap-3 md:mt-16 lg:grid-cols-3">
          {values.map((value) => (
            <article
              key={value.number}
              className="
                group
                relative
                overflow-hidden

                rounded-[24px]
                border border-[#E3E9EF]
                bg-white

                p-5

                transition-all
                duration-300

                hover:-translate-y-1
                hover:border-[#D4DEE6]
                hover:shadow-[0_24px_60px_rgba(19,31,49,0.08)]

                md:p-6
              "
            >
              {/* Header */}
              <div className="mb-6 flex items-center justify-between px-1">
                <span className="font-mono text-[10px] text-[#68717a]">
                  {value.number}
                </span>

                <span className="h-[4px] w-[4px] rounded-full bg-[#2CCEC2] opacity-50 transition-opacity duration-300 group-hover:opacity-100" />
              </div>


              {/* Graphic */}


              {/* Copy */}
              <div className="px-1 pb-2 pt-8">
                <h3 className="mb-3 text-[26px] font-semibold tracking-[-0.04em] text-[#171C25]">
                  {value.title}
                </h3>

                <p className="m-0 max-w-[360px] leading-7 text-[#667181]">
                  {value.text}
                </p>
              </div>


              {/* Hover line */}
              <div
                className="
                  absolute
                  bottom-0
                  left-6
                  right-6
                  h-px

                  origin-left
                  scale-x-0

                  bg-gradient-to-r
                  from-[#0B72FE]
                  via-[#12B4F0]
                  to-[#2CCEC2]

                  transition-transform
                  duration-500

                  group-hover:scale-x-100
                "
              />
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyCompartners;