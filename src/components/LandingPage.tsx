import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, LucideIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Contact from "@/components/Contact";
import ScrollReveal from "@/components/ScrollReveal";

export interface LandingPageProps {
  seoTitle: string;
  seoDescription: string;
  canonical: string;
  eyebrow: string;
  heading: string;
  highlight: string;
  intro: string;
  benefits: string[];
  features: { icon: LucideIcon; title: string; description: string }[];
  faq?: { q: string; a: string }[];
}

const LandingPage = ({
  seoTitle,
  seoDescription,
  canonical,
  eyebrow,
  heading,
  highlight,
  intro,
  benefits,
  features,
  faq,
}: LandingPageProps) => {
  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: heading + " " + highlight,
      provider: {
        "@type": "Organization",
        name: "Compartners",
        url: "https://compartners.se/",
        telephone: "+46-10-210-27-00",
      },
      areaServed: "SE",
      description: seoDescription,
    },
  ];

  if (faq && faq.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title={seoTitle} description={seoDescription} canonical={canonical} jsonLd={jsonLd} />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 -z-10" />
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10" />

          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
                {eyebrow}
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                {heading} <span className="text-white">{highlight}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">{intro}</p>

              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {benefits.map((b) => (
                  <div key={b} className="flex items-center gap-2 text-foreground">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="font-medium">{b}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button  size="xl" asChild>
                  <a href="#kontakt">
                    Kontakta oss <ArrowRight className="w-5 h-5" />
                  </a>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <a href="tel:010-2102700">Ring 010-210 27 00</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 md:py-28 bg-muted/40">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Det här ingår
                </h2>
                <p className="text-muted-foreground text-lg">
                  Allt du behöver för en smidig och pålitlig lösning.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <ScrollReveal key={f.title} delay={i * 0.1}>
                  <div className="bg-card rounded-2xl p-8 shadow-card border border-border/50 h-full hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                      <f.icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-3">{f.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{f.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        {faq && faq.length > 0 && (
          <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">
                  Vanliga frågor
                </h2>
                <div className="space-y-4">
                  {faq.map((f) => (
                    <details
                      key={f.q}
                      className="group bg-card rounded-xl p-6 border border-border/50 shadow-card"
                    >
                      <summary className="font-semibold text-foreground cursor-pointer list-none flex justify-between items-center">
                        {f.q}
                        <span className="text-primary group-open:rotate-45 transition-transform">+</span>
                      </summary>
                      <p className="text-muted-foreground mt-3 leading-relaxed">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
