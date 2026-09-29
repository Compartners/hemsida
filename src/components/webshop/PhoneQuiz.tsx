// PhoneQuiz.tsx
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  RefreshCcw,
  Sparkles,
  Smartphone,
} from "lucide-react";

import type { Product } from "./types";
import { ProductCard } from "./ProductCard";


type PhoneQuizProps = {
  products: Product[];
  onAdd: (product: Product) => void;
  onShowAllPhones?: () => void;
};


type QuestionKey =
  | "ecosystem"
  | "price"
  | "size"
  | "usage"
  | "priority";


type QuizAnswers = Partial<
  Record<QuestionKey, string | string[]>
>;

// Frågor där användaren kan välja flera alternativ (max 2)
const MULTI_SELECT_KEYS: QuestionKey[] = [
  "usage",
  "priority",
];

const QUESTIONS = [
  {
    key: "ecosystem" as const,
    eyebrow: "Ekosystem",
    title: "Vilket ekosystem föredrar du?",
    description:
      "Välj det du redan trivs med – eller låt oss jämföra fritt.",
    options: [
      {
        value: "apple",
        label: "Apple",
        description: "Jag vill helst ha iPhone.",
      },
      {
        value: "samsung",
        label: "Samsung",
        description: "Jag föredrar Galaxy.",
      },
      {
        value: "any",
        label: "spelar-ingen-roll",
        description: "Jag är öppen för båda.",
      },
    ],
  },
  {
    key: "price" as const,
    eyebrow: "Prisnivå",
    title: "Hur tänker du kring pris?",
    description:
      "Vi jämför relativt mot telefonerna som faktiskt finns i sortimentet.",
    options: [
      {
        value: "value",
        label: "Prisvärd",
        description: "Så mycket telefon som möjligt för pengarna.",
      },
      {
        value: "balanced",
        label: "Bra balans",
        description: "Pris och prestanda ska väga jämnt.",
      },
      {
        value: "premium",
        label: "Premium",
        description: "Jag prioriterar modellen framför priset.",
      },
    ],
  },
  {
    key: "size" as const,
    eyebrow: "Storlek",
    title: "Vilken typ av telefon trivs du bäst med?",
    description:
      "Storleksmatchningen använder modellnamnet som vägledning.",
    options: [
      {
        value: "compact",
        label: "Smidig",
        description: "En telefon som känns lätt att hantera.",
      },
      {
        value: "standard",
        label: "Normal",
        description: "En bra kompromiss för arbetsdagen.",
      },
      {
        value: "large",
        label: "Stor skärm",
        description: "Jag vill ha gott om skärmyta.",
      },
      {
        value: "any",
        label: "Spelar ingen roll",
        description: "Storleken är inte avgörande.",
      },
    ],
  },
  {
    key: "usage" as const,
    eyebrow: "Arbetsdag",
    title: "Hur använder du telefonen i jobbet?",
    description:
      "Välj upp till två alternativ som bäst beskriver en vanlig arbetsdag.",
    options: [
      {
        value: "basic",
        label: "Samtal & mail",
        description: "Basfunktioner, BankID, mail och kalender.",
      },
      {
        value: "balanced",
        label: "Teams & appar",
        description: "Många appar, möten och löpande multitasking.",
      },
      {
        value: "power",
        label: "Tung användning",
        description: "Hög belastning och mycket multitasking.",
      },
      {
        value: "camera",
        label: "Foto & video",
        description: "Kameran är viktig i arbetet.",
      },
    ],
  },
  {
    key: "priority" as const,
    eyebrow: "Prioritet",
    title: "Vad väger tyngst i slutändan?",
    description:
      "Välj upp till två. Dina val får extra vikt när vi rangordnar matchningarna.",
    options: [
      {
        value: "value",
        label: "Prisvärdhet",
        description: "Jag vill hålla nere kostnaden.",
      },
      {
        value: "performance",
        label: "Prestanda",
        description: "Jag vill ha en kraftfull modell.",
      },
      {
        value: "camera",
        label: "Kamera",
        description: "Foto och video är viktigast.",
      },
      {
        value: "future",
        label: "Lång livslängd",
        description: "Jag vill välja en så aktuell modell som möjligt.",
      },
    ],
  },
] as const;


/* ============================================================
   MATCHNING
   ============================================================ */

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}


// Fungerar både för enkelval (string) och flerval (string[])
function has(
  answer: string | string[] | undefined,
  value: string
) {
  return Array.isArray(answer)
    ? answer.includes(value)
    : answer === value;
}


function hasAnswer(
  answer: string | string[] | undefined
) {
  return Array.isArray(answer)
    ? answer.length > 0
    : Boolean(answer);
}


function inferSize(
  product: Product
): "compact" | "standard" | "large" {
  const name =
    normalize(product.name);

  if (
    name.includes("pro max") ||
    name.includes("ultra") ||
    name.includes(" plus") ||
    name.includes(" max")
  ) {
    return "large";
  }

  if (
    name.includes(" mini") ||
    /\bse\b/.test(name)
  ) {
    return "compact";
  }

  return "standard";
}


function inferTier(
  product: Product
): number {
  const name =
    normalize(product.name);

  if (
    name.includes("pro max") ||
    name.includes("ultra") ||
    name.includes("fold")
  ) {
    return 4;
  }

  if (
    name.includes(" pro ") ||
    name.includes("galaxy s25") ||
    name.includes("galaxy s24") ||
    name.includes("iphone 17") ||
    name.includes("iphone 16") ||
    name.includes("iphone 15")
  ) {
    return 3;
  }

  if (
    name.includes("galaxy a56") ||
    name.includes("galaxy a36")
  ) {
    return 2;
  }

  return 1;
}


function isCameraFocused(
  product: Product
) {
  const name =
    normalize(product.name);

  return (
    name.includes(" pro") ||
    name.includes("ultra")
  );
}


function generationBonus(
  product: Product
) {
  const value = normalize(
    `${product.modelFamily} ${product.name}`
  );

  if (
    value.includes("iphone 17") ||
    value.includes("galaxy s25") ||
    value.includes("galaxy a56")
  ) {
    return 30;
  }

  if (
    value.includes("iphone 16") ||
    value.includes("galaxy s24") ||
    value.includes("galaxy a36")
  ) {
    return 20;
  }

  if (
    value.includes("iphone 15")
  ) {
    return 10;
  }

  return 0;
}


function recommendationFamilyKey(
  product: Product
) {
  const name =
    normalize(product.name);

  const iphoneMatch =
    name.match(
      /iphone\s+\d+\s*(pro max|pro|plus)?/
    );

  if (iphoneMatch) {
    return iphoneMatch[0]
      .replace(/\s+/g, " ")
      .trim();
  }

  const galaxyMatch =
    name.match(
      /galaxy\s+(?:s|a)\d+\s*(ultra|plus|\+)?/
    );

  if (galaxyMatch) {
    return galaxyMatch[0]
      .replace(/\s+/g, " ")
      .trim();
  }

  return (
    product.modelFamily ||
    product.name
  )
    .toLowerCase()
    .trim();
}


function buildRecommendations(
  products: Product[],
  answers: QuizAnswers
) {
  const phones =
    products.filter(
      (product) =>
        product.productType === "phone" &&
        product.stock
    );

  if (phones.length === 0) {
    return [];
  }

  const prices =
    phones
      .map((product) => product.price)
      .filter(
        (price) =>
          Number.isFinite(price)
      );

  const minPrice =
    Math.min(...prices);

  const maxPrice =
    Math.max(...prices);

  const priceRange =
    Math.max(
      maxPrice - minPrice,
      1
    );

  const scored = phones.map(
    (product) => {
      let score = 0;

      const name =
        normalize(product.name);

      const brand =
        normalize(product.brand);

      const size =
        inferSize(product);

      const tier =
        inferTier(product);

      const pricePosition =
        Math.min(
          1,
          Math.max(
            0,
            (
              product.price -
              minPrice
            ) /
              priceRange
          )
        );

      /* ------------------------------------------------------
         EKOSYSTEM
      ------------------------------------------------------ */

      if (
        answers.ecosystem ===
        "apple"
      ) {
        score +=
          brand.includes("apple")
            ? 70
            : -25;
      }

      if (
        answers.ecosystem ===
        "samsung"
      ) {
        score +=
          brand.includes("samsung")
            ? 70
            : -25;
      }


      /* ------------------------------------------------------
         PRISPROFIL
      ------------------------------------------------------ */

      if (
        has(answers.price, "value")
      ) {
        score +=
          (1 - pricePosition) *
          55;

        if (
          name.includes("begagnad") ||
          name.includes("galaxy a56") ||
          name.includes("galaxy a36")
        ) {
          score += 20;
        }
      }

      if (
        has(answers.price, "balanced")
      ) {
        const distance =
          Math.abs(
            pricePosition - 0.45
          );

        score +=
          Math.max(
            0,
            45 -
              distance * 80
          );
      }

      if (
        has(answers.price, "premium")
      ) {
        score +=
          pricePosition *
          45;

        score +=
          tier >= 3
            ? 20
            : 0;
      }


      /* ------------------------------------------------------
         STORLEK
      ------------------------------------------------------ */

      if (
        answers.size &&
        answers.size !== "any"
      ) {
        if (
          answers.size === size
        ) {
          score += 35;
        } else if (
          answers.size === "compact" &&
          size === "standard"
        ) {
          // Sortimentet innehåller inte alltid en uttalad
          // mini/SE-modell. Standard får därför en mindre bonus.
          score += 12;
        }
      }


      /* ------------------------------------------------------
         ANVÄNDNING (flerval)
      ------------------------------------------------------ */

      if (
        has(answers.usage, "basic")
      ) {
        score +=
          tier <= 2
            ? 35
            : 10;

        score +=
          (1 - pricePosition) *
          15;
      }

      if (
        has(answers.usage, "balanced")
      ) {
        score +=
          tier >= 2 &&
          tier <= 3
            ? 35
            : 15;
      }

      if (
        has(answers.usage, "power")
      ) {
        score +=
          tier >= 3
            ? 45
            : 5;

        if (
          name.includes("pro") ||
          name.includes("ultra")
        ) {
          score += 20;
        }
      }

      if (
        has(answers.usage, "camera")
      ) {
        score +=
          isCameraFocused(
            product
          )
            ? 55
            : 10;
      }


      /* ------------------------------------------------------
         SLUTPRIORITET (flerval)
      ------------------------------------------------------ */

      if (
        has(answers.priority, "value")
      ) {
        score +=
          (1 - pricePosition) *
          40;
      }

      if (
        has(answers.priority, "performance")
      ) {
        score +=
          tier * 12;
      }

      if (
        has(answers.priority, "camera")
      ) {
        score +=
          isCameraFocused(
            product
          )
            ? 50
            : 10;
      }

      if (
        has(answers.priority, "future")
      ) {
        score +=
          generationBonus(
            product
          );

        score +=
          tier >= 3
            ? 15
            : 5;
      }

      return {
        product,
        score,
      };
    }
  );


  // Undvik att resultatet bara blir tre färger/lagringsstorlekar
  // av exakt samma telefonmodell.
  const bestByFamily =
    new Map<
      string,
      {
        product: Product;
        score: number;
      }
    >();

  for (
    const item of scored
  ) {
    const key =
      recommendationFamilyKey(
        item.product
      );

    const existing =
      bestByFamily.get(key);

    if (
      !existing ||
      item.score >
        existing.score ||
      (
        item.score ===
          existing.score &&
        item.product.price <
          existing.product.price
      )
    ) {
      bestByFamily.set(
        key,
        item
      );
    }
  }

  return Array.from(
    bestByFamily.values()
  )
    .sort(
      (a, b) =>
        b.score -
          a.score ||
        a.product.price -
          b.product.price
    )
    .slice(0, 3)
    .map(
      (item) =>
        item.product
    );
}


/* ============================================================
   COMPONENT
   ============================================================ */

export function PhoneQuiz({
  products,
  onAdd,
  onShowAllPhones,
}: PhoneQuizProps) {
  const [started, setStarted] =
    useState(false);

  const [step, setStep] =
    useState(0);

  const [answers, setAnswers] =
    useState<QuizAnswers>(
      {}
    );

  const [showResults, setShowResults] =
    useState(false);

  const currentQuestion =
    QUESTIONS[step];

  const currentAnswer =
    answers[
      currentQuestion.key
    ];

  const recommendations =
    useMemo(
      () =>
        buildRecommendations(
          products,
          answers
        ),
      [
        products,
        answers,
      ]
    );

  const availablePhoneCount =
    useMemo(
      () =>
        products.filter(
          (product) =>
            product.productType ===
              "phone" &&
            product.stock
        ).length,
      [products]
    );


  const selectAnswer = (value: string) => {
  const isMultiSelect =
    MULTI_SELECT_KEYS.includes(currentQuestion.key);

  setAnswers((current) => {
    const existing = current[currentQuestion.key];

    if (!isMultiSelect) {
      return {
        ...current,
        [currentQuestion.key]: value,
      };
    }

    const currentValues = Array.isArray(existing)
      ? existing
      : existing
        ? [existing]
        : [];

    // Klicka på ett redan valt alternativ → ta bort det
    if (currentValues.includes(value)) {
      return {
        ...current,
        [currentQuestion.key]: currentValues.filter(
          (item) => item !== value
        ),
      };
    }

    // Max 2 val på usage/priority
    if (currentValues.length >= 2) {
      return current;
    }

    return {
      ...current,
      [currentQuestion.key]: [
        ...currentValues,
        value,
      ],
    };
  });
};


  const goNext = () => {
    if (!hasAnswer(currentAnswer)) {
      return;
    }

    if (
      step ===
      QUESTIONS.length - 1
    ) {
      setShowResults(true);
      return;
    }

    setStep(
      (current) =>
        current + 1
    );
  };


  const goBack = () => {
    if (step === 0) {
      setStarted(false);
      return;
    }

    setStep(
      (current) =>
        current - 1
    );
  };


  const restart = () => {
    setAnswers({});
    setStep(0);
    setShowResults(false);
    setStarted(true);
  };


  /* ==========================================================
     INTRO
     ========================================================== */

  if (!started) {
    return (
      <section
        className="
          relative
          overflow-hidden
          rounded-[28px]
          border
          border-[#DDE6EC]
          bg-[#171C25]
          px-5
          py-6
          text-white
          shadow-[0_18px_55px_rgba(19,31,49,0.10)]
          sm:px-7
          sm:py-7
        "
      >
        <div className="pointer-events-none absolute right-[-90px] top-[-120px] h-[280px] w-[280px] rounded-full bg-[#12B4F0]/20 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-[-130px] left-[20%] h-[230px] w-[230px] rounded-full bg-[#2CCEC2]/10 blur-[90px]" />

        <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
              <Sparkles
                size={14}
                className="text-[#2CCEC2]"
              />

              Telefonväljaren
            </div>

            <h2 className="max-w-[620px] text-2xl font-semibold tracking-[-0.035em] sm:text-[30px]">
              Vilken telefon ska jag ha?
            </h2>

            <p className="mt-3 max-w-[650px] text-sm leading-6 text-white/65">
              Svara på fem snabba frågor så matchar vi dina behov
              mot telefonerna som finns i det aktuella sortimentet.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-white/55">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                5 frågor
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                {availablePhoneCount} telefoner i lager
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                Ca 1 minut
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setStarted(true)
            }
            disabled={
              availablePhoneCount === 0
            }
            className="
              inline-flex
              min-h-[48px]
              items-center
              justify-center
              gap-2
              rounded-full
              bg-white
              px-5
              text-sm
              font-semibold
              text-[#171C25]
              transition
              hover:bg-[#F4F7FA]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Starta guiden

            <ArrowRight
              size={16}
            />
          </button>
        </div>
      </section>
    );
  }


  /* ==========================================================
     RESULT
     ========================================================== */

  if (showResults) {
    return (
      <section
        className="
          rounded-[28px]
          border
          border-[#DDE6EC]
          bg-white
          p-5
          shadow-[0_16px_50px_rgba(19,31,49,0.05)]
          sm:p-6
        "
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#168E85]">
              <Check
                size={14}
              />

              Din matchning
            </div>

            <h2 className="text-2xl font-semibold tracking-[-0.035em] text-[#171C25]">
              Telefoner som passar dina svar
            </h2>

            <p className="mt-2 max-w-[680px] text-sm leading-6 text-[#667181]">
              Matchningen rangordnar telefonerna i det aktuella sortimentet
              utifrån dina val, prisnivå och modellnamn.
            </p>
          </div>

          <button
            type="button"
            onClick={restart}
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-[#E3E9EF]
              bg-white
              px-4
              py-2
              text-xs
              font-semibold
              text-[#667181]
              transition
              hover:border-[#CBD6DE]
              hover:text-[#171C25]
            "
          >
            <RefreshCcw
              size={14}
            />

            Gör om
          </button>
        </div>


        {recommendations.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {recommendations.map(
                (
                  product,
                  index
                ) => (
                  <div
                    key={
                      product.id
                    }
                    className="relative"
                  >
                    <div
                      className="
                        absolute
                        left-3
                        top-3
                        z-10
                        rounded-full
                        bg-[#171C25]
                        px-2.5
                        py-1
                        text-[10px]
                        font-semibold
                        text-white
                        shadow-sm
                      "
                    >
                      {index === 0
                        ? "Bäst match"
                        : `Match ${index + 1}`}
                    </div>

                    <ProductCard
                      product={
                        product
                      }
                      onAdd={onAdd}
                    />
                  </div>
                )
              )}
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-[#EDF1F4] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[650px] text-xs leading-5 text-[#8A96A3]">
                Guiden är ett beslutsstöd och använder den produktdata
                som finns i webshoppen. Jämför gärna alternativen innan
                du beställer.
              </p>

              {onShowAllPhones && (
                <button
                  type="button"
                  onClick={
                    onShowAllPhones
                  }
                  className="
                    inline-flex
                    min-h-[42px]
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    border
                    border-[#E3E9EF]
                    bg-white
                    px-4
                    text-sm
                    font-semibold
                    text-[#171C25]
                    transition
                    hover:border-[#CBD6DE]
                  "
                >
                  Visa alla telefoner

                  <ArrowRight
                    size={15}
                  />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-[22px] border border-dashed border-[#D5DEE5] bg-[#F8FAFB] px-5 py-10 text-center">
            <Smartphone
              size={24}
              className="mx-auto text-[#8A96A3]"
            />

            <h3 className="mt-4 text-base font-semibold text-[#171C25]">
              Inga telefoner att matcha just nu
            </h3>

            <p className="mt-2 text-sm text-[#7D8794]">
              Det finns inga lagerförda telefoner i det aktuella sortimentet.
            </p>
          </div>
        )}
      </section>
    );
  }


  /* ==========================================================
     QUESTIONS
     ========================================================== */

  const progress =
    ((step + 1) /
      QUESTIONS.length) *
    100;

  const isMulti =
    MULTI_SELECT_KEYS.includes(currentQuestion.key);

  return (
    <section
      className="
        overflow-hidden
        rounded-[28px]
        border
        border-[#DDE6EC]
        bg-white
        shadow-[0_16px_50px_rgba(19,31,49,0.05)]
      "
    >
      <div className="h-1.5 w-full bg-[#EEF2F5]">
        <div
          className="h-full bg-[#0B72FE] transition-all duration-300"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8A96A3]">
              Fråga {step + 1} av{" "}
              {QUESTIONS.length} ·{" "}
              {currentQuestion.eyebrow}

              {isMulti && (
                <span className="ml-2 rounded-full bg-[#0B72FE]/10 px-2 py-0.5 normal-case tracking-normal text-[#0B72FE]">
                  Välj upp till 2
                </span>
              )}
            </div>

            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#171C25] sm:text-2xl">
              {currentQuestion.title}
            </h2>

            <p className="mt-2 max-w-[650px] text-sm leading-6 text-[#667181]">
              {currentQuestion.description}
            </p>
          </div>

          <div className="hidden h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#0B72FE]/10 text-[#0B72FE] sm:grid">
            <Smartphone
              size={19}
            />
          </div>
        </div>


        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {currentQuestion.options.map(
            (option) => {
              const active =
                has(
                  currentAnswer,
                  option.value
                );

              return (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  onClick={() =>
                    selectAnswer(
                      option.value
                    )
                  }
                  className={`
                    min-h-[92px]
                    rounded-[18px]
                    border
                    p-4
                    text-left
                    transition-all
                    duration-200

                    ${
                      active
                        ? `
                          border-[#0B72FE]
                          bg-[#0B72FE]/5
                          shadow-[0_8px_24px_rgba(11,114,254,0.08)]
                        `
                        : `
                          border-[#E3E9EF]
                          bg-[#F8FAFB]
                          hover:border-[#CBD6DE]
                          hover:bg-white
                        `
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div
                        className={`
                          text-sm
                          font-semibold

                          ${
                            active
                              ? "text-[#0B72FE]"
                              : "text-[#171C25]"
                          }
                        `}
                      >
                        {option.label}
                      </div>

                      <div className="mt-1.5 text-xs leading-5 text-[#7D8794]">
                        {option.description}
                      </div>
                    </div>

                    <div
                      className={`
                        mt-0.5
                        grid
                        h-5
                        w-5
                        shrink-0
                        place-items-center
                        border

                        ${
                          isMulti
                            ? "rounded-md"
                            : "rounded-full"
                        }

                        ${
                          active
                            ? `
                              border-[#0B72FE]
                              bg-[#0B72FE]
                              text-white
                            `
                            : `
                              border-[#CBD6DE]
                              bg-white
                              text-transparent
                            `
                        }
                      `}
                    >
                      <Check
                        size={12}
                      />
                    </div>
                  </div>
                </button>
              );
            }
          )}
        </div>


        <div className="mt-6 flex items-center justify-between border-t border-[#EDF1F4] pt-5">
          <button
            type="button"
            onClick={goBack}
            className="
              inline-flex
              min-h-[42px]
              items-center
              gap-2
              rounded-full
              px-3
              text-sm
              font-semibold
              text-[#667181]
              transition
              hover:bg-[#F4F7FA]
              hover:text-[#171C25]
            "
          >
            <ArrowLeft
              size={15}
            />

            {step === 0
              ? "Avbryt"
              : "Tillbaka"}
          </button>

          <button
            type="button"
            disabled={
              !hasAnswer(currentAnswer)
            }
            onClick={goNext}
            className="
              inline-flex
              min-h-[44px]
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[#171C25]
              px-5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#2D3444]
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            {step ===
            QUESTIONS.length - 1
              ? "Visa min matchning"
              : "Nästa"}

            <ArrowRight
              size={15}
            />
          </button>
        </div>
      </div>
    </section>
  );
}