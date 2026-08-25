import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/compartners-logo-white.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const navLinks = [
    { name: "Hem", href: isHomePage ? "#hem" : "/#hem", isRoute: false },
    { name: "Tjänster", href: isHomePage ? "#tjanster" : "/#tjanster", isRoute: false },
    { name: "Kundröster", href: isHomePage ? "#kundröster" : "/#kundröster", isRoute: false },
    { name: "Jobba hos oss", href: "/jobba-hos-oss", isRoute: true },

  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/15 backdrop-blur-md rounded-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="Compartners" 
              className="h-28 md:h-[8.5rem] w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="font-display text-white font-semibold hover:text-primary transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-display font-semibold text-white hover:text-primary transition-colors duration-200"
                >
                  {link.name}
                </a>
              )
              
            )}
            <Button size="lg" className="font-semibold bg-secondary" asChild>
              <a href={isHomePage ? "/webshop" : "/Webshop"}>Webshop</a>
            </Button>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
                        
            <a href="tel:010-2102700" className="flex items-center gap-2 text-foreground font-display font-semibold">
              <Phone className="w-4 h-4 text-primary" />
              010-210 27 00
            </a>
            <Button size="lg" className="font-semibold bg-secondary hover:bg-secondary" asChild>
              <a href={isHomePage ? "#kontakt" : "/#kontakt"}>Kontakta oss</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-10 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="font-medium text-white text-muted-foreground hover:text-primary transition-colors duration-200 py-2"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="font-medium text-white text-muted-foreground hover:text-primary transition-colors duration-200 py-2"
                  >
                    {link.name}
                  </a>
                )
              )}
              <Button size="lg" className="font-semibold" asChild>
              <a href={isHomePage ? "/webshop" : "/Webshop"}>Webshop</a>
            </Button>
              <a href="tel:010-2102700" className="flex items-center gap-2 text-foreground font-display font-semibold py-2">
                <Phone className="w-4 h-4 text-primary" />
                010-210 27 00
              </a>

              <Button  size="lg" className="mt-2 font-semibold" asChild>
                <a href={isHomePage ? "#kontakt" : "/#kontakt"} onClick={() => setIsOpen(false)}>Kontakta oss</a>
              </Button>

            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
