import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface HeroAnimationProps {
  replayKey: number;
  onManualReplay?: () => void;
}

export function HeroAnimation({
  replayKey,
  onManualReplay,
}: HeroAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }

      const square = containerRef.current.querySelector('#anim-square') as HTMLElement;
      const pillarBig = containerRef.current.querySelector('#pillar-big') as HTMLElement;
      const pillarMid = containerRef.current.querySelector('#pillar-mid') as HTMLElement;
      const pillarSmall = containerRef.current.querySelector('#pillar-small') as HTMLElement;
      const ring1 = containerRef.current.querySelector('#impact-ring-1') as HTMLElement;
      const ring2 = containerRef.current.querySelector('#impact-ring-2') as HTMLElement;
      const ring3 = containerRef.current.querySelector('#impact-ring-3') as HTMLElement;
      const signalGlow = containerRef.current.querySelector('#signal-glow') as HTMLElement;
      const soapBubble = containerRef.current.querySelector('#soap-bubble') as HTMLElement;
      const brandReveal = containerRef.current.querySelector('#brand-reveal') as HTMLElement;
      const brandWord = containerRef.current.querySelector('#brand-word') as HTMLElement;
      const brandTagline = containerRef.current.querySelector('#brand-tagline') as HTMLElement;

      if (!square || !pillarBig || !pillarMid || !pillarSmall || !brandReveal || !brandWord) {
        return;
      }

      // ================================================================
      // SETTINGS
      // ================================================================
      const PAUS_I_BOTTEN_STUDS_1 = 0.06;
      const PAUS_I_BOTTEN_STUDS_2 = 0.06;

      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

      const xBig = isMobile ? 72 : 84;
      const xMid = 0;
      const xSmall = isMobile ? -72 : -84;

      // Brand reveal målpositioner för staplarna och texten
      // Anpassade för mobil (centrerat/kompakt) och desktop
      const leftShift = isMobile ? -80 : -215;
      const targetTextX = leftShift;
      const targetBigX = isMobile ? leftShift - 10 : leftShift - 13;
      const targetMidX = isMobile ? leftShift - 32 : leftShift - 45;
      const targetSmallX = isMobile ? leftShift - 54 : leftShift - 77;
      const targetPillarY = -112;

      // ================================================================
      // INITIAL STATE
      // ================================================================
      gsap.set(square, {
        x: isMobile ? 180 : 320,
        y: isMobile ? -200 : -240,
        rotation: 25,
        opacity: 0,
        scaleX: 1,
        scaleY: 1,
        width: 64,
        height: 64,
        borderRadius: 14,
      });

      gsap.set([pillarBig, pillarMid, pillarSmall], {
        scaleY: 0,
        scaleX: 1,
        scale: 1,
        transformOrigin: 'bottom center',
        opacity: 0,
        x: 0,
        y: 0,
      });

      gsap.set([ring1, ring2, ring3], {
        scale: 0.3,
        opacity: 0,
      });

      if (signalGlow) {
        gsap.set(signalGlow, {
          opacity: 0,
          scale: 0.8,
        });
      }

      if (soapBubble) {
        gsap.set(soapBubble, {
          opacity: 0,
          scale: 0.3,
          x: xSmall,
          y: 0,
        });
      }

      // Brand text positioneras något till höger och dold
      gsap.set(brandReveal, {
        opacity: 0,
        x: targetTextX + 25,
      });

      gsap.set(brandWord, {
        letterSpacing: '0.04em',
      });

      if (brandTagline) {
        gsap.set(brandTagline, {
          opacity: 0,
          y: 4,
        });
      }

      // ================================================================
      // TIMELINE
      // ================================================================
      const tl = gsap.timeline({
        repeat: 0,
        onStart: () => setIsPlaying(true),
        onComplete: () => setIsPlaying(false),
      });

      timelineRef.current = tl;

      // ================================================================
      // STUDS 1
      // ================================================================
      tl.to(square, {
        opacity: 1,
        duration: 0.2,
        ease: 'sine.out',
      })
        .to(square, { x: xBig, duration: 0.85, ease: 'sine.inOut' }, 0)
        .to(square, { y: 0, rotation: 0, duration: 0.85, ease: 'power1.in' }, 0)
        .to(square, { scaleX: 1.26, scaleY: 0.74, duration: 0.14, ease: 'sine.out' }, 'impact1')
        .fromTo(
          ring1,
          { scale: 0.3, opacity: 0.8, x: xBig },
          { scale: 1.6, opacity: 0, duration: 0.45, ease: 'sine.out' },
          '<0.01'
        )
        .to(pillarBig, { scaleY: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' }, '<0.03')
        .to(square, { scaleX: 0.96, scaleY: 1.08, duration: 0.16, ease: 'sine.inOut' }, '<')

        // ================================================================
        // STUDS 2
        // ================================================================
        .to(
          square,
          {
            x: (xBig + xMid) / 2,
            rotation: -40,
            scaleX: 0.94,
            scaleY: 1.1,
            duration: 0.23,
            ease: 'sine.inOut',
          },
          `impact1+=${PAUS_I_BOTTEN_STUDS_1}`
        )
        .to(square, { y: -110, duration: 0.23, ease: 'sine.out' }, '<')
        .to(square, { x: xMid, rotation: -75, scaleX: 1, scaleY: 1, duration: 0.26, ease: 'sine.inOut' }, '>')
        .to(square, { y: 0, duration: 0.26, ease: 'power1.in' }, '<')
        .to(square, { scaleX: 1.22, scaleY: 0.78, duration: 0.13, ease: 'sine.out' }, 'impact2')
        .fromTo(
          ring2,
          { scale: 0.3, opacity: 0.8, x: xMid },
          { scale: 1.6, opacity: 0, duration: 0.45, ease: 'sine.out' },
          '<0.01'
        )
        .to(pillarMid, { scaleY: 1, opacity: 1, duration: 0.48, ease: 'back.out(1.4)' }, '<0.03')
        .to(square, { scaleX: 0.96, scaleY: 1.06, duration: 0.16, ease: 'sine.inOut' }, '<')

        // ================================================================
        // STUDS 3
        // ================================================================
        .to(
          square,
          {
            x: (xMid + xSmall) / 2,
            rotation: -115,
            scaleX: 0.96,
            scaleY: 1.06,
            duration: 0.28,
            ease: 'sine.inOut',
          },
          `impact2+=${PAUS_I_BOTTEN_STUDS_2}`
        )
        .to(square, { y: -85, duration: 0.28, ease: 'sine.out' }, '<')
        .to(square, { x: xSmall, rotation: -180, scaleX: 1, scaleY: 1, duration: 0.3, ease: 'sine.inOut' }, '>')
        .to(square, { y: 0, duration: 0.3, ease: 'power1.in' }, '<')
        .to(square, { scaleX: 1.22, scaleY: 0.78, duration: 0.13, ease: 'sine.out' })
        .fromTo(
          ring3,
          { scale: 0.3, opacity: 0.8, x: xSmall },
          { scale: 1.6, opacity: 0, duration: 0.45, ease: 'sine.out' },
          '<0.01'
        )

        // ================================================================
        // FYRKANTEN MORFAR IN
        // ================================================================
        .to(
          square,
          {
            width: 48,
            height: 48,
            borderRadius: 10,
            opacity: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 0.4,
            ease: 'sine.inOut',
          },
          '<'
        )
        .to(pillarSmall, { scaleY: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.4)' }, '<0.03')

        // ================================================================
        // SÅPBUBBLA
        // ================================================================
        .fromTo(
          soapBubble,
          { opacity: 0, scale: 0.3, x: xSmall, y: 0 },
          { opacity: 0.85, scale: 1, duration: 0.3, ease: 'back.out(2)' },
          '<0.05'
        )
        .to(soapBubble, { y: 15, x: xSmall - 40, duration: 1, ease: 'sine.inOut' }, '<')
        .to(soapBubble, { scale: 1.15, opacity: 0, duration: 0.45, ease: 'sine.in' }, '<0.35')

        // ================================================================
        // FINAL PULSE
        // ================================================================
        .to(
          [pillarSmall, pillarMid, pillarBig],
          {
            scaleY: 1.04,
            duration: 0.24,
            stagger: 0.08,
            yoyo: true,
            repeat: 1,
            ease: 'sine.inOut',
          },
          '+=0.15'
        )
        .fromTo(
          signalGlow,
          { opacity: 0, scale: 0.85 },
          { opacity: 0.6, scale: 1.2, duration: 0.65, ease: 'sine.out' },
          '<'
        )
        .to(signalGlow, { opacity: 0, duration: 0.45 }, '>-0.2');

      // ================================================================
      // BRAND REVEAL & SAMMANSLAGNING AV PELARE
      // ================================================================
      const pillarScale = isMobile ? 0.32 : 0.44;

      // Samla pelarna tight som ett gemensamt emblem precis till vänster om "Compartners"
      tl.to(
        pillarSmall,
        {
          scale: pillarScale,
          x: targetSmallX - xSmall,
          y: targetPillarY,
          duration: 0.75,
          ease: 'power3.inOut',
        },
        '+=0.15'
      )
      .to(
        pillarMid,
        {
          scale: pillarScale,
          x: targetMidX - xMid,
          y: targetPillarY,
          duration: 0.75,
          ease: 'power3.inOut',
        },
        '<0.05'
      )
      .to(
        pillarBig,
        {
          scale: pillarScale,
          x: targetBigX - xBig,
          y: targetPillarY,
          duration: 0.75,
          ease: 'power3.inOut',
        },
        '<0.05'
      )

      // Texten glider in bredvid de samlade pelarna
      .to(
        brandReveal,
        {
          opacity: 1,
          x: targetTextX,
          duration: 0.65,
          ease: 'power3.out',
        },
        '<0.15'
      )
      .to(
        brandWord,
        {
          letterSpacing: '-0.025em',
          duration: 0.65,
          ease: 'power3.out',
        },
        '<'
      );

      if (brandTagline) {
        tl.to(
          brandTagline,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out',
          },
          '<0.15'
        );
      }
    },
    { scope: containerRef, dependencies: [replayKey] }
  );

  return (
    <div
      id="animation-stage"
      className="relative w-full flex flex-col items-center select-none"
    >
      <div
        ref={containerRef}
        className="
          relative
          h-[360px]
          sm:h-[400px]
          w-full
          flex
          items-end
          justify-center
          overflow-visible
        "
      >
        {/* Glow */}
        <div
          id="signal-glow"
          className="
            absolute
            bottom-12
            h-48
            w-48
            rounded-full
            bg-primary/10
            dark:bg-primary/20
            blur-3xl
            pointer-events-none
            opacity-0
          "
        />

        {/* Impact rings */}
        <div
          id="impact-ring-1"
          className="absolute bottom-[63px] h-5 w-24 rounded-full border border-primary/60 pointer-events-none z-10"
        />
        <div
          id="impact-ring-2"
          className="absolute bottom-[63px] h-5 w-24 rounded-full border border-secondary/60 pointer-events-none z-10"
        />
        <div
          id="impact-ring-3"
          className="absolute bottom-[63px] h-5 w-24 rounded-full border border-accent/60 pointer-events-none z-10"
        />

        {/* Animated square */}
        <div
          id="anim-square"
          className="
            absolute
            bottom-16
            z-20
            flex
            items-center
            justify-center
            pointer-events-none
            will-change-transform
          "
        >
          <div
            className="
              h-full
              w-full
              rounded-2xl
              bg-gradient-to-tr
              from-primary
              via-secondary
              to-accent
              shadow-xl
              shadow-primary/25
              border-2
              border-secondary/45
            "
          />
        </div>

        {/* Pelare */}
        <div
          className="
            absolute
            bottom-16
            flex
            items-end
            justify-center
            gap-5
            sm:gap-6
            z-15
          "
        >
          {/* Soap bubble */}
          <div
            id="soap-bubble"
            className="
              absolute
              bottom-6
              right-30
              h-5
              w-5
              rounded-full
              bg-gradient-to-br
              from-primary/70
              via-secondary/40
              to-accent/70
              border
              border-white/60
              shadow-sm
              pointer-events-none
              z-30
            "
          />

          {/* LITEN PELARE */}
          <div className="flex flex-col items-center">
            <div
              id="pillar-small"
              style={{ height: 72 }}
              className="
                w-12
                sm:w-14
                rounded-full
                bg-gradient-to-r
                from-primary
                to-primary/80
                shadow-md
                shadow-primary/20
                border-t-2
                border-primary/35
                relative
                overflow-hidden
                will-change-transform
              "
            />
          </div>

          {/* MELLANPELARE */}
          <div className="flex flex-col items-center">
            <div
              id="pillar-mid"
              style={{ height: 156 }}
              className="
                w-12
                sm:w-14
                rounded-full
                bg-gradient-to-r
                from-secondary
                to-secondary/75
                shadow-lg
                shadow-secondary/20
                border-t-2
                border-secondary/35
                relative
                overflow-hidden
                will-change-transform
              "
            />
          </div>

          {/* STOR PELARE */}
          <div className="flex flex-col items-center">
            <div
              id="pillar-big"
              style={{ height: 216 }}
              className="
                w-14
                sm:w-16
                rounded-full
                bg-gradient-to-r
                from-accent
                to-accent/75
                shadow-xl
                shadow-accent/20
                border-t-2
                border-accent/35
                relative
                overflow-hidden
                will-change-transform
              "
            />
          </div>
        </div>

        {/* Brand reveal - texten och taglinen positioneras relativt till scenen */}
        <div
          id="brand-reveal"
          className="
            absolute
            bottom-[176px]
            left-1/2
            z-30
            pointer-events-none
            will-change-transform
          "
        >
          <span
            id="brand-word"
            className="
              block
              text-4xl
              sm:text-5xl
              lg:text-6xl
              font-semibold
              tracking-tight
              text-foreground
              transition-colors
              duration-200
              whitespace-nowrap
            "
          >
            Compartners
          </span>
          <span
            id="brand-tagline"
            className="
              absolute
              top-full
              left-0
              mt-2
              text-[10px]
              sm:text-xs
              font-medium
              tracking-[0.2em]
              sm:tracking-[0.25em]
              text-muted-foreground
              uppercase
              whitespace-nowrap
            "
          >
            Communications Partners · 
          </span>
        </div>
      </div>
    </div>
  );
}