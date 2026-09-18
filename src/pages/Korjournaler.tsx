"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Calculator,
  Car,
  CheckCircle2,
  ChevronDown,
  FileText,
  Navigation,
  Route,
  ShieldCheck,
  Smartphone,
  Users,
  Zap,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import SEO from "@/components/SEO";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Contact from "@/components/Contact";
import BrandSignalBars from "@/components/SignalBars";

const BENEFITS = [
  {
    icon: FileText,
    title: "Slipp manuella körjournaler",
    description:
      "Resorna registreras automatiskt när bilen används. Föraren behöver inte komma ihåg starttid, mätarställning eller körsträcka.",
  },
  {
    icon: ShieldCheck,
    title: "Ordning på underlagen",
    description:
      "Samla resor, adresser, tider, sträckor och syften på ett ställe så att administration och uppföljning blir enklare.",
  },
  {
    icon: Users,
    title: "Fungerar för hela fordonsflottan",
    description:
      "Hantera flera fordon och förare i samma system och få en gemensam överblick utan separata körjournaler.",
  },
];

const FEATURES = [
  {
    icon: Car,
    title: "Automatisk GPS-loggning",
    description:
      "När bilen börjar rulla registreras resan automatiskt. Föraren behöver inte starta någon separat loggning.",
  },
  {
    icon: Smartphone,
    title: "Privat eller tjänst i appen",
    description:
      "Klassificera resan direkt i mobilen och komplettera vid behov med syfte, kund eller projektnummer.",
  },
  {
    icon: FileText,
    title: "Färdiga rapporter",
    description:
      "Sammanställ körjournaler och exportera underlag när ekonomi, löneadministration eller revision behöver dem.",
  },
  {
    icon: Route,
    title: "Resehistorik",
    description:
      "Se tidigare körningar med start, stopp, körsträcka och tidsangivelser samlade på ett och samma ställe.",
  },
  {
    icon: Users,
    title: "Flera förare",
    description:
      "Låt flera medarbetare använda samma fordon och koppla respektive resa till rätt förare.",
  },
  {
    icon: ShieldCheck,
    title: "Privata resor skyddas",
    description:
      "Separera privata resor från tjänsteresor och hantera positionsinformation med hänsyn till medarbetarnas integritet.",
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Bilen börjar rulla",
    description:
      "Enheten registrerar resan automatiskt utan att föraren behöver öppna en app eller starta en körjournal.",
  },
  {
    number: "02",
    title: "Resan loggas",
    description:
      "Tid, position, körsträcka och annan relevant information samlas in medan bilen används.",
  },
  {
    number: "03",
    title: "Resan klassificeras",
    description:
      "Föraren markerar vid behov om körningen var privat eller i tjänsten och kompletterar med syfte.",
  },
  {
    number: "04",
    title: "Underlaget är samlat",
    description:
      "Administration och ekonomi kan ta fram historik och rapporter utan att samla in manuella anteckningar.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Uppfyller körjournalen Skatteverkets krav?",
    a: "Systemet registrerar de uppgifter som normalt behövs i en elektronisk körjournal, såsom datum, tider, start- och slutadress, körsträcka och resans syfte. Ni får ett samlat underlag som kan användas för dokumentation och uppföljning.",
  },
  {
    q: "Fungerar enheten i olika bilmodeller och elbilar?",
    a: "Lösningen kan användas i ett brett urval av moderna personbilar, elbilar, hybrider och transportbilar. Vi hjälper er att säkerställa vilken installation som passar fordonen i er vagnpark.",
  },
  {
    q: "Hur skiljer jag på privata resor och tjänsteresor?",
    a: "Resorna kan klassificeras i mobilappen. Det går även att arbeta med regler och arbetstider beroende på vilken lösning och konfiguration ni använder.",
  },
  {
    q: "Kan flera medarbetare dela på samma fordon?",
    a: "Ja. Lösningen kan hantera fordon som används av flera personer så att resorna kan kopplas till rätt förare.",
  },
];

export default function Korjournaler() {
  const pageRef = useRef<HTMLDivElement>(null);

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [carCount, setCarCount] = useState(5);

  const savedHoursPerMonth = carCount * 2.5;
  const savedSekPerYear = carCount * 2.5 * 12 * 450;

  /* ================================================================
     GSAP
  ================================================================= */
  useEffect(() => {
    if (!pageRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      /* Hero */
      gsap.from("[data-hero-reveal]", {
        opacity: 0,
        y: 28,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
      });

      /* Långsam dekorativ rörelse på signalstaplarna */
      gsap.to("[data-signal-drift='hero']", {
        y: 24,
        x: -30,
        rotate: 0.8,
        duration: 7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to("[data-signal-drift='section']", {
        y: -0,
        x: 0,
        duration: 8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      /* Generella section reveals */
      gsap.utils
        .toArray<HTMLElement>("[data-reveal]")
        .forEach((element) => {
          gsap.from(element, {
            opacity: 0,
            y: 30,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
              once: true,
            },
          });
        });

      /* Stagger containers */
      gsap.utils
        .toArray<HTMLElement>("[data-stagger]")
        .forEach((container) => {
          const children = Array.from(container.children);

          gsap.from(children, {
            opacity: 0,
            y: 24,
            duration: 0.65,
            stagger: 0.09,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              start: "top 84%",
              once: true,
            },
          });
        });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary"
    >
      <SEO
        title="Elektronisk körjournal för företag | Compartners"
        description="Automatisk elektronisk körjournal som registrerar företagets resor och förenklar administration, rapportering och uppföljning."
        canonical="https://compartners.se/korjournaler"
      />

      <Navbar />

      <main>
        {/* =========================================================
            1. HERO
        ========================================================== */}
        <section
          className="
            relative
            overflow-hidden
            border-b
            border-border/40
            bg-gradient-to-b
            from-muted
            via-muted/50
            to-background
            pb-20
            pt-32
            md:pb-28
            md:pt-44
          "
        >
          {/* =====================================================
              BRAND SIGNAL
              Endast dekorativ bakgrund.
          ====================================================== */}
          <div
            data-signal-drift="hero"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >

          </div>

          {/* Fade framför signalmotivet */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-r
              from-background/70
              via-background/30
              to-transparent
              md:from-background/45
              md:via-background/15
            "
          />

          {/* Mjuk glow */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-1/2
              top-0
              h-[420px]
              w-[900px]
              -translate-x-1/2
              rounded-full
              bg-primary/5
              blur-[150px]
            "
          />

          <div className="container relative z-10 mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-4xl text-center">
              <div
                data-hero-reveal
                className="mb-6 flex justify-center"
              >
                <span
                  className="
                    rounded-full
                    border
                    border-primary/20
                    bg-background/50
                    px-4
                    py-1.5
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-primary
                    backdrop-blur-sm
                  "
                >
                  Elektronisk körjournal
                </span>
              </div>

              <h1
                data-hero-reveal
                className="
                  font-display
                  text-4xl
                  font-bold
                  leading-[1.08]
                  tracking-tight
                  text-foreground
                  sm:text-5xl
                  md:text-6xl
                  lg:text-7xl
                "
              >
                Körjournalen som sköter{" "}
                <span
                  className="
                    bg-gradient-to-r
                    from-primary
                    via-accent
                    to-primary
                    bg-clip-text
                    text-transparent
                  "
                >
                  jobbet automatiskt.
                </span>
              </h1>

              <p
                data-hero-reveal
                className="
                  mx-auto
                  mt-7
                  max-w-2xl
                  text-base
                  leading-relaxed
                  text-muted-foreground
                  sm:text-lg
                "
              >
                Företagets resor registreras medan bilen används. Ni får
                körsträckor, tider och underlag samlade digitalt – utan
                handskrivna körjournaler och efterhandsarbete.
              </p>

              <div
                data-hero-reveal
                className="
                  mt-9
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-3
                  sm:flex-row
                "
              >
                <a
                  href="#kontakt"
                  className="
                    inline-flex
                    h-12
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-primary
                    px-6
                    text-sm
                    font-semibold
                    text-primary-foreground
                    transition-opacity
                    hover:opacity-90
                  "
                >
                  Prata med oss om körjournal
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="#sa-fungerar-det"
                  className="
                    inline-flex
                    h-12
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-border
                    bg-background/70
                    px-6
                    text-sm
                    font-semibold
                    text-foreground
                    backdrop-blur-sm
                    transition-colors
                    hover:bg-muted
                  "
                >
                  Se hur det fungerar
                </a>
              </div>

              <div
                data-hero-reveal
                className="
                  mt-9
                  flex
                  flex-wrap
                  justify-center
                  gap-x-6
                  gap-y-3
                  text-xs
                  text-muted-foreground
                  sm:text-sm
                "
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Automatisk registrering
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Privat & tjänst
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Färdiga underlag
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            2. VARFÖR ELEKTRONISK KÖRJOURNAL?
        ========================================================== */}
        <section
          className="
            relative
            overflow-hidden
            bg-background
            py-20
            md:py-28
          "
        >
          {/* Väldigt subtilt signalmotiv i vänster kant */}
          <div
            data-signal-drift="section"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <BrandSignalBars
              size="md"
              align="left"
              glow={false}
              className="
                opacity-[0.045]
                md:opacity-[0.27]
              "
              barsClassName="
                -translate-x-[65%]
                translate-y-[18%]
                scale-[1.25]
                md:-translate-x-[52%]
                md:scale-[1.5]
              "
            />
          </div>

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-r
              from-transparent
              via-background/75
              to-background
            "
          />

          <div className="container relative z-10 mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div
                data-reveal
                className="lg:col-span-5"
              >
                <span
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-primary
                  "
                >
                  Från manuellt till automatiskt
                </span>

                <h2
                  className="
                    mt-4
                    font-display
                    text-3xl
                    font-bold
                    tracking-tight
                    text-foreground
                    md:text-4xl
                  "
                >
                  Körjournalen ska dokumentera resan. Inte skapa mer arbete.
                </h2>

                <p
                  className="
                    mt-6
                    text-base
                    leading-relaxed
                    text-muted-foreground
                  "
                >
                  En traditionell körjournal bygger på att föraren kommer ihåg
                  att anteckna varje resa och att informationen sedan samlas in
                  och kontrolleras.
                </p>

                <p
                  className="
                    mt-4
                    text-base
                    leading-relaxed
                    text-muted-foreground
                  "
                >
                  Med automatisk registrering skapas underlaget medan bilen
                  används. Föraren kompletterar bara det som faktiskt behöver
                  kompletteras.
                </p>
              </div>

              <div
                data-stagger
                className="
                  grid
                  gap-4
                  sm:grid-cols-3
                  lg:col-span-7
                  lg:grid-cols-1
                "
              >
                {BENEFITS.map((benefit) => {
                  const Icon = benefit.icon;

                  return (
                    <div
                      key={benefit.title}
                      className="
                        group
                        rounded-2xl
                        border
                        border-border/70
                        bg-card
                        p-6
                        transition-colors
                        hover:border-primary/30
                      "
                    >
                      <div
                        className="
                          flex
                          flex-col
                          gap-4
                          lg:flex-row
                          lg:items-start
                        "
                      >
                        <div
                          className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-primary/20
                            bg-primary/10
                            text-primary
                          "
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div>
                          <h3
                            className="
                              font-display
                              text-base
                              font-bold
                              text-foreground
                            "
                          >
                            {benefit.title}
                          </h3>

                          <p
                            className="
                              mt-2
                              text-sm
                              leading-relaxed
                              text-muted-foreground
                            "
                          >
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            3. AUTOMATISK RESA / PRODUKTVISUALISERING

            INGA BRANDSTAPLAR HÄR.
            Sektionen innehåller redan faktisk rese-/datavisualisering.
        ========================================================== */}
        <section
          id="sa-fungerar-det"
          className="
            scroll-mt-24
            border-y
            border-border/40
            bg-muted/20
            py-20
            md:py-28
          "
        >
          <div className="container mx-auto max-w-5xl px-6">
            <div
              data-reveal
              className="
                mx-auto
                mb-12
                max-w-2xl
                text-center
              "
            >
              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-primary
                "
              >
                Automatisk registrering
              </span>

              <h2
                className="
                  mt-4
                  font-display
                  text-3xl
                  font-bold
                  tracking-tight
                  text-foreground
                  md:text-4xl
                "
              >
                Resan registreras medan bilen används.
              </h2>

              <p
                className="
                  mt-5
                  text-sm
                  leading-relaxed
                  text-muted-foreground
                  sm:text-base
                "
              >
                Systemet samlar informationen löpande och skapar en resa som
                sedan kan kompletteras och klassificeras.
              </p>
            </div>

            <div
              data-reveal
              className="
                rounded-3xl
                border
                border-border/80
                bg-card/90
                p-6
                shadow-2xl
                shadow-primary/5
                backdrop-blur-xl
                md:p-10
              "
            >
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-4
                  border-b
                  border-border/60
                  pb-6
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      rounded-xl
                      border
                      border-primary/20
                      bg-primary/10
                      p-2.5
                      text-primary
                    "
                  >
                    <Navigation className="h-5 w-5" />
                  </div>

                  <div>
                    <div
                      className="
                        text-sm
                        font-bold
                        text-foreground
                      "
                    >
                      Senaste registrerade resa
                    </div>

                    <div
                      className="
                        text-xs
                        text-muted-foreground
                      "
                    >
                      Idag 08:42 · Volvo XC60 (ABC 123)
                    </div>
                  </div>
                </div>

                <span
                  className="
                    rounded-full
                    border
                    border-emerald-500/20
                    bg-emerald-500/10
                    px-3
                    py-1
                    text-xs
                    font-bold
                    text-emerald-500
                  "
                >
                  Tjänsteresa
                </span>
              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  items-center
                  gap-8
                  py-8
                  md:grid-cols-12
                "
              >
                <div className="space-y-6 md:col-span-7">
                  <div className="flex items-start gap-4">
                    <div
                      className="
                        mt-1
                        flex
                        flex-col
                        items-center
                      "
                    >
                      <span
                        className="
                          h-3
                          w-3
                          rounded-full
                          bg-primary
                          ring-4
                          ring-primary/20
                        "
                      />

                      <span
                        className="
                          h-12
                          w-0.5
                          bg-gradient-to-b
                          from-primary
                          to-accent
                        "
                      />

                      <span
                        className="
                          h-3
                          w-3
                          rounded-full
                          bg-accent
                          ring-4
                          ring-accent/20
                        "
                      />
                    </div>

                    <div
                      className="
                        flex-1
                        space-y-6
                        text-xs
                        md:text-sm
                      "
                    >
                      <div>
                        <div
                          className="
                            text-xs
                            text-muted-foreground
                          "
                        >
                          Start 08:14 · Mätare: 12 450 km
                        </div>

                        <div
                          className="
                            text-base
                            font-semibold
                            text-foreground
                          "
                        >
                          Huvudkontoret, Storgatan 12
                        </div>
                      </div>

                      <div>
                        <div
                          className="
                            text-xs
                            text-muted-foreground
                          "
                        >
                          Stopp 08:42 · Mätare: 12 478 km
                        </div>

                        <div
                          className="
                            text-base
                            font-semibold
                            text-foreground
                          "
                        >
                          Kundbesök: Tuna Entreprenad
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="
                    space-y-3
                    md:col-span-5
                    md:border-l
                    md:border-border/60
                    md:pl-8
                  "
                >
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div
                      className="
                        rounded-2xl
                        border
                        border-border/50
                        bg-background/70
                        p-3.5
                      "
                    >
                      <div className="text-xs text-muted-foreground">
                        Total sträcka
                      </div>

                      <div
                        className="
                          mt-0.5
                          font-display
                          text-lg
                          font-bold
                          text-foreground
                          md:text-xl
                        "
                      >
                        28,4 km
                      </div>
                    </div>

                    <div
                      className="
                        rounded-2xl
                        border
                        border-border/50
                        bg-background/70
                        p-3.5
                      "
                    >
                      <div className="text-xs text-muted-foreground">
                        Körtid
                      </div>

                      <div
                        className="
                          mt-0.5
                          font-display
                          text-lg
                          font-bold
                          text-foreground
                          md:text-xl
                        "
                      >
                        28 min
                      </div>
                    </div>
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      border
                      border-primary/20
                      bg-primary/10
                      p-3.5
                      text-xs
                      font-semibold
                      text-primary
                    "
                  >
                    <span>Rapportstatus</span>
                    <span>Redo ✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            4. RESAN FRÅN BIL TILL UNDERLAG
        ========================================================== */}
        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-6">
            <div
              data-reveal
              className="
                mx-auto
                mb-14
                max-w-2xl
                text-center
              "
            >
              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-primary
                "
              >
                Från bil till underlag
              </span>

              <h2
                className="
                  mt-4
                  font-display
                  text-3xl
                  font-bold
                  tracking-tight
                  md:text-4xl
                "
              >
                Fyra steg – utan en handskriven körjournal.
              </h2>
            </div>

            <div
              data-stagger
              className="
                grid
                gap-4
                md:grid-cols-4
              "
            >
              {PROCESS_STEPS.map((item) => (
                <div
                  key={item.number}
                  className="
                    rounded-2xl
                    border
                    border-border/70
                    bg-card
                    p-6
                  "
                >
                  <span
                    className="
                      text-xs
                      font-bold
                      tracking-widest
                      text-primary
                    "
                  >
                    {item.number}
                  </span>

                  <h3
                    className="
                      mt-4
                      font-display
                      text-base
                      font-bold
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-relaxed
                      text-muted-foreground
                    "
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            5. FUNKTIONER
        ========================================================== */}
        {/* =========================================================
    5. FUNKTIONER / BENTO
========================================================== */}
<section
  className="
    relative
    overflow-hidden
    border-y
    border-border/40
    bg-muted/20
    py-20
    md:py-28
  "
>
  {/* =====================================================
      DEKORATIV BRANDGRAFIK
      Endast kontrast / identitet.
  ====================================================== */}
  <div
    data-signal-drift="section"
    aria-hidden="true"
    className="pointer-events-none absolute inset-0"
  >
    <BrandSignalBars
      size="lg"
      align="right"
      glow={false}
      className="
        opacity-[0.035]
        md:opacity-[0.26]
      "
      barsClassName="
        translate-x-[60%]
        translate-y-[30%]
        scale-[1.3]
        md:translate-x-[48%]
        md:scale-[1.6]
      "
    />
  </div>

  {/* Fade så signalmotivet bara känns i kanten */}
  <div
    aria-hidden="true"
    className="
      pointer-events-none
      absolute
      inset-0
      bg-gradient-to-r
      from-muted/20
      via-muted/20
      to-transparent
    "
  />

  <div className="container relative z-10 mx-auto max-w-7xl px-6">
    {/* ===================================================
        RUBRIK
    ==================================================== */}
    <div
      data-reveal
      className="
        mb-12
        grid
        gap-6
        lg:grid-cols-12
        lg:items-end
      "
    >
      <div className="lg:col-span-7">
        <span
          className="
            text-xs
            font-bold
            uppercase
            tracking-[0.18em]
            text-primary
          "
        >
          Funktionerna bakom
        </span>

        <h2
          className="
            mt-4
            max-w-3xl
            font-display
            text-3xl
            font-bold
            tracking-tight
            text-foreground
            md:text-4xl
            lg:text-5xl
          "
        >
          All information om bilen.{" "}
          <span className="text-muted-foreground">
            Utan mer administration.
          </span>
        </h2>
      </div>

      <div className="lg:col-span-5 lg:pl-8">
        <p
          className="
            max-w-lg
            text-sm
            leading-relaxed
            text-muted-foreground
            lg:text-base
          "
        >
          Resorna registreras automatiskt i bakgrunden. Föraren kompletterar
          bara det som behövs, medan administrationen får en samlad bild av
          resor, förare och fordon.
        </p>
      </div>
    </div>

    {/* ===================================================
        BENTO GRID
    ==================================================== */}
    <div
      data-stagger
      className="
        grid
        grid-cols-1
        gap-5
        md:grid-cols-2
        lg:grid-cols-12
      "
    >
      {/* =================================================
          STORT HUVUDKORT
      ================================================== */}
      <div
        className="
          group
          relative
          overflow-hidden
          rounded-3xl
          border
          border-border/70
          bg-card
          p-7
          md:p-8
          lg:col-span-7
          lg:row-span-2
          lg:min-h-[470px]
        "
      >
        {/* subtil glow */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-72
            w-72
            rounded-full
            bg-primary/10
            blur-[100px]
          "
        />

        <div className="relative z-10 flex h-full flex-col">
          <div>
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-primary/20
                bg-primary/10
                text-primary
              "
            >
              <Car className="h-5 w-5" />
            </div>

            <h3
              className="
                mt-5
                max-w-lg
                font-display
                text-2xl
                font-bold
                tracking-tight
                text-foreground
                md:text-3xl
              "
            >
              Resan registreras automatiskt från start till stopp.
            </h3>

            <p
              className="
                mt-4
                max-w-xl
                text-sm
                leading-relaxed
                text-muted-foreground
                md:text-base
              "
            >
              När bilen används skapas körjournalen i bakgrunden. Start,
              destination, körsträcka och tid samlas in utan att föraren
              behöver börja eller avsluta en resa manuellt.
            </p>
          </div>

          {/* Mini interface */}
          <div
            className="
              mt-8
              overflow-hidden
              rounded-2xl
              border
              border-border/60
              bg-background/70
              shadow-sm
              lg:mt-auto
            "
          >
            {/* topbar */}
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                border-b
                border-border/50
                px-4
                py-3
                sm:px-5
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-primary/10
                    text-primary
                  "
                >
                  <Navigation className="h-4 w-4" />
                </div>

                <div>
                  <div
                    className="
                      text-xs
                      font-semibold
                      text-foreground
                    "
                  >
                    Pågående resa
                  </div>

                  <div
                    className="
                      text-[10px]
                      text-muted-foreground
                    "
                  >
                    Volvo XC60 · ABC 123
                  </div>
                </div>
              </div>

              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-emerald-500/10
                  px-2.5
                  py-1
                  text-[10px]
                  font-semibold
                  text-emerald-500
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-emerald-500
                  "
                />
                Registrerar
              </span>
            </div>

            {/* trip content */}
            <div
              className="
                grid
                gap-5
                p-4
                sm:p-5
                md:grid-cols-12
                md:items-center
              "
            >
              <div className="md:col-span-7">
                <div className="flex gap-4">
                  <div
                    className="
                      flex
                      flex-col
                      items-center
                      pt-1
                    "
                  >
                    <span
                      className="
                        h-2.5
                        w-2.5
                        rounded-full
                        bg-primary
                        ring-4
                        ring-primary/10
                      "
                    />

                    <span
                      className="
                        h-10
                        w-px
                        bg-border
                      "
                    />

                    <span
                      className="
                        h-2.5
                        w-2.5
                        rounded-full
                        bg-accent
                        ring-4
                        ring-accent/10
                      "
                    />
                  </div>

                  <div className="flex-1 space-y-5">
                    <div>
                      <div
                        className="
                          text-[10px]
                          uppercase
                          tracking-wider
                          text-muted-foreground
                        "
                      >
                        Start
                      </div>

                      <div
                        className="
                          mt-0.5
                          text-xs
                          font-semibold
                          text-foreground
                        "
                      >
                        Storgatan 12
                      </div>
                    </div>

                    <div>
                      <div
                        className="
                          text-[10px]
                          uppercase
                          tracking-wider
                          text-muted-foreground
                        "
                      >
                        Destination
                      </div>

                      <div
                        className="
                          mt-0.5
                          text-xs
                          font-semibold
                          text-foreground
                        "
                      >
                        Tuna Entreprenad
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="
                  grid
                  grid-cols-2
                  gap-2
                  md:col-span-5
                "
              >
                <div
                  className="
                    rounded-xl
                    border
                    border-border/50
                    bg-card
                    p-3
                  "
                >
                  <div
                    className="
                      text-[10px]
                      text-muted-foreground
                    "
                  >
                    Sträcka
                  </div>

                  <div
                    className="
                      mt-1
                      font-display
                      text-base
                      font-bold
                    "
                  >
                    28,4 km
                  </div>
                </div>

                <div
                  className="
                    rounded-xl
                    border
                    border-border/50
                    bg-card
                    p-3
                  "
                >
                  <div
                    className="
                      text-[10px]
                      text-muted-foreground
                    "
                  >
                    Tid
                  </div>

                  <div
                    className="
                      mt-1
                      font-display
                      text-base
                      font-bold
                    "
                  >
                    28 min
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          APP
      ================================================== */}
      <div
        className="
          group
          rounded-3xl
          border
          border-border/70
          bg-card
          p-7
          transition-colors
          hover:border-primary/30
          lg:col-span-5
        "
      >
        <div
          className="
            flex
            items-start
            gap-4
          "
        >
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-primary/20
              bg-primary/10
              text-primary
            "
          >
            <Smartphone className="h-5 w-5" />
          </div>

          <div>
            <h3
              className="
                font-display
                text-lg
                font-bold
                text-foreground
              "
            >
              Privat eller tjänst?
            </h3>

            <p
              className="
                mt-2
                text-sm
                leading-relaxed
                text-muted-foreground
              "
            >
              Föraren klassificerar resan direkt i mobilen och kan lägga till
              syfte, kund eller projektnummer.
            </p>
          </div>
        </div>

        {/* Mini swipe */}
        <div
          className="
            mt-6
            grid
            grid-cols-2
            gap-2
          "
        >
          <div
            className="
              rounded-xl
              border
              border-border/60
              bg-muted/30
              px-4
              py-3
            "
          >
            <span
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-muted-foreground
              "
            >
              Privat
            </span>
          </div>

          <div
            className="
              rounded-xl
              border
              border-primary/20
              bg-primary/10
              px-4
              py-3
            "
          >
            <span
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-primary
              "
            >
              Tjänst ✓
            </span>
          </div>
        </div>
      </div>

      {/* =================================================
          RAPPORT
      ================================================== */}
      <div
        className="
          group
          rounded-3xl
          border
          border-border/70
          bg-card
          p-7
          transition-colors
          hover:border-primary/30
          lg:col-span-5
        "
      >
        <div
          className="
            flex
            items-start
            gap-4
          "
        >
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-primary/20
              bg-primary/10
              text-primary
            "
          >
            <FileText className="h-5 w-5" />
          </div>

          <div>
            <h3
              className="
                font-display
                text-lg
                font-bold
                text-foreground
              "
            >
              Färdigt när administrationen behöver det.
            </h3>

            <p
              className="
                mt-2
                text-sm
                leading-relaxed
                text-muted-foreground
              "
            >
              Historik och körjournaler finns redan samlade när ekonomi eller
              löneadministration behöver underlaget.
            </p>
          </div>
        </div>

        <div
          className="
            mt-6
            flex
            items-center
            justify-between
            rounded-xl
            border
            border-border/60
            bg-muted/30
            p-4
          "
        >
          <div>
            <div
              className="
                text-[10px]
                uppercase
                tracking-wider
                text-muted-foreground
              "
            >
              Augusti 2026
            </div>

            <div
              className="
                mt-1
                text-xs
                font-semibold
                text-foreground
              "
            >
              Körjournal · 124 resor
            </div>
          </div>

          <span
            className="
              rounded-lg
              bg-primary/10
              px-2.5
              py-1.5
              text-[10px]
              font-semibold
              text-primary
            "
          >
            Klar ✓
          </span>
        </div>
      </div>

      {/* =================================================
          TRE MINDRE FUNKTIONER
      ================================================== */}
      {[
        {
          icon: Route,
          title: "Resehistorik",
          description:
            "Hitta tidigare resor med tider, adresser och körsträckor samlade på samma plats.",
        },
        {
          icon: Users,
          title: "Flera förare",
          description:
            "Koppla resor till rätt medarbetare även när flera personer delar på samma bil.",
        },
        {
          icon: ShieldCheck,
          title: "Privata resor",
          description:
            "Håll privat och tjänst tydligt separerat med hänsyn till förarens integritet.",
        },
      ].map((feature) => {
        const Icon = feature.icon;

        return (
          <div
            key={feature.title}
            className="
              group
              rounded-3xl
              border
              border-border/70
              bg-card
              p-6
              transition-all
              hover:-translate-y-0.5
              hover:border-primary/30
              lg:col-span-4
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-primary/10
                text-primary
              "
            >
              <Icon className="h-5 w-5" />
            </div>

            <h3
              className="
                mt-5
                font-display
                text-base
                font-bold
                text-foreground
              "
            >
              {feature.title}
            </h3>

            <p
              className="
                mt-2
                text-sm
                leading-relaxed
                text-muted-foreground
              "
            >
              {feature.description}
            </p>
          </div>
        );
      })}
    </div>
  </div>
</section>

        {/* =========================================================
            6. TRYGGHET / ADMINISTRATION
        ========================================================== */}
        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-6">
            <div
              data-reveal
              className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-border/70
                bg-card
              "
            >
              {/* Brand signal bakom högersidan */}
              <div
                data-signal-drift="section"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
              >
                <BrandSignalBars
                  size="lg"
                  align="right"
                  className="
                    opacity-[0.12]
                    md:opacity-[0.38]
                  "
                  barsClassName="
                    translate-x-[48%]
                    translate-y-[18%]
                    scale-[1.25]
                    md:translate-x-[30%]
                    md:scale-[1.3]
                  "
                />
              </div>

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  z-[1]
                  bg-gradient-to-r
                  from-card
                  via-card/95
                  to-card/45
                  lg:via-card/85
                  lg:to-transparent
                "
              />

              <div
                className="
                  relative
                  z-10
                  grid
                  lg:grid-cols-2
                "
              >
                <div className="p-8 sm:p-10 md:p-12">
                  <span
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-primary
                    "
                  >
                    Kontroll utan mer administration
                  </span>

                  <h2
                    className="
                      mt-4
                      font-display
                      text-3xl
                      font-bold
                      tracking-tight
                      md:text-4xl
                    "
                  >
                    En körjournal som både förare och administration kan leva
                    med.
                  </h2>

                  <p
                    className="
                      mt-6
                      text-sm
                      leading-relaxed
                      text-muted-foreground
                      sm:text-base
                    "
                  >
                    Föraren ska inte behöva bli administratör för att företaget
                    ska få ordning på sina resor.
                  </p>

                  <p
                    className="
                      mt-4
                      text-sm
                      leading-relaxed
                      text-muted-foreground
                      sm:text-base
                    "
                  >
                    Därför automatiseras det som kan automatiseras och
                    användaren kompletterar bara informationen som kräver en
                    mänsklig bedömning.
                  </p>
                </div>

                <div
                  className="
                    border-t
                    border-border/60
                    bg-muted/20
                    p-8
                    backdrop-blur-[2px]
                    sm:p-10
                    md:p-12
                    lg:border-l
                    lg:border-t-0
                  "
                >
                  <div className="space-y-6">
                    {[
                      {
                        icon: Zap,
                        title: "Automatik först",
                        text: "Information registreras löpande så att mindre behöver fyllas i i efterhand.",
                      },
                      {
                        icon: ShieldCheck,
                        title: "Privat och tjänst hålls isär",
                        text: "Föraren kan klassificera resor och privata resor kan hanteras separat.",
                      },
                      {
                        icon: FileText,
                        title: "Ett gemensamt underlag",
                        text: "Administrationen kan arbeta från en samlad historik istället för separata anteckningar.",
                      },
                    ].map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.title}
                          className="flex gap-4"
                        >
                          <div
                            className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              bg-primary/10
                              text-primary
                            "
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div>
                            <h3
                              className="
                                text-sm
                                font-bold
                                text-foreground
                              "
                            >
                              {item.title}
                            </h3>

                            <p
                              className="
                                mt-1
                                text-sm
                                leading-relaxed
                                text-muted-foreground
                              "
                            >
                              {item.text}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            7. KALKYLATOR

            MEDVETET UTAN SIGNALSTAPLAR.
            Här visas riktiga numeriska värden.
        ========================================================== */}
        <section
          id="kalkylator"
          className="
            border-y
            border-border/40
            bg-muted/20
            py-20
            md:py-28
          "
        >
          <div className="container mx-auto max-w-5xl px-6">
            <div
              data-reveal
              className="
                rounded-3xl
                border
                border-border
                bg-card
                p-8
                shadow-xl
                md:p-12
              "
            >
              <div
                className="
                  grid
                  grid-cols-1
                  items-center
                  gap-8
                  md:grid-cols-12
                "
              >
                <div className="space-y-4 md:col-span-6">
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      text-xs
                      font-semibold
                      uppercase
                      tracking-widest
                      text-primary
                    "
                  >
                    <Calculator className="h-4 w-4" />
                    Ekonomisk kalkyl
                  </span>

                  <h2
                    className="
                      font-display
                      text-2xl
                      font-bold
                      text-foreground
                      md:text-3xl
                    "
                  >
                    Vad kostar manuell administration er idag?
                  </h2>

                  <p
                    className="
                      text-sm
                      leading-relaxed
                      text-muted-foreground
                    "
                  >
                    Dra i reglaget för att se ett exempel på hur mycket
                    administrativ tid som kan frigöras när körjournalerna
                    hanteras automatiskt.
                  </p>

                  <div className="space-y-2 pt-4">
                    <div
                      className="
                        flex
                        justify-between
                        text-sm
                        font-semibold
                      "
                    >
                      <span>Antal fordon:</span>

                      <span
                        className="
                          text-base
                          font-bold
                          text-primary
                        "
                      >
                        {carCount} st
                      </span>
                    </div>

                    <input
                      type="range"
                      min={1}
                      max={50}
                      value={carCount}
                      onChange={(event) =>
                        setCarCount(Number(event.target.value))
                      }
                      className="
                        h-2
                        w-full
                        cursor-pointer
                        appearance-none
                        rounded-lg
                        bg-muted
                        accent-primary
                      "
                    />
                  </div>
                </div>

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-4
                    rounded-2xl
                    border
                    border-border/60
                    bg-muted/40
                    p-6
                    md:col-span-6
                  "
                >
                  <div className="space-y-1">
                    <span
                      className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-muted-foreground
                      "
                    >
                      Exempel på frigjord administration
                    </span>

                    <div
                      className="
                        font-display
                        text-3xl
                        font-bold
                        text-foreground
                      "
                    >
                      ~{savedHoursPerMonth.toLocaleString("sv-SE")} timmar{" "}
                      <span
                        className="
                          text-sm
                          font-normal
                          text-muted-foreground
                        "
                      >
                        / månad
                      </span>
                    </div>
                  </div>

                  <div
                    className="
                      space-y-1
                      border-t
                      border-border/40
                      pt-3
                    "
                  >
                    <span
                      className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-muted-foreground
                      "
                    >
                      Uppskattat värde av tiden
                    </span>

                    <div
                      className="
                        font-display
                        text-3xl
                        font-bold
                        text-primary
                      "
                    >
                      ~{savedSekPerYear.toLocaleString("sv-SE")} kr{" "}
                      <span
                        className="
                          text-sm
                          font-normal
                          text-muted-foreground
                        "
                      >
                        / år
                      </span>
                    </div>
                  </div>

                  <p
                    className="
                      pt-1
                      text-[11px]
                      leading-relaxed
                      text-muted-foreground
                    "
                  >
                    * Illustrativ beräkning baserad på 2,5 timmars
                    administration per fordon och månad samt ett uppskattat
                    administrativt timvärde på 450 kr.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            8. CTA
        ========================================================== */}
        <section className="bg-background py-20 md:py-24">
          <div className="container mx-auto max-w-5xl px-6">
            <div
              data-reveal
              className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-primary/20
                bg-card
                px-7
                py-10
                text-center
                sm:px-12
                md:py-14
              "
            >
              <div
                data-signal-drift="section"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
              >
                <BrandSignalBars
                  size="md"
                  align="right"
                  glow={false}
                  className="
                    opacity-[0.10]
                    md:opacity-[0.16]
                  "
                  barsClassName="
                    translate-x-[58%]
                    translate-y-[22%]
                    scale-[1.2]
                    md:translate-x-[38%]
                    md:scale-[1.4]
                  "
                />
              </div>

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  z-[1]
                  bg-gradient-to-r
                  from-card
                  via-card/85
                  to-transparent
                "
              />

              <div className="relative z-10">
                <h2
                  className="
                    mx-auto
                    max-w-2xl
                    font-display
                    text-2xl
                    font-bold
                    tracking-tight
                    sm:text-3xl
                  "
                >
                  Hur mycket administration skulle ni kunna slippa?
                </h2>

                <p
                  className="
                    mx-auto
                    mt-4
                    max-w-xl
                    text-sm
                    leading-relaxed
                    text-muted-foreground
                    sm:text-base
                  "
                >
                  Berätta hur många fordon ni har och hur körjournalerna
                  hanteras idag. Vi hjälper er att se vilken lösning som passar
                  verksamheten.
                </p>

                <a
                  href="#kontakt"
                  className="
                    mt-7
                    inline-flex
                    h-12
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-primary
                    px-6
                    text-sm
                    font-semibold
                    text-primary-foreground
                    transition-opacity
                    hover:opacity-90
                  "
                >
                  Diskutera er körjournal
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            9. FAQ
        ========================================================== */}
        <section
          className="
            border-t
            border-border/40
            bg-muted/30
            py-20
            md:py-28
          "
        >
          <div className="container mx-auto max-w-4xl px-6">
            <div
              data-reveal
              className="mb-12 text-center"
            >
              <span
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-widest
                  text-primary
                "
              >
                Vanliga frågor
              </span>

              <h2
                className="
                  mt-4
                  font-display
                  text-3xl
                  font-bold
                  tracking-tight
                  text-foreground
                  md:text-4xl
                "
              >
                Innan ni väljer elektronisk körjournal.
              </h2>
            </div>

            <div
              data-stagger
              className="space-y-3"
            >
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openFaq === index;

                return (
                  <div
                    key={item.q}
                    className="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-border/70
                      bg-card
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq(isOpen ? null : index)
                      }
                      aria-expanded={isOpen}
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        gap-5
                        p-5
                        text-left
                        text-sm
                        font-semibold
                        text-foreground
                        transition-colors
                        hover:text-primary
                        md:p-6
                        md:text-base
                      "
                    >
                      <span>{item.q}</span>

                      <ChevronDown
                        className={`
                          h-4
                          w-4
                          shrink-0
                          text-muted-foreground
                          transition-transform
                          duration-200

                          ${
                            isOpen
                              ? "rotate-180 text-primary"
                              : ""
                          }
                        `}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{
                            height: 0,
                            opacity: 0,
                          }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                          }}
                          transition={{
                            duration: 0.2,
                          }}
                        >
                          <div
                            className="
                              border-t
                              border-border/40
                              px-5
                              pb-6
                              pt-4
                              text-sm
                              leading-relaxed
                              text-muted-foreground
                              md:px-6
                            "
                          >
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            10. CONTACT
        ========================================================== */}
        <div
          id="kontakt"
          className="scroll-mt-24"
        >
          <Contact />
        </div>
      </main>

      <Footer />
    </div>
  );
}