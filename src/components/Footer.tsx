import { Phone, Mail } from "lucide-react";
import logoDark from "@/assets/compartners-logo-dark.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={logoDark} 
              alt="Compartners" 
              className="h-12 md:h-14 w-auto"
            />
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <a href="tel:010-2102700" className="flex items-center gap-2 text-background/80 hover:text-background transition-colors">
              <Phone className="w-4 h-4" />
              010-210 27 00
            </a>
            <a href="mailto:info@compartners.se" className="flex items-center gap-2 text-background/80 hover:text-background transition-colors">
              <Mail className="w-4 h-4" />
              info@compartners.se
            </a>
          </div>

          {/* Copyright */}
          <div className="text-background/60 text-sm">
            © {currentYear} Compartners. Alla rättigheter förbehållna.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
