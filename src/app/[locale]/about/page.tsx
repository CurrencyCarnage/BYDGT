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
      "BYD highlights extensive testing and international safety recognition across multiple products, with 5-star safety achievements across C-NCAP, Euro NCAP, ANCAP, and Green NCAP programs for selected vehicles including Seal, ATTO 3, and Dolphin.",
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
      "BYD-ის პროდუქტებს მიღებული აქვთ მაღალი უსაფრთხოების შეფასებები საერთაშორისო პროგრამებში, მათ შორის C-NCAP, Euro NCAP, ANCAP და Green NCAP-ში. ჩამოთვლილ პროდუქტებს შორისაა BYD Seal, ATTO 3 და Dolphin.",
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

const aboutContent = {
  ...content,
  en: {
    heroTitle: "About GT Group",
    heroSubtitle:
      "Building trusted partnerships, delivering international brands, and supporting mobility and industry in Georgia since 1999.",
    introTitle: "Since 1999",
    introText:
      "GT Group is a diversified Georgian private holding with extensive experience in automotive distribution, specialised machinery, technical service, and international brand representation. Since beginning operations in 1999, the company has continuously expanded its capabilities while remaining focused on quality, long-term partnerships, and customer satisfaction. Today, GT Group connects Georgian customers and businesses with established global manufacturers across passenger and commercial vehicles, construction and agricultural machinery, municipal equipment, lubricants, marine transport, and viticulture solutions.",
    globalLabel: "Local Expertise, Global Standards",
    globalText:
      "GT Group's growth has been built on close cooperation with leading international manufacturers and on the ability to deliver more than a product. The company supports customers throughout the ownership lifecycle with professional consultation, technical expertise, maintenance, and after-sales service. This experience provides the foundation for GT Group's partnership with BYD and for the introduction of authorised electric and plug-in hybrid mobility solutions to customers in Georgia.",
    innovationLabel: "Our Strengths",
    innovationTitle: "Experience Built Across Mobility and Industry",
    innovationText:
      "GT Group combines local market knowledge with long-term experience in international distribution, technical service, and complex customer support. Its diversified structure allows the company to serve private customers, businesses, public organisations, and major infrastructure projects across Georgia.",
    features: [
      {
        title: "Operating in Georgia Since 1999",
        desc: "More than two decades of continuous operation have given GT Group deep knowledge of the Georgian market, customer expectations, and the operational standards required to represent major international brands responsibly.",
      },
      {
        title: "Multiple Business Directions",
        desc: "GT Group operates across passenger and commercial vehicles, construction and agricultural machinery, municipal equipment, lubricants, marine transport, viticulture solutions, and related technical services.",
      },
      {
        title: "Sales, Service, and After-Sales Support",
        desc: "GT Group's role extends beyond vehicle and equipment sales. The company provides technical consultation, diagnostics, maintenance, repair, and continuing customer support through specialised teams and service infrastructure.",
      },
      {
        title: "Global Brands, Local Responsibility",
        desc: "By working with recognised manufacturers across several industries, GT Group brings global technologies and operating standards to Georgia while providing customers with accessible local expertise and support.",
      },
    ],
    safetyLabel: "Service & Quality",
    safetyTitle: "Support That Continues After the Purchase",
    safetyText:
      "Reliable ownership depends on professional service, qualified technical support, and access to the correct parts and procedures. GT Group has developed its automotive and machinery operations around long-term customer support, manufacturer requirements, and modern service infrastructure. Through its authorised BYD operations, GT Group aims to provide Georgian customers with official vehicles, warranty support, certified servicing, qualified technical assistance, and original spare parts in accordance with BYD standards.",
    badges: [
      "Authorised Sales",
      "Warranty Support",
      "Certified Service",
      "Original Parts",
    ],
    marketLabel: "BYD in Georgia",
    marketTitle: "A New Chapter in GT Group's Automotive Journey",
    marketText:
      "Beginning in 2026, GT Group became the exclusive authorised BYD dealer in Georgia. The partnership brings together BYD's electric and plug-in hybrid vehicle technology with GT Group's local market experience, established automotive operations, and long-term commitment to customer service. Georgian customers can now discover BYD through an authorised local partner focused on transparent sales, professional consultation, warranty support, qualified service, technical assistance, and original spare parts.",
    stats: [
      { value: "25+", label: "Years of Experience" },
      { value: "1999", label: "Operating Since" },
    ],
    sustainLabel: "Future Mobility",
    sustainTitle: "Bringing Advanced Electrified Vehicles to Georgia",
    sustainText:
      "The partnership with BYD reflects GT Group's continued focus on innovation and on bringing relevant global technologies to the Georgian market. BYD's electric and plug-in hybrid vehicles expand the choices available to local drivers and support the gradual transition toward more efficient, intelligent, and lower-emission mobility. GT Group's responsibility is to make that technology accessible through professional guidance, authorised sales, dependable service, and long-term ownership support in Georgia.",
    partnershipYear: "2026",
    partnershipCaption: "Exclusive BYD Partnership in Georgia",
    closing:
      "For GT Group, representing BYD is not only about introducing new vehicles. It is about giving Georgian customers access to advanced mobility through trusted local service, professional support, and a long-term partnership.",
  },
  ka: {
    heroTitle: "GT ჯგუფის შესახებ",
    heroSubtitle:
      "სანდო პარტნიორობების შექმნა, საერთაშორისო ბრენდების წარმოდგენა და საქართველოში მობილობისა და ინდუსტრიის მხარდაჭერა 1999 წლიდან.",
    introTitle: "1999 წლიდან",
    introText:
      "GT ჯგუფი მრავალპროფილიანი ქართული კერძო ჰოლდინგია, რომელსაც აქვს დიდი გამოცდილება საავტომობილო დისტრიბუციაში, სპეციალიზებულ ტექნიკაში, ტექნიკურ სერვისსა და საერთაშორისო ბრენდების წარმომადგენლობაში. 1999 წლიდან კომპანია მუდმივად აფართოებს შესაძლებლობებს და ამავე დროს ხარისხზე, გრძელვადიან პარტნიორობებსა და მომხმარებლის კმაყოფილებაზეა ორიენტირებული. დღეს GT ჯგუფი ქართველ მომხმარებლებსა და ბიზნესს აკავშირებს საერთაშორისო მწარმოებლებთან მსუბუქი და კომერციული ავტომობილების, სამშენებლო და სასოფლო-სამეურნეო ტექნიკის, მუნიციპალური აღჭურვილობის, ლუბრიკანტების, საზღვაო ტრანსპორტისა და მევენახეობის გადაწყვეტილებების მიმართულებით.",
    globalLabel: "ადგილობრივი გამოცდილება, გლობალური სტანდარტები",
    globalText:
      "GT ჯგუფის ზრდას საფუძვლად უდევს მჭიდრო თანამშრომლობა წამყვან საერთაშორისო მწარმოებლებთან და მომხმარებლისთვის მხოლოდ პროდუქტის მიწოდებაზე მეტის შეთავაზების უნარი. კომპანია მხარს უჭერს მომხმარებელს მფლობელობის მთელი ციკლის განმავლობაში პროფესიული კონსულტაციით, ტექნიკური გამოცდილებით, მოვლითა და გაყიდვის შემდგომი მომსახურებით. ეს გამოცდილება ქმნის საფუძველს GT ჯგუფისა და BYD-ის პარტნიორობისთვის და საქართველოში ავტორიზებული ელექტრო და პლაგ-ინ ჰიბრიდული მობილობის გადაწყვეტილებების დანერგვისთვის.",
    innovationLabel: "ჩვენი ძლიერი მხარეები",
    innovationTitle: "გამოცდილება მობილობასა და ინდუსტრიაში",
    innovationText:
      "GT ჯგუფი აერთიანებს ადგილობრივი ბაზრის ცოდნას საერთაშორისო დისტრიბუციის, ტექნიკური სერვისისა და კომპლექსური მომხმარებლის მხარდაჭერის მრავალწლიან გამოცდილებასთან. მისი მრავალპროფილიანი სტრუქტურა საშუალებას აძლევს კომპანიას მოემსახუროს კერძო მომხმარებლებს, ბიზნესს, საჯარო ორგანიზაციებსა და მსხვილ ინფრასტრუქტურულ პროექტებს საქართველოს მასშტაბით.",
    features: [
      {
        title: "საქართველოში 1999 წლიდან",
        desc: "ოც წელზე მეტი უწყვეტი საქმიანობა GT ჯგუფს აძლევს საქართველოს ბაზრის, მომხმარებელთა მოლოდინებისა და საერთაშორისო ბრენდების პასუხისმგებლიანად წარმოდგენისთვის საჭირო საოპერაციო სტანდარტების ღრმა ცოდნას.",
      },
      {
        title: "ბიზნესის მრავალი მიმართულება",
        desc: "GT ჯგუფი საქმიანობს მსუბუქი და კომერციული ავტომობილების, სამშენებლო და სასოფლო-სამეურნეო ტექნიკის, მუნიციპალური აღჭურვილობის, ლუბრიკანტების, საზღვაო ტრანსპორტის, მევენახეობის გადაწყვეტილებებისა და დაკავშირებული ტექნიკური სერვისების მიმართულებით.",
      },
      {
        title: "გაყიდვები, სერვისი და შემდგომი მხარდაჭერა",
        desc: "GT ჯგუფის საქმიანობა ავტომობილებისა და ტექნიკის გაყიდვებს სცდება. სპეციალიზებული გუნდებისა და სერვის ინფრასტრუქტურის მეშვეობით კომპანია უზრუნველყოფს ტექნიკურ კონსულტაციას, დიაგნოსტიკას, მოვლას, შეკეთებასა და მომხმარებლის მუდმივ მხარდაჭერას.",
      },
      {
        title: "გლობალური ბრენდები, ადგილობრივი პასუხისმგებლობა",
        desc: "რამდენიმე ინდუსტრიაში აღიარებულ მწარმოებლებთან თანამშრომლობით GT ჯგუფს საქართველოში მოაქვს გლობალური ტექნოლოგიები და საოპერაციო სტანდარტები, მომხმარებლებს კი სთავაზობს ხელმისაწვდომ ადგილობრივ გამოცდილებასა და მხარდაჭერას.",
      },
    ],
    safetyLabel: "სერვისი და ხარისხი",
    safetyTitle: "მხარდაჭერა, რომელიც შეძენის შემდეგაც გრძელდება",
    safetyText:
      "საიმედო მფლობელობისთვის აუცილებელია პროფესიული სერვისი, კვალიფიციური ტექნიკური მხარდაჭერა და სწორი ნაწილებისა და პროცედურების ხელმისაწვდომობა. GT ჯგუფმა საავტომობილო და ტექნიკის მიმართულებები გრძელვადიანი მომხმარებლის მხარდაჭერის, მწარმოებლის მოთხოვნებისა და თანამედროვე სერვის ინფრასტრუქტურის საფუძველზე განავითარა. BYD-ის ავტორიზებული ოპერაციების მეშვეობით GT ჯგუფი ცდილობს საქართველოს მომხმარებლებს შესთავაზოს ოფიციალური ავტომობილები, საგარანტიო მხარდაჭერა, სერტიფიცირებული სერვისი, კვალიფიციური ტექნიკური დახმარება და ორიგინალი სათადარიგო ნაწილები BYD-ის სტანდარტების შესაბამისად.",
    badges: [
      "ავტორიზებული გაყიდვები",
      "საგარანტიო მხარდაჭერა",
      "სერტიფიცირებული სერვისი",
      "ორიგინალი ნაწილები",
    ],
    marketLabel: "BYD საქართველოში",
    marketTitle: "ახალი ეტაპი GT ჯგუფის საავტომობილო გზაზე",
    marketText:
      "2026 წლიდან GT ჯგუფი საქართველოში BYD-ის ექსკლუზიური ავტორიზებული დილერი გახდა. პარტნიორობა აერთიანებს BYD-ის ელექტრო და პლაგ-ინ ჰიბრიდული ავტომობილების ტექნოლოგიას GT ჯგუფის ადგილობრივი ბაზრის გამოცდილებასთან, ჩამოყალიბებულ საავტომობილო ოპერაციებთან და მომხმარებლის მომსახურებისადმი გრძელვადიან ერთგულებასთან. საქართველოს მომხმარებლებს ახლა შეუძლიათ BYD გაეცნონ ავტორიზებული ადგილობრივი პარტნიორის მეშვეობით, რომელიც ორიენტირებულია გამჭვირვალე გაყიდვებზე, პროფესიულ კონსულტაციაზე, საგარანტიო მხარდაჭერაზე, კვალიფიციურ სერვისზე, ტექნიკურ დახმარებასა და ორიგინალ სათადარიგო ნაწილებზე.",
    stats: [
      { value: "25+", label: "წლის გამოცდილება" },
      { value: "1999", label: "საქმიანობის დასაწყისი" },
    ],
    sustainLabel: "მომავლის მობილობა",
    sustainTitle:
      "საქართველოში მოწინავე ელექტრიფიცირებული ავტომობილების შემოტანა",
    sustainText:
      "BYD-თან პარტნიორობა ასახავს GT ჯგუფის მუდმივ ყურადღებას ინოვაციაზე და საქართველოს ბაზარზე შესაბამისი გლობალური ტექნოლოგიების შემოტანაზე. BYD-ის ელექტრო და პლაგ-ინ ჰიბრიდული ავტომობილები ადგილობრივ მძღოლებს არჩევანს უფართოებს და ხელს უწყობს უფრო ეფექტიანი, გონიერი და დაბალი ემისიის მობილობისკენ თანდათანობით გადასვლას. GT ჯგუფის პასუხისმგებლობაა ეს ტექნოლოგია ხელმისაწვდომი გახადოს პროფესიული კონსულტაციის, ავტორიზებული გაყიდვების, საიმედო სერვისისა და საქართველოში მფლობელობის გრძელვადიანი მხარდაჭერის მეშვეობით.",
    partnershipYear: "2026",
    partnershipCaption: "BYD-ის ოფიციალური პარტნიორობა საქართველოში",
    closing:
      "GT ჯგუფისთვის BYD-ის წარმომადგენლობა მხოლოდ ახალი ავტომობილების შემოყვანას არ ნიშნავს. ეს ნიშნავს ქართველ მომხმარებლებს მისცეს წვდომა მოწინავე მობილობაზე სანდო ადგილობრივი სერვისის, პროფესიული მხარდაჭერისა და გრძელვადიანი პარტნიორობის მეშვეობით.",
  },
};

export default async function AboutPage() {
  const locale = await getLocale();
  const c = locale === "ka" ? aboutContent.ka : aboutContent.en;

  return (
    <div className="overflow-hidden">
      {/* ── HERO ── */}
      <section
        className="theme-media-section relative min-h-[75vh] flex items-end pb-20 pt-40"
        style={{
          backgroundImage: "url('/images/aboutus/byd_about_bg_hq_hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Dark overlay that intensifies at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-[#252728]" />
        <div className="relative section-container">
          <ScrollReveal>
            <p
              className="text-xs text-byd-red uppercase tracking-[0.25em] mb-4"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {locale === "ka"
                ? "GT ჯგუფი — BYD საქართველო"
                : "GT Group — BYD Georgia"}
            </p>
            <h1
              className="text-4xl md:text-[4rem] font-bold text-white mb-6 max-w-3xl leading-tight"
              style={{
                fontFamily: "var(--font-montserrat)",
                letterSpacing: "-0.02em",
              }}
            >
              {c.heroTitle}
            </h1>
            <p
              className="text-white/60 text-lg md:text-xl max-w-2xl font-light leading-relaxed"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {c.heroSubtitle}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── INTRO — WHITE section ── */}
      <section
        data-header-theme="light"
        className="about-intro-section py-section-sm md:py-section-lg bg-white"
      >
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-[2px] bg-byd-red flex-shrink-0" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-byd-red">
                  {c.introTitle}
                </p>
              </div>
              <p
                className="text-[#4E5356] text-lg leading-relaxed font-light"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {c.introText}
              </p>
            </ScrollReveal>

            {/* Global presence block */}
            <ScrollReveal delay={0.15} className="mt-10">
              <div className="flex items-start gap-4 p-6 bg-[#F5F6F7] border border-[#E0E2E4]">
                <span className="flex-shrink-0 mt-0.5 text-byd-red">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                    />
                  </svg>
                </span>
                <div>
                  <p
                    className="text-xs text-byd-red uppercase tracking-widest mb-2"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {c.globalLabel}
                  </p>
                  <p
                    className="text-[#4E5356] leading-relaxed font-light"
                    style={{ fontFamily: "var(--font-montserrat)" }}
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
        className="theme-media-section relative py-section-sm md:py-section-lg"
        style={{
          backgroundImage: "url('/images/aboutus/byd_about_bg_tech_dark.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#252728]/95 via-[#252728]/80 to-[#252728]/60" />
        <div className="relative section-container">
          <div className="max-w-4xl">
            <ScrollReveal>
              <p
                className="text-xs text-byd-red uppercase tracking-[0.2em] mb-3"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {c.innovationLabel}
              </p>
              <h2
                className="text-h3 md:text-h2 font-bold text-white mb-6"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  letterSpacing: "-0.02em",
                }}
              >
                {c.innovationTitle}
              </h2>
              <p
                className="text-white/60 text-lg leading-relaxed font-light mb-14"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {c.innovationText}
              </p>
            </ScrollReveal>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {c.features.map((feat, i) => (
                <ScrollReveal key={feat.title} delay={i * 0.1}>
                  <div className="p-6 bg-[rgba(200,208,220,0.06)] border border-[rgba(200,208,220,0.13)] hover:border-[rgba(200,208,220,0.28)] transition-all duration-300 h-full">
                    <h3
                      className="text-sm font-semibold text-white mb-3"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {feat.title}
                    </h3>
                    <p
                      className="text-xs text-white/60 font-light leading-relaxed"
                      style={{ fontFamily: "var(--font-montserrat)" }}
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
        className="theme-media-section relative py-section-sm md:py-section-lg"
        style={{
          backgroundImage: "url('/images/aboutus/byd_about_bg_auto_dark.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-[#252728]/95 via-[#252728]/80 to-[#252728]/60" />
        <div className="relative section-container flex justify-end">
          <div className="max-w-xl">
            <ScrollReveal direction="right">
              <p
                className="text-xs text-byd-red uppercase tracking-[0.2em] mb-3"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {c.safetyLabel}
              </p>
              <h2
                className="text-h3 md:text-h2 font-semibold text-white mb-5"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  letterSpacing: "-0.02em",
                }}
              >
                {c.safetyTitle}
              </h2>
              <p
                className="text-white/60 leading-relaxed font-light"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {c.safetyText}
              </p>

              {/* Safety badges */}
              <div className="flex flex-wrap gap-2 mt-8">
                {c.badges.map((badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1.5 text-xs font-medium bg-[rgba(200,208,220,0.08)] border border-[rgba(200,208,220,0.15)] text-white/60"
                    style={{ fontFamily: "var(--font-montserrat)" }}
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
      <section className="py-section-sm md:py-section-lg bg-byd-dark">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Market performance */}
            <ScrollReveal direction="left">
              <div
                className="about-market-card theme-media-section relative overflow-hidden h-full min-h-[20rem] flex flex-col justify-end p-8"
                style={{
                  backgroundImage:
                    "url('/images/aboutus/byd_about_bg_global_dark.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="about-market-overlay absolute inset-0 bg-gradient-to-t from-[#252728] via-[#252728]/70 to-transparent" />
                <div className="relative">
                  <p
                    className="text-xs text-byd-red uppercase tracking-[0.2em] mb-2"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {c.marketLabel}
                  </p>
                  <h2
                    className="text-xl md:text-2xl font-bold text-white mb-3"
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {c.marketTitle}
                  </h2>
                  <p
                    className="text-white/60 text-sm font-light leading-relaxed"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {c.marketText}
                  </p>
                  {/* Stats */}
                  <div className="flex gap-6 mt-6">
                    <div>
                      <p
                        className="text-2xl font-bold text-white"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                      >
                        {c.stats[0].value}
                      </p>
                      <p
                        className="text-xs text-white/35 uppercase tracking-wider mt-0.5"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                      >
                        {c.stats[0].label}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-2xl font-bold text-white"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                      >
                        {c.stats[1].value}
                      </p>
                      <p
                        className="text-xs text-white/35 uppercase tracking-wider mt-0.5"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                      >
                        {c.stats[1].label}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Sustainability */}
            <ScrollReveal direction="right">
              <div className=" p-8 h-full min-h-[20rem] flex flex-col justify-between bg-[rgba(200,208,220,0.04)] border border-[rgba(200,208,220,0.1)]">
                <div>
                  <p
                    className="text-xs text-byd-red uppercase tracking-[0.2em] mb-2"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {c.sustainLabel}
                  </p>
                  <h2
                    className="text-xl md:text-2xl font-bold text-white mb-4"
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {c.sustainTitle}
                  </h2>
                  <p
                    className="text-white/60 text-sm font-light leading-relaxed"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {c.sustainText}
                  </p>
                </div>
                {/* Partnership milestone */}
                <div className="mt-8 pt-6 border-t border-[rgba(200,208,220,0.1)]">
                  <p
                    className="text-3xl font-bold text-white"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {c.partnershipYear}
                  </p>
                  <p
                    className="text-xs text-white/35 uppercase tracking-wider mt-1"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {c.partnershipCaption}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CLOSING ── */}
      <section className="py-24 text-center bg-[#1C1E1F]">
        <div className="section-container">
          <ScrollReveal>
            <p
              className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed italic"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              &ldquo;{c.closing}&rdquo;
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
