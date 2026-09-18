import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, Play, CheckCircle2, Signal } from 'lucide-react';

interface HeroTextProps {
  onReplayAnimation: () => void;
}

export function HeroText({ onReplayAnimation }: HeroTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Smooth fade-in for all text upon page load using GSAP
      gsap.fromTo(
        '.gsap-fade-item',
        {
          opacity: 0,
          y: -34,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.5,
          stagger: 0.12,
          ease: 'power3.out',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col text-left max-w-xl xl:max-w-2xl">
      
      {/* Category Tag with 3 Signal bars indicator */}
      <div className="gsap-fade-item flex items-center gap-2 mb-4">

      </div>

      {/* Main Headline */}
      <h1 className="gsap-fade-item text-4xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.12] mb-6 transition-colors duration-200">
      Smartare <br/>
      kommunikation.<br/>
      Starkare affär.
      </h1>

      {/* Description text */}
      <p className="gsap-fade-item text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8 max-w-lg transition-colors duration-200">
    Telekom och AI-lösningar som förenklar arbetet,
    förbättrar kundresan och skapar mätbar effekt.
      </p>

      {/* Action CTA Buttons */}
      <div className="gsap-fade-item flex flex-wrap items-center gap-3.5 mb-10">
        <button
          id="hero-primary-cta"
          onClick={onReplayAnimation}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 font-medium text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-[0.98] group cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
          <span>Boka Rådgivning</span>
        </button>
      </div>

    </div>
  );
}
