import { Phone, FileText, HeadphonesIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import mobilaVaxlarImg from "@/assets/mobilvaxel.jpg";
import korjournalerImg from "@/assets/bilar.jpg";
import supportImg from "@/assets/support.jpg";

const services = [
  {
    icon: Phone,
    title: "Mobila växlar",
    description: "Compartners förstår att varje företag är unikt. Därför använder vi flera olika växelplattformar för att kunna välja den bästa lösningen för varje kund.",
    color: "bg-primary/10 text-primary",
    href: "/mobila-vaxlar",
    img: mobilaVaxlarImg,
  },
  {
    icon: FileText,
    title: "Körjournaler",
    description: "Slipp krångel och försvunna dokument med en elektronisk körjournal som sköter rapporteringen åt dig.",
    color: "bg-secondary/15 text-secondary",
    href: "/korjournaler",
    img: korjournalerImg,
  },
  {
    icon: HeadphonesIcon,
    title: "Support",
    description: "Vi på Compartners vet hur viktigt det är för våra kunder att deras telefonilösningar fungerar. Med er personliga kontakt på Compartners är vi bara ett samtal bort.",
    color: "bg-accent/15 text-accent",
    href: "/support",
    img: supportImg,
  },
];

const Services = () => {
  return (
    <section id="tjanster" className="py-24 md:py-32 bg-muted/40">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Våra tjänster</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
              Allt för er{" "}
              <span className="text-white">telefoni</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Vi erbjuder skräddarsydda lösningar som passar just ert företags behov.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ScrollReveal key={service.title} delay={index * 0.1}>
              <Link
                to={service.href}
                className="group relative block rounded-2xl p-8 shadow-card hover:shadow-lifted transition-all duration-300 hover:-translate-y-2 border border-border/50 h-full overflow-hidden min-h-[320px] flex flex-col justify-end"
              >
                {/* Bakgrundsbild */}
                <div className="">
                <img
                  src={service.img}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 blur-sm group-hover:blur-0 transition-transform duration-500"
                />
</div>
                {/* Mörk gradient-overlay så texten syns */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/40" />

                {/* Innehåll ovanpå bilden */}
                <div className="relative z-10">
                  <h3 className="font-display text-xl font-bold text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-white font-semibold">
                    Läs mer <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;