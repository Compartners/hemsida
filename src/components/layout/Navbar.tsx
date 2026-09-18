import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

import logoLight from "@/assets/compartners-logo-white.png";
import logoDark from "@/assets/compartners-logo-dark.png";
import AnimatedLogo from "../AnimatedLogo";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 900);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  return (
    <header
      className={`
        fixed left-0 top-0 z-50 w-full
        transition-all duration-300
        ${
          scrolled
            ? "border-b border-[#E3E9EF]/80 bg-white/90 shadow-[0_8px_30px_rgba(19,31,49,0.05)] backdrop-blur-xl"
            : "bg-transparent"
        }
      `}
    >
      <div className="mx-auto flex h-[88px] w-full max-w-[1240px] items-center justify-between px-5 md:px-8">

        {/* Logo */}
        <Link
  to="/"
  className="relative flex h-[88px] w-[190px] shrink-0 items-center"
>
  <AnimatedLogo
  className="w-[190px] h-auto"
  variant={scrolled ? "dark" : "light"}
/>
</Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            to="/tjanster"
            className={`
              text-sm font-medium transition
              ${
                scrolled
                  ? "text-[#667181] hover:text-[#171C25]"
                  : "text-white/70 hover:text-white"
              }
            `}
          >
            Tjänster
          </Link>

          <Link
            to="/#varfor"
            className={`
              text-sm font-medium transition
              ${
                scrolled
                  ? "text-[#667181] hover:text-[#171C25]"
                  : "text-white/70 hover:text-white"
              }
            `}
          >
            Varför Compartners
          </Link>

          <Link
            to="/#kundcase"
            className={`
              text-sm font-medium transition
              ${
                scrolled
                  ? "text-[#667181] hover:text-[#171C25]"
                  : "text-white/70 hover:text-white"
              }
            `}
          >
            Kundcase
          </Link>

          <Link
            to="/om-oss"
            className={`
              text-sm font-medium transition
              ${
                scrolled
                  ? "text-[#667181] hover:text-[#171C25]"
                  : "text-white/70 hover:text-white"
              }
            `}
          >
            Om oss
          </Link>

          <Link
            to="/webbshop"
            className={`
              text-sm font-medium transition
              ${
                scrolled
                  ? "text-[#667181] hover:text-[#171C25]"
                  : "text-white/70 hover:text-white"
              }
            `}
          >
            Webbshop
          </Link>
        </nav>

        {/* CTA */}
        <div className="hidden lg:block">
          <Link
            to="/#kontakt"
            className={`
              inline-flex min-h-[44px] items-center justify-center
              rounded-full px-5
              text-sm font-semibold
              transition-all duration-300
              ${
                scrolled
                  ? "bg-[#171C25] text-white hover:bg-[#2D3444]"
                  : "border border-white/20 bg-white/[0.08] text-white backdrop-blur-xl hover:bg-white/[0.14]"
              }
            `}
          >
            Kontakta oss
          </Link>
        </div>

        {/* Mobile button */}
        <button
          type="button"
          onClick={() =>
            setMobileOpen((prev) => !prev)
          }
          className={`
            grid h-10 w-10 place-items-center
            rounded-full
            lg:hidden
            ${
              scrolled
                ? "text-[#171C25]"
                : "text-white"
            }
          `}
          aria-label="Öppna meny"
        >
          {mobileOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#111724] px-5 pb-8 pt-5 text-white lg:hidden">
          <nav className="flex flex-col">
            {[
              ["Tjänster", "/tjanster"],
              ["Varför Compartners", "/#varfor"],
              ["Kundcase", "/#kundcase"],
              ["Om oss", "/om-oss"],
              ["Webbshop", "/webbshop"],
            ].map(([label, href]) => (
              <Link
                key={href}
                to={href}
                onClick={() =>
                  setMobileOpen(false)
                }
                className="border-b border-white/10 py-4 text-lg font-medium text-white/80"
              >
                {label}
              </Link>
            ))}

            <Link
              to="/#kontakt"
              onClick={() =>
                setMobileOpen(false)
              }
              className="mt-6 flex min-h-[50px] items-center justify-center rounded-full bg-gradient-to-r from-[#0B72FE] via-[#12B4F0] to-[#2CCEC2] text-sm font-semibold text-white"
            >
              Boka rådgivning
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}