import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Mail,
  Phone,
} from "lucide-react";

import logoDark from "@/assets/compartners-logo-dark.png";
import AnimatedLogo from "../AnimatedLogo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#E3E9EF] bg-white text-[#171C25]">
      <div className="mx-auto w-full max-w-[1240px] px-5 md:px-8">
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.9fr_0.85fr] lg:gap-16 lg:py-20">

          {/* Brand */}
          <div className="max-w-[320px]">
            <Link
              to="/"
              className="inline-flex items-center"
              aria-label="Compartners startsida"
            >
              <AnimatedLogo className="w-[190px] h-auto" />
            </Link>

            <p className="mt-7 text-[17px] leading-7 text-[#667181]">
              Nordisk klarhet.
              <br />
              Mänsklig trygghet.
              <br />
              Smart teknologi.
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="mb-5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#7D8794]">
              Utforska
            </p>

            <nav className="flex flex-col items-start gap-3 text-sm text-[#667181]">
              <Link
                to="/tjanster"
                className="transition hover:translate-x-1 hover:text-[#171C25]"
              >
                Tjänster
              </Link>

              <Link
                to="/#varfor"
                className="transition hover:translate-x-1 hover:text-[#171C25]"
              >
                Varför Compartners
              </Link>

              <Link
                to="/#kundcase"
                className="transition hover:translate-x-1 hover:text-[#171C25]"
              >
                Kundcase
              </Link>

              <Link
                to="/jobba-hos-oss"
                className="transition hover:translate-x-1 hover:text-[#171C25]"
              >
                Jobba hos oss
              </Link>

              <Link
                to="/webbshop"
                className="transition hover:translate-x-1 hover:text-[#171C25]"
              >
                Webbshop
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#7D8794]">
              Kontakt
            </p>

            <div className="flex flex-col gap-4 text-sm">
              <a
                href="tel:0102102700"
                className="flex items-center gap-2.5 text-[#667181] transition hover:text-[#171C25]"
              >
                <Phone
                  size={16}
                  strokeWidth={1.7}
                  className="text-[#0B72FE]"
                />

                010-210 27 00
              </a>

              <a
                href="mailto:info@compartners.se"
                className="flex items-center gap-2.5 text-[#667181] transition hover:text-[#171C25]"
              >
                <Mail
                  size={16}
                  strokeWidth={1.7}
                  className="text-[#0B72FE]"
                />

                info@compartners.se
              </a>
            </div>
          </div>

          {/* CTA */}
          <div>
            <p className="mb-5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#7D8794]">
              Nästa steg
            </p>

            <p className="mb-5 max-w-[230px] text-sm leading-6 text-[#667181]">
              Behöver ni hjälp att hitta rätt lösning?
            </p>

            <Link
              to="/#kontakt"
              className="group inline-flex items-center gap-2 border-b border-[#171C25] pb-1 text-sm font-semibold"
            >
              Prata med oss

              <ArrowUpRight
                size={17}
                strokeWidth={1.7}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>

        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-3 border-t border-[#E3E9EF] py-6 text-[11px] text-[#7D8794] md:flex-row md:items-center md:justify-between">
          <span>
            © {currentYear} Compartners. Alla rättigheter förbehållna.
          </span>

          <span className="font-mono text-[10px] tracking-[0.06em]">
            Koppla ihop. Förenkla. Förstärk.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;