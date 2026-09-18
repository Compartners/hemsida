"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  AudioLines,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  Headphones,
  ListChecks,
  MessageSquareText,
  Mic2,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
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

/* =========================================================
   DATA
========================================================== */

const AI_AREAS = [
  {
    icon: AudioLines,
    eyebrow: "Transkribering",
    title: "Gör varje samtal sökbart.",
    description:
      "Omvandla kunddialoger till text så att information, beslut och viktiga detaljer inte stannar i ett telefonsamtal.",
  },
  {
    icon: Mic2,
    eyebrow: "Samtalsinspelning",
    title: "Fånga hela kunddialogen.",
    description:
      "Spela in samtal när verksamheten behöver det och bygg ett bättre underlag för kvalitet, utbildning och uppföljning.",
  },
  {
    icon: Bot,
    eyebrow: "AI-chattbotar",
    title: "Låt AI ta första dialogen.",
    description:
      "Besvara återkommande frågor, samla in information och skicka mer komplexa ärenden vidare till rätt medarbetare.",
  },
  {
    icon: Headphones,
    eyebrow: "Contact Center",
    title: "Samla kundkontakten.",
    description:
      "Hantera samtal, digitala kanaler, köer och medarbetare i en gemensam miljö med AI som stöd.",
  },
];

const FEATURES = [
  {
    icon: BrainCircuit,
    title: "AI-sammanfattningar",
    description:
      "Skapa korta sammanfattningar av längre kunddialoger direkt efter avslutat samtal.",
  },
  {
    icon: ListChecks,
    title: "Nästa åtgärd",
    description:
      "Identifiera uppföljningar, överenskommelser och andra uppgifter som annars riskerar att glömmas bort.",
  },
  {
    icon: Search,
    title: "Sök i dialogerna",
    description:
      "Hitta information i tidigare kundsamtal utan att lyssna igenom långa inspelningar.",
  },
  {
    icon: Users,
    title: "Smart eskalering",
    description:
      "Låt AI hantera det enkla och lämna över till en människa när ärendet kräver erfarenhet eller personlig kontakt.",
  },
  {
    icon: ShieldCheck,
    title: "Behörighet & kontroll",
    description:
      "Bestäm vilka användare som får tillgång till samtal, transkriberingar och kundinformation.",
  },
  {
    icon: Zap,
    title: "Automatiserade flöden",
    description:
      "Använd information från dialogen för att trigga nästa steg i kundresan eller era interna arbetsflöden.",
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Vi kartlägger dialogerna",
    description:
      "Vi tittar på vilka kanaler kunderna använder, vilka frågor som återkommer och var teamet tappar tid idag.",
  },
  {
    number: "02",
    title: "Vi väljer rätt AI-användning",
    description:
      "Alla problem behöver inte en chatbot. Vi väljer de delar där AI faktiskt förenklar arbetet eller förbättrar kundupplevelsen.",
  },
  {
    number: "03",
    title: "Vi kopplar ihop lösningen",
    description:
      "Telefoni, Contact Center, chatbot och andra system sätts ihop till ett fungerande arbetsflöde.",
  },
  {
    number: "04",
    title: "Vi följer upp och förbättrar",
    description:
      "Efter lansering följer vi upp användningen och justerar flöden, instruktioner och automatiseringar.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Måste vi införa allt samtidigt?",
    a: "Nej. Det är ofta bättre att börja med ett tydligt användningsområde, exempelvis transkribering och AI-sammanfattningar, och sedan bygga vidare när teamet ser hur lösningen används i praktiken.",
  },
  {
    q: "Kan AI sammanfatta våra telefonsamtal automatiskt?",
    a: "Ja, beroende på vald telefoni- och AI-lösning kan ett inspelat eller transkriberat samtal analyseras efter avslutad dialog och exempelvis sammanfattas med viktiga punkter och nästa åtgärd.",
  },
  {
    q: "Kan en chatbot lämna över till en riktig person?",
    a: "Ja. En bra chatbot ska inte försöka lösa allt själv. Den kan samla in information och besvara enklare frågor men lämna över ärendet när kunden behöver personlig hjälp.",
  },
  {
    q: "Hur fungerar samtalsinspelning och integritet?",
    a: "Hur samtal bör spelas in och lagras beror på verksamheten, syftet och vilken information som behandlas. Vi hjälper till att konfigurera tekniken med rätt behörigheter, lagring och arbetsflöden, medan juridiska krav och interna policyer behöver bedömas utifrån er verksamhet.",
  },
  {
    q: "Vad är skillnaden mellan en växel och ett Contact Center?",
    a: "En företagsväxel fokuserar främst på telefoni och samtalsstyrning. Ett Contact Center är byggt för verksamheter med större kunddialoger, köhantering, flera kommunikationskanaler, arbetsledning och mer avancerad uppföljning.",
  },
];

/* =========================================================
   COMPONENT
========================================================== */

export default function AIPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [conversationView, setConversationView] = useState<
    "summary" | "transcript" | "actions"
  >("summary");

  /* =======================================================
     GSAP
  ======================================================== */

  useEffect(() => {
    if (!pageRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      /* HERO */
      gsap.from("[data-hero-reveal]", {
        opacity: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.11,
        ease: "power3.out",
      });

      /* BRAND SIGNALS */
      gsap.to("[data-signal-drift='hero']", {
        y: 25,
        x: -12,
        rotate: 0.7,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to("[data-signal-drift='section']", {
        y: 0,
        x: 2,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /* NORMAL REVEALS */
      gsap.utils
        .toArray<HTMLElement>("[data-reveal]")
        .forEach((element) => {
          gsap.from(element, {
            opacity: 0,
            y: 32,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
              once: true,
            },
          });
        });

      /* STAGGER */
      gsap.utils
        .toArray<HTMLElement>("[data-stagger]")
        .forEach((container) => {
          gsap.from(Array.from(container.children), {
            opacity: 0,
            y: 28,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              start: "top 84%",
              once: true,
            },
          });
        });

      /* UI MOCKUPS */
      gsap.utils
        .toArray<HTMLElement>("[data-ui-reveal]")
        .forEach((element) => {
          gsap.from(element, {
            opacity: 0,
            scale: 0.97,
            y: 25,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
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
      className="
        min-h-screen
        bg-background
        text-foreground
        selection:bg-primary/20
        selection:text-primary
      "
    >
      <SEO
        title="AI för kundservice & telefoni – Transkribering, chatbot & Contact Center | Compartners"
        description="Compartners hjälper företag att använda AI i kunddialogen med transkribering, samtalsinspelning, AI-chattbotar, automatisering och Contact Center."
        canonical="https://compartners.se/ai"
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
          {/* BRAND SIGNAL */}
          <div
            data-signal-drift="hero"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            
          </div>

          {/* FADE */}
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

          {/* GLOW */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-1/2
              top-0
              h-[460px]
              w-[920px]
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
                    inline-flex
                    items-center
                    gap-2
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
                  <Sparkles className="h-3.5 w-3.5" />
                  AI för kunddialogen
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
                Fånga samtalet.
                <br />
                Förstå kunden.{" "}
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
                  Agera snabbare.
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
                Använd AI för att transkribera och sammanfatta samtal,
                automatisera återkommande kunddialoger och ge ert Contact
                Center bättre verktyg för nästa steg.
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
                  Diskutera AI med oss
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="#ai-losningar"
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
                    backdrop-blur-sm
                    transition-colors
                    hover:bg-muted
                  "
                >
                  Utforska möjligheterna
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
                  Transkribering
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  AI-chattbotar
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Contact Center
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Samtalsinspelning
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            2. INTRO / VARFÖR AI?
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
                md:opacity-[0.07]
              "
              barsClassName="
                -translate-x-[65%]
                translate-y-[18%]
                scale-[1.3]

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
                  AI där arbetet faktiskt sker
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
                  Kunddialogen innehåller redan informationen.
                </h2>

                <p
                  className="
                    mt-6
                    text-base
                    leading-relaxed
                    text-muted-foreground
                  "
                >
                  Varje dag berättar kunder vad de behöver, vilka problem de
                  har och vad nästa steg borde vara.
                </p>

                <p
                  className="
                    mt-4
                    text-base
                    leading-relaxed
                    text-muted-foreground
                  "
                >
                  Utmaningen är att informationen ofta försvinner när samtalet
                  avslutas. AI gör det möjligt att omvandla dialogen till
                  information som går att söka, sammanfatta och agera på.
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
                {[
                  {
                    icon: Mic2,
                    title: "Fånga",
                    text: "Samtalet, chatten och kundens faktiska frågor blir ett användbart underlag.",
                  },
                  {
                    icon: BrainCircuit,
                    title: "Förstå",
                    text: "AI hjälper till att strukturera dialogen och lyfta fram det som är viktigt.",
                  },
                  {
                    icon: Zap,
                    title: "Agera",
                    text: "Sammanfattningar, uppgifter och eskalering gör det enklare att ta nästa steg.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="
                        rounded-2xl
                        border
                        border-border/70
                        bg-card
                        p-6
                      "
                    >
                      <div className="flex gap-4">
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
                          <h3 className="font-display font-bold">
                            {item.title}
                          </h3>

                          <p
                            className="
                              mt-2
                              text-sm
                              leading-relaxed
                              text-muted-foreground
                            "
                          >
                            {item.text}
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
    3. FYRA AI-OMRÅDEN / VISUELL BENTO
========================================================== */}
<section
  id="ai-losningar"
  className="
    relative
    overflow-hidden
    scroll-mt-24
    border-y
    border-border/40
    bg-muted/20
    py-20
    md:py-28
  "
>
  {/* =====================================================
      DEKORATIV BRANDGRAFIK
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
        opacity-[0.025]
        md:opacity-[0.05]
      "
      barsClassName="
        translate-x-[65%]
        translate-y-[35%]
        scale-[1.45]
        md:translate-x-[52%]
        md:scale-[1.7]
      "
    />
  </div>

  <div className="container relative z-10 mx-auto max-w-7xl px-6">
    {/* ===================================================
        HEADER
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
          Fyra delar. Ett flöde.
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
          Från första ordet till{" "}
          <span className="text-muted-foreground">
            nästa åtgärd.
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
          AI blir betydligt mer användbart när telefoni, inspelning,
          transkribering och digitala dialoger får arbeta tillsammans istället
          för som separata verktyg.
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
          1. TRANSKRIBERING — HUVUDKORT
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
          lg:min-h-[500px]
        "
      >
        {/* Glow */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            h-72
            w-72
            rounded-full
            bg-primary/10
            blur-[110px]
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
              <AudioLines className="h-5 w-5" />
            </div>

            <span
              className="
                mt-6
                block
                text-[11px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-primary
              "
            >
              Transkribering
            </span>

            <h3
              className="
                mt-2
                max-w-xl
                font-display
                text-2xl
                font-bold
                tracking-tight
                text-foreground
                md:text-3xl
              "
            >
              Samtalet blir användbar information.
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
              Samtal kan omvandlas till text, sammanfattningar och tydliga
              nästa steg utan att någon behöver lyssna igenom hela dialogen
              igen.
            </p>
          </div>

          {/* Conversation intelligence UI */}
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
            {/* Topbar */}
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
                  <PhoneCall className="h-4 w-4" />
                </div>

                <div>
                  <div className="text-xs font-semibold text-foreground">
                    Kundsamtal
                  </div>

                  <div className="text-[10px] text-muted-foreground">
                    12 min 48 sek
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
                <CheckCircle2 className="h-3 w-3" />
                Bearbetad
              </span>
            </div>

            {/* Waveform */}
            <div
              className="
                flex
                h-20
                items-center
                justify-center
                gap-1
                border-b
                border-border/50
                px-5
              "
            >
              {[
                18, 30, 52, 35, 70, 44, 62, 78, 42, 60,
                82, 45, 70, 34, 56, 75, 48, 30, 63, 42,
                74, 55, 36, 68, 46, 26, 58, 72, 38, 52,
              ].map((height, index) => (
                <span
                  key={index}
                  className="
                    w-1
                    rounded-full
                    bg-primary/50
                  "
                  style={{
                    height: `${height}%`,
                  }}
                />
              ))}
            </div>

            {/* Summary */}
            <div className="p-4 sm:p-5">
              <div className="flex gap-3">
                <Sparkles
                  className="
                    mt-0.5
                    h-4
                    w-4
                    shrink-0
                    text-primary
                  "
                />

                <div>
                  <span
                    className="
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-primary
                    "
                  >
                    AI-sammanfattning
                  </span>

                  <p
                    className="
                      mt-1.5
                      text-xs
                      leading-relaxed
                      text-muted-foreground
                      sm:text-sm
                    "
                  >
                    Kunden behöver lägga till en ny användare och justera två
                    befintliga abonnemang inför nästa vecka.
                  </p>
                </div>
              </div>

              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  gap-2
                "
              >
                <span
                  className="
                    rounded-lg
                    border
                    border-border/60
                    bg-card
                    px-2.5
                    py-1.5
                    text-[10px]
                    font-medium
                    text-muted-foreground
                  "
                >
                  Abonnemang
                </span>

                <span
                  className="
                    rounded-lg
                    border
                    border-border/60
                    bg-card
                    px-2.5
                    py-1.5
                    text-[10px]
                    font-medium
                    text-muted-foreground
                  "
                >
                  Ny användare
                </span>

                <span
                  className="
                    rounded-lg
                    border
                    border-primary/20
                    bg-primary/10
                    px-2.5
                    py-1.5
                    text-[10px]
                    font-medium
                    text-primary
                  "
                >
                  Uppföljning krävs
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          2. AI CHATBOT
      ================================================== */}
      <div
        className="
          group
          overflow-hidden
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
        <div className="flex items-start gap-4">
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
            <Bot className="h-5 w-5" />
          </div>

          <div>
            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-primary
              "
            >
              AI-chattbot
            </span>

            <h3
              className="
                mt-1
                font-display
                text-lg
                font-bold
                text-foreground
              "
            >
              Första dialogen, automatiskt.
            </h3>

            <p
              className="
                mt-2
                text-sm
                leading-relaxed
                text-muted-foreground
              "
            >
              Besvara det enkla, samla in rätt information och lämna över när
              kunden behöver en människa.
            </p>
          </div>
        </div>

        {/* Mini chat */}
        <div
          className="
            mt-6
            space-y-3
            rounded-2xl
            border
            border-border/60
            bg-background/60
            p-4
          "
        >
          <div className="flex justify-end">
            <div
              className="
                max-w-[82%]
                rounded-xl
                rounded-tr-sm
                bg-primary
                px-3
                py-2
                text-[11px]
                leading-relaxed
                text-primary-foreground
              "
            >
              Jag behöver hjälp med en faktura.
            </div>
          </div>

          <div className="flex justify-start">
            <div
              className="
                max-w-[88%]
                rounded-xl
                rounded-tl-sm
                border
                border-border/60
                bg-card
                px-3
                py-2
                text-[11px]
                leading-relaxed
                text-muted-foreground
              "
            >
              Självklart. Gäller det en befintlig faktura eller vill du ändra
              faktureringsuppgifter?
            </div>
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              pt-1
              text-[10px]
              font-semibold
              text-primary
            "
          >
            <Sparkles className="h-3 w-3" />
            AI hanterar dialogen
          </div>
        </div>
      </div>

      {/* =================================================
          3. SAMTALSINSPELNING
      ================================================== */}
      <div
        className="
          group
          overflow-hidden
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
        <div className="flex items-start gap-4">
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
            <Mic2 className="h-5 w-5" />
          </div>

          <div>
            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-primary
              "
            >
              Samtalsinspelning
            </span>

            <h3
              className="
                mt-1
                font-display
                text-lg
                font-bold
                text-foreground
              "
            >
              Dialogen finns kvar när samtalet är slut.
            </h3>

            <p
              className="
                mt-2
                text-sm
                leading-relaxed
                text-muted-foreground
              "
            >
              Skapa underlag för kvalitet, utbildning och uppföljning med
              kontrollerad åtkomst.
            </p>
          </div>
        </div>

        {/* Recording visual */}
        <div
          className="
            mt-6
            rounded-2xl
            border
            border-border/60
            bg-background/60
            p-4
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <div className="flex items-center gap-3">
              <span
                className="
                  relative
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-rose-500/10
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-rose-500
                  "
                />
              </span>

              <div>
                <div
                  className="
                    text-xs
                    font-semibold
                    text-foreground
                  "
                >
                  Inspelning aktiv
                </div>

                <div
                  className="
                    text-[10px]
                    text-muted-foreground
                  "
                >
                  08:42
                </div>
              </div>
            </div>

            <span
              className="
                rounded-lg
                border
                border-border/60
                bg-card
                px-2.5
                py-1.5
                text-[10px]
                font-semibold
                text-muted-foreground
              "
            >
              Krypterad
            </span>
          </div>

          <div
            className="
              mt-4
              flex
              h-8
              items-center
              gap-[3px]
            "
          >
            {[
              25, 45, 70, 38, 55, 78, 42, 66, 34, 80,
              48, 60, 28, 72, 50, 38, 62, 45, 70, 30,
            ].map((height, index) => (
              <span
                key={index}
                className="
                  flex-1
                  rounded-full
                  bg-foreground/20
                "
                style={{
                  height: `${height}%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* =================================================
          4. CONTACT CENTER
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
          lg:col-span-12
        "
      >
        {/* dekorativt motiv */}
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
              opacity-[0.07]
              md:opacity-[0.11]
            "
            barsClassName="
              translate-x-[60%]
              translate-y-[28%]
              scale-[1.25]
              md:translate-x-[38%]
              md:scale-[1.45]
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
            from-card
            via-card/95
            to-card/45
          "
        />

        <div
          className="
            relative
            z-10
            grid
            gap-8
            lg:grid-cols-12
            lg:items-center
          "
        >
          {/* Copy */}
          <div className="lg:col-span-5">
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
              <Headphones className="h-5 w-5" />
            </div>

            <span
              className="
                mt-6
                block
                text-[11px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-primary
              "
            >
              Contact Center
            </span>

            <h3
              className="
                mt-2
                max-w-md
                font-display
                text-2xl
                font-bold
                tracking-tight
                md:text-3xl
              "
            >
              En arbetsyta för hela kunddialogen.
            </h3>

            <p
              className="
                mt-4
                max-w-md
                text-sm
                leading-relaxed
                text-muted-foreground
              "
            >
              Samla samtal, digitala kanaler, köer och medarbetare. Lägg sedan
              AI ovanpå för att hjälpa både kunden och agenten genom dialogen.
            </p>
          </div>

          {/* Mini dashboard */}
          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-border/60
              bg-background/70
              lg:col-span-7
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-border/50
                px-4
                py-3
              "
            >
              <div>
                <div className="text-xs font-semibold">
                  Contact Center
                </div>

                <div className="text-[10px] text-muted-foreground">
                  Realtid
                </div>
              </div>

              <span
                className="
                  flex
                  items-center
                  gap-1.5
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
                Online
              </span>
            </div>

            {/* KPI strip */}
            <div
              className="
                grid
                grid-cols-3
                divide-x
                divide-border/50
                border-b
                border-border/50
              "
            >
              <div className="p-4">
                <span
                  className="
                    text-[9px]
                    uppercase
                    tracking-wider
                    text-muted-foreground
                  "
                >
                  Aktiva
                </span>

                <div
                  className="
                    mt-1
                    font-display
                    text-xl
                    font-bold
                  "
                >
                  14
                </div>
              </div>

              <div className="p-4">
                <span
                  className="
                    text-[9px]
                    uppercase
                    tracking-wider
                    text-muted-foreground
                  "
                >
                  Väntar
                </span>

                <div
                  className="
                    mt-1
                    font-display
                    text-xl
                    font-bold
                  "
                >
                  3
                </div>
              </div>

              <div className="p-4">
                <span
                  className="
                    text-[9px]
                    uppercase
                    tracking-wider
                    text-muted-foreground
                  "
                >
                  Agenter
                </span>

                <div
                  className="
                    mt-1
                    font-display
                    text-xl
                    font-bold
                  "
                >
                  8
                </div>
              </div>
            </div>

            {/* queues */}
            <div className="space-y-2 p-4">
              {[
                {
                  name: "Kundservice",
                  agents: "4 agenter",
                  queue: "2 väntar",
                },
                {
                  name: "Support",
                  agents: "3 agenter",
                  queue: "1 väntar",
                },
                {
                  name: "Försäljning",
                  agents: "1 agent",
                  queue: "Ingen kö",
                },
              ].map((queue) => (
                <div
                  key={queue.name}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    rounded-xl
                    border
                    border-border/50
                    bg-card
                    px-3
                    py-2.5
                  "
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-lg
                        bg-primary/10
                        text-primary
                      "
                    >
                      <Headphones className="h-3.5 w-3.5" />
                    </div>

                    <div>
                      <div
                        className="
                          text-[11px]
                          font-semibold
                        "
                      >
                        {queue.name}
                      </div>

                      <div
                        className="
                          text-[9px]
                          text-muted-foreground
                        "
                      >
                        {queue.agents}
                      </div>
                    </div>
                  </div>

                  <span
                    className="
                      text-[10px]
                      font-medium
                      text-muted-foreground
                    "
                  >
                    {queue.queue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ===================================================
        FOOTER / KOPPLINGEN MELLAN ALLT
    ==================================================== */}
    <div
      data-reveal
      className="
        mt-6
        flex
        flex-col
        gap-4
        rounded-2xl
        border
        border-primary/15
        bg-primary/[0.04]
        p-5
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      <div className="flex items-start gap-3">
        <BrainCircuit
          className="
            mt-0.5
            h-5
            w-5
            shrink-0
            text-primary
          "
        />

        <div>
          <div
            className="
              text-sm
              font-semibold
              text-foreground
            "
          >
            Det viktiga är inte fyra separata AI-funktioner.
          </div>

          <p
            className="
              mt-1
              max-w-2xl
              text-xs
              leading-relaxed
              text-muted-foreground
              sm:text-sm
            "
          >
            Värdet uppstår när samma kunddialog kan spelas in,
            transkriberas, förstås och användas för nästa steg i Contact
            Center eller andra arbetsflöden.
          </p>
        </div>
      </div>

      <a
        href="#kontakt"
        className="
          inline-flex
          shrink-0
          items-center
          gap-2
          text-sm
          font-semibold
          text-primary
          transition-opacity
          hover:opacity-70
        "
      >
        Prata med oss
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  </div>
</section>

        {/* =========================================================
            4. TRANSKRIBERING / CONVERSATION INTELLIGENCE
        ========================================================== */}

        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-6">
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
                Transkribering & samtalsinspelning
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
                Samtalet slutar. Informationen stannar kvar.
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
                Ett avslutat kundsamtal kan bli transkribering,
                sammanfattning och konkreta uppgifter istället för ännu ett
                minne som någon måste försöka återge senare.
              </p>
            </div>

            <div
              data-ui-reveal
              className="
                overflow-hidden
                rounded-3xl
                border
                border-border/80
                bg-card
                shadow-xl
              "
            >
              {/* TOPBAR */}
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-4
                  border-b
                  border-border/60
                  px-5
                  py-4
                  sm:px-7
                "
              >
                <div className="flex items-center gap-3">
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
                    <PhoneCall className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="text-sm font-bold">
                      Kundsamtal · 08:42
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Anna Karlsson · 12 min 48 sek
                    </div>
                  </div>
                </div>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-emerald-500/20
                    bg-emerald-500/10
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-emerald-500
                  "
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Bearbetad
                </span>
              </div>

              {/* BODY */}
              <div className="grid lg:grid-cols-12">
                {/* LEFT */}
                <div
                  className="
                    border-b
                    border-border/60
                    p-5
                    sm:p-7
                    lg:col-span-4
                    lg:border-b-0
                    lg:border-r
                  "
                >
                  <div
                    className="
                      mb-6
                      flex
                      h-28
                      items-center
                      justify-center
                      gap-1
                      rounded-2xl
                      border
                      border-border/60
                      bg-muted/30
                      px-5
                    "
                  >
                    {[
                      20, 32, 55, 36, 70, 48, 78, 42, 60, 85, 46, 68, 40, 74,
                      52, 30, 62, 80, 45, 28,
                    ].map((height, index) => (
                      <span
                        key={index}
                        className="
                          w-1
                          rounded-full
                          bg-primary/50
                        "
                        style={{
                          height: `${height}%`,
                        }}
                      />
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span
                        className="
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-muted-foreground
                        "
                      >
                        Ärende
                      </span>

                      <div className="mt-1 text-sm font-semibold">
                        Ändring av abonnemang
                      </div>
                    </div>

                    <div>
                      <span
                        className="
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-muted-foreground
                        "
                      >
                        Kund
                      </span>

                      <div className="mt-1 text-sm font-semibold">
                        Exempelbolaget AB
                      </div>
                    </div>

                    <div>
                      <span
                        className="
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-muted-foreground
                        "
                      >
                        Samtalstid
                      </span>

                      <div className="mt-1 flex items-center gap-2 text-sm font-semibold">
                        <Clock3 className="h-4 w-4 text-primary" />
                        12:48
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="p-5 sm:p-7 lg:col-span-8">
                  {/* TABS */}
                  <div
                    className="
                      mb-6
                      inline-flex
                      rounded-xl
                      border
                      border-border/60
                      bg-muted/30
                      p-1
                    "
                  >
                    {[
                      {
                        id: "summary",
                        label: "Sammanfattning",
                      },
                      {
                        id: "transcript",
                        label: "Transkribering",
                      },
                      {
                        id: "actions",
                        label: "Nästa steg",
                      },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() =>
                          setConversationView(
                            tab.id as
                              | "summary"
                              | "transcript"
                              | "actions",
                          )
                        }
                        className={`
                          rounded-lg
                          px-3
                          py-2
                          text-xs
                          font-semibold
                          transition-all

                          ${
                            conversationView === tab.id
                              ? "bg-card text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }
                        `}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {conversationView === "summary" && (
                      <motion.div
                        key="summary"
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: -5,
                        }}
                        transition={{
                          duration: 0.18,
                        }}
                      >
                        <div
                          className="
                            rounded-2xl
                            border
                            border-primary/15
                            bg-primary/5
                            p-5
                          "
                        >
                          <div className="flex gap-3">
                            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                            <div>
                              <span
                                className="
                                  text-xs
                                  font-bold
                                  text-primary
                                "
                              >
                                AI-sammanfattning
                              </span>

                              <p
                                className="
                                  mt-2
                                  text-sm
                                  leading-relaxed
                                  text-muted-foreground
                                "
                              >
                                Kunden vill justera företagets abonnemang inför
                                en nyanställning. Två befintliga användare ska
                                ändras och en ny användare behöver aktiveras
                                före nästa måndag.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          <div
                            className="
                              rounded-xl
                              border
                              border-border/60
                              p-4
                            "
                          >
                            <span className="text-xs text-muted-foreground">
                              Huvudämne
                            </span>

                            <div className="mt-1 text-sm font-semibold">
                              Abonnemangsändring
                            </div>
                          </div>

                          <div
                            className="
                              rounded-xl
                              border
                              border-border/60
                              p-4
                            "
                          >
                            <span className="text-xs text-muted-foreground">
                              Uppföljning
                            </span>

                            <div className="mt-1 text-sm font-semibold">
                              Behövs
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {conversationView === "transcript" && (
                      <motion.div
                        key="transcript"
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: -5,
                        }}
                        transition={{
                          duration: 0.18,
                        }}
                        className="space-y-4"
                      >
                        <div className="flex gap-3">
                          <span
                            className="
                              mt-1
                              h-7
                              w-7
                              shrink-0
                              rounded-full
                              bg-primary/10
                              text-center
                              text-[10px]
                              font-bold
                              leading-7
                              text-primary
                            "
                          >
                            K
                          </span>

                          <div>
                            <span className="text-xs font-semibold">
                              Kund
                            </span>

                            <p
                              className="
                                mt-1
                                text-sm
                                leading-relaxed
                                text-muted-foreground
                              "
                            >
                              Vi kommer ta in en ny person nästa vecka och
                              behöver samtidigt justera två av våra nuvarande
                              abonnemang.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <span
                            className="
                              mt-1
                              h-7
                              w-7
                              shrink-0
                              rounded-full
                              bg-accent/10
                              text-center
                              text-[10px]
                              font-bold
                              leading-7
                              text-accent
                            "
                          >
                            C
                          </span>

                          <div>
                            <span className="text-xs font-semibold">
                              Compartners
                            </span>

                            <p
                              className="
                                mt-1
                                text-sm
                                leading-relaxed
                                text-muted-foreground
                              "
                            >
                              Då ser vi till att den nya användaren är
                              förberedd och går samtidigt igenom vilka
                              ändringar som behövs på de befintliga.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {conversationView === "actions" && (
                      <motion.div
                        key="actions"
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: -5,
                        }}
                        transition={{
                          duration: 0.18,
                        }}
                        className="space-y-3"
                      >
                        {[
                          "Skapa ny användare före måndag",
                          "Kontrollera två befintliga abonnemang",
                          "Återkoppla till kunden när ändringarna är genomförda",
                        ].map((action, index) => (
                          <div
                            key={action}
                            className="
                              flex
                              items-start
                              gap-3
                              rounded-xl
                              border
                              border-border/60
                              p-4
                            "
                          >
                            <div
                              className="
                                flex
                                h-6
                                w-6
                                shrink-0
                                items-center
                                justify-center
                                rounded-md
                                bg-primary/10
                                text-[10px]
                                font-bold
                                text-primary
                              "
                            >
                              {index + 1}
                            </div>

                            <span className="text-sm">
                              {action}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            5. AI CHATBOT
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
          <div className="container mx-auto max-w-6xl px-6">
            <div
              className="
                grid
                gap-12
                lg:grid-cols-12
                lg:items-center
              "
            >
              {/* COPY */}
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
                  AI-chattbotar
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
                  Låt AI hantera det enkla. Människor tar hand om resten.
                </h2>

                <p
                  className="
                    mt-6
                    text-base
                    leading-relaxed
                    text-muted-foreground
                  "
                >
                  En AI-bot kan möta kunden direkt, besvara vanliga frågor och
                  samla in rätt information innan en medarbetare behöver ta
                  över.
                </p>

                <div className="mt-7 space-y-4">
                  {[
                    "Svar på återkommande frågor",
                    "Informationsinsamling före överlämning",
                    "Eskalering till rätt team",
                    "Tillgänglighet utanför ordinarie öppettider",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />

                      <span
                        className="
                          text-sm
                          text-muted-foreground
                        "
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CHAT UI */}
              <div
                data-ui-reveal
                className="lg:col-span-7"
              >
                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-border/70
                    bg-card
                    shadow-xl
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
                        opacity-[0.08]
                        md:opacity-[0.13]
                      "
                      barsClassName="
                        translate-x-[55%]
                        translate-y-[20%]
                        scale-[1.2]
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
                      from-card
                      via-card/90
                      to-card/35
                    "
                  />

                  <div className="relative z-10">
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-border/60
                        p-5
                      "
                    >
                      <div className="flex items-center gap-3">
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
                          <Bot className="h-5 w-5" />
                        </div>

                        <div>
                          <div className="text-sm font-bold">
                            Compartners AI
                          </div>

                          <div
                            className="
                              flex
                              items-center
                              gap-1.5
                              text-[11px]
                              text-muted-foreground
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
                            Tillgänglig
                          </div>
                        </div>
                      </div>

                      <MessageSquareText className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="space-y-5 p-5 sm:p-7">
                      <div className="flex justify-end">
                        <div
                          className="
                            max-w-[78%]
                            rounded-2xl
                            rounded-tr-sm
                            bg-primary
                            px-4
                            py-3
                            text-sm
                            leading-relaxed
                            text-primary-foreground
                          "
                        >
                          Jag behöver lägga till en ny användare till vår
                          telefonilösning.
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <div
                          className="
                            max-w-[82%]
                            rounded-2xl
                            rounded-tl-sm
                            border
                            border-border/60
                            bg-background/70
                            px-4
                            py-3
                            text-sm
                            leading-relaxed
                          "
                        >
                          Absolut. Jag kan hjälpa dig samla in uppgifterna
                          först. Ska användaren ha ett nytt mobilnummer eller
                          använda ett befintligt nummer?
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div
                          className="
                            max-w-[78%]
                            rounded-2xl
                            rounded-tr-sm
                            bg-primary
                            px-4
                            py-3
                            text-sm
                            text-primary-foreground
                          "
                        >
                          Nytt nummer.
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <div
                          className="
                            max-w-[82%]
                            rounded-2xl
                            rounded-tl-sm
                            border
                            border-primary/20
                            bg-primary/5
                            px-4
                            py-3
                          "
                        >
                          <div className="flex gap-2">
                            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                            <div>
                              <span
                                className="
                                  text-xs
                                  font-semibold
                                  text-primary
                                "
                              >
                                AI samlar in ärendet
                              </span>

                              <p
                                className="
                                  mt-1
                                  text-sm
                                  leading-relaxed
                                  text-muted-foreground
                                "
                              >
                                När uppgifterna är kompletta kan ärendet lämnas
                                vidare till rätt team utan att kunden behöver
                                börja om.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="
                        border-t
                        border-border/60
                        p-4
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          rounded-xl
                          border
                          border-border/60
                          bg-background/60
                          px-4
                          py-3
                          text-xs
                          text-muted-foreground
                        "
                      >
                        <span>Skriv ett meddelande...</span>

                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            6. CONTACT CENTER
        ========================================================== */}

        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto max-w-7xl px-6">
            <div
              data-reveal
              className="
                mx-auto
                mb-12
                max-w-3xl
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
                Contact Center
              </span>

              <h2
                className="
                  mt-4
                  font-display
                  text-3xl
                  font-bold
                  tracking-tight
                  md:text-4xl
                  lg:text-5xl
                "
              >
                När kunddialogen blir en del av verksamheten.
              </h2>

              <p
                className="
                  mx-auto
                  mt-5
                  max-w-2xl
                  text-sm
                  leading-relaxed
                  text-muted-foreground
                  sm:text-base
                "
              >
                För organisationer med större samtalsvolymer behövs mer än en
                traditionell telefonväxel. Contact Center samlar köer,
                medarbetare, kanaler och AI-stöd i samma arbetsyta.
              </p>
            </div>

            <div
              data-ui-reveal
              className="
                overflow-hidden
                rounded-3xl
                border
                border-border/70
                bg-card
              "
            >
              {/* TOP */}
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-4
                  border-b
                  border-border/60
                  p-5
                  sm:p-6
                "
              >
                <div>
                  <div className="text-sm font-bold">
                    Contact Center
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Realtidsöversikt
                  </div>
                </div>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-emerald-500/10
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-emerald-500
                  "
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Alla system online
                </span>
              </div>

              <div
                className="
                  grid
                  gap-px
                  bg-border/60
                  md:grid-cols-2
                  lg:grid-cols-4
                "
              >
                {[
                  {
                    label: "Pågående dialoger",
                    value: "14",
                    helper: "Samtal & chatt",
                  },
                  {
                    label: "Väntande",
                    value: "3",
                    helper: "Genomsnitt 42 sek",
                  },
                  {
                    label: "Tillgängliga agenter",
                    value: "8",
                    helper: "Av 12 aktiva",
                  },
                  {
                    label: "AI-hanterade ärenden",
                    value: "27",
                    helper: "Idag",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-card p-6"
                  >
                    <span
                      className="
                        text-xs
                        text-muted-foreground
                      "
                    >
                      {item.label}
                    </span>

                    <div
                      className="
                        mt-2
                        font-display
                        text-3xl
                        font-bold
                      "
                    >
                      {item.value}
                    </div>

                    <span
                      className="
                        mt-1
                        block
                        text-[11px]
                        text-muted-foreground
                      "
                    >
                      {item.helper}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-12">
                {/* QUEUES */}
                <div
                  className="
                    border-b
                    border-border/60
                    p-6
                    lg:col-span-7
                    lg:border-b-0
                    lg:border-r
                  "
                >
                  <span
                    className="
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-muted-foreground
                    "
                  >
                    Aktiva köer
                  </span>

                  <div className="mt-4 space-y-3">
                    {[
                      {
                        name: "Kundservice",
                        active: "8 aktiva",
                        queue: "2 väntar",
                      },
                      {
                        name: "Teknisk support",
                        active: "4 aktiva",
                        queue: "1 väntar",
                      },
                      {
                        name: "Försäljning",
                        active: "2 aktiva",
                        queue: "Ingen kö",
                      },
                    ].map((queue) => (
                      <div
                        key={queue.name}
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          rounded-xl
                          border
                          border-border/60
                          bg-background/50
                          p-4
                        "
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              bg-primary/10
                              text-primary
                            "
                          >
                            <Headphones className="h-4 w-4" />
                          </div>

                          <div>
                            <div className="text-sm font-semibold">
                              {queue.name}
                            </div>

                            <div className="text-[11px] text-muted-foreground">
                              {queue.active}
                            </div>
                          </div>
                        </div>

                        <span className="text-xs font-semibold text-muted-foreground">
                          {queue.queue}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI ASSIST */}
                <div
                  className="
                    bg-muted/20
                    p-6
                    lg:col-span-5
                  "
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />

                    <span
                      className="
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-primary
                      "
                    >
                      AI-assistent
                    </span>
                  </div>

                  <h3
                    className="
                      mt-4
                      font-display
                      text-xl
                      font-bold
                    "
                  >
                    Stöd medan dialogen pågår.
                  </h3>

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-relaxed
                      text-muted-foreground
                    "
                  >
                    AI kan hjälpa medarbetaren att hitta information,
                    strukturera dialogen och förbereda nästa steg utan att ta
                    över den mänskliga kontakten.
                  </p>

                  <div className="mt-6 space-y-3">
                    {[
                      "Relevant information snabbare",
                      "Sammanfattning efter avslutat ärende",
                      "Förslag på nästa åtgärd",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary" />

                        <span
                          className="
                            text-sm
                            text-muted-foreground
                          "
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            7. FUNKTIONER
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
                opacity-[0.03]
                md:opacity-[0.055]
              "
              barsClassName="
                translate-x-[62%]
                translate-y-[30%]
                scale-[1.45]
              "
            />
          </div>

          <div className="container relative z-10 mx-auto max-w-7xl px-6">
            <div
              data-reveal
              className="
                mb-14
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
                  AI bakom arbetsflödet
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
                  Mindre efterarbete. Mer användbar information.
                </h2>
              </div>

              <p
                className="
                  max-w-xl
                  text-sm
                  leading-relaxed
                  text-muted-foreground
                  lg:col-span-5
                  lg:justify-self-end
                  lg:text-base
                "
              >
                AI behöver inte förändra hela verksamheten på en gång. Börja
                där ni idag tappar tid eller information och bygg vidare därifrån.
              </p>
            </div>

            <div
              data-stagger
              className="
                grid
                gap-5
                md:grid-cols-2
                lg:grid-cols-3
              "
            >
              {FEATURES.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="
                      rounded-2xl
                      border
                      border-border/70
                      bg-card
                      p-7
                      transition-all
                      hover:-translate-y-0.5
                      hover:border-primary/30
                    "
                  >
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
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3
                      className="
                        mt-5
                        font-display
                        text-lg
                        font-bold
                      "
                    >
                      {feature.title}
                    </h3>

                    <p
                      className="
                        mt-3
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
            8. COMPARTNERS / IMPLEMENTATION
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
                    md:opacity-[0.18]
                  "
                  barsClassName="
                    translate-x-[48%]
                    translate-y-[18%]
                    scale-[1.2]

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
                  to-card/40
                  lg:via-card/85
                  lg:to-transparent
                "
              />

              <div
                className="
                  relative
                  z-10
                  grid
                  lg:grid-cols-12
                "
              >
                <div
                  className="
                    p-8
                    sm:p-10
                    md:p-12
                    lg:col-span-6
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
                    AI utan ett AI-projekt
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
                    Börja med problemet.
                    <br />
                    Inte tekniken.
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
                    AI skapar störst värde när den löser ett konkret problem:
                    för mycket efterarbete, förlorad information, långa
                    svarstider eller repetitiva kundfrågor.
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
                    Vi hjälper er därför att börja i arbetsflödet och koppla
                    på rätt teknik först därefter.
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
                    lg:col-span-6
                    lg:border-l
                    lg:border-t-0
                  "
                >
                  <div className="space-y-6">
                    {PROCESS_STEPS.map((step) => (
                      <div
                        key={step.number}
                        className="flex gap-4"
                      >
                        <span
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-primary/10
                            text-[11px]
                            font-bold
                            text-primary
                          "
                        >
                          {step.number}
                        </span>

                        <div>
                          <h3 className="text-sm font-bold">
                            {step.title}
                          </h3>

                          <p
                            className="
                              mt-1
                              text-sm
                              leading-relaxed
                              text-muted-foreground
                            "
                          >
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            9. CTA
        ========================================================== */}

        <section className="bg-background pb-20 md:pb-24">
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
                py-12
                text-center
                sm:px-12
                md:py-16
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
                    scale-[1.25]

                    md:translate-x-[38%]
                    md:scale-[1.45]
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
                <Sparkles
                  className="
                    mx-auto
                    mb-5
                    h-5
                    w-5
                    text-primary
                  "
                />

                <h2
                  className="
                    mx-auto
                    max-w-2xl
                    font-display
                    text-2xl
                    font-bold
                    tracking-tight
                    sm:text-3xl
                    md:text-4xl
                  "
                >
                  Var skulle AI göra mest nytta i er kunddialog?
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
                  Ni behöver inte veta vilken AI-plattform ni behöver. Börja
                  med att berätta var teamet tappar tid eller information så
                  hjälper vi er att hitta rätt nästa steg.
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
                  Diskutera AI med oss
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            10. FAQ
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
                  font-bold
                  uppercase
                  tracking-[0.18em]
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
                  md:text-4xl
                "
              >
                Innan ni börjar använda AI i kunddialogen.
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
                      aria-expanded={isOpen}
                      onClick={() =>
                        setOpenFaq(isOpen ? null : index)
                      }
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
            11. CONTACT
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