import React, { useState } from "react";
import { Building2 } from "lucide-react";

interface Logo {
  name: string;
  src: string;
}

const PARTNER_LOGOS: readonly Logo[] = [
  { name: "Kronans Apotek", src: "/logos/kronans-apotek.png" },
  { name: "Tuna Entreprenad", src: "/logos/tuna-entreprenad.png" },
  { name: "Kilenkrysset", src: "/logos/kilenkrysset.png" },
  { name: "Installationsservice", src: "/logos/installationsservice.png" },
  { name: "Svensk Fastighetsförmedling", src: "/logos/svensk-fastighetsformedling.png" },
  { name: "Svenska Kyrkan", src: "/logos/svenska-kyrkan.png" },
];

const LogoItem = ({ name, src }: Logo) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="flex items-center justify-center h-12 min-w-[140px] md:min-w-[180px] px-4">
      {!hasError ? (
        <img
          src={src}
          alt={`${name} logotyp`}
          loading="lazy"
          onError={() => setHasError(true)}
          className="h-7 md:h-9 w-auto max-w-[140px] object-contain opacity-50 grayscale contrast-125 transition-all duration-300 hover:opacity-100 hover:grayscale-0 hover:scale-105"
        />
      ) : (
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 border border-border/40 px-3 py-1.5 rounded-md">
          <Building2 className="w-3.5 h-3.5" />
          {name}
        </span>
      )}
    </div>
  );
};

const LogoMarquee = () => {
  return (
    <div className="w-full py-8 border-y border-border/40 bg-background/50 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl mb-4">
        <p className="text-center text-[11px] md:text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Företag och organisationer som litar på Compartners
        </p>
      </div>

      {/* Rullande container med gradient mask för fada ut i kanterna */}
      <div 
        className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
        role="region"
        aria-label="Samarbetspartners och kunder"
      >
        <div className="flex w-max gap-8 md:gap-12 animate-marquee focus-within:[animation-play-state:paused] will-change-transform py-2">
          {/* Första uppsättningen logotyper */}
          {PARTNER_LOGOS.map((logo, index) => (
            <LogoItem key={`logo-1-${index}`} {...logo} />
          ))}

          {/* Duplicerad uppsättning för sömlös oändlig loop */}
          {PARTNER_LOGOS.map((logo, index) => (
            <LogoItem key={`logo-2-${index}`} {...logo} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoMarquee;