import { HeadphonesIcon, Users, Clock, Phone, Wrench, MessageCircle } from "lucide-react";
import LandingPage from "@/components/LandingPage";

const Support = () => (
  <LandingPage
    seoTitle="Personlig support för företagstelefoni | Compartners"
    seoDescription="Personlig support från Compartners – er egen kontaktperson, snabb hjälp och svensk support för företagstelefoni och växellösningar."
    canonical="https://compartners.se/support"
    eyebrow="Support"
    heading="Personlig support"
    highlight="när du behöver den"
    intro="Vi vet hur viktigt det är att telefonin fungerar. Hos oss får ni en personlig kontakt – inte en anonym växel."
    benefits={["Egen kontaktperson", "Svensk support", "Snabb återkoppling"]}
    features={[
      { icon: Users, title: "Personlig kontakt", description: "Ni får en namngiven kontaktperson som känner till just er lösning." },
      { icon: Phone, title: "Bara ett samtal bort", description: "Ring 010-210 27 00 så hjälper vi er direkt – ingen knappval-djungel." },
      { icon: Clock, title: "Snabb hjälp", description: "Vi prioriterar att lösa ert ärende snabbt så att verksamheten kan rulla på." },
      { icon: Wrench, title: "Teknisk expertis", description: "Vårt team har lång erfarenhet av växlar, mobil och företagstelefoni." },
      { icon: MessageCircle, title: "Hjälp via mail", description: "Skicka ett mail till support@compartners.se så återkommer vi snabbt." },
      { icon: HeadphonesIcon, title: "Löpande rådgivning", description: "Vi hjälper er optimera lösningen även efter att ni kommit igång." },
    ]}
    faq={[
      { q: "Hur når jag supporten?", a: "Ring 010-210 27 00 eller maila support@compartners.se så hjälper vi er." },
      { q: "Får jag en egen kontaktperson?", a: "Ja, alla våra kunder får en personlig kontakt som kan deras lösning." },
      { q: "Vad kostar supporten?", a: "Support ingår i vårt åtagande. Kontakta oss så går vi igenom vad som passar er." },
    ]}
  />
);

export default Support;
