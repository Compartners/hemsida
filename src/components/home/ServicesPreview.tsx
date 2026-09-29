import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Car,
  Headphones,
  Phone,
} from "lucide-react";

const solutions = [
  {
    number: "01",
    label: "Växel & företagstelefoni",
    title: "Växel och telefoni, oavsett operatör.",
    text: "Vi väljer växelplattform och operatör efter er verksamhet, inte tvärtom.",
    href: "/tjanster#telefoni",
    icon: Phone,
  },
  {
    number: "02",
    label: "Transkribering",
    title: "Samtal till anteckningar.",
    text: "Samtal skrivs ut automatiskt, så ni slipper anteckna och kan söka i det som sagts.", // GISSNING
    href: "/tjanster#transkribering",
    icon: Bot,
  },
  {
    number: "03",
    label: "Körjournaler",
    title: "Körjournal utan pappersarbete.",
    text: "En elektronisk körjournal sköter rapporteringen åt er, så inget krångel och inga försvunna dokument.",
    href: "/tjanster#korjournal",
    icon: Car,
  },
  {
    number: "04",
    label: "Support",
    title: "En fast kontakt när något strular.",
    text: "Personlig support och löpande förvaltning. Ni ringer en person som redan känner er lösning.",
    href: "/tjanster#support",
    icon: Headphones,
  },
];

const ServicesPreview = () => {
  return (
    <section
      id="tjanster"
      className="bg-[#F4F7FA] py-20 md:py-24 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1240px] px-5 md:px-8">

        {/* Heading */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-20">

          <div>
            <div className="mb-5 flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#7D8794]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0B72FE]" />

              Tjänster
            </div>

            <h2 className="m-0 text-[42px] font-semibold leading-[0.98] tracking-[-0.055em] text-[#171C25] sm:text-[50px] md:text-[60px] lg:text-[68px]">
              Flera tjänster.
              <br />
              En kontakt.
            </h2>
          </div>

          <p className="m-0 max-w-[520px] text-[16px] leading-7 text-[#667181] md:text-[17px] md:leading-8">
              Växel, transkribering, körjournaler och support. Oberoende av operatör.
          </p>

        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-3 md:mt-16 lg:grid-cols-2">
          {solutions.map((solution) => {
            const Icon = solution.icon;

            return (
              <Link
                key={solution.number}
                to={solution.href}
                className="
                  group
                  relative
                  flex
                  min-h-[380px]
                  flex-col
                  overflow-hidden
                  rounded-[24px]
                  border border-[#DFE6EB]
                  bg-white
                  p-7

                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:shadow-[0_24px_60px_rgba(19,31,49,0.08)]

                  md:p-8
                "
              >
                {/* Top */}
                <div className="flex items-center justify-between">
                </div>

                {/* Copy */}
                <div className="mt-12 md:mt-14">
                  <div className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#7D8794]">
                    {solution.label}
                  </div>

                  <h3 className="max-w-[430px] text-[27px] font-semibold leading-[1.08] tracking-[-0.045em] text-[#171C25] md:text-[30px]">
                    {solution.title}
                  </h3>

                  <p className="mt-4 max-w-[500px] leading-7 text-[#667181]">
                    {solution.text}
                  </p>
                </div>

                {/* Link */}
                <div className="mt-auto flex items-center gap-2 pt-8 text-sm font-semibold text-[#171C25]">
                  Utforska lösningen

                  <ArrowRight
                    size={16}
                    strokeWidth={1.8}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>

                {/* Hover glow */}
                <div
                  className="
                    pointer-events-none
                    absolute bottom-[-100px] right-[-90px]
                    h-[240px] w-[240px]
                    rounded-full
                    bg-[#12B4F0]/10
                    blur-[70px]
                    opacity-0

                    transition-opacity
                    duration-500

                    group-hover:opacity-100
                  "
                />
              </Link>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/tjanster"
            className="
              group
              inline-flex
              min-h-[50px]
              items-center
              justify-center
              gap-2

              rounded-full
              bg-[#171C25]
              px-6

              text-sm
              font-semibold
              text-white

              transition-all
              duration-300

              hover:-translate-y-0.5
              hover:bg-[#2D3444]
            "
          >
            Utforska alla tjänster

            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ServicesPreview;