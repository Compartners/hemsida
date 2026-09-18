import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import Hero from "../components/home/Hero";
import TrustStrip from "../components/home/TrustStrip";
import WhyCompartners from "../components/home/WhyCompartners";
import ServicesPreview from "../components/home/ServicesPreview";
import MethodSection from "../components/home/MethodSection";
import AiFeature from "../components/home/AiFeature";
import CustomerCases from "../components/home/CostumerCases";
import PersonalSupport from "../components/home/PersonalSupport";
import FinalCTA from "../components/home/FinalCTA";
import ContactSection from "../components/contact/ContactSection";
import { C } from "vitest/dist/chunks/reporters.d.BFLkQcL6.js";
import Seo from "@/components/SEO";

const Index = () => {
  return (
    <>
      <Navbar />
<Seo
    title="Compartners – Telefoni, AI och företagskommunikation"
    description="Compartners hjälper företag med företagstelefoni, AI, mobilitet och personlig support – samlat hos en operatörsoberoende partner."
    canonical="https://compartners.se/"
  />
      <main>
        <Hero />

        <TrustStrip />

        <WhyCompartners />

        <ServicesPreview />

        <MethodSection />

        <AiFeature />

        <CustomerCases />

        <PersonalSupport />
        <ContactSection />

        <FinalCTA />
      </main>

      <Footer />
    </>
  );
};

export default Index;