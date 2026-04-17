import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-secondary border-t border-[rgba(255,255,255,0.06)]">
      <div className="section-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center group mb-4">
              <span className="text-2xl font-bold tracking-widest text-white group-hover:text-white/90 transition-colors duration-300" style={{ fontFamily: "'Source Sans Pro', sans-serif", letterSpacing: "0.12em" }}>
                BYD
              </span>
              <span className="mx-2 h-5 w-px bg-white/30 self-center hidden sm:block" />
              <span className="text-2xl font-light tracking-wider text-white/85 group-hover:text-[#68D89B] transition-all duration-300" style={{ fontFamily: "'Source Sans Pro', sans-serif", letterSpacing: "0.08em" }}>
                GT
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed">
              {t("description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/" as const, label: tNav("home") },
                { href: "/catalog" as const, label: tNav("catalog") },
                { href: "/compare" as const, label: tNav("compare") },
                { href: "/booking" as const, label: tNav("booking") },
                { href: "/contact" as const, label: tNav("contact") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary text-sm hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
              {t("contactInfo")}
            </h3>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li>{t("address")}</li>
              <li>
                <a
                  href={`tel:${t("phone").replace(/\s/g, "")}`}
                  className="hover:text-accent transition-colors duration-200"
                >
                  {t("phone")}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${t("email")}`}
                  className="hover:text-accent transition-colors duration-200"
                >
                  {t("email")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[rgba(255,255,255,0.06)] text-center">
          <p className="text-text-muted text-xs">
            &copy; {currentYear} BYD GT. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
