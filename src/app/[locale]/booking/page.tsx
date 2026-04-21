import { getLocale } from "next-intl/server";
import { getAvailableModels } from "@/lib/models";
import BookingForm from "@/components/ui/BookingForm";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default async function BookingPage() {
  const [locale, models] = await Promise.all([
    getLocale(),
    getAvailableModels(),
  ]);

  return (
    <div className="pt-24 md:pt-32 pb-section-sm md:pb-section-lg">
      <div className="section-container">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <p className="text-xs text-accent uppercase tracking-[0.2em] mb-3" style={{ fontFamily: "var(--font-source-sans)" }}>
              {locale === "ka" ? "უფასო სერვისი" : "Free Service"}
            </p>
            <h1 className="text-3xl md:text-display font-bold text-white mb-4" style={{ fontFamily: "var(--font-source-sans)", letterSpacing: "-0.02em" }}>
              {locale === "ka" ? "ტესტ დრაივის დაჯავშნა" : "Book a Test Drive"}
            </h1>
            <p className="text-white/50 font-light leading-relaxed" style={{ fontFamily: "var(--font-source-sans)" }}>
              {locale === "ka"
                ? "შეავსეთ ფორმა და ჩვენი გუნდი დაგიკავშირდებათ 24 საათის განმავლობაში"
                : "Fill in the form and our team will reach out within 24 hours to confirm your test drive"}
            </p>
          </ScrollReveal>

          {/* Info pills */}
          <ScrollReveal delay={0.1} className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { icon: "✓", text: locale === "ka" ? "სრულიად უფასო" : "Completely free" },
              { icon: "✓", text: locale === "ka" ? "ვალდებულება არ არის" : "No obligation" },
              { icon: "✓", text: locale === "ka" ? "24სთ პასუხი" : "24h response" },
            ].map((pill) => (
              <span key={pill.text} className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-full text-xs text-white/60" style={{ fontFamily: "var(--font-source-sans)" }}>
                <span className="text-gt-green font-bold">{pill.icon}</span>
                {pill.text}
              </span>
            ))}
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <BookingForm models={models} />
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
