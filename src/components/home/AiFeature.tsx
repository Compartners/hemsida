import { Check } from "lucide-react";

const features = [
  "Fånga viktig information",
  "Minska manuell administration",
  "Skapa tydligare nästa steg",
];

export default function AiFeature() {
  return (
    <section className="relative overflow-hidden bg-[#111724] py-20 text-white md:py-24 lg:py-32">

      {/* Ambient background */}
      <div className="pointer-events-none absolute left-[-180px] top-[-120px] h-[520px] w-[520px] rounded-full bg-[#0B72FE]/10 blur-[140px]" />

      <div className="pointer-events-none absolute bottom-[-220px] right-[-150px] h-[600px] w-[600px] rounded-full bg-[#2CCEC2]/10 blur-[160px]" />

      <div className="relative mx-auto w-full max-w-[760px] px-5 text-center md:px-8">

        {/* Title */}
        <h2
          className="
            m-0

            text-[42px]
            font-semibold
            leading-[0.98]
            tracking-[-0.055em]

            text-white

            sm:text-[50px]
            md:text-[60px]
            lg:text-[68px]
          "
        >
          När kommunikationen börjar arbeta för er.
        </h2>

        {/* Description */}
        <p
          className="
            mx-auto
            mt-6
            max-w-[560px]

            text-[16px]
            leading-7

            text-white/55

            md:text-[17px]
            md:leading-8
          "
        >
          AI behöver inte kännas futuristiskt. Rätt använd kan den
          sammanfatta, strukturera och automatisera delar av vardagen —
          utan att ta bort den mänskliga kontakten.
        </p>

        {/* Features */}
        <div className="mx-auto mt-8 grid max-w-[420px] gap-3.5 text-left">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 text-sm text-white/70"
            >
              <div
                className="
                  grid
                  h-6
                  w-6
                  shrink-0
                  place-items-center

                  rounded-full

                  border border-[#2CCEC2]/20

                  bg-[#2CCEC2]/10
                "
              >
                <Check
                  size={13}
                  strokeWidth={2}
                  className="text-[#2CCEC2]"
                />
              </div>

              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Small supporting line */}
        <div
          className="
            mx-auto
            mt-10
            flex
            w-fit
            items-center
            gap-3

            font-mono
            text-[9px]
            uppercase
            tracking-[0.12em]

            text-white/25
          "
        >
          <span
            className="
              h-px
              w-10

              bg-gradient-to-r
              from-[#0B72FE]
              to-[#2CCEC2]
            "
          />

          Effekt före funktion
        </div>

      </div>
    </section>
  );
}