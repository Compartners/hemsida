"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Cloud,
  Headphones,
  Layers,
  Phone,
  PhoneCall,
  PhoneForwarded,
  RefreshCw,
  Settings,
  Shield,
  Smartphone,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import SEO from "@/components/SEO";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Contact from "@/components/Contact";
import SwitchboardPanel from "@/components/SwitchboardPanel";
import BrandSignalBars from "@/components/SignalBars";

const BENEFITS = [
  {
    icon: PhoneCall,
    title: "Rätt person svarar snabbare",
    description:
      "Styr inkommande samtal med svarsgrupper, köer, knappval och prioriteringar utifrån hur ert företag faktiskt arbetar.",
  },
  {
    icon: Smartphone,
    title: "Jobba från valfri plats",
    description:
      "Medarbetare kan använda företagsnumret från mobilen, datorn eller Teams – på kontoret, hemma eller på språng.",
  },
  {
    icon: Users,
    title: "En bättre kundupplevelse",
    description:
      "Kunden möts av rätt öppettider, tydliga val och ett professionellt samtalsflöde istället för att skickas runt.",
  },
];

const FEATURES = [
  {
    icon: Phone,
    title: "Svarsgrupper & köer",
    description:
      "Fördela inkommande samtal mellan rätt personer och team. Välj hur samtalen ska ringa och vad som händer om ingen svarar.",
  },
  {
    icon: PhoneForwarded,
    title: "Knappval & samtalsflöden",
    description:
      "Låt kunden välja exempelvis försäljning, support eller ekonomi och styr samtalet direkt till rätt funktion.",
  },
  {
    icon: Cloud,
    title: "Molnbaserad växel",
    description:
      "Växeln följer med användaren. Ingen lokal telefonväxel behöver installeras eller underhållas på kontoret.",
  },
  {
    icon: Layers,
    title: "Microsoft Teams",
    description:
      "Koppla företagstelefoni till Teams så att medarbetare kan ringa och ta emot externa samtal direkt i sitt vanliga arbetsverktyg.",
  },
  {
    icon: Settings,
    title: "Administration",
    description:
      "Hantera användare, öppettider, nummer, grupper och andra inställningar utan att bygga om hela lösningen.",
  },
  {
    icon: Headphones,
    title: "Personlig support",
    description:
      "Ni får hjälp både vid uppstart och när verksamheten förändras – utan att själva behöva bli experter på telefoni.",
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Vi kartlägger hur ni arbetar",
    description:
      "Vi går igenom nummer, användare, öppettider, samtalsvolymer, svarsgrupper och hur kunderna ska kunna nå er.",
  },
  {
    number: "02",
    title: "Vi bygger rätt lösning",
    description:
      "Utifrån behovet väljer vi plattform, abonnemang och funktioner och konfigurerar växeln innan flytten.",
  },
  {
    number: "03",
    title: "Nummer flyttas och teamet förbereds",
    description:
      "Vi hjälper till med portering av befintliga nummer och ser till att användarna vet hur lösningen fungerar.",
  },
  {
    number: "04",
    title: "Vi följer upp efter start",
    description:
      "När växeln är igång hjälper vi till med justeringar, nya användare och förändringar när verksamheten utvecklas.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Vad är egentligen en mobil växel?",
    a: "En mobil växel är företagets centrala system för inkommande och utgående telefoni. Den gör det möjligt att styra samtal till rätt person eller avdelning, använda gemensamma företagsnummer och låta medarbetare arbeta från mobil, dator eller andra anslutna enheter.",
  },
  {
    q: "Är ni bundna till en viss operatör eller plattform?",
    a: "Nej. Compartners arbetar operatörsoberoende och kan hjälpa er att välja lösning utifrån verksamhetens behov istället för att utgå från en enskild operatör eller plattform.",
  },
  {
    q: "Hur fungerar det med våra befintliga telefonnummer?",
    a: "Befintliga nummer kan normalt flyttas till den nya lösningen. Vi hjälper till med porteringen och planerar övergången så att bytet blir så smidigt som möjligt.",
  },
  {
    q: "Kan medarbetare svara både i mobilen och på datorn?",
    a: "Ja. Beroende på vald lösning kan användarna arbeta via mobilapp, datorapplikation, Microsoft Teams och vid behov även traditionella bordstelefoner.",
  },
  {
    q: "Kan vi ha olika öppettider och samtalsflöden?",
    a: "Ja. Växeln kan exempelvis styra samtal olika beroende på tid, dag, avdelning och tillgänglighet. Ni kan även använda välkomstmeddelanden, knappval, köer och hänvisningar.",
  },
  {
    q: "Hur lång tid tar det att byta växel?",
    a: "Ett normalt byte kan ofta genomföras inom cirka 1–2 veckor, men tiden beror bland annat på omfattning, vald lösning och portering av befintliga nummer. Vi planerar hela övergången tillsammans med er.",
  },
];

export default function MobilaVaxlar() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <SEO
        title="Mobil växel för företag – Företagstelefoni | Compartners"
        description="Mobil växel anpassad efter hur ert företag arbetar. Compartners hjälper er med svarsgrupper, köer, Teams, portering och personlig support."
        canonical="https://compartners.se/mobila-vaxlar"
      />

      <Navbar />

      <main>
        {/* =========================================================
            1. HERO
        ========================================================== */}
        <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-muted via-muted/50 to-background pt-32 pb-20 md:pt-44 md:pb-28">
          {/* =====================================================
              DEKORATIVA SIGNALSTAPLAR
              Stora + beskurna. Ska inte upplevas som diagram.
          ====================================================== */}

          {/* Extra atmosfär */}
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
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-4xl text-center"
            >
              <div className="mb-6 flex justify-center">
                <span className="rounded-full border border-primary/20 bg-background/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur-sm">
                  Företagstelefoni & mobil växel
                </span>
              </div>

              <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                En företagsväxel byggd efter{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  hur ni faktiskt arbetar.
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Vi hjälper er att samla företagets telefoni i en lösning där
                kunder når rätt person, medarbetarna kan arbeta var de än är
                och ni slipper anpassa verksamheten efter växeln.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#kontakt"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
                >
                  Prata med oss om er telefoni
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="#sa-fungerar-det"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background/70 px-6 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-muted"
                >
                  Se hur det fungerar
                </a>
              </div>

              <div className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground sm:text-sm">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Behåll befintliga nummer
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Mobil, dator & Teams
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Personlig hjälp hela vägen
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* =========================================================
            2. VAD ÄR EN MOBIL VÄXEL?
        ========================================================== */}
        <section className="relative overflow-hidden bg-background py-20 md:py-28">
          {/* Väldigt subtil dekor i kanten */}
          <BrandSignalBars
            size="md"
            align="left"
            glow={false}
            className="
              opacity-[0.545]
              md:opacity-[0.75]
            "
            barsClassName="
              -translate-x-[65%]
              translate-y-[18%]
              scale-[1.25]
              md:-translate-x-[55%]
              md:scale-[1.45]
            "
          />

          {/* Tonar bort motivet innan det når texten */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-r
              from-transparent
              via-background/70
              to-background
            "
          />

          <div className="container relative z-10 mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  Börja med behovet
                </span>

                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  En mobil växel är mer än ett nummer som ringer.
                </h2>

                <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                  Växeln bestämmer hur kunder kommer i kontakt med företaget,
                  vem som får samtalet och vad som händer när rätt person inte
                  kan svara.
                </p>

                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  Rätt uppsatt blir den en naturlig del av verksamheten. Fel
                  uppsatt skapar den istället onödiga köer, missade samtal och
                  administration.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-1">
                {BENEFITS.map((benefit) => {
                  const Icon = benefit.icon;

                  return (
                    <div
                      key={benefit.title}
                      className="group rounded-2xl border border-border/70 bg-card p-6 transition-colors hover:border-primary/30"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div>
                          <h3 className="font-display text-base font-bold text-foreground">
                            {benefit.title}
                          </h3>

                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
            3. SAMTALSRESAN

            MEDVETET INGA SIGNALSTAPLAR HÄR.
            De skulle lätt börja läsas som data / diagram.
        ========================================================== */}
        <section
          id="sa-fungerar-det"
          className="scroll-mt-24 border-y border-border/40 bg-muted/25 py-20 md:py-28"
        >
          <div className="container mx-auto max-w-6xl px-6">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Så fungerar det
              </span>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Från inkommande samtal till rätt person.
              </h2>

              <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Ni bestämmer hur kunden ska tas emot. Växeln sköter resten
                automatiskt utifrån era regler, öppettider och medarbetarnas
                tillgänglighet.
              </p>
            </div>

            <div className="relative grid gap-4 md:grid-cols-4">
              <div className="absolute left-[12%] right-[12%] top-8 hidden h-px bg-border md:block" />

              {[
                {
                  step: "01",
                  title: "Kunden ringer",
                  text: "Samtalet kommer in via företagets huvudnummer eller ett direktnummer.",
                },
                {
                  step: "02",
                  title: "Växeln styr",
                  text: "Öppettider, knappval och regler avgör vart samtalet ska skickas.",
                },
                {
                  step: "03",
                  title: "Rätt team får samtalet",
                  text: "Sälj, support eller en specifik medarbetare kan svara från mobil, dator eller Teams.",
                },
                {
                  step: "04",
                  title: "Ingen kan svara?",
                  text: "Samtalet kan köas, skickas vidare eller hanteras enligt ert förutbestämda flöde.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative rounded-2xl border border-border/70 bg-card p-6"
                >
                  <div className="relative z-10 mb-5 flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-bold text-primary">
                    {item.step}
                  </div>

                  <h3 className="font-display text-base font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            4. PRODUKTVISUALISERING
        ========================================================== */}
        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                En gemensam arbetsyta
              </span>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
                Överblick över samtal, kollegor och tillgänglighet.
              </h2>

              <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Medarbetarna kan se vem som är tillgänglig, hantera samtal och
                ändra sin egen status utan att behöva förstå tekniken bakom
                växeln.
              </p>
            </div>

            <SwitchboardPanel />
          </div>
        </section>

        {/* =========================================================
            5. FUNKTIONER
        ========================================================== */}
        <section
          id="funktioner"
          className="border-y border-border/40 bg-muted/20 py-20 md:py-28"
        >
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mb-14 grid gap-6 lg:grid-cols-2 lg:items-end">
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  Funktionerna bakom upplevelsen
                </span>

                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  Företagstelefoni som kan följa verksamheten.
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground lg:justify-self-end lg:text-base">
                Ni behöver inte aktivera allt från dag ett. Vi sätter upp det
                som skapar värde för er idag och kan utveckla lösningen när
                organisationen förändras.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="group rounded-2xl border border-border/70 bg-card p-7 transition-all hover:-translate-y-0.5 hover:border-primary/30"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-5 font-display text-lg font-bold text-foreground">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            6. VARFÖR COMPARTNERS
        ========================================================== */}
        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card">
              {/* ===================================================
                  SIGNALMOTIV SOM BAKGRUND
              ==================================================== */}
              <BrandSignalBars
                size="lg"
                align="right"
                className="
                  opacity-[0.12]
                  md:opacity-[0.3]
                "
                barsClassName="
                  translate-x-[45%]
                  translate-y-[15%]
                  scale-[1.1]
                  md:translate-x-[-20%]
                  md:scale-[1.2]
                "
              />

              {/* Gradient över grafiken */}
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

              <div className="relative z-10 grid lg:grid-cols-2">
                <div className="p-8 sm:p-10 md:p-12">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                    Oberoende rådgivning
                  </span>

                  <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
                    Börja med företaget.
                    <br />
                    Inte operatören.
                  </h2>

                  <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Behovet ser olika ut för ett mindre lokalt bolag, en
                    rikstäckande organisation och ett företag med support,
                    jour eller flera kontor.
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Därför börjar vi med hur ni arbetar och hjälper därefter
                    till att välja en lösning som passar verksamheten.
                  </p>
                </div>

                <div className="border-t border-border/60 bg-muted/20 p-8 backdrop-blur-[2px] sm:p-10 md:p-12 lg:border-l lg:border-t-0">
                  <div className="space-y-6">
                    {[
                      {
                        icon: RefreshCw,
                        title: "Operatörsoberoende",
                        text: "Lösningen utgår från era behov istället för från en enskild leverantör.",
                      },
                      {
                        icon: Shield,
                        title: "En kontakt genom hela bytet",
                        text: "Vi hjälper till från kartläggning och konfiguration till portering och uppföljning.",
                      },
                      {
                        icon: Zap,
                        title: "Lösningen kan förändras",
                        text: "När teamet växer eller arbetssättet ändras kan växeln justeras utan att ni behöver börja om.",
                      },
                    ].map((item) => {
                      const Icon = item.icon;

                      return (
                        <div key={item.title} className="flex gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>

                          <div>
                            <h3 className="text-sm font-bold text-foreground">
                              {item.title}
                            </h3>

                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
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
            7. PROCESS

            OCKSÅ MEDVETET UTAN STAPLAR.
        ========================================================== */}
        <section className="border-y border-border/40 bg-muted/20 py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Från gammalt till nytt
              </span>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
                Ett växelbyte behöver inte bli ett IT-projekt.
              </h2>

              <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Vi hjälper till med hela övergången och ser till att den nya
                lösningen är förberedd innan den tas i bruk.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-3xl border border-border/70 bg-border/70 md:grid-cols-2">
              {PROCESS_STEPS.map((step) => (
                <div key={step.number} className="bg-card p-7 sm:p-8">
                  <span className="text-xs font-bold tracking-widest text-primary">
                    {step.number}
                  </span>

                  <h3 className="mt-3 font-display text-lg font-bold">
                    {step.title}
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <p className="text-sm leading-relaxed text-muted-foreground">
                Ett normalt införande kan ofta vara klart inom ungefär{" "}
                <strong className="font-semibold text-foreground">
                  1–2 veckor
                </strong>
                , beroende på lösning, omfattning och portering av befintliga
                nummer.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================
            8. MELLAN-CTA
        ========================================================== */}
        <section className="bg-background py-20 md:py-24">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card px-7 py-10 text-center sm:px-12 md:py-14">
              {/* Accent bakom CTA:n */}
              <BrandSignalBars
                size="md"
                align="right"
                glow={false}
                className="
                  opacity-[0.10]
                  md:opacity-[0.15]
                "
                barsClassName="
                  translate-x-[55%]
                  translate-y-[20%]
                  scale-[1.15]
                  md:translate-x-[35%]
                  md:scale-[1.35]
                "
              />

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
                <h2 className="mx-auto max-w-2xl font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  Osäker på vilken växellösning ni egentligen behöver?
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Ni behöver inte välja plattform, licenser eller funktioner
                  innan ni kontaktar oss. Börja med att berätta hur ni arbetar
                  så hjälper vi er att reda ut resten.
                </p>

                <a
                  href="#kontakt"
                  className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Diskutera er lösning
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            9. FAQ
        ========================================================== */}
        <section className="border-t border-border/40 bg-muted/30 py-20 md:py-28">
          <div className="container mx-auto max-w-4xl px-6">
            <div className="mb-12 text-center">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Vanliga frågor
              </span>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Innan ni byter företagsväxel.
              </h2>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openFaq === index;

                return (
                  <div
                    key={item.q}
                    className="overflow-hidden rounded-2xl border border-border/70 bg-card"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-5 p-5 text-left text-sm font-semibold text-foreground transition-colors hover:text-primary md:p-6 md:text-base"
                    >
                      <span>{item.q}</span>

                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="border-t border-border/40 px-5 pb-6 pt-4 text-sm leading-relaxed text-muted-foreground md:px-6">
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

        <div id="kontakt" className="scroll-mt-24">
          <Contact />
        </div>
      </main>

      <Footer />
    </div>
  );
}