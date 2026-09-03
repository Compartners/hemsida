"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: readonly FAQItem[] = [
  {
    question: "Är ni bundna till en viss operatör?",
    answer:
      "Nej, vi är helt operatörsoberoende. Det betyder att vi alltid kan rekommendera det nät, den växel och det avtal som ger bäst förutsättningar och pris för just er verksamhet.",
  },
  {
    question: "Kan vi behålla våra befintliga telefonnummer?",
    answer:
      "Ja, självklart. Vi hanterar hela porteringsprocessen med er tidigare operatör och ser till att bytet sker helt sömlöst utan några avbrott i er tillgänglighet.",
  },
  {
    question: "Kan ni hjälpa oss att byta från vår nuvarande lösning?",
    answer:
      "Absolut. Vi börjar med att gå igenom era nuvarande avtal, kostnader och arbetsflöden för att ta fram en mer kostnadseffektiv och modern lösning anpassad efter era behov.",
  },
  {
    question: "Vad händer efter att lösningen är installerad och klar?",
    answer:
      "Vårt samarbete slutar inte vid leverans. Ni får en dedikerad kontaktperson hos oss som hjälper till med löpande support, förändringar av abonnemang och framtida uppskalning.",
  },
  {
    question: "Passar era tjänster både mindre och större företag?",
    answer:
      "Ja. Våra lösningar är modulära och skalbara – vi hjälper allt från mindre ägarledda företag till organisationer med flera hundra anställda och komplexa växelkrav.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="relative py-20 md:py-28 overflow-hidden bg-background border-t border-border/40">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-primary/5 rounded-full blur-[140px] -z-10"
      />

      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center space-y-3 mb-14"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
            FAQ
          </span>

          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Vanliga{" "}
              frågor & svar
          </h2>

          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Här har vi samlat svaren på de vanligaste funderingarna kring hur vi arbetar och hur ett byte går till.
          </p>
        </motion.div>

        {/* FAQ Accordion List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3.5"
        >
          {FAQ_DATA.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.question}
                className={`rounded-2xl border transition-all duration-300 backdrop-blur-md overflow-hidden ${
                  isOpen
                    ? "bg-card/90 border-primary/40 shadow-lg shadow-primary/5"
                    : "bg-card/50 border-border/60 hover:border-border/90 hover:bg-card/70"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors"
                >
                  <span className="font-display text-base sm:text-lg font-semibold text-foreground tracking-tight">
                    {item.question}
                  </span>

                  {/* Minimalistisk plus/minus-indikator utan externa ikoner */}
                  <span
                    aria-hidden="true"
                    className={`font-mono text-lg font-bold transition-transform duration-300 shrink-0 select-none ${
                      isOpen ? "text-primary rotate-45" : "text-muted-foreground"
                    }`}
                  >
                    +
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-sm sm:text-base leading-relaxed text-muted-foreground border-t border-border/30">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}