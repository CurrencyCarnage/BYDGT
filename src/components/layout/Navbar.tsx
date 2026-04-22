"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/" as const, label: t("home") },
    { href: "/about" as const, label: t("about") },
    { href: "/catalog" as const, label: t("catalog") },
    { href: "/compare" as const, label: t("compare") },
    { href: "/booking" as const, label: t("booking") },
    { href: "/contact" as const, label: t("contact") },
  ];

  const switchLocale = () => {
    const nextLocale = locale === "en" ? "ka" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-bg-primary/95 backdrop-blur-[16px] border-b border-white/[0.07] shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo — BYD brand white + GT dealer identity + city */}
          <Link href="/" className="flex items-center group">
            {/* BYD */}
            <span
              className="text-xl md:text-2xl font-bold tracking-widest text-white group-hover:text-white/90 transition-colors duration-300"
              style={{ fontFamily: "'Source Sans Pro', sans-serif", letterSpacing: "0.12em" }}
            >
              BYD
            </span>
            {/* City — same size, accent color */}
            <span
              className="ml-2 text-xl md:text-2xl font-bold text-[#68D89B]/70 group-hover:text-[#68D89B] transition-colors duration-300"
              style={{ fontFamily: "'Source Sans Pro', sans-serif", letterSpacing: "0.08em" }}
            >
              {locale === "ka" ? "თბილისი" : "Tbilisi"}
            </span>
            {/* Divider */}
            <span className="mx-2.5 h-5 w-px bg-white/25 self-center" />
            {/* GT — dealer brand */}
            <span
              className="text-xl md:text-2xl font-light tracking-wider text-white/70 group-hover:text-white/90 transition-all duration-300"
              style={{ fontFamily: "'Source Sans Pro', sans-serif", letterSpacing: "0.08em" }}
            >
              GT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-light tracking-wide transition-all duration-200 relative group/link ${
                  pathname === link.href
                    ? "text-white"
                    : "text-white/55 hover:text-white/90"
                }`}
                style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
              >
                {link.label}
                {/* Active underline */}
                <span className={`absolute -bottom-1 left-0 h-px bg-white transition-all duration-300 ${
                  pathname === link.href ? "w-full" : "w-0 group-hover/link:w-full"
                }`} />
              </Link>
            ))}
          </div>

          {/* Right: Language + Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={switchLocale}
              className="px-3 py-1.5 text-xs font-semibold tracking-widest rounded border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all duration-200"
              style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
            >
              {locale === "en" ? "KA" : "EN"}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex flex-col gap-[5px] p-2"
              aria-label={isOpen ? tCommon("close") : tCommon("menu")}
            >
              <span className={`block w-5 h-px bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
              <span className={`block w-5 h-px bg-white transition-all duration-200 ${isOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-px bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-400 ${isOpen ? "max-h-80" : "max-h-0"}`}>
        <div className="bg-bg-primary/98 backdrop-blur-[16px] section-container py-4 space-y-1 border-t border-white/[0.06]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block py-3 px-4 text-base transition-colors duration-200 ${
                pathname === link.href
                  ? "text-white border-l-2 border-white pl-3"
                  : "text-white/50 hover:text-white/90 hover:pl-5"
              }`}
              style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
