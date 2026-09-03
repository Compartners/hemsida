"use client";

import { useState, useEffect, useRef } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring,
  type Variants 
} from "framer-motion";

const OPERATORS = ["Telia", "Tele2", "Telenor", "Tre"];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 120,
    },
  },
};

export default function WhyChooseUs() {
  const [activeOperator, setActiveOperator] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-driven 3D-tilt och framträdande ur mörker
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001,
  });

  // 3D vinkel & skala
  const gridRotateX = useTransform(smoothProgress, [0, 1], [35, 0]);
  const gridScale = useTransform(smoothProgress, [0, 1], [0.70, 1]);

  // Framträdande ur mörkret: Korten startar nästan helt dolda (0.05) och tonas in
  const gridOpacity = useTransform(smoothProgress, [0, 0.85], [0.05, 1]);

  // Skugglager: Börjar på 75% svart skugga och tonas bort till 0% när de når ljuset
  const darkOverlayOpacity = useTransform(smoothProgress, [0, 0.8], [0.75, 0]);

  // Bakgrunds-glow väcks till liv ur mörkret
  const glowOpacity = useTransform(smoothProgress, [0.2, 1], [0, 0.18]);
  const glowScale = useTransform(smoothProgress, [0, 1], [0.5, 1.2]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveOperator((prev) => (prev + 1) % OPERATORS.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="varfor-valja-oss" 
      className="relative py-20 md:py-32 overflow-hidden bg-background"
    >
      {/* Scroll-drivet ambient bakgrundsljus som väcks ur mörkret */}
      <motion.div 
        aria-hidden="true" 
        style={{
          opacity: glowOpacity,
          scale: glowScale,
        }}
        className="pointer-events-none absolute -top-40 right-1/3 w-[600px] h-[400px] bg-primary rounded-full blur-[140px] -z-10" 
      />

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center space-y-3 mb-16"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
            Fördelar
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Varför företag{" "}
              väljer oss
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Vi gör företagstelefoni enkelt, driftsäkert och kostnadseffektivt – utan krångel och låsta avtal.
          </p>
        </motion.div>

        {/* 3D-aktiverad Bento Grid Container som kliver fram ur mörkret */}
        <div style={{ perspective: "1400px" }}>
          <motion.div 
            style={{
              rotateX: gridRotateX,
              scale: gridScale,
              opacity: gridOpacity,
              transformStyle: "preserve-3d",
            }}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 will-change-transform"
          >
            {/* Kort 1: 100% Operatörsoberoende */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="md:col-span-2 relative flex flex-col justify-between p-7 md:p-8 rounded-sm border border-white/20 bg-gradient-to-br from-card/90 via-card/50 to-muted/20 backdrop-blur-xl overflow-hidden group shadow-sm hover:border-primary/40 hover:shadow-xl transition-all duration-300"
            >
              {/* Dynamiskt mörker-overlay som tonas bort */}
              <motion.div 
                style={{ opacity: darkOverlayOpacity }}
                className="pointer-events-none absolute inset-0 bg-black z-[1]"
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Oberoende
                  </span>

                  {/* Växlande operatörsindikator */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 border border-border/60 text-xs">
                    <span className="text-muted-foreground font-medium">Vi jämför:</span>
                    <motion.span 
                      key={OPERATORS[activeOperator]}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="font-bold text-primary inline-block min-w-[50px]"
                    >
                      {OPERATORS[activeOperator]}
                    </motion.span>
                  </div>
                </div>

                <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
                  Alltid den bästa operatören för ert läge
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md">
                  Vi är inte bundna till något enskilt nät. Vi väljer den operatör som ger era kontor och medarbetare bäst täckning till lägst totalkostnad.
                </p>
              </div>

              <div className="relative z-10 flex flex-wrap gap-2 mt-8 pt-6 border-t border-border/40">
                {["Bästa lokala täckning", "Lägre samtalskostnader", "Rätt avtalslängd"].map((tag) => (
                  <span key={tag} className="inline-flex items-center text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Kort 2: Personlig Support utan kö */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="relative flex flex-col justify-between p-7 rounded-sm border border-white/20 bg-card/60 backdrop-blur-xl overflow-hidden group hover:border-primary/40 hover:shadow-xl transition-all duration-300"
            >
              {/* Dynamiskt mörker-overlay */}
              <motion.div 
                style={{ opacity: darkOverlayOpacity }}
                className="pointer-events-none absolute inset-0 bg-black z-[1]"
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Support
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Snabb respons
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  En dedikerad kontaktperson
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  När ni behöver hjälp ringer ni direkt till er personliga rådgivare som redan kan er lösning och organisation.
                </p>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-border/40 flex items-center text-xs font-semibold text-primary">
                Slipp långa telefonköer
              </div>
            </motion.div>

            {/* Kort 3: Färdigkonfigurerat från start */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="relative flex flex-col justify-between p-7 rounded-sm border border-white/20 bg-card/60 backdrop-blur-xl overflow-hidden group hover:border-primary/40 hover:shadow-xl transition-all duration-300"
            >
              {/* Dynamiskt mörker-overlay */}
              <motion.div 
                style={{ opacity: darkOverlayOpacity }}
                className="pointer-events-none absolute inset-0 bg-black z-[1]"
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Uppstart
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  Nyckelfärdigt & testat
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Vi bygger alla svarsgrupper, scheman och kopplingar i förväg så att allt fungerar direkt från dag ett.
                </p>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Inget internt IT-arbete</span>
                <div className="w-9 h-5 rounded-full bg-primary/20 p-0.5 flex items-center justify-end border border-primary/30">
                  <div className="w-4 h-4 rounded-full bg-primary" />
                </div>
              </div>
            </motion.div>

            {/* Kort 4: Skalar med bolagets tillväxt */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="md:col-span-3 lg:col-span-4 relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-7 md:p-8 rounded-sm border border-white/20 bg-gradient-to-r from-card/80 via-card/40 to-primary/5 backdrop-blur-xl overflow-hidden group hover:border-primary/40 hover:shadow-xl transition-all duration-300 gap-6"
            >
              {/* Dynamiskt mörker-overlay */}
              <motion.div 
                style={{ opacity: darkOverlayOpacity }}
                className="pointer-events-none absolute inset-0 bg-black z-[1]"
              />

              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
                  Skalbarhet
                </span>
                <h3 className="font-display text-lg md:text-xl font-bold text-foreground">
                  Lösningen växer i er takt
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mt-0.5 max-w-2xl">
                  Lägg till eller ta bort abonnemang, uppgradera telefoner och koppla på nya kontor med ett enkelt samtal eller mejl till oss.
                </p>
              </div>

              <div className="relative z-10 flex items-end gap-1.5 h-8 shrink-0 self-end sm:self-auto px-4 py-1.5 rounded-xl bg-background/50 border border-border/40">
                <span className="w-2 h-3 bg-primary/30 rounded-sm" />
                <span className="w-2 h-4 bg-primary/50 rounded-sm" />
                <span className="w-2 h-6 bg-primary/70 rounded-sm" />
                <span className="w-2 h-8 bg-primary rounded-sm shadow-sm shadow-primary/50" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}