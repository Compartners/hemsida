import React, { useState } from "react";
import { Quote, Star, Building2, ShieldCheck } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const FEATURED_TESTIMONIAL = {
  quote:
    "Att lägga ut telefonin på ComPartner var ett strategiskt styrelsebeslut som fungerat klockrent. De är extremt närvarande och vår egen insats är minimal.",
  author: "Jonas Lundin",
  role: "Ledningsrepresentant",
  company: "Tuna Entreprenad",
  logo: "/logos/tuna-entreprenad.png",
  rating: 5,
  stats: [
    { value: "170+", label: "Medarbetare" },
    { value: "100%", label: "Driftsäkerhet" },
    { value: "Minimal", label: "Administration" },
  ],
};

const Testimonial = () => {
  const [logoError, setLogoError] = useState(false);
  const { quote, author, role, company, logo, rating, stats } = FEATURED_TESTIMONIAL;

  return (
    <section id="kundcase" className="relative py-12 md:py-16 overflow-hidden bg-background">
      {/* Subtilt bakgrundsljus */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 left-1/4 w-[450px] h-[250px] bg-primary/5 rounded-full blur-[100px] -z-10"
      />

      <div className="container mx-auto px-6 max-w-7xl">
        <ScrollReveal>
          {/* Topplinje med badget och betyg */}
          <div className="flex items-center gap-3 pb-6 border-b border-border/40">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <ShieldCheck className="w-3.5 h-3.5" />
              Kundreferens
            </span>
            <span className="text-border/60">/</span>
            <div className="flex gap-0.5" aria-label={`Betyg: ${rating} av 5`}>
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>

          {/* Huvudlayout */}
          <figure className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-6 items-center">
            {/* Vänster: Logotyp, Citat & Avsändare */}
            <div className="lg:col-span-8 flex gap-5 md:gap-6">
              <Quote className="w-8 h-8 md:w-10 md:h-10 text-primary/30 shrink-0 select-none mt-1" aria-hidden="true" />
              
              <div className="space-y-4">
                {/* Kundlogotyp */}
                <div className="h-8 flex items-center">
                  {!logoError ? (
                    <img
                      src={logo}
                      alt={`${company} logotyp`}
                      onError={() => setLogoError(true)}
                      className="h-7 md:h-8 w-auto max-w-[160px] object-contain opacity-90 hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Building2 className="w-4 h-4 text-primary" />
                      {company}
                    </span>
                  )}
                </div>

                {/* Citat */}
                <blockquote className="font-display text-lg sm:text-xl md:text-2xl text-foreground font-normal leading-snug tracking-tight">
                  "{quote}"
                </blockquote>

                {/* Avsändare */}
                <figcaption className="text-xs md:text-sm text-muted-foreground pt-1">
                  <strong className="text-foreground font-semibold">{author}</strong> • {role}, {company}
                </figcaption>
              </div>
            </div>

            {/* Höger: Nyckeltal */}
            <div className="lg:col-span-4 lg:border-l lg:border-border/40 lg:pl-8">
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
                {stats.map((stat, idx) => (
                  <div 
                    key={idx} 
                    className="flex flex-col lg:flex-row lg:items-baseline lg:justify-between gap-0.5 lg:border-b lg:border-border/20 lg:pb-2"
                  >
                    <span className="text-xs text-muted-foreground order-2 lg:order-1 font-medium">
                      {stat.label}
                    </span>
                    <span className="font-display text-lg md:text-xl font-bold text-foreground tracking-tight order-1 lg:order-2">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </figure>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Testimonial;