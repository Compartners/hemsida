"use client";

import React, { useState } from "react";
import {
  Building2,
  Quote,
  Star,
} from "lucide-react";

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
    {
      value: "170+",
      label: "Medarbetare",
    },
    {
      value: "100%",
      label: "Driftsäkerhet",
    },
    {
      value: "Minimal",
      label: "Administration",
    },
  ],
};

const Testimonial = () => {
  const [logoError, setLogoError] = useState(false);

  const {
    quote,
    author,
    role,
    company,
    logo,
    rating,
    stats,
  } = FEATURED_TESTIMONIAL;

  return (
    <section
      id="kundcase"
      className="
        relative
        overflow-hidden
        bg-background
        py-20
        md:py-28
      "
    >
      <div className="container mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <figure
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-border
              bg-card
              shadow-card
            "
          >
            {/* =====================================================
                STORA SIGNAL BARS I BAKGRUNDEN
                Delvis beskurna av kortets overflow-hidden
            ====================================================== */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                overflow-hidden
              "
            >
              {/* Subtil glow bakom formerna */}
              <div
                className="
                  absolute
                  -right-24
                  top-1/2
                  h-[520px]
                  w-[520px]
                  -translate-y-1/2
                  rounded-full
                  bg-secondary/5
                  blur-[120px]
                "
              />

              {/* Stapel 1 — Signal Blue */}
              <div
                className="
                  absolute
                  -bottom-[155px]
                  right-[250px]
                  h-[310px]
                  w-[76px]
                  rounded-full
                  bg-primary/[1]
                  transition-all
                  duration-700
                  md:left-[150px]
                  md:h-[250px]
                  md:w-[92px]
                "
              />

              {/* Stapel 2 — Electric Cyan */}
              <div
                className="
                  absolute
                  -bottom-[145px]
                  right-[130px]
                  h-[430px]
                  w-[82px]
                  rounded-full
                  bg-secondary/[0.8]
                  transition-all
                  duration-700
                  group-hover:bg-secondary/[0.8]
                  md:left-[270px]
                  md:h-[340px]
                  md:w-[100px]
                "
              />

              {/* Stapel 3 — AI Teal */}
              <div
                className="
                  absolute
                  -bottom-[130px]
                  right-[-10px]
                  h-[550px]
                  w-[90px]
                  rounded-full
                  bg-accent/[0.6]
                  transition-all
                  duration-700
                  md:left-[400px]
                  md:h-[440px]
                  md:w-[110px]
                "
              />

              {/* Diskret fade så grafiken inte konkurrerar med citatet */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-card
                  via-card/50
                  to-transparent
                "
              />
            </div>

            {/* =====================================================
                INNEHÅLL
            ====================================================== */}
            <div
              className="
                relative
                z-10
                grid
                grid-cols-1
                gap-10
                p-7
                sm:p-9
                md:p-12
                lg:grid-cols-12
                lg:gap-14
                lg:p-14
              "
            >
              {/* ===================================================
                  VÄNSTER — KUNDCITAT
              ==================================================== */}
              <div className="lg:col-span-8">
                {/* Meta */}
                <div
                  className="
                    mb-8
                    flex
                    flex-wrap
                    items-center
                    gap-3
                  "
                >
                  <span
                    className="
                      font-technical
                      text-[11px]
                      font-medium
                      uppercase
                      tracking-[0.14em]
                      text-primary
                    "
                  >
                    Kundreferens
                  </span>

                  <div
                    aria-hidden="true"
                    className="h-px w-8 bg-border"
                  />

                  <div
                    className="flex gap-0.5"
                    aria-label={`Betyg: ${rating} av 5`}
                  >
                    {Array.from({
                      length: rating,
                    }).map((_, index) => (
                      <Star
                        key={index}
                        className="
                          h-3.5
                          w-3.5
                          fill-primary
                          text-primary
                        "
                      />
                    ))}
                  </div>
                </div>

                {/* Logotyp */}
                <div className="mb-8 flex h-9 items-center">
                  {!logoError ? (
                    <img
                      src={logo}
                      alt={`${company} logotyp`}
                      onError={() => setLogoError(true)}
                      className="
                        h-8
                        w-auto
                        max-w-[180px]
                        object-contain
                      "
                    />
                  ) : (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-foreground
                      "
                    >
                      <Building2
                        className="
                          h-4
                          w-4
                          text-primary
                        "
                      />

                      {company}
                    </span>
                  )}
                </div>

                {/* Quote */}
                <div className="relative">
                  <Quote
                    aria-hidden="true"
                    className="
                      absolute
                      -left-1
                      -top-3
                      h-10
                      w-10
                      text-primary/10
                      sm:h-12
                      sm:w-12
                    "
                  />

                  <blockquote
                    className="
                      relative
                      max-w-3xl
                      font-display
                      text-xl
                      font-medium
                      leading-snug
                      tracking-tight
                      text-foreground
                      sm:text-2xl
                      md:text-3xl
                    "
                  >
                    “{quote}”
                  </blockquote>
                </div>

                {/* Avsändare */}
                <figcaption
                  className="
                    mt-7
                    text-sm
                    text-muted-foreground
                  "
                >
                  <strong
                    className="
                      font-semibold
                      text-foreground
                    "
                  >
                    {author}
                  </strong>

                  <span className="mx-2 text-border">
                    ·
                  </span>

                  {role}, {company}
                </figcaption>
              </div>

              {/* ===================================================
                  HÖGER — RESULTAT
              ==================================================== */}
              <div
                className="
                  relative
                  lg:col-span-4
                  lg:flex
                  lg:items-center
                  lg:border-l
                  lg:border-border
                  lg:pl-10
                "
              >
                <div className="grid w-full grid-cols-3 gap-4 lg:grid-cols-1 lg:gap-0">
                  {stats.map((stat, index) => (
                    <div
                      key={stat.label}
                      className={`
                        flex
                        flex-col
                        py-3

                        lg:flex-row
                        lg:items-baseline
                        lg:justify-between
                        lg:gap-6
                        lg:py-5

                        ${
                          index !== stats.length - 1
                            ? "lg:border-b lg:border-border"
                            : ""
                        }
                      `}
                    >
                      <span
                        className="
                          order-2
                          mt-1
                          text-[11px]
                          font-medium
                          text-muted-foreground
                          sm:text-xs

                          lg:order-1
                          lg:mt-0
                        "
                      >
                        {stat.label}
                      </span>

                      <span
                        className="
                          order-1
                          font-display
                          text-xl
                          font-bold
                          tracking-tight
                          text-foreground

                          md:text-2xl
                          lg:order-2
                        "
                      >
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </figure>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Testimonial;