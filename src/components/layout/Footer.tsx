import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/" as const,        label: tNav("home") },
    { href: "/about" as const,   label: tNav("about") },
    { href: "/catalog" as const, label: tNav("catalog") },
    { href: "/compare" as const, label: tNav("compare") },
    { href: "/booking" as const, label: tNav("booking") },
    { href: "/contact" as const, label: tNav("contact") },
  ];

  return (
    <footer className="bg-[#1C1E1F] border-t border-white/[0.06]">

      {/* ── Main footer content — 3-column, 141px min-height per spec ── */}
      <div className="section-container py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">

          {/* Brand column */}
          <div>
            {/* BYD wordmark */}
            <Link href="/" className="inline-block mb-3 group">
              <Image
                src="/byd-wordmark.svg"
                alt="BYD"
                width={104}
                height={22}
                className="h-[22px] w-auto group-hover:opacity-75 transition-opacity duration-200"
              />
            </Link>
            <p className="text-[10px] text-white/30 mb-1 tracking-[0.2em] uppercase font-semibold">
              {locale === "ka" ? "თბილისი" : "Tbilisi"} · GT Group
            </p>
            <p className="text-xs text-white/35 mb-4 tracking-wide font-light">
              {locale === "ka" ? "BYD-ის ოფიციალური დილერი" : "Authorised BYD Dealer"}
            </p>
            <p className="text-sm text-white/45 leading-relaxed font-light max-w-xs">
              {t("description")}
            </p>

            {/* Social links — per BYD spec icons section */}
            <div className="flex items-center gap-4 mt-6">
              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="text-white/30 hover:text-white transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* Facebook (Meta) */}
              <a
                href="#"
                aria-label="Facebook"
                className="text-white/30 hover:text-white transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Twitter/X */}
              <a
                href="#"
                aria-label="Twitter"
                className="text-white/30 hover:text-white transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links column */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-[0.18em] mb-5">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 hover:text-white transition-colors duration-200 font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-[0.18em] mb-5">
              {t("contactInfo")}
            </h3>
            <ul className="space-y-3 text-sm text-white/40 font-light">
              <li className="leading-relaxed">{t("address")}</li>
              <li>
                <a
                  href={`tel:${t("phone").replace(/\s/g, "")}`}
                  className="hover:text-white transition-colors duration-200"
                >
                  {t("phone")}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${t("email")}`}
                  className="hover:text-white transition-colors duration-200"
                >
                  {t("email")}
                </a>
              </li>
            </ul>

            {/* Book test drive CTA */}
            <div className="mt-6">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.1em] uppercase text-byd-red hover:text-red-400 transition-colors duration-200"
              >
                {locale === "ka" ? "ტესტ დრაივი" : "Book Test Drive"}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar — copyright per BYD spec ───────────────────── */}
      <div className="border-t border-white/[0.05]">
        <div className="section-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* BYD copyright text — matches spec: "©byd auto co.,ltd YYYY" */}
          <p className="text-xs text-white/25 font-light" style={{ lineHeight: "15px" }}>
            &copy;GT Group {currentYear} — Official BYD Dealer in Georgia. {t("rights")}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="text-xs text-white/25 hover:text-white/50 transition-colors duration-200 font-light">
              {locale === "ka" ? "კონფიდენციალურობა" : "Privacy & Legal"}
            </Link>
            <Link href="/contact" className="text-xs text-white/25 hover:text-white/50 transition-colors duration-200 font-light">
              {locale === "ka" ? "კონტაქტი" : "Contact"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
