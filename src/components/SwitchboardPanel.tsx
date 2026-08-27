"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export type SwitchboardPanelProps = {
  /** Sökväg/URL till videofilen. Default: /src/assets/lynes.mp4 */
  videoSrc?: string;

  /** Kicker/tagline ovanför rubriken. */
  badge?: string;

  /** Rubrik under laptopen. */
  title?: string;

  /** Beskrivningstext under laptopen. */
  description?: string;
};

export default function SwitchboardPanel({
  videoSrc = "/src/assets/lynes.mp4",
  badge = "alltid någon som svarar",
  title = "Inga samtal lämnas åt slumpen.",
  description = "Se vem som är tillgänglig, vem som pratar och vem som är redo att svara — direkt i växeln.",
}: SwitchboardPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  // ============================================================
  // SCROLL-TRANSFORMATIONER
  // ============================================================

  // 1. Datorn glider och roterar in stängd
  const laptopScale = useTransform(smoothProgress, [0, 0.35], [0.82, 1]);
  const laptopY = useTransform(smoothProgress, [0, 0.35], [20, 0]);
  const laptopRotateX = useTransform(smoothProgress, [0, 0.35], [-12, 12]);
  const laptopRotateY = useTransform(smoothProgress, [0, 0.35], [-18, 0]);

  // 2. Skärmlocket öppnas (från -100deg helt stängt till 0deg öppet)
  //    Locket roterar kring X-axeln — backsidan måste därför också
  //    roteras kring X (inte Y) för att backface-visibility ska stämma.
  const screenRotateX = useTransform(smoothProgress, [0.3, 0.7], [-100, 0]);

  // 3. Videons innehåll och ljus tänds först när skärmen börjar öppnas
  const screenContentOpacity = useTransform(smoothProgress, [0.42, 0.6], [0, 1]);

  // 4. Texten tonas in på fast plats
  const textOpacity = useTransform(smoothProgress, [0.72, 0.95], [0, 1]);
  const textY = useTransform(smoothProgress, [0.72, 0.95], [20, 0]);

  return (
    // Dold på mobil (scroll-driven 3D-animationen är tung + tar för mycket
    // vertikalt utrymme på små skärmar). Syns från md-breakpoint och uppåt.
    <div className="hidden md:block">
      <div ref={containerRef} className="relative h-[160vh] w-full">
        {/*
          justify-start + pt-* istället för justify-center:
          ger kontroll över avståndet till en fixed navbar, så att
          laptopens ram inte hamnar bakom/under den innan skrollet startar.
          pt sänkt (var 24/28/32) så att textblocket längst ner får plats
          inom h-screen istället för att klippas av overflow-hidden.
        */}
        <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-start overflow-hidden px-4 pt-16 sm:pt-20 lg:pt-24">

          {/* Huvudbehållare med fast vertikal centrering */}
          <div className="relative flex w-full max-w-5xl flex-col items-center">

            {/* ============================================================
                3D LAPTOP
                Perspective ligger på YTTRE wrappern, lägre värde (1100px)
                ger mer märkbar djupkänsla än 2000px.
            ============================================================ */}
            <div
              className="relative w-full max-w-5xl py-2"
              style={{ perspective: "2000px" }}
            >
              <motion.div
                style={{
                  scale: laptopScale,
                  y: laptopY,
                  rotateX: laptopRotateX,
                  rotateY: laptopRotateY,
                  transformStyle: "preserve-3d",
                }}
                className="relative flex flex-col items-center"
              >
                {/* ---------------- SKÄRMLOCK (3D) ---------------- */}
                {/* Bredden här (w-[90%]) MÅSTE matcha basen nedan, annars ser datorn trasig ut */}
                <motion.div
                  style={{
                    rotateX: screenRotateX,
                    transformOrigin: "bottom center",
                    transformStyle: "preserve-3d",
                  }}
                  className="relative z-10 w-[90%] rounded-t-2xl border border-neutral-700/70 bg-neutral-900 p-2.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] ring-1 ring-white/10 sm:p-3"
                >
                  {/* BAKSIDA PÅ LOCKET (Syns när locket är nerfällt) */}
                  {/* OBS: roterad kring X (samma axel som screenRotateX), inte Y */}
                  <div
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateX(180deg)",
                    }}
                    className="absolute inset-0 z-20 flex items-center justify-center rounded-t-2xl border border-neutral-700/80 bg-gradient-to-b from-neutral-800 via-neutral-850 to-neutral-900 shadow-2xl"
                  >
                    {/* Diskret logomarkör på laptopens lock */}
                    <div className="h-6 w-6 rounded-full border border-neutral-700/50 bg-neutral-800/80 shadow-inner" />
                  </div>

                  {/* FRAMSIDA / SKÄRM (Syns när locket öppnas) */}
                  <div
                    style={{
                      backfaceVisibility: "hidden",
                      transformStyle: "preserve-3d",
                    }}
                    className="relative overflow-hidden rounded-xl border border-neutral-800 bg-black"
                  >
                    {/* Kamera & Sensor */}
                    <div className="absolute top-2 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-neutral-800 ring-1 ring-neutral-600/60" />
                      <motion.div
                        style={{ opacity: screenContentOpacity }}
                        className="h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.9)]"
                      />
                    </div>

                    {/* Display & Video */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                      <motion.div
                        style={{ opacity: screenContentOpacity }}
                        className="h-full w-full"
                      >
                        <video
                          src={videoSrc}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="h-full w-full object-cover"
                        />
                        {/* Skärmglans */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/[0.04] to-transparent" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Gångjärn */}
                  <div className="mt-1 h-1.5 w-full rounded-b-md bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800" />
                </motion.div>

                {/* ---------------- TANGENTBORD & CHASSI ---------------- */}
                {/* Basen (w-[94%]) är EN aning bredare än skärmen (w-[90%] ovan) — */}
                {/* det ger en subtil, realistisk "läpp" runt gångjärnet istället för */}
                {/* att basen sticker ut brett över hela behållarens bredd. */}
              </motion.div>
            </div>

            {/* ============================================================
                TEXTINNEHÅLL
                mt/min-h sänkta något så blocket garanterat får plats
                inom h-screen tillsammans med laptopen ovanför.
            ============================================================ */}
            <motion.div
              style={{
                opacity: textOpacity,
                y: textY,
              }}
              className="mt-4 flex min-h-[110px] max-w-3xl flex-col items-center text-center sm:mt-6"
            >
              {badge && (
                <span className="mb-2.5 inline-block font-mono text-xs font-medium uppercase tracking-[0.12em] text-primary">
                  {badge}
                </span>
              )}

              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {title}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {description}
              </p>
            </motion.div>

          </div>
        </div>
      </div>

      {/*
        Luft till nästa komponent. Måste ligga UTANFÖR sticky/overflow-hidden-
        blocket ovan för att ge riktigt utrymme i sidflödet — mb/pb inuti
        sticky-boxen påverkar inte avståndet till det som kommer efter.
      */}
      <div className="h-16 sm:h-24 lg:h-32" />
    </div>
  );
}