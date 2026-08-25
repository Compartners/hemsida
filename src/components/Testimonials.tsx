import { Quote } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const testimonials = [
  {
    quote: "Vi är väldigt nöjda med Compartners som leverantör. De är otroligt snabba på återkoppling, kommer med innovativa lösningar och förslag till förbättring. Deras personliga service är en trygghet för hela vår organisation.",
    author: "Ulrica Storensten",
    company: "Kronans Apotek",
    logo: "/logos/kronans-apotek.png",
  },
  {
    quote: "Vi på Tuna Entreprenad är ett bygg- och anläggningsföretag i Södermanland och Västmanland med 170 medarbetare. Sedan några år har vi all vår telefoni utlagd hos ComPartner. Det var ett strategiskt beslut vi tog i styrelsen och har fungerat mycket bra. Philip och gänget är väldigt närvarande i vår verksamhet och vår insats är minimal för att få all telefoni med alla abonnemang att fungera smidigt.",
    author: "Jonas Lundin",
    company: "Tuna Entreprenad",
    logo: "/logos/tuna-entreprenad.png",
  },
  {
    quote: "Vi är väldigt nöjda med vårt samarbete med Compartners. Dom är otroligt lösningsorienterade, alltid serviceminded, snabbt på plats och ingenting är omöjligt.",
    author: "Rosie Persson",
    company: "Kilenkrysset",
    logo: "/logos/kilenkrysset.png",
  },
  {
    quote: "Samarbetet med Compartners har var otroligt smidigt! Vi får alltid ett trevligt bemötande med snabb och kunnig support när vi behöver det.",
    author: "Joakim Eriksson",
    company: "Installationsservice",
    logo: "/logos/installationsservice.png",
  },
  {
    quote: "Compartners sätter sig in i ditt företags behov och utformar lösningar exakt därefter! Trevliga, kunniga, snabba och alltid lättillgängliga - de överträffar mina förväntningar vid varje kontakt, rekommenderar varmt!",
    author: "Elisabet Jacobsen",
    company: "Svensk Fastighetsförmedling",
    logo: "/logos/svensk-fastighetsformedling.png",
  },
  {
    quote: "Jag tycker att vårt samarbete med Compartners är toppenbra. De levererar alltid den bästa supporten! Alltid tillgängliga och snabb med att hjälpa oss med våra behov.",
    author: "Sofia Stark",
    company: "Svenska Kyrkan",
    logo: "/logos/svenska-kyrkan.png",
  },
];

const TestimonialCard = ({
  quote,
  author,
  company,
  logo,
}: {
  quote: string;
  author: string;
  company: string;
  logo: string;
}) => (
  <div className="group bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-lifted hover:bg-gradient-to-br hover:from-primary/10 hover:via-secondary/10 hover:to-accent/10 hover:border-primary/30 transition-all duration-300 flex flex-col h-full w-[340px] md:w-[400px] shrink-0">
    <div className="flex items-center justify-between mb-4">
      <Quote className="w-8 h-8 text-primary/30 group-hover:text-primary/60 transition-colors duration-300" />

      {/* Kundens logotyp - faller tillbaka till företagsnamn om bilden saknas */}
      <div className="h-8 flex items-center">
        <img
          alt={company}
          className="h-8 w-auto max-w-[120px] object-contain opacity-80 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = "none";
            const fallback = target.nextElementSibling as HTMLElement | null;
            if (fallback) fallback.style.display = "inline-flex";
          }}
        />
        <span className="hidden items-center h-8 px-3 text-xs font-semibold text-muted-foreground/70 whitespace-nowrap border border-border/50 rounded-full">
          {company}
        </span>
      </div>
    </div>

    <p className="text-foreground leading-relaxed mb-6 flex-grow">
      "{quote}"
    </p>
    <div className="border-t border-border group-hover:border-primary/20 pt-4 transition-colors duration-300">
      <div className="font-display font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
        {author}
      </div>
      <div className="text-sm text-muted-foreground">{company}</div>
    </div>
  </div>
);

const TestimonialMarquee = () => {
  // Dubblera listan så loopen blir sömlös
  const loopTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <div className="flex w-max animate-marquee-slow gap-6 [animation-play-state:running] hover:[animation-play-state:paused]">
        {loopTestimonials.map((testimonial, index) => (
          <TestimonialCard key={`${testimonial.author}-${index}`} {...testimonial} />
        ))}
      </div>
    </div>
  );
};

const Testimonials = () => {
  return (
    <section id="kundröster" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Kundröster</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
              Vad säger våra{" "}
              <span className="text-white">kunder</span>?
            </h2>
            <p className="text-muted-foreground text-lg">
              Vi är stolta över de långvariga relationer vi byggt med våra kunder.
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Ligger utanför containern (full bredd) så korten kan rulla ända ut i kanterna */}
      <ScrollReveal>
        <TestimonialMarquee />
      </ScrollReveal>
    </section>
  );
};

export default Testimonials;