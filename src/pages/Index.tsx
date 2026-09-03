import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SEO from "@/components/SEO";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import SwitchboardPanel from "@/components/SwitchboardPanel";
import Banderoll from "@/components/Banderoll";
import WhyCompartners from "@/components/WhyCompartners";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Compartners – Operatörsoberoende telefonilösningar för företag"
        description="Vi skräddarsyr er telefonilösning – mobila växlar, körjournaler och personlig support, oavsett operatör. Ring 010-210 27 00."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Compartners",
          url: "https://compartners.se/",
          telephone: "+46-10-210-27-00",
          email: "info@compartners.se",
        }}
      />

      <Navbar />

      <main>
        <Hero />
        <WhyCompartners />
        <Services />
        <HowItWorks />
        <Banderoll />
        <SwitchboardPanel />
        <Stats />

        <Testimonials />

        <FAQ />

        <Contact />
      </main>

      <Footer />

      <CookieBanner />

    </div>
  );
};

export default Index;