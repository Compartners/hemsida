"use client";

import { useRef } from "react";
import { Link } from "react-router-dom";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  MotionValue
} from "framer-motion";
import mobilaVaxlarImg from "@/assets/mobilvaxel.jpg";
import korjournalerImg from "@/assets/bilar.jpg";
import supportImg from "@/assets/support.jpg";

const services = [
  {
    category: "Växellösningar",
    title: "Mobila växlar",
    description: "Skräddarsydda växelplattformar anpassade efter just er organisations unika behov.",
    href: "/mobila-vaxlar",
    img: mobilaVaxlarImg,
  },
  {
    category: "Fordon & Resor",
    title: "Körjournaler",
    description: "Elektronisk och automatisk körjournal som sparar tid och säkrar Skatteverkets krav.",
    href: "/korjournaler",
    img: korjournalerImg,
  },
  {
    category: "Service",
    title: "Support & Förvaltning",
    description: "Alltid en personlig kontakt och snabb experthjälp bara ett samtal bort.",
    href: "/support",
    img: supportImg,
  },
  {
    category: "Telefoni",
    title: "Hårdvara & Abonnemang",
    description: "Kostnadseffektiva företagsabonnemang och de senaste mobilerna med trygg livscykelhantering.",
    href: "/abonnemang",
    img: mobilaVaxlarImg,
  },
  {
    category: "Nätverk",
    title: "Fast & Mobilt Bredband",
    description: "Stabila och säkra uppkopplingar för kontoret eller medarbetare på språng.",
    href: "/bredband",
    img: supportImg,
  },
  {
    category: "Möten",
    title: "Mötesteknik & IT",
    description: "Moderna konferensrumslösningar och IT-verktyg för smidiga digitala möten.",
    href: "/it-losningar",
    img: korjournalerImg,
  },
];

/* Enskilt 3D-kort med dynamiskt ljus och ren typografi */
const ServiceCard = ({ 
  service, 
  index,
  darkOverlayOpacity
}: { 
  service: typeof services[0]; 
  index: number;
  darkOverlayOpacity: MotionValue<number>;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.08, 
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative"
    >
      <Link
        to={service.href}
        className="relative block rounded-2xl p-6 md:p-7 border border-white/10 bg-card/40 backdrop-blur-sm overflow-hidden min-h-[240px] md:min-h-[260px] flex flex-col justify-between hover:border-white/30 shadow-md hover:shadow-2xl transition-all duration-500"
      >
        {/* Bakgrundsbild med blur-zoom */}
        <img
          src={service.img}
          alt={service.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover blur-[2px] group-hover:blur-0 scale-105 group-hover:scale-100 transition-all duration-700 ease-out"
        />

        {/* Standard gradient-overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/50 group-hover:via-black/70 transition-colors duration-500" />

        {/* Scroll-driven dynamisk mörkläggning/ljusning */}
        <motion.div 
          style={{ opacity: darkOverlayOpacity }}
          className="pointer-events-none absolute inset-0 bg-black z-[1]"
        />

        {/* Kategori-tagg istället för ikon */}
        <div className="relative z-10 self-start">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/70 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/10">
            {service.category}
          </span>
        </div>

        {/* Textblock */}
        <div className="relative z-10 mt-6">
          <h3 className="font-display text-lg font-bold text-white mb-1.5 transition-colors duration-300">
            {service.title}
          </h3>
          <p className="text-white/75 text-xs md:text-sm leading-relaxed mb-4 line-clamp-2 font-normal">
            {service.description}
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 group-hover:text-white transition-colors duration-300">
            Läs mer 
            <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">
              →
            </span>
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-driven perspektiv och ljusjustering
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001,
  });

  // 3D rotation & skalning
  const gridRotateX = useTransform(smoothProgress, [0, 1], [40, 0]);
  const gridScale = useTransform(smoothProgress, [0, 1], [0.60, 1]);

  // Opacitet: Börjar lågt och tonas upp gradvis hela vägen in i fokus
  const gridOpacity = useTransform(smoothProgress, [0, 0.25], [0.2, 1]);

  // Skugg-overlay: Börjar på 70% svart och tonas bort till 0%
  const darkOverlayOpacity = useTransform(smoothProgress, [0, 0.8], [0.7, 0]);

  // Bakgrundsljuset växer och blir starkare ju närmare sektionen kommer
  const glowOpacity = useTransform(smoothProgress, [0.2, 1], [0, 0.15]);
  const glowScale = useTransform(smoothProgress, [0, 1], [0.6, 1]);

  return (
    <section 
      ref={sectionRef} 
      id="tjanster" 
      className="relative py-20 md:py-28 bg-muted/40 overflow-hidden"
    >
      {/* Scroll-drivet ambient bakgrundsljus */}
      <motion.div 
        aria-hidden="true" 
        style={{
          opacity: glowOpacity,
          scale: glowScale,
        }}
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary rounded-full blur-[150px] -z-10" 
      />

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Rubrikblock */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-primary font-semibold text-xs md:text-sm uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            Våra tjänster
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mt-3 mb-3 tracking-tight">
            Allt för er <span className="text-primary">företagstelefoni</span> & IT
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Skräddarsydda helhetslösningar som effektiviserar er vardag.
          </p>
        </motion.div>

        {/* 3D-aktiverad Grid Container med dynamiskt ljus */}
        <div style={{ perspective: "1400px" }}>
          <motion.div 
            style={{
              rotateX: gridRotateX,
              scale: gridScale,
              opacity: gridOpacity,
              transformStyle: "preserve-3d",
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 will-change-transform"
          >
            {services.map((service, index) => (
              <ServiceCard 
                key={service.title} 
                service={service} 
                index={index} 
                darkOverlayOpacity={darkOverlayOpacity}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}