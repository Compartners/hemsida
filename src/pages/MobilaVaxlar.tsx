import { Phone, Users, Settings, Zap, Cloud, Shield } from "lucide-react";
import LandingPage from "@/components/LandingPage";

const MobilaVaxlar = () => (
  <LandingPage
    seoTitle="Mobil växel för företag – flexibla växellösningar | Compartners"
    seoDescription="Mobila växlar från Compartners – flera plattformar, smidig hantering och personlig rådgivning. Hitta rätt växellösning för ert företag."
    canonical="https://compartners.se/mobila-vaxlar"
    eyebrow="Mobila växlar"
    heading="Mobil växel anpassad efter"
    highlight="ert företag"
    intro="Vi erbjuder flera olika växelplattformar och hjälper er välja den lösning som passar bäst – oavsett storlek, bransch eller operatör."
    benefits={["Flera plattformar", "Operatörsoberoende", "Personlig rådgivning"]}
    features={[
      { icon: Phone, title: "Smarta samtalsflöden", description: "Köfunktioner, svarsgrupper och hänvisningar som gör att inga samtal missas." },
      { icon: Users, title: "Skalbar för alla team", description: "Från enmansföretag till växande organisationer – växeln växer med er." },
      { icon: Settings, title: "Enkel administration", description: "Hantera användare, nummer och scheman via en tydlig portal eller app." },
      { icon: Cloud, title: "Molnbaserat", description: "Inga servrar att underhålla. Fungerar var ni än är – kontor, hemma eller på resande fot." },
      { icon: Zap, title: "Snabb driftsättning", description: "Vi sköter portering, konfiguration och utbildning så ni kommer igång snabbt." },
      { icon: Shield, title: "Säker och stabil", description: "Driftsäkra plattformar med svensk support när det behövs." },
    ]}
    faq={[
      { q: "Är ni bundna till en operatör?", a: "Nej, Compartners är operatörsoberoende. Vi väljer den växel och operatör som passar er bäst." },
      { q: "Kan ni hjälpa till med portering av befintliga nummer?", a: "Ja, vi hanterar hela processen så att ni behåller era nummer utan avbrott." },
      { q: "Fungerar växeln med mobil och dator?", a: "Ja, växeln fungerar via mobilnätet, softphone på datorn och bordstelefoner." },
    ]}
  />
);

export default MobilaVaxlar;
