import {
  ArrowRight,
  Check,
  Phone,
} from "lucide-react";

import teamPhoto from "@/assets/team.jpg";

const PersonalSupport = () => {
  const points = [
  "Personlig kontakt",
  "Svar samma dag", // byt till t.ex. "Svar samma dag" om det är sant
  "Löpande förvaltning",
];

  return (
    <section className="overflow-hidden bg-[#F4F7FA] py-20 md:py-24 lg:py-32">
      <div className="mx-auto grid w-full max-w-[1240px] gap-14 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-24">

        {/* Visual */}
        <div className="relative">

          <div
            className="
              relative
              min-h-[430px]
              overflow-hidden
              rounded-[28px]

              bg-gradient-to-br
              from-[#DEE5E8]
              via-[#EDF2F4]
              to-[#DDE6E8]

              md:min-h-[560px]
            "
          >
            {/* Ambient light */}


            {/* Placeholder */}
            <div className="absolute inset-0 grid place-items-center">

              
              <img src={teamPhoto} alt="Compartners team" className="h-full w-full object-cover" />

              <div className="absolute left-[-20%] top-[-10%] h-[330px] w-[330px] rounded-full bg-[#12B4F0]/30 blur-[90px]" />

            <div className="absolute bottom-[-15%] right-[-15%] h-[360px] w-[360px] rounded-full bg-[#2CCEC2]/30 blur-[100px]" />
            </div>
          </div>
                      


          {/* Floating badge */}
          <div
            className="
              absolute
              bottom-4
              right-4

              flex items-center
              gap-3

              rounded-[18px]
              border border-white/80

              bg-white/90

              px-4
              py-3.5

              shadow-[0_20px_50px_rgba(19,31,49,0.12)]

              backdrop-blur-xl

              md:bottom-8
              md:right-[-20px]
              md:px-5
              md:py-4
            "
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#0B72FE]/10 text-[#0B72FE]">
              <Phone
                size={18}
                strokeWidth={1.7}
              />
            </div>

            <div>
              <span className="block text-[11px] text-[#7D8794]">
                Personlig kontakt
              </span>

              <strong className="block text-sm font-semibold text-[#171C25]">
                Hela vägen
              </strong>
            </div>
          </div>

        </div>


        {/* Content */}
        <div className="max-w-[620px]">

          <div className="mb-5 flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#7D8794]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0B72FE]" />

            Mänsklig trygghet
          </div>

          <h2 className="m-0 text-[42px] font-semibold leading-[0.98] tracking-[-0.055em] text-[#171C25] sm:text-[50px] md:text-[60px] lg:text-[68px]">
            En partner som faktiskt
            <br className="hidden sm:block" />
            {" "}
            svarar när du ringer.
          </h2>

          <p className="mt-6 max-w-[570px] text-[16px] leading-7 text-[#667181] md:text-[17px] md:leading-8">
            Bra teknik hjälper inte om supporten försvinner när något går fel.
            Ni får en kontakt som redan känner er verksamhet.
          </p>


          {/* Points */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {points.map((point) => (
              <div
                key={point}
                className="
                  flex
                  items-center
                  gap-2

                  rounded-full
                  border border-[#E3E9EF]

                  bg-white

                  px-3.5
                  py-2

                  text-[12px]
                  font-medium
                  text-[#667181]
                "
              >
                <Check
                  size={14}
                  strokeWidth={2}
                  className="text-[#2CCEC2]"
                />

                {point}
              </div>
            ))}
          </div>


          {/* CTA */}
          <a
            href="#kontakt"
            className="
              group
              mt-8
              inline-flex
              items-center
              gap-2

              text-sm
              font-semibold
              text-[#171C25]
            "
          >
            Prata med oss

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
};

export default PersonalSupport;