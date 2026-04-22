import { getLocale } from "next-intl/server";
import ScrollReveal from "@/components/ui/ScrollReveal";

const content = {
  en: {
    heroTitle: "About BYD",
    heroSubtitle:
      "Driving the future with electric innovation, advanced battery technology, and a global vision for cleaner mobility.",
    introTitle: "Founded in 1994",
    introText:
      "BYD is a technology company focused on creating better ways to live through innovation. Over more than three decades, the company has grown into a major force across electronics, automotive, renewable energy, and rail transit. With deep expertise in energy acquisition, storage, and application, BYD delivers integrated zero-emission new energy solutions for a rapidly changing world. In 2024, the company's annual revenue exceeded RMB 700 billion.",
    globalLabel: "Global Presence",
    globalText:
      "BYD's new energy vehicles are now present in more than 100 countries and regions worldwide, reflecting the brand's rapid international expansion and growing influence in global mobility.",
    innovationLabel: "Innovation",
    innovationTitle: "Technology Built for the Next Generation",
    innovationText:
      "BYD has developed a strong portfolio of in-house technologies that support the transition from conventional combustion vehicles to electrified mobility. These include the Blade Battery, dual-mode hybrid systems, the e-Platform 3.0 architecture, intelligent cockpit systems, advanced body control technologies, and integrated battery-body structures designed to improve safety, efficiency, intelligence, and driving experience.",
    features: [
      {
        title: "Blade Battery",
        desc: "Designed with safety, durability, range, and charging capability in mind, BYD's Blade Battery has safely passed the nail penetration test, offers high structural strength, supports long driving range, and can charge from 10% to 80% in about 33 minutes under supported conditions.",
      },
      {
        title: "DM-i & DM-p Hybrid Technologies",
        desc: "BYD's dual-mode hybrid technologies deliver a balance of performance and efficiency. DM-i emphasizes low fuel consumption, smoothness, and quiet operation, while DM-p focuses on stronger performance and faster acceleration.",
      },
      {
        title: "e-Platform 3.0",
        desc: "This next-generation electric vehicle platform is designed around safety, efficiency, intelligence, and vehicle design freedom — featuring an 8-in-1 electric powertrain, improved structural rigidity, and aerodynamic packaging benefits.",
      },
      {
        title: "Intelligent Cockpit & Smart Systems",
        desc: "BYD integrates major smartphone-style functions into the in-car platform and continues to build intelligent vehicle ecosystems through BYD OS and advanced perception and control technologies.",
      },
    ],
    safetyLabel: "Safety & Quality",
    safetyTitle: "Committed to Safety and Quality",
    safetyText:
      "BYD highlights extensive testing and international safety recognition across multiple models, with 5-star safety achievements across C-NCAP, Euro NCAP, ANCAP, and Green NCAP programs for selected vehicles including Seal, ATTO 3, and Dolphin.",
    marketLabel: "Market Performance",
    marketTitle: "A Global Leader in New Energy Vehicles",
    marketText:
      "As of the end of April 2025, BYD's cumulative NEV sales had exceeded 11.9 million units. BYD also became the world's first automaker to produce 10 million new energy vehicles on November 18, 2024.",
    sustainLabel: "Sustainability",
    sustainTitle: "Lower Emissions, Greater Impact",
    sustainText:
      "BYD links its growth to a broader sustainability mission. By March 10, 2025, it had helped counterbalance more than 86.8 billion kilograms of CO₂, equivalent to the CO₂ absorption of over 1.4 billion trees.",
    closing:
      "At BYD, innovation is not only about building vehicles. It is about rethinking energy, improving mobility, and shaping a cleaner future through technology.",
  },
  ka: {
    heroTitle: "BYD-ის შესახებ",
    heroSubtitle:
      "მომავლის მობილობა ელექტრო ინოვაციებით, მოწინავე ბატარეის ტექნოლოგიით და უფრო სუფთა სამყაროს ხედვით.",
    introTitle: "დაარსდა 1994 წელს",
    introText:
      "BYD წარმოადგენს ტექნოლოგიურ კომპანიას, რომელიც უკეთესი ცხოვრების შექმნას ინოვაციების საშუალებით ისახავს მიზნად. სამი ათწლეულის განმავლობაში კომპანია მნიშვნელოვნად განვითარდა ელექტრონიკის, ავტომობილების, განახლებადი ენერგიისა და სარკინიგზო ტრანსპორტის სფეროებში. კომპანიის ოფიციალური ინფორმაციით, 2024 წლის წლიურმა შემოსავალმა 700 მილიარდ იუანს გადააჭარბა.",
    globalLabel: "გლობალური გავლენა",
    globalText:
      "2025 წლის აპრილის მდგომარეობით, BYD-ის ახალი ენერგიის ავტომობილები წარმოდგენილია მსოფლიოს 100-ზე მეტ ქვეყანაში და რეგიონში, რაც კომპანიის სწრაფ საერთაშორისო გაფართოებასა და გლობალურ გავლენას უსვამს ხაზს.",
    innovationLabel: "ინოვაცია",
    innovationTitle: "ტექნოლოგია ახალი თაობისთვის",
    innovationText:
      "BYD ავითარებს საკუთარ ტექნოლოგიებს, რომლებიც ხელს უწყობს შიდაწვის ძრავიანი ავტომობილებიდან ელექტრიფიცირებულ მობილობაზე გადასვლას. ამ მიმართულებაში შედის Blade Battery, ორმაგი რეჟიმის ჰიბრიდული სისტემები, e-Platform 3.0, ინტელექტუალური კოქპიტი და ბატარეისა და ძარის ინტეგრირებული სტრუქტურები.",
    features: [
      {
        title: "Blade Battery",
        desc: "BYD-ის Blade Battery შექმნილია უსაფრთხოების, გამძლეობის, სავალი მარაგისა და სწრაფი დამუხტვის გათვალისწინებით. ბატარეამ წარმატებით გაიარა nail penetration test და შესაბამის პირობებში 10%-დან 80%-მდე დამუხტვას დაახლოებით 33 წუთში უზრუნველყოფს.",
      },
      {
        title: "DM-i და DM-p ჰიბრიდული ტექნოლოგიები",
        desc: "BYD-ის ორმაგი რეჟიმის ჰიბრიდული ტექნოლოგიები აერთიანებს ეფექტიანობასა და დინამიკას. DM-i ორიენტირებულია დაბალ საწვავის ხარჯზე, ხოლო DM-p გათვლილია უფრო ძლიერ წარმადობასა და სწრაფ აჩქარებაზე.",
      },
      {
        title: "e-Platform 3.0",
        desc: "ეს პლატფორმა შექმნილია უსაფრთხოების, ეფექტიანობის, ინტელექტუალური შესაძლებლობებისა და დიზაინის თავისუფლების გასაძლიერებლად, 8-in-1 ელექტრო ძალოვანი სისტემითა და გაუმჯობესებული სიმყარით.",
      },
      {
        title: "ინტელექტუალური კოქპიტი",
        desc: "BYD ავტომობილში აერთიანებს სმარტფონისთვის დამახასიათებელ მთავარ ფუნქციებს BYD OS-ისა და გარემოს აღქმისა და კონტროლის მოწინავე სისტემების მეშვეობით.",
      },
    ],
    safetyLabel: "უსაფრთხოება და ხარისხი",
    safetyTitle: "უსაფრთხოება და ხარისხი",
    safetyText:
      "BYD-ის მოდელებს მიღებული აქვთ მაღალი უსაფრთხოების შეფასებები საერთაშორისო პროგრამებში, მათ შორის C-NCAP, Euro NCAP, ANCAP და Green NCAP-ში. ჩამოთვლილ მოდელებს შორისაა BYD Seal, ATTO 3 და Dolphin.",
    marketLabel: "ბაზარზე წარმატება",
    marketTitle: "ახალი ენერგიის ავტომობილების გლობალური ლიდერი",
    marketText:
      "BYD-ის ოფიციალური მონაცემებით, 2025 წლის აპრილის ბოლოს კომპანიის ახალი ენერგიის ავტომობილების ჯამურმა გაყიდვებმა 11.9 მილიონ ერთეულს გადააჭარბა. კომპანია ასევე 2024 წლის 18 ნოემბერს გახდა მსოფლიოში პირველი ავტომწარმოებელი, რომელმაც 10 მილიონი NEV გამოუშვა.",
    sustainLabel: "მდგრადი განვითარება",
    sustainTitle: "ნაკლები ემისია, მეტი გავლენა",
    sustainText:
      "BYD-ის განცხადებით, 2025 წლის 10 მარტის მდგომარეობით, მან 86.8 მილიარდ კილოგრამზე მეტი CO₂-ის დაბალანსებას შეუწყო ხელი, რაც 1.4 მილიარდზე მეტი ხის მიერ შთანთქმულ CO₂-ს უტოლდება.",
    closing:
      "BYD-ისთვის ინოვაცია მხოლოდ ავტომობილის შექმნას არ ნიშნავს. ეს არის ენერგიის, მობილობისა და უფრო სუფთა მომავლის თავიდან გააზრება ტექნოლოგიის დახმარებით.",
  },
};

export default async function AboutPage() {
  const locale = await getLocale();
  const c = locale === "ka" ? content.ka : content.en;

  return (
    <div className="overflow-hidden">
      {/* ── HERO ── */}
      <section
        className="relative min-h-[75vh] flex items-end pb-20 pt-40"
        style={{
          backgroundImage: "url('/images/aboutus/byd_about_bg_hq_hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Dark overlay that intensifies at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-[#1A1E28]" />
        <div className="relative section-container">
          <ScrollReveal>
            <p
              className="text-xs text-accent uppercase tracking-[0.25em] mb-4"
              style={{ fontFamily: "var(--font-source-sans)" }}
            >
              BYD Georgia — GT Group
            </p>
            <h1
              className="text-4xl md:text-[4rem] font-bold text-text-primary mb-6 max-w-3xl leading-tight"
              style={{ fontFamily: "var(--font-source-sans)", letterSpacing: "-0.02em" }}
            >
              {c.heroTitle}
            </h1>
            <p
              className="text-text-secondary text-lg md:text-xl max-w-2xl font-light leading-relaxed"
              style={{ fontFamily: "var(--font-source-sans)" }}
            >
              {c.heroSubtitle}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="py-section-sm md:py-section-lg bg-bg-primary">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p
                className="text-xs text-accent uppercase tracking-[0.2em] mb-3"
                style={{ fontFamily: "var(--font-source-sans)" }}
              >
                {c.introTitle}
              </p>
              <p
                className="text-text-secondary text-lg leading-relaxed font-light"
                style={{ fontFamily: "var(--font-source-sans)" }}
              >
                {c.introText}
              </p>
            </ScrollReveal>

            {/* Global presence pill */}
            <ScrollReveal delay={0.15} className="mt-10">
              <div className="flex items-start gap-4 p-6 rounded-card bg-white/[0.04] border border-white/[0.08]">
                <span className="text-2xl mt-0.5">🌍</span>
                <div>
                  <p
                    className="text-xs text-accent uppercase tracking-widest mb-2"
                    style={{ fontFamily: "var(--font-source-sans)" }}
                  >
                    {c.globalLabel}
                  </p>
                  <p
                    className="text-text-secondary leading-relaxed font-light"
                    style={{ fontFamily: "var(--font-source-sans)" }}
                  >
                    {c.globalText}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── INNOVATION ── */}
      <section
        className="relative py-section-sm md:py-section-lg"
        style={{
          backgroundImage: "url('/images/aboutus/byd_about_bg_tech_dark.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1E28]/95 via-[#1A1E28]/80 to-[#1A1E28]/60" />
        <div className="relative section-container">
          <div className="max-w-4xl">
            <ScrollReveal>
              <p
                className="text-xs text-accent uppercase tracking-[0.2em] mb-3"
                style={{ fontFamily: "var(--font-source-sans)" }}
              >
                {c.innovationLabel}
              </p>
              <h2
                className="text-3xl md:text-display font-bold text-text-primary mb-6"
                style={{ fontFamily: "var(--font-source-sans)", letterSpacing: "-0.02em" }}
              >
                {c.innovationTitle}
              </h2>
              <p
                className="text-text-secondary text-lg leading-relaxed font-light mb-14"
                style={{ fontFamily: "var(--font-source-sans)" }}
              >
                {c.innovationText}
              </p>
            </ScrollReveal>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {c.features.map((feat, i) => (
                <ScrollReveal key={feat.title} delay={i * 0.1}>
                  <div className="p-6 rounded-card bg-[rgba(200,208,220,0.06)] border border-[rgba(200,208,220,0.13)] hover:border-[rgba(200,208,220,0.28)] transition-all duration-300 h-full">
                    <h3
                      className="text-sm font-semibold text-text-primary mb-3"
                      style={{ fontFamily: "var(--font-source-sans)" }}
                    >
                      {feat.title}
                    </h3>
                    <p
                      className="text-xs text-text-secondary font-light leading-relaxed"
                      style={{ fontFamily: "var(--font-source-sans)" }}
                    >
                      {feat.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SAFETY ── */}
      <section
        className="relative py-section-sm md:py-section-lg"
        style={{
          backgroundImage: "url('/images/aboutus/byd_about_bg_auto_dark.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-[#1A1E28]/95 via-[#1A1E28]/80 to-[#1A1E28]/60" />
        <div className="relative section-container flex justify-end">
          <div className="max-w-xl">
            <ScrollReveal direction="right">
              <p
                className="text-xs text-accent uppercase tracking-[0.2em] mb-3"
                style={{ fontFamily: "var(--font-source-sans)" }}
              >
                {c.safetyLabel}
              </p>
              <h2
                className="text-3xl md:text-heading font-bold text-text-primary mb-5"
                style={{ fontFamily: "var(--font-source-sans)", letterSpacing: "-0.02em" }}
              >
                {c.safetyTitle}
              </h2>
              <p
                className="text-text-secondary leading-relaxed font-light"
                style={{ fontFamily: "var(--font-source-sans)" }}
              >
                {c.safetyText}
              </p>

              {/* Safety badges */}
              <div className="flex flex-wrap gap-2 mt-8">
                {["C-NCAP ★★★★★", "Euro NCAP ★★★★★", "ANCAP ★★★★★", "Green NCAP ★★★★★"].map((badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1.5 text-xs font-medium rounded-full bg-[rgba(200,208,220,0.08)] border border-[rgba(200,208,220,0.15)] text-text-secondary"
                    style={{ fontFamily: "var(--font-source-sans)" }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── MARKET + SUSTAINABILITY ── */}
      <section className="py-section-sm md:py-section-lg bg-bg-primary">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Market performance */}
            <ScrollReveal direction="left">
              <div
                className="relative rounded-card overflow-hidden h-full min-h-[320px] flex flex-col justify-end p-8"
                style={{
                  backgroundImage: "url('/images/aboutus/byd_about_bg_global_dark.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1E28] via-[#1A1E28]/70 to-transparent" />
                <div className="relative">
                  <p
                    className="text-xs text-accent uppercase tracking-[0.2em] mb-2"
                    style={{ fontFamily: "var(--font-source-sans)" }}
                  >
                    {c.marketLabel}
                  </p>
                  <h2
                    className="text-xl md:text-2xl font-bold text-text-primary mb-3"
                    style={{ fontFamily: "var(--font-source-sans)", letterSpacing: "-0.01em" }}
                  >
                    {c.marketTitle}
                  </h2>
                  <p
                    className="text-text-secondary text-sm font-light leading-relaxed"
                    style={{ fontFamily: "var(--font-source-sans)" }}
                  >
                    {c.marketText}
                  </p>
                  {/* Stats */}
                  <div className="flex gap-6 mt-6">
                    <div>
                      <p className="text-2xl font-bold text-text-primary" style={{ fontFamily: "var(--font-source-sans)" }}>11.9M+</p>
                      <p className="text-xs text-text-muted uppercase tracking-wider mt-0.5" style={{ fontFamily: "var(--font-source-sans)" }}>{locale === "ka" ? "გაყიდული NEV" : "NEV Sold"}</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-text-primary" style={{ fontFamily: "var(--font-source-sans)" }}>100+</p>
                      <p className="text-xs text-text-muted uppercase tracking-wider mt-0.5" style={{ fontFamily: "var(--font-source-sans)" }}>{locale === "ka" ? "ქვეყანა" : "Countries"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Sustainability */}
            <ScrollReveal direction="right">
              <div className="rounded-card p-8 h-full min-h-[320px] flex flex-col justify-between bg-[rgba(200,208,220,0.04)] border border-[rgba(200,208,220,0.1)]">
                <div>
                  <p
                    className="text-xs text-accent uppercase tracking-[0.2em] mb-2"
                    style={{ fontFamily: "var(--font-source-sans)" }}
                  >
                    {c.sustainLabel}
                  </p>
                  <h2
                    className="text-xl md:text-2xl font-bold text-text-primary mb-4"
                    style={{ fontFamily: "var(--font-source-sans)", letterSpacing: "-0.01em" }}
                  >
                    {c.sustainTitle}
                  </h2>
                  <p
                    className="text-text-secondary text-sm font-light leading-relaxed"
                    style={{ fontFamily: "var(--font-source-sans)" }}
                  >
                    {c.sustainText}
                  </p>
                </div>
                {/* CO2 stat */}
                <div className="mt-8 pt-6 border-t border-[rgba(200,208,220,0.1)]">
                  <p className="text-3xl font-bold text-text-primary" style={{ fontFamily: "var(--font-source-sans)" }}>
                    86.8B <span className="text-lg font-light text-text-muted">kg CO₂</span>
                  </p>
                  <p className="text-xs text-text-muted uppercase tracking-wider mt-1" style={{ fontFamily: "var(--font-source-sans)" }}>
                    {locale === "ka" ? "დაბალანსებული ემისია" : "CO₂ counterbalanced"}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CLOSING ── */}
      <section className="py-24 text-center bg-bg-secondary">
        <div className="section-container">
          <ScrollReveal>
            <p
              className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto font-light leading-relaxed italic"
              style={{ fontFamily: "var(--font-source-sans)" }}
            >
              &ldquo;{c.closing}&rdquo;
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
