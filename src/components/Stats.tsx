"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";

interface StatItem {
  value: number;
  suffix?: string;
  label: string;
  subtext: string;
}

const STATS: readonly StatItem[] = [
  {
    value: 500,
    suffix: "+",
    label: "Nöjda företag",
    subtext: "Långsiktiga kundsamarbeten",
  },
  {
    value: 30,
    suffix: "+",
    label: "År i branschen",
    subtext: "Gedigen telekomerfarenhet",
  },
  {
    value: 24,
    suffix: "h",
    label: "Snabb återkoppling",
    subtext: "Alltid personlig kontakt",
  },
  {
    value: 100,
    suffix: "%",
    label: "Engagemang",
    subtext: "I varje enskild leverans",
  },
];

// Smidig 60fps-räknare utan React-rerenders via direct DOM-uppdatering
const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || !isInView) return;

    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1], // expo out för professionell känsla
      onUpdate(latest) {
        node.textContent = `${Math.floor(latest)}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [value, suffix, isInView]);

  return (
    <span
      ref={nodeRef}
      className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground"
    >
      0{suffix}
    </span>
  );
};

export default function Stats() {
  return (
    <section className="relative py-16 md:py-24 bg-muted/40 overflow-hidden border-y border-border/40">
      {/* Subtilt centrerat bakgrundsljus */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[140px] -z-10"
      />

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Rubrik */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-primary font-semibold text-xs md:text-sm uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            Fakta & Erfarenhet
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mt-3 mb-2 tracking-tight">
            Siffror som skapar <span className="text-primary">trygghet</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Vi bygger långsiktiga relationer genom personlig service och driftsäkra lösningar.
          </p>
        </motion.div>

        {/* Minimalistiskt Stat-grid med integrerade borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-border/50">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="group relative flex flex-col items-center text-center p-6 sm:p-8 hover:bg-card/40 rounded-2xl lg:rounded-none transition-colors duration-300"
            >
              {/* Räknare */}
              <div className="mb-2">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>

              {/* Etikett & Subtext */}
              <div className="space-y-0.5">
                <span className="block font-display font-semibold text-foreground text-sm md:text-base">
                  {stat.label}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {stat.subtext}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}