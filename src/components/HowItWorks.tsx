"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useMotionTemplate, type Variants } from "framer-motion";

interface StepItem {
  number: string;
  title: string;
  text: string;
  highlight: string;
}

const steps: readonly StepItem[] = [
  {
    number: "01",
    title: "Vi lyssnar",
    text: "Vi kartlägger era nuvarande arbetsflöden, operatörsavtal och specifika utmaningar.",
    highlight: "Behovsanalys",
  },
  {
    number: "02",
    title: "Vi hittar rätt",
    text: "Vi sätter ihop den optimala lösningen – helt operatörsoberoende och skräddarsytt.",
    highlight: "Rätt plattform",
  },
  {
    number: "03",
    title: "Vi driftsätter",
    text: "Vi hanterar portering, konfigurering och utbildning så ni slipper driftstopp.",
    highlight: "Smidig övergång",
  },
  {
    number: "04",
    title: "Vi finns kvar",
    text: "Ni har alltid en personlig kontaktperson för löpande support, tillväxt och justeringar.",
    highlight: "Dedikerad support",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 24,
      stiffness: 110,
    },
  },
};

const StepCard = ({ step, index }: { step: StepItem; index: number }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.01 }}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-7 backdrop-blur-md shadow-sm hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 ease-out"
    >
      {/* Bakgrunds-glow som följer muspekaren */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              220px circle at ${mouseX}px ${mouseY}px,
              rgba(var(--primary-rgb, 59, 130, 246), 0.12),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10">
        {/* Header: Siffra + Highlight Badge */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <span className="font-mono text-2xl md:text-3xl font-bold text-primary group-hover:text-primary transition-colors duration-300">
            {step.number}
          </span>
          <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {step.highlight}
          </span>
        </div>

        <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 tracking-tight">
          {step.title}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-normal">
          {step.text}
        </p>
      </div>

      {/* Stegindikator i botten */}
      <div className="relative z-10 mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
        <span>Steg {index + 1} av 4</span>
        <span className="font-medium text-primary/60 group-hover:text-primary transition-colors">
          0{index + 1}
        </span>
      </div>
    </motion.div>
  );
};

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section 
      ref={sectionRef} 
      id="sa-fungerar-det" 
      className="relative py-20 md:py-28 overflow-hidden bg-muted/30 border-y border-border/40"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/5 rounded-full blur-[140px] -z-10"
      />

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center space-y-3 mb-16"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
            Processen
          </span>

          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Från behov till{" "}
              driftsatt lösning.

          </h2>

          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Vi gör övergången enkel och trygg utan avbrott i er dagliga verksamhet.
          </p>
        </motion.div>

        {/* 4-stegs Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
        >
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}