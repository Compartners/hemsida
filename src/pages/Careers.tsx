import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/SEO";

import AboutHero from "../components/about/AboutHero";
import AboutStory from "../components/about/AboutStory";
import AboutValues from "../components/about/AboutValues";
import AboutTeam from "../components/about/AboutTeam";
import CareerApplication from "../components/about/CareerApplication";

export default function About() {
  return (
    <>
      <Seo
  title="Om Compartners – Teknik med personligt ansvar"
  description="Lär känna Compartners – en operatörsoberoende partner som hjälper företag få telefoni, smart teknik och support att fungera som en helhet."
  canonical="https://compartners.se/om-oss"
/>

      <Navbar />

      <main>
        <AboutHero />
        <AboutStory />
        <AboutValues />
        <AboutTeam />

        <section id="karriar">
          <CareerApplication />
        </section>
      </main>

      <Footer />
    </>
  );
}