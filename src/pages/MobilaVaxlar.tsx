"use client";

import { useState } from "react";
import {
  Phone,
  Users,
  Settings,
  Zap,
  Cloud,
  Shield,
  PhoneCall,
  PhoneForwarded,
  Clock,
  ChevronDown,
  Layers,
  Headphones,
  Sliders,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import { Switch } from "@radix-ui/react-switch";
import SwitchboardPanel from "@/components/SwitchboardPanel";

const TEAM_MEMBERS = [
  { name: "Johan Berg", role: "Sälj / Stockholm", status: "available", ext: "101" },
  { name: "Sara Lindqvist", role: "Supportchef", status: "busy", ext: "102" },
  { name: "Mikael Ek", role: "Projektledare", status: "lunch", ext: "103" },
  { name: "Elin Andersson", role: "Ekonomi", status: "available", ext: "104" },
];

const FAQ_ITEMS = [
  {
    q: "Är ni bundna till en viss operatör eller plattform?",
    a: "Nej, vi är helt operatörsoberoende. Vi jobbar med marknadens ledande plattformar (bland annat Lynes, Telia och Tele2) och sätter ihop den lösning som passar just ert sätt att arbeta.",
  },
  {
    q: "Hur fungerar det med våra befintliga telefonnummer?",
    a: "Vi tar hand om hela porteringen åt er. Ni behåller alla era fasta och mobila nummer utan något som helst driftavbrott under övergången.",
  },
  {
    q: "Kan medarbetare svara både i mobilen och på datorn?",
    a: "Ja! Växeln fungerar sömlöst via mobilapp, datorapplikation (softphone för Mac/PC), Microsoft Teams-integration och klassiska bordstelefoner om ni önskar det.",
  },
  {
    q: "Hur snabbt kan vi komma igång med en ny växel?",
    a: "Vanligtvis är allt uppsatt och klart inom 1–2 veckor beroende på porteringstider. Vi konfigurerar alla samtalsflöden och utbildar ert team innan skarp start.",
  },
];

export default function MobilaVaxlar() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedQueue, setSelectedQueue] = useState<"sales" | "support">("sales");

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <SEO
        title="Mobil växel för företag – Oberoende växellösningar | Compartners"
        description="Skräddarsydd mobil växel från Compartners. Smarta köer, svarsgrupper och personlig support oavsett operatör."
        canonical="https://compartners.se/mobila-vaxlar"
      />
      <Navbar />

      <main>
        {/* ============================================================
            1. REN HERO (MÖRK / ACCENTUERAD BAKGRUND)
        ============================================================ */}
        <section className="relative pt-33 pb-16 md:pt-44 md:pb-20 overflow-hidden bg-gradient-to-b from-muted/100 via-muted/50 to-muted/30 border-b border-border/40">
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
                Mobil växel anpassad efter{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
                  hur ni faktiskt jobbar.
                </span>
              </h1>
              <div>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
                  Skräddarsydd mobil växel från Compartners. Smarta köer, svarsgrupper och personlig support oavsett operatör.
                </p>
              </div>
            </motion.div>

            {/* Badges */}
          </div>
        </section>
            <SwitchboardPanel/>
        {/* ============================================================
            2. INTERAKTIV VÄXEL-ILLUSTRATION (PLACERAD UNDER HERON)
        ============================================================ */}
        <section className="py-16 md:py-24 bg-muted/20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Interaktiv översikt</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Så fungerar ert samtalsflöde i realtid
              </h2>
            </div>

            <div className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-2xl p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Vänster: Inkommande köer & svarsgrupper */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5 text-primary" />
                      Svarsgrupper
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                      Växeln är öppen
                    </span>
                  </div>

                  {/* Svarsgrupp 1: Sälj */}
                  <div
                    onClick={() => setSelectedQueue("sales")}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
                      selectedQueue === "sales"
                        ? "bg-primary/10 border-primary/50 shadow-sm"
                        : "bg-background/60 border-border/50 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-primary/15 text-primary">
                          <PhoneCall className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-foreground">Huvudnummer Sälj</div>
                          <div className="text-xs text-muted-foreground">010-210 27 00</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-background border border-border">
                        0 i kö
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-3 pt-1">
                      <span>Metod: Ring alla samtidigt</span>
                      <span>•</span>
                      <span>Svarstid: ~4s</span>
                    </div>
                  </div>

                  {/* Svarsgrupp 2: Support */}
                  <div
                    onClick={() => setSelectedQueue("support")}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
                      selectedQueue === "support"
                        ? "bg-primary/10 border-primary/50 shadow-sm"
                        : "bg-background/60 border-border/50 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-secondary/30 text-primary">
                          <Headphones className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-foreground">Kundsupport & Jour</div>
                          <div className="text-xs text-muted-foreground">010-210 27 10</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        1 i kö
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-3 pt-1">
                      <span>Metod: Linjär prioritering</span>
                      <span>•</span>
                      <span>Återuppringning aktiv</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 flex items-center gap-3 text-xs text-muted-foreground">
                    <PhoneForwarded className="w-4 h-4 text-primary shrink-0" />
                    <span>Nattkoppling & helgmeddelanden styrs automatiskt via kalendern.</span>
                  </div>
                </div>

                {/* Höger: Live Status på medarbetare */}
                <div className="lg:col-span-7 space-y-4 lg:border-l lg:border-border/60 lg:pl-8">
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      Anslutna kollegor & Status
                    </span>
                    <span className="text-[11px] text-muted-foreground">Synkad med kalender & Teams</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TEAM_MEMBERS.map((member) => (
                      <div
                        key={member.name}
                        className="p-3.5 rounded-xl bg-background/70 border border-border/60 flex items-center justify-between hover:border-primary/40 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <div className="font-semibold text-xs md:text-sm text-foreground flex items-center gap-1.5">
                            {member.name}
                            <span className="text-[10px] text-muted-foreground font-normal">#{member.ext}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground">{member.role}</div>
                        </div>

                        {/* Statusindikator */}
                        <div>
                          {member.status === "available" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Ledig
                            </span>
                          )}
                          {member.status === "busy" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              I samtal
                            </span>
                          )}
                          {member.status === "lunch" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                              <Clock className="w-3 h-3" />
                              Lunch
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* App preview banner */}
                  <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/5 to-transparent border border-primary/20 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Full funktion i mobilen & Teams</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Koppla samtal, byt svarsstatus eller lyssna på röstbrevlådor med ett klick.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-primary shrink-0 ml-4">iOS / Android / Mac / PC</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            3. FUNKTIONER / BENTO GRID
        ============================================================ */}
        <section id="funktioner" className="py-20 md:py-28 bg-background border-t border-border/40">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-primary font-semibold text-xs md:text-sm uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                Funktioner som gör skillnad
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Allt er företagstelefoni behöver på en och samma plats
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-7 rounded-2xl bg-card border border-border/70 hover:border-primary/40 transition-colors space-y-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">Smarta samtalsflöden & Köer</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Ställ in knappval (IVR), prioriteringar och återuppringning så att era kunder alltid når rätt person snabbt.
                </p>
              </div>

              <div className="p-7 rounded-2xl bg-card border border-border/70 hover:border-primary/40 transition-colors space-y-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center text-primary">
                  <Cloud className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">100% Molnbaserat</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Ingen hårdvara eller lokala servrar som kräver underhåll. Allt uppdateras löpande och fungerar överallt.
                </p>
              </div>

              <div className="p-7 rounded-2xl bg-card border border-border/70 hover:border-primary/40 transition-colors space-y-4">
                <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-primary">
                  <Settings className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">Enkel Administration</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Lägg till nya kollegor, ändra öppettider och hantera licenser direkt via en tydlig webbportal.
                </p>
              </div>

              <div className="p-7 rounded-2xl bg-card border border-border/70 hover:border-primary/40 transition-colors space-y-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">Microsoft Teams-integration</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Ring och ta emot externa växelsamtal direkt i Teams-klienten utan att byta program.
                </p>
              </div>

              <div className="p-7 rounded-2xl bg-card border border-border/70 hover:border-primary/40 transition-colors space-y-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center text-primary">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">Snabb & Trygg Portering</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Vi sköter all kontakt med er tidigare operatör. Ni behåller alla nummer och slipper driftstopp.
                </p>
              </div>

              <div className="p-7 rounded-2xl bg-card border border-border/70 hover:border-primary/40 transition-colors space-y-4">
                <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-primary">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">Personlig Support & Utbildning</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Ni får en dedikerad kontaktperson hos oss som hjälper till med allt från utbildning till löpande justeringar.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================
            4. FAQ
        ============================================================ */}
        <section className="py-20 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-12 space-y-2">
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">FAQ</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Vanliga frågor om mobila växlar</h2>
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
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
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