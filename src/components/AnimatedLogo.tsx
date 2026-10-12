import { useId, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

type AnimatedLogoProps = {
  className?: string;
  replayOnHover?: boolean;
  variant?: 'light' | 'dark';
};

export default function AnimatedLogo({
  className = '',
  replayOnHover = false,
  variant = 'dark',
}: AnimatedLogoProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const bar1Ref = useRef<SVGPathElement>(null);
  const bar2Ref = useRef<SVGPathElement>(null);
  const wordmarkRef = useRef<SVGGElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Logotypen kan visas flera gånger samtidigt (t.ex. navbar och footer).
  const uid = useId().replace(/:/g, '');
  const gCircle = `gCircle-${uid}`;
  const gBar1 = `gBar1-${uid}`;
  const gBar2 = `gBar2-${uid}`;

  useGSAP(() => {
    const dot = dotRef.current;
    const bar1 = bar1Ref.current;
    const bar2 = bar2Ref.current;
    const wordmark = wordmarkRef.current;
    const svg = svgRef.current;
    if (!dot || !bar1 || !bar2 || !wordmark || !svg) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      gsap.set([dot, bar1, bar2, wordmark], {
        opacity: 1, x: 0, y: 0, scale: 1, scaleY: 1,
      });
      return;
    }

    gsap.set(dot, {
      opacity: 0, scale: 0.45, x: -12, y: -8,
      transformOrigin: 'center center',
    });
    gsap.set([bar1, bar2], {
      opacity: 0, scaleY: 0, transformOrigin: '50% 100%',
    });
    gsap.set(wordmark, { opacity: 0, x: 14 });

    const tl = gsap.timeline({ paused: true });
    tl.to(dot, {
      opacity: 1, scale: 1, x: 0, y: 0,
      duration: 0.32, ease: 'back.out(2)',
    })
      .to(dot, { y: -5, duration: 0.13, ease: 'power2.out' })
      .to(dot, { y: 0, duration: 0.16, ease: 'power2.in' })
      .to(bar1, {
        opacity: 1, scaleY: 1, duration: 0.34, ease: 'back.out(1.5)',
      }, '-=0.12')
      .to(bar2, {
        opacity: 1, scaleY: 1, duration: 0.4, ease: 'back.out(1.5)',
      }, '-=0.23')
      .to([dot, bar1, bar2], {
        scale: 1.025, duration: 0.1, ease: 'power2.out',
      }, '-=0.1')
      .to([dot, bar1, bar2], {
        scale: 1, duration: 0.12, ease: 'power2.inOut',
      })
      .to(wordmark, {
        opacity: 1, x: 0, duration: 0.48, ease: 'power3.out',
      }, '-=0.18');

    timelineRef.current = tl;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        tl.restart();
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(svg);

    return () => {
      observer.disconnect();
      tl.kill();
      timelineRef.current = null;
    };
  }, { scope: svgRef });

  const replay = () => {
    if (!replayOnHover) return;
    const timeline = timelineRef.current;
    if (timeline && !timeline.isActive()) timeline.restart();
  };

  const wordmarkColor = variant === 'light' ? '#FFFFFF' : '#2E3645';

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 715.55 121.12"
      className={className}
      onMouseEnter={replay}
      role="img"
      aria-label="Compartners"
    >
      <defs>
        <linearGradient
          id={gCircle}
          x1="-1413.53" y1="440.42" x2="-1412.53" y2="440.42"
          gradientTransform="translate(57954.59 18157.0474) scale(41 -41)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#107efc" />
          <stop offset=".52" stopColor="#1694fc" />
          <stop offset="1" stopColor="#1aa5f0" />
        </linearGradient>
        <linearGradient
          id={gBar1}
          x1="-1411.75" y1="456.13" x2="-1410.75" y2="457.13"
          gradientTransform="translate(55108.7376 41629.3329) scale(39 -91)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#1aa5f0" />
          <stop offset=".48" stopColor="#2dafdf" />
          <stop offset="1" stopColor="#3bbbbb" />
        </linearGradient>
        <linearGradient
          id={gBar2}
          x1="-1412.65" y1="459.44" x2="-1411.66" y2="460.44"
          gradientTransform="translate(56606.9118 55712.4041) scale(40 -121)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#37b7bd" />
          <stop offset=".5" stopColor="#46c2b7" />
          <stop offset="1" stopColor="#61cfae" />
        </linearGradient>
      </defs>

      <circle ref={dotRef} cx="20.5" cy="100" r="20.5" fill={`url(#${gCircle})`} />
      <path
        ref={bar1Ref}
        fill={`url(#${gBar1})`}
        d="M70,30h0c10.77,0,19.5,8.95,19.5,20v51c0,11.05-8.73,20-19.5,20h0c-10.77,0-19.5-8.95-19.5-20v-51c0-11.05,8.73-20,19.5-20Z"
      />
      <path
        ref={bar2Ref}
        fill={`url(#${gBar2})`}
        d="M120.5,0h0c11.05,0,20,8.95,20,20v81c0,11.05-8.95,20-20,20h0c-11.05,0-20-8.95-20-20V20c0-11.05,8.95-20,20-20Z"
      />

      <g
        ref={wordmarkRef}
        fill={wordmarkColor}
        style={{ transition: 'fill 300ms ease' }}
      >
        <path d="M177.9,102.52c-7.53,0-13.82-2.53-18.85-7.6-5.03-5.07-7.55-11.33-7.55-18.8s2.52-13.73,7.55-18.8c5.03-5.07,11.32-7.6,18.85-7.6,4.87,0,9.3,1.17,13.3,3.5,4,2.33,7.03,5.47,9.1,9.4l-11.1,6.5c-1-2.07-2.52-3.7-4.55-4.9-2.03-1.2-4.32-1.8-6.85-1.8-3.87,0-7.07,1.28-9.6,3.85-2.53,2.57-3.8,5.85-3.8,9.85s1.27,7.18,3.8,9.75c2.53,2.57,5.73,3.85,9.6,3.85,2.6,0,4.92-.58,6.95-1.75,2.03-1.17,3.55-2.78,4.55-4.85l11.2,6.4c-2.2,3.93-5.3,7.08-9.3,9.45s-8.43,3.55-13.3,3.55Z" />
        <path d="M247.28,94.87c-5.13,5.1-11.4,7.65-18.8,7.65s-13.65-2.55-18.75-7.65c-5.1-5.1-7.65-11.35-7.65-18.75s2.55-13.65,7.65-18.75c5.1-5.1,11.35-7.65,18.75-7.65s13.67,2.55,18.8,7.65c5.13,5.1,7.7,11.35,7.7,18.75s-2.57,13.65-7.7,18.75ZM218.83,86.02c2.57,2.6,5.78,3.9,9.65,3.9s7.1-1.3,9.7-3.9c2.6-2.6,3.9-5.9,3.9-9.9s-1.3-7.3-3.9-9.9c-2.6-2.6-5.83-3.9-9.7-3.9s-7.08,1.3-9.65,3.9c-2.57,2.6-3.85,5.9-3.85,9.9s1.28,7.3,3.85,9.9Z" />
        <path d="M325.7,49.72c6.88,0,12.38,1.87,16.5,5.6,4.12,3.73,6.18,8.73,6.18,15v30.8h-15.48v-29.9c0-3-.88-5.33-2.64-7-1.76-1.67-4.24-2.5-7.44-2.5-3.52,0-6.26.97-8.22,2.9-1.96,1.93-2.94,4.73-2.94,8.4v28.1h-15.48v-29.9c0-3-.88-5.33-2.64-7-1.76-1.67-4.24-2.5-7.44-2.5-3.44,0-6.18.97-8.22,2.9-2.04,1.93-3.06,4.73-3.06,8.4v28.1h-15.48v-50h15.48v5.3c3.6-4.47,9.16-6.7,16.68-6.7s12.8,2.4,16.32,7.2c4-4.8,9.96-7.2,17.88-7.2Z" />
        <path d="M382.17,49.72c6.73,0,12.48,2.55,17.25,7.65,4.77,5.1,7.15,11.35,7.15,18.75s-2.38,13.65-7.15,18.75c-4.77,5.1-10.52,7.65-17.25,7.65s-12.4-2.43-16.2-7.3v25.9h-12.9V51.12h12.9v5.9c3.8-4.87,9.2-7.3,16.2-7.3ZM369.87,86.27c2.6,2.63,5.9,3.95,9.9,3.95s7.32-1.32,9.95-3.95c2.63-2.63,3.95-6.02,3.95-10.15s-1.32-7.52-3.95-10.15c-2.63-2.63-5.95-3.95-9.95-3.95s-7.3,1.32-9.9,3.95c-2.6,2.63-3.9,6.02-3.9,10.15s1.3,7.52,3.9,10.15Z" />
        <path d="M449.6,51.12h12.9v50h-12.9v-5.9c-3.87,4.87-9.3,7.3-16.3,7.3s-12.38-2.55-17.15-7.65c-4.77-5.1-7.15-11.35-7.15-18.75s2.38-13.65,7.15-18.75c4.77-5.1,10.48-7.65,17.15-7.65,7,0,12.43,2.43,16.3,7.3v-5.9ZM425.8,86.27c2.6,2.63,5.9,3.95,9.9,3.95s7.32-1.32,9.95-3.95c2.63-2.63,3.95-6.02,3.95-10.15s-1.32-7.52-3.95-10.15c-2.63-2.63-5.95-3.95-9.95-3.95s-7.3,1.32-9.9,3.95c-2.6,2.63-3.9,6.02-3.9,10.15s1.3,7.52,3.9,10.15Z" />
        <path d="M481.61,59.72c1.2-3.2,3.18-5.6,5.95-7.2,2.77-1.6,5.85-2.4,9.25-2.4v14.4c-3.93-.47-7.45.33-10.55,2.4-3.1,2.07-4.65,5.5-4.65,10.3v23.9h-12.9v-50h12.9v8.6Z" />
        <path d="M561.34,49.72c5.47,0,9.98,1.83,13.55,5.5,3.57,3.67,5.35,8.73,5.35,15.2v30.7h-12.9v-29.1c0-3.33-.9-5.88-2.7-7.65-1.8-1.77-4.2-2.65-7.2-2.65-3.33,0-6,1.03-8,3.1-2,2.07-3,5.17-3,9.3v27h-12.9v-50h12.9v5.6c3.13-4.67,8.1-7,14.9-7Z" />
        <path d="M598.75,81.42c1.73,6.27,6.43,9.4,14.1,9.4,4.93,0,8.67-1.67,11.2-5l10.4,6c-4.93,7.13-12.2,10.7-21.8,10.7-8.27,0-14.9-2.5-19.9-7.5s-7.5-11.3-7.5-18.9,2.47-13.82,7.4-18.85c4.93-5.03,11.27-7.55,19-7.55,7.33,0,13.38,2.53,18.15,7.6,4.77,5.07,7.15,11.33,7.15,18.8,0,1.67-.17,3.43-.5,5.3h-37.7ZM598.54,71.42h25.5c-.73-3.4-2.25-5.93-4.55-7.6-2.3-1.67-4.92-2.5-7.85-2.5-3.47,0-6.33.88-8.6,2.65-2.27,1.77-3.77,4.25-4.5,7.45Z" />
        <path d="M656.73,59.72c1.2-3.2,3.18-5.6,5.95-7.2,2.77-1.6,5.85-2.4,9.25-2.4v14.4c-3.93-.47-7.45.33-10.55,2.4-3.1,2.07-4.65,5.5-4.65,10.3v23.9h-12.9v-50h12.9v8.6Z" />
        <path d="M689.75,65.32c0,1.33.88,2.42,2.65,3.25,1.77.83,3.92,1.57,6.45,2.2,2.53.63,5.07,1.43,7.6,2.4,2.53.97,4.68,2.58,6.45,4.85,1.77,2.27,2.65,5.1,2.65,8.5,0,5.13-1.92,9.08-5.75,11.85-3.83,2.77-8.62,4.15-14.35,4.15-10.27,0-17.27-3.97-21-11.9l11.2-6.3c1.47,4.33,4.73,6.5,9.8,6.5,4.6,0,6.9-1.43,6.9-4.3,0-1.33-.88-2.42-2.65-3.25-1.77-.83-3.92-1.58-6.45-2.25-2.53-.67-5.07-1.5-7.6-2.5-2.53-1-4.68-2.58-6.45-4.75-1.77-2.17-2.65-4.88-2.65-8.15,0-4.93,1.82-8.82,5.45-11.65,3.63-2.83,8.15-4.25,13.55-4.25,4.07,0,7.77.92,11.1,2.75,3.33,1.83,5.97,4.45,7.9,7.85l-11,6c-1.6-3.4-4.27-5.1-8-5.1-1.67,0-3.05.37-4.15,1.1-1.1.73-1.65,1.73-1.65,3Z" />
        <path d="M531.7,97.73c-3.16,2.4-6.63,3.39-11.37,3.39-12.31,0-19.35-6.2-19.35-18v-47.9h13.15v15.9s10.07,0,10.07,0v8.39s-10.07,0-10.07,0v23.31c0,5.2,2.84,8,7.78,8,2.73,0,4.07-.3,6.07-1.8l3.72,8.71Z" />
      </g>
    </svg>
  );
}
