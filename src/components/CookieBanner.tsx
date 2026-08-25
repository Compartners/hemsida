import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Small delay before showing banner
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in">
      <div className="container mx-auto">
        <div className="bg-card border border-border rounded-2xl shadow-lifted p-6 md:flex md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4 mb-4 md:mb-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground mb-1">
                Vi använder cookies
              </h3>
              <p className="text-sm text-muted-foreground">
                Vi använder cookies för att förbättra din upplevelse på vår webbplats. 
                Genom att fortsätta använda sidan godkänner du vår användning av cookies.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={declineCookies}
              className="font-medium"
            >
              Avböj
            </Button>
            <Button 
              size="sm" 
              onClick={acceptCookies}
              className="font-medium"
            >
              Acceptera
            </Button>
          </div>
          <button
            onClick={declineCookies}
            className="absolute top-4 right-4 md:hidden p-1 hover:bg-muted rounded-full transition-colors"
            aria-label="Stäng"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
