"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/" as const,        label: t("home") },
    { href: "/about" as const,   label: t("about") },
    { href: "/catalog" as const, label: t("catalog") },
    { href: "/compare" as const, label: t("compare") },
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
          ? "bg-[#252728] shadow-[0_2px_24px_rgba(0,0,0,0.5)]"
          : "bg-gradient-to-b from-black/50 to-transparent"
      }`}
      style={{ height: "80px" }}
    >
      <div className="section-container h-full flex items-center justify-between gap-8">

        {/* ── BYD Tbilisi | GT Group ── */}
        <Link href="/" className="flex-shrink-0 h-[16px] flex items-center gap-2.5 group">
          <Image
            src="/byd-wordmark.svg"
            alt="BYD"
            width={104}
            height={22}
            priority
            className="block h-[13px] w-auto flex-shrink-0 group-hover:opacity-80 transition-opacity duration-200"
          />
          {/* Dealer identity */}
          <div className="hidden sm:flex h-full items-center gap-1.5 text-white/50 leading-none group-hover:text-white/65 transition-colors duration-200">
            <span className="text-[12px] font-medium tracking-[0.06em] leading-none">
              {locale === "ka" ? "თბილისი" : "Tbilisi"}
            </span>
            <span className="self-center text-white/25 text-xs leading-none">|</span>
            <span className="text-[12px] font-medium tracking-[0.06em] leading-none">
              GT Group
            </span>
          </div>
        </Link>

        {/* ── Desktop nav links — center ── */}
        <div className="hidden md:flex items-center gap-7 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link text-sm${pathname === link.href ? " active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Language toggle */}
          <button
            onClick={switchLocale}
            aria-label="Switch language"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] uppercase text-white/45 hover:text-white transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>{locale === "en" ? "KA" : "EN"}</span>
          </button>

          <span className="hidden sm:block h-4 w-px bg-white/15" />

          {/* Book Test Drive CTA */}
          <Link
            href="/booking"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-byd-red text-white text-xs font-bold tracking-[0.1em] uppercase hover:bg-red-700 transition-all duration-200"
          >
            {tCommon("bookTestDrive")}
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-[5px] p-1.5"
            aria-label={isOpen ? tCommon("close") : tCommon("menu")}
          >
            <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
            <span className={`block w-5 h-[1.5px] bg-white transition-all duration-200 ${isOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ${
          isOpen ? "max-h-[440px]" : "max-h-0"
        }`}
      >
        <div className="bg-[#252728] border-t border-white/[0.07]">
          <div className="section-container py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between py-3.5 text-sm border-b border-white/[0.05] last:border-0 transition-colors duration-200 ${
                  pathname === link.href
                    ? "text-white font-semibold"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <span>{link.label}</span>
                {pathname === link.href && (
                  <span className="w-1.5 h-1.5 bg-byd-red flex-shrink-0" />
                )}
              </Link>
            ))}
            <div className="py-4 flex items-center justify-between">
              <button
                onClick={() => { switchLocale(); setIsOpen(false); }}
                className="text-xs font-semibold tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                {locale === "en" ? "Switch to Georgian" : "Switch to English"}
              </button>
              <Link
                href="/booking"
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold tracking-[0.1em] uppercase text-byd-red"
              >
                {tCommon("bookTestDrive")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
