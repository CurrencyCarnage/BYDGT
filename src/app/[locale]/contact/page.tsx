import { useLocale } from "next-intl";
import dynamic from "next/dynamic";
import ContactForm from "@/components/ui/ContactForm";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { SHOWROOM } from "@/lib/test-drive";

const ShowroomMap = dynamic(() => import("@/components/ui/ShowroomMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#1C1E1F] animate-pulse" />,
});

export default function ContactPage() {
  const locale = useLocale();

  const contactDetails = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: locale === "ka" ? "მისამართი" : "Address",
      value: SHOWROOM.address,
      href: `https://www.google.com/maps/dir/?api=1&destination=${SHOWROOM.lat},${SHOWROOM.lng}`,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: locale === "ka" ? "ტელეფონი" : "Phone",
      value: "+995 XXX XXX XXX",
      href: "tel:+995XXXXXXXXX",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: "Email",
      value: "info@gtgroup.ge",
      href: "mailto:info@gtgroup.ge",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      label: "WhatsApp",
      value: locale === "ka" ? "პირდაპირ დაგვიკავშირდით" : "Chat with us directly",
      href: "https://wa.me/995XXXXXXXXX",
    },
  ];

  return (
    <div className="bg-byd-dark">

      {/* ── Header — dark strip ── */}
      <div className="bg-[#1C1E1F] border-b border-white/[0.06]" style={{ paddingTop: "80px" }}>
        <div className="section-container py-14 md:py-20">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-[2px] bg-byd-red flex-shrink-0" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-byd-red">
                {locale === "ka" ? "კონტაქტი" : "Contact"}
              </p>
            </div>
            <h1 className="text-h2 font-semibold text-white mb-4 leading-[1.15]" style={{ letterSpacing: "-0.02em" }}>
              {locale === "ka" ? "დაგვიკავშირდით" : "Get in Touch"}
            </h1>
            <p className="text-body1 text-white/45 font-light max-w-lg">
              {locale === "ka"
                ? "მზად ვართ ყველა კითხვაზე გიპასუხოთ — ავტომობილებიდან ფინანსებამდე"
                : "Ready to answer all your questions — from vehicle specs to financing options"}
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* ── Form + Contact details ── */}
      <section className="section-container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Contact details */}
          <div className="lg:col-span-2 space-y-3">
            {contactDetails.map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 0.08}>
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 bg-[#1C1E1F] border border-white/[0.08] hover:border-white/20 transition-all duration-200 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/45 group-hover:text-byd-red group-hover:border-byd-red/30 transition-colors duration-200">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[11px] text-white/30 uppercase tracking-[0.18em] mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-sm text-white group-hover:text-byd-red transition-colors duration-200">
                      {item.value}
                    </p>
                  </div>
                </a>
              </ScrollReveal>
            ))}

            {/* Map */}
            <ScrollReveal delay={0.35}>
              <div className="border border-white/[0.08] overflow-hidden h-52">
                <ShowroomMap
                  lat={SHOWROOM.lat}
                  lng={SHOWROOM.lng}
                  label={SHOWROOM.name}
                  address={SHOWROOM.address}
                />
              </div>
            </ScrollReveal>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <ScrollReveal delay={0.15}>
              <ContactForm />
            </ScrollReveal>
          </div>
        </div>
      </section>

    </div>
  );
}
