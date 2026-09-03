"use client";

import { useState } from "react";
import {
  FileText,
  Car,
  Smartphone,
  Navigation,
  ChevronDown,
  Calculator,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";

const FAQ_ITEMS = [
  {
    q: "Uppfyller körjournalen Skatteverkets alla krav?",
    a: "Ja, till 100%. Systemet loggar automatiskt datum, klockslag, start- och slutadress, mätarställning samt resans syfte. Du får kompletta underlag redo för revision med ett klick.",
  },
  {
    q: "Fungerar enheten i alla bilmodeller och elbilar?",
    a: "Ja. Enheten pluggas enkelt in i bilens OBD-uttag på under 30 sekunder och fungerar på alla moderna personbilar, elbilar, hybrider och transportbilar.",
  },
  {
    q: "Hur skiljer jag på privata resor och tjänsteresor?",
    a: "Med ett enkelt svep i mobilappen eller via schemalagda arbetstider. Privata resor döljer positionsdata automatiskt för att skydda förarnas personliga integritet (GDPR).",
  },
  {
    q: "Kan flera medarbetare dela på samma fordon?",
    a: "Absolut! Förare kan enkelt logga in med sin profil i appen eller via RFID-bricka i bilen så att resan bokförs på rätt person automatiskt.",
  },
];

export default function Korjournaler() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [carCount, setCarCount] = useState(5);

  const savedHoursPerMonth = carCount * 2.5;
  const savedSekPerYear = carCount * 2.5 * 12 * 450;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <SEO
        title="Elektronisk Körjournal – 100% Automatisk & Skatteverksgodkänd | Compartners"
        description="Slipp manuella anteckningar och skatterisker. Compartners elektroniska körjournal loggar alla resor automatiskt via GPS och OBD."
        canonical="https://compartners.se/korjournaler"
      />
      <Navbar />

      <main>
        {/* ============================================================
            1. REN HERO (MÖRK / ACCENTUERAD BAKGRUND)
        ============================================================ */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden bg-gradient-to-b from-muted/100 via-muted/50 to-muted/30 border-b border-border/40">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary/5 rounded-full blur-[140px] -z-10"
          />

          <div className="container mx-auto px-6 max-w-5xl text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
                Körjournalen som sköter sig själv.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
                  100% automatiskt.
                </span>
              </h1>
            </motion.div>
          </div>
        </section>

        {/* ============================================================
            2. INTERAKTIV GPS / TRIP-ILLUSTRATION (UNDER HERON)
        ============================================================ */}
        <section className="py-16 md:py-24 bg-muted/20">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Live Data</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Automatisk loggning meter för meter
              </h2>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 md:p-10 rounded-3xl bg-card/90 backdrop-blur-xl border border-border/80 shadow-2xl shadow-primary/5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">Senaste registrerade rutt</div>
                    <div className="text-xs text-muted-foreground">Idag 08:42 • Volvo XC60 (ABC 123)</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Tjänsteresa verifierad
                  </span>
                </div>
              </div>

              {/* Ruttvisning */}
              <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center mt-1">
                      <span className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20" />
                      <span className="w-0.5 h-12 bg-gradient-to-b from-primary to-accent" />
                      <span className="w-3 h-3 rounded-full bg-accent ring-4 ring-accent/20" />
                    </div>
                    <div className="space-y-6 flex-1 text-xs md:text-sm">
                      <div>
                        <div className="text-muted-foreground text-xs">Start 08:14 • Mätare: 12 450 km</div>
                        <div className="font-semibold text-foreground text-base">Huvudkontoret, Storgatan 12</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">Stopp 08:42 • Mätare: 12 478 km</div>
                        <div className="font-semibold text-foreground text-base">Kundbesök: Tuna Entreprenad</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 md:border-l md:border-border/60 md:pl-8 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3.5 rounded-2xl bg-background/70 border border-border/50">
                      <div className="text-xs text-muted-foreground">Total sträcka</div>
                      <div className="font-display font-bold text-lg md:text-xl text-foreground mt-0.5">28.4 km</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-background/70 border border-border/50">
                      <div className="text-xs text-muted-foreground">Körtid</div>
                      <div className="font-display font-bold text-lg md:text-xl text-foreground mt-0.5">28 min</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs text-primary font-semibold">
                    <span>Exportstatus</span>
                    <span>Klar för revision ✓</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================
            3. FUNKTIONER / BENTO GRID
        ============================================================ */}
        <section className="py-20 md:py-28 bg-background border-t border-border/40">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-primary font-semibold text-xs md:text-sm uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                Funktioner
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Allt du behöver för full kontroll på vagnparken
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-7 rounded-2xl bg-card border border-border/70 hover:border-primary/40 transition-colors space-y-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Car className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">Automatisk GPS-start</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Så fort tändningen slås på börjar loggningen. Inga knappar som måste tryckas på, inga appar som måste startas manuellt.
                </p>
              </div>

              <div className="p-7 rounded-2xl bg-card border border-border/70 hover:border-primary/40 transition-colors space-y-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center text-primary">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">Svep i appen</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Gör ett snabbt svep till höger för tjänsteresa eller vänster för privat. Föraren kan lägga till syfte och projektnummer direkt.
                </p>
              </div>

              <div className="p-7 rounded-2xl bg-card border border-border/70 hover:border-primary/40 transition-colors space-y-4">
                <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">Färdiga Skatterapporter</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Exportera kompletta månadssammanställningar till lönekontoret eller Skatteverket i Excel/PDF med en enda knapptryckning.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================
            4. KALKYLATOR
        ============================================================ */}
        <section id="kalkylator" className="py-20 md:py-28 bg-muted/20 border-t border-border/40">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="p-8 md:p-12 rounded-3xl bg-card border border-border shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                <div className="md:col-span-6 space-y-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                    <Calculator className="w-4 h-4" />
                    Ekonomisk kalkyl
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    Vad kostar manuell administration er idag?
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Dra i reglaget för att se hur mycket tid och pengar ni sparar varje månad på att automatisera körjournalerna.
                  </p>

                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Antal fordon i företaget:</span>
                      <span className="text-primary font-bold text-base">{carCount} st</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={50}
                      value={carCount}
                      onChange={(e) => setCarCount(Number(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>

                <div className="md:col-span-6 grid grid-cols-1 gap-4 p-6 rounded-2xl bg-muted/40 border border-border/60">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Sparad administrativ tid</span>
                    <div className="font-display text-3xl font-bold text-foreground">
                      ~{savedHoursPerMonth} timmar <span className="text-sm font-normal text-muted-foreground">/ månad</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/40 space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Uppskattat värde i sparad tid</span>
                    <div className="font-display text-3xl font-bold text-primary">
                      ~{savedSekPerYear.toLocaleString("sv-SE")} kr <span className="text-sm font-normal text-muted-foreground">/ år</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground pt-1">
                    * Beräknat på 2.5h administration per förare/månad inkl. minskad risk för skattetillägg.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            5. FAQ
        ============================================================ */}
        <section className="py-20 bg-background border-t border-border/40">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-12 space-y-2">
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">FAQ</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Vanliga frågor om körjournaler</h2>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div 
                    key={index}
                    className="rounded-2xl border border-border/70 bg-card overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-5 text-left font-semibold text-foreground text-sm md:text-base hover:text-primary transition-colors"
                    >
                      <span>{item.q}</span>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
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

        {/* Kontaktsektion */}
        <div id="kontakt">
          <Contact />
        </div>
      </main>

      <Footer />
    </div>
  );
}