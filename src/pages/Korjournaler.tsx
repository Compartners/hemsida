import { FileText, Car, MapPin, Clock, Shield, Smartphone } from "lucide-react";
import LandingPage from "@/components/LandingPage";

const Korjournaler = () => (
  <LandingPage
    seoTitle="Elektronisk körjournal – automatisk rapportering | Compartners"
    seoDescription="Slipp manuell körjournal. Compartners elektroniska körjournal registrerar resor automatiskt och uppfyller Skatteverkets krav."
    canonical="https://compartners.se/korjournaler"
    eyebrow="Körjournaler"
    heading="Automatisk"
    highlight="elektronisk körjournal"
    intro="Slipp krångel, glömda anteckningar och försvunna dokument. Vår körjournal registrerar resorna automatiskt och håller koll på allt."
    benefits={["Skatteverket-godkänd", "Automatisk loggning", "Tjänste & privat"]}
    features={[
      { icon: Car, title: "Automatisk registrering", description: "Resor loggas automatiskt så fort fordonet startar – inget mer manuellt arbete." },
      { icon: MapPin, title: "GPS-positionering", description: "Exakta start- och slutpositioner för varje resa, med karta och tidsstämpel." },
      { icon: FileText, title: "Skattemässigt korrekt", description: "Rapporterna uppfyller Skatteverkets krav för förmånsbeskattning." },
      { icon: Smartphone, title: "Smidig app", description: "Klassificera resor som tjänste eller privat med ett enkelt svep i appen." },
      { icon: Clock, title: "Sparar tid", description: "Slipp timmar av administration varje månad – allt finns redan dokumenterat." },
      { icon: Shield, title: "Säker datahantering", description: "Dina resedata hanteras säkert och i enlighet med GDPR." },
    ]}
    faq={[
      { q: "Uppfyller körjournalen Skatteverkets krav?", a: "Ja, lösningen är utformad för att uppfylla Skatteverkets krav på elektronisk körjournal." },
      { q: "Funkar det i alla bilar?", a: "Ja, vi har lösningar som passar både personbilar, lätta lastbilar och tjänstebilar." },
      { q: "Kan flera förare dela ett fordon?", a: "Ja, ni kan koppla flera förare till samma fordon och varje resa registreras per förare." },
    ]}
  />
);

export default Korjournaler;
