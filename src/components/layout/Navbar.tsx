import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import AnimatedLogo from "../AnimatedLogo";

const navigation = [
  { label: "Tjänster", href: "/tjanster" },
  { label: "Om oss", href: "/om-oss" },
  { label: "Jobba hos oss", href: "/jobba-hos-oss" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const lightBackground = scrolled || mobileOpen;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const linkClass = `
    text-sm font-medium transition-colors duration-200
    ${
      lightBackground
        ? "text-[#353A43] hover:text-[#0B72FE]"
        : "text-white/75 hover:text-white"
    }
  `;

  return (
    <header
      className={`
        fixed inset-x-0 top-0 z-50
        transition-[background-color,box-shadow,border-color] duration-300
        ${
          mobileOpen
            ? "border-b border-[#E3E9EF] bg-white"
            : scrolled
              ? "border-b border-[#E3E9EF]/70 bg-white/85 shadow-[0_8px_30px_rgba(19,31,49,0.04)] backdrop-blur-xl"
              : "border-b border-transparent bg-transparent"
        }
      `}
    >
      <div className="mx-auto flex h-[88px] w-full max-w-[1240px] items-center justify-between gap-8 px-5 md:px-8">
        {/* Logotyp */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex w-[175px] shrink-0 items-center"
          aria-label="Compartners – startsida"
        >
          <AnimatedLogo
            className="h-auto w-full"
            variant={lightBackground ? "dark" : "light"}
          />
        </Link>

        {/* Huvudnavigation */}
        <nav
          aria-label="Huvudnavigation"
          className="hidden items-center gap-7 lg:flex"
        >
          {navigation.map(({ label, href }) => (
            <Link key={href} to={href} className={linkClass}>
              {label}
            </Link>
          ))}
        </nav>

        {/* En tydlig huvudknapp */}
        <div className="hidden items-center gap-6 lg:flex">
         {/* <Link
            to="/webbshop"
            className={`${linkClass} inline-flex items-center gap-1`}
          >
            Webbshop
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link> */}

          <Link
            to="/#kontakt"
            className={`
              inline-flex min-h-[44px] items-center justify-center
              rounded-full px-5 text-sm font-semibold
              transition-colors duration-200
              ${
                lightBackground
                  ? "bg-[#171C25] text-white hover:bg-[#2D3444]"
                  : "bg-white text-[#171C25] hover:bg-white/90"
              }
            `}
          >
            Kontakta oss
          </Link>
        </div>

        {/* Mobilknapp */}
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className={`
            grid size-11 shrink-0 place-items-center rounded-full
            transition-colors lg:hidden
            ${
              lightBackground
                ? "text-[#171C25] hover:bg-black/5"
                : "text-white hover:bg-white/10"
            }
          `}
          aria-label={mobileOpen ? "Stäng meny" : "Öppna meny"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobilmeny */}
      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobilnavigation"
          className="max-h-[calc(100dvh-88px)] overflow-y-auto border-t border-[#E3E9EF] bg-white px-5 pb-7 pt-2 md:px-8 lg:hidden"
        >
          {navigation.map(({ label, href }) => (
            <Link
              key={href}
              to={href}
              onClick={() => setMobileOpen(false)}
              className="block border-b border-[#E3E9EF] py-4 text-lg font-medium text-[#171C25] transition-colors hover:text-[#0B72FE]"
            >
              {label}
            </Link>
          ))}

          {/*<Link
            to="/webbshop"
            onClick={() => setMobileOpen(false)}
            className="inline-flex items-center gap-1.5 py-5 text-sm font-medium text-[#625F6B]"
          >
            Webbshop
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link> */}

          <Link
            to="/#kontakt"
            onClick={() => setMobileOpen(false)}
            className="flex min-h-[48px] items-center gap-1.5 py-5 justify-center rounded-full bg-[#171C25] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#2D3444]"
          >
            Kontakta oss
          </Link>
        </nav>
      )}
    </header>
  );
}