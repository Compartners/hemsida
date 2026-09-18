"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  type Variants,
} from "framer-motion";


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
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 110,
    },
  },
};

const StepCard = ({
  step,
  index,
}: {
  step: StepItem;
  index: number;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const glowBackground = useMotionTemplate`
    radial-gradient(
      220px circle at ${mouseX}px ${mouseY}px,
      hsl(var(--primary) / 0.10),
      transparent 78%
    )
  `;

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -4,
      }}
      onMouseMove={handleMouseMove}
      className="
        group
        relative
        flex
        flex-col
        justify-between
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-card
        p-6
        shadow-card
        transition-all
        duration-300
        hover:border-primary/30
        hover:shadow-lifted
        sm:p-7
      "
    >
      {/* Subtil pointer-signal */}
      <motion.div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -inset-px
          rounded-2xl
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
        style={{
          background: glowBackground,
        }}
      />

      <div className="relative z-10">
        {/* Nummer + processetikett */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <span
            className="
              font-technical
              text-2xl
              font-medium
              tracking-tight
              text-primary
              md:text-3xl
            "
          >
            {step.number}
          </span>

          <span
            className="
              text-[11px]
              font-medium
              uppercase
              tracking-[0.12em]
              text-muted-foreground
            "
          >
            {step.highlight}
          </span>
        </div>

        <h3
          className="
            font-display
            text-lg
            font-bold
            tracking-tight
            text-foreground
            transition-colors
            duration-300
            group-hover:text-primary
          "
        >
          {step.title}
        </h3>

        <p
          className="
            mt-2
            text-sm
            font-normal
            leading-relaxed
            text-muted-foreground
          "
        >
          {step.text}
        </p>
      </div>

      {/* Stegindikator */}
      <div
        className="
          relative
          z-10
          mt-6
          flex
          items-center
          justify-between
          border-t
          border-border
          pt-4
          text-xs
          text-muted-foreground
        "
      >
        <span>
          Steg {index + 1} av {steps.length}
        </span>

        <span
          className="
            h-1.5
            w-1.5
            rounded-full
            bg-primary
            opacity-40
            transition-all
            duration-300
            group-hover:scale-125
            group-hover:opacity-100
          "
        />
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
      className="
        relative
        overflow-hidden
        border-y
        border-border
        bg-muted/30
        py-20
        md:py-28
      "
    >
      {/* Primary ambient signal */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          -z-10
          h-[360px]
          w-[720px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-primary/5
          blur-[150px]
        "
      />

      {/* Secondary ambient signal */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-40
          right-[8%]
          -z-10
          h-[300px]
          w-[420px]
          rounded-full
          bg-secondary/5
          blur-[150px]
        "
      />

      <div className="container mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 16,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-60px",
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="
            mx-auto
            mb-16
            max-w-3xl
            text-center
          "
        >
          {/* Brandankare */}
          <div className="mb-5 flex flex-col items-center gap-3">

            <span
              className="
                font-technical
                text-[11px]
                font-medium
                uppercase
                tracking-[0.14em]
                text-muted-foreground
              "
            >
              Processen
            </span>
          </div>

          <h2
            className="
              font-display
              text-3xl
              font-bold
              tracking-tight
              text-foreground
              md:text-5xl
            "
          >
            Från behov till driftsatt lösning.
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-2xl
              text-sm
              leading-relaxed
              text-muted-foreground
              md:text-base
            "
          >
            Vi gör övergången enkel och trygg utan avbrott i er dagliga
            verksamhet.
          </p>
        </motion.div>

        {/* Process */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            margin: "-40px",
          }}
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            md:gap-6
            lg:grid-cols-4
          "
        >
          {steps.map((step, index) => (
            <StepCard
              key={step.number}
              step={step}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}