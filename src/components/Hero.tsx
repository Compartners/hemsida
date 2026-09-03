import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import heroVideo from "@/assets/forest-drone.mp4";
//import heroPosterImg from "@/assets/forest-drone-poster.webp"; // Skapa en faktisk bild här
import { useState, useEffect } from "react";

const Hero = () => {
  const benefits = [
    "Operatörsoberoende",
    "Personlig service",
    "Skräddarsydda lösningar",
  ];

  const getOpenStatus = () => {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;

    const openTime = 8 * 60;
    const closeTime = 17 * 60;
    const isWeekday = day >= 1 && day <= 5;
    const isOpen = isWeekday && currentTime >= openTime && currentTime < closeTime;

    if (isOpen) return { isOpen: true, message: "Vi har öppet" };
    if (day === 0 || day === 6 || (day === 5 && currentTime >= closeTime)) {
      return { isOpen: false, message: "Vi har stängt, öppnar åter måndag 08:00" };
    }
    if (currentTime >= closeTime) {
      return { isOpen: false, message: "Vi har stängt, öppnar åter imorgon 08:00" };
    }
    return { isOpen: false, message: "Vi har stängt, öppnar 08:00" };
  };

  const [status, setStatus] = useState(getOpenStatus);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getOpenStatus());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hem" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          //poster={heroPosterImg}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/40" />
      </div>

      {/* Background decorations */}
      <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl z-0 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Open/Closed Badge */}
          <a 
            href="#kontakt" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-card mb-8 animate-fade-in hover:bg-card/80 transition-colors cursor-pointer"
          >
            <span className="relative flex h-3 w-3">
              {status.isOpen && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              )}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${status.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
            </span>
            <span className="text-sm font-medium text-muted-foreground">{status.message}</span>
          </a>

          {/* Heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight animate-fade-in">
            Vi skräddarsyr er{" "}
            <span className="text-blue-300">telefonilösning</span> efter behov
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-8 animate-fade-in font-medium">
            Compartners är ett operatörsoberoende företag som hjälper er hitta 
            den bästa telefonilösningen – oavsett operatör.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-10 animate-fade-in">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-foreground">
                <CheckCircle className="w-5 h-5 text-secondary" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button className="bg-secondary text-white hover:bg-secondary/90" size="xl" asChild>
              <a href="#kontakt">
                Kontakta oss
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <Button variant="outline" size="xl" asChild className="text-white border-secondary text-secondary hover:bg-secondary">
              <a href="#tjanster">Våra tjänster</a>
            </Button>
          </div>

          {/* Tagline */}
          <p className="mt-16 text-2xl md:text-3xl font-display font-bold text-white animate-fade-in">
            #comsåblirvipartners
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;