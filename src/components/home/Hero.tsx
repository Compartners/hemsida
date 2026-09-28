import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

import heroVideo from "@/assets/fog_video.mp4";
import fogBild from "@/assets/fog_bild.png";
/*import winterVideo from "@/assets/winter_video.mp4";*/

const Hero = () => {
  const [videoReady, setVideoReady] = useState(false);

  return (
    <section className="relative flex min-h-[760px] h-[100vh] max-h-[1020px] items-center overflow-hidden bg-[#050607] text-white">

      {/* =====================================================
          BACKGROUND VIDEO
      ===================================================== */}

      <div className="absolute inset-0 bg-[#050607]">
  {/* Stillbild visas direkt */}
  <img
    src={fogBild}
    alt=""
    aria-hidden="true"
    fetchPriority="high"
    className="
      absolute inset-0
      h-full w-full
      object-cover object-center
      saturate-[0.9] contrast-[0.95]
    "
  />

  {/* Video tonar in när den faktiskt spelar */}
  <video
    className={`
      absolute inset-0
      h-full w-full
      object-cover object-center
      saturate-[0.9] contrast-[0.95]
      transition-opacity duration-1000
      ${videoReady ? "opacity-100" : "opacity-0"}
    `}
    autoPlay
    muted
    loop
    playsInline
    preload="auto"
    poster={fogBild}
    aria-hidden="true"
    onPlaying={() => setVideoReady(true)}
  >
    <source
      src={heroVideo}
      type="video/mp4"
    />
  </video>
</div>


      {/* =====================================================
          DARK OVERLAY
      ===================================================== */}

      <div
        className="
          absolute inset-0
          bg-[linear-gradient(50deg,rgba(3,6,10,0.84)_0%,rgba(3,6,10,0.62)_32%,rgba(3,6,10,0.42)_62%,rgba(3,6,10,0.20)_100%)]
        "
      />

      <div
        className="
          absolute inset-0
          bg-[linear-gradient(180deg,rgba(3,6,10,0.12)_0%,rgba(3,6,10,0.05)_55%,rgba(3,6,10,0.38)_100%)]
        "
      />


      {/* =====================================================
          SUBTLE GRID
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute inset-0
          opacity-[0.09]

          [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)]
          [background-size:72px_72px]

          [mask-image:linear-gradient(90deg,black_0%,rgba(0,0,0,0.65)_45%,transparent_82%)]
        "
      />


      {/* =====================================================
          SIGNAL ROUTES
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute right-[-140px] top-[31%]
          hidden
          h-[160px] w-[520px]
          rounded-r-full
          border border-l-0 border-[#12B4F0]/20
          lg:block
        "
      />

      <div
        className="
          pointer-events-none
          absolute right-[-80px] top-[49%]
          hidden
          h-[260px] w-[390px]
          rounded-r-full
          border border-l-0 border-[#2CCEC2]/15
          lg:block
        "
      />


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-5 pt-16 md:px-8 lg:pt-20">

        <div className="max-w-[900px]">

          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2CCEC2] shadow-[0_0_12px_rgba(44,206,194,0.7)]" />

            Operatörsoberoende företagskommunikation
          </div>


          {/* Heading */}
          <h1
            className="
              max-w-[950px]
              text-[52px]
              font-semi-bold
              leading-[0.94]
              tracking-[-0.065em]

              sm:text-[64px]
              md:text-[76px]
              lg:text-[96px]
            "
          >
            Kommunikation som
            <br />

            <span className="font-semi-bold text-white/90">
              skapar klarhet.
            </span>
          </h1>


          {/* Description */}
          <p
            className="
              mt-7
              max-w-[670px]
              text-[16px]
              leading-7
              text-white/80

              md:text-[18px]
              md:leading-8
            "
          >
            Telefoni, smarta AI-lösningar och personlig support —
            samlat hos en partner som utgår från hur er verksamhet
            faktiskt arbetar.
          </p>


          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <a
              href="#kontakt"
              className="
                group
                inline-flex
                min-h-[52px]
                items-center
                justify-center
                gap-2.5

                rounded-full

                bg-gradient-to-r
                from-[#0B72FE]
                via-[#12B4F0]
                to-[#2CCEC2]

                px-6

                text-sm
                font-semibold
                text-white

                shadow-[0_18px_46px_rgba(11,114,254,0.24)]

                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:shadow-[0_22px_58px_rgba(11,114,254,0.34)]
              "
            >
              Boka rådgivning

              <ArrowRight
                size={17}
                strokeWidth={1.8}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>


            <Link
              to="/tjanster"
              className="
                inline-flex
                min-h-[52px]
                items-center
                justify-center

                rounded-full

                border border-white/20

                bg-white/[0.06]

                px-6

                text-sm
                font-medium
                text-white

                backdrop-blur-xl

                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:border-white/35
                hover:bg-white/[0.10]
              "
            >
              Se våra tjänster
            </Link>

          </div>


          {/* Proof */}
          <div
            className="
              mt-9
              flex
              flex-col
              gap-3

              text-[13px]
              text-white/55

              sm:flex-row
              sm:flex-wrap
              sm:gap-7
            "
          >
            <div className="flex items-center gap-2">
              <Check
                size={15}
                strokeWidth={2}
                className="text-[#2CCEC2]"
              />

              Operatörsoberoende
            </div>

            <div className="flex items-center gap-2">
              <Check
                size={15}
                strokeWidth={2}
                className="text-[#2CCEC2]"
              />

              Personlig kontakt
            </div>

            <div className="flex items-center gap-2">
              <Check
                size={15}
                strokeWidth={2}
                className="text-[#2CCEC2]"
              />

              Företagsanpassat
            </div>
          </div>

        </div>
      </div>


      {/* =====================================================
          BRAND STATEMENT
      ===================================================== */}

      <div
        className="
          absolute
          bottom-8
          right-8
          z-10

          hidden

          items-center
          gap-3

          font-mono
          text-[9px]
          uppercase
          tracking-[0.15em]
          text-white/30

          xl:flex
        "
      >
        <span>Nordisk minimalism</span>

        <span className="h-px w-6 bg-white/15" />

        <span>Mänsklig trygghet</span>

        <span className="h-px w-6 bg-white/15" />

        <span>Smart teknologi</span>
      </div>


      {/* =====================================================
          BOTTOM FADE
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          h-24
          w-full
          bg-gradient-to-t
          from-black/30
          to-transparent
        "
      />

    </section>
  );
};

export default Hero;