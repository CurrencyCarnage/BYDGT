import { getLocale } from "next-intl/server";
import Image from "next/image";
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
    heroTitle: "About Us",
    heroSubtitle:
      "GT Group has operated successfully in the Georgian market for more than 20 years.",
    introTitle: "GT Group",
    introText:
      "Today, the company maintains a leading position in the import and servicing of commercial, agricultural, construction, and marine equipment, as well as passenger vehicles. GT Group continues to expand its areas of operation and offers products and services that meet international standards through brands including Castrol, Ford Trucks, IVECO, New Holland, and others.",
    globalLabel: "BYD in Georgia",
    globalText:
      "Since 2026, GT Group has been BYD's sole official dealer in Georgia — the only authorised representative in the country of the world's largest new energy vehicle (NEV) manufacturer and global market leader. Through this partnership, GT Group is establishing a sales and service experience aligned with international standards, giving BYD owners access to a full official warranty, genuine spare parts, and high-quality after-sales service.",
    innovationLabel: "Our Strengths",
    innovationTitle: "Experience Built Across Mobility and Industry",
    innovationText:
      "GT Group combines local market knowledge with long-term experience in international distribution, technical service, and complex customer support. Its diversified structure allows the company to serve private customers, businesses, public organisations, and major infrastructure projects across Georgia.",
    features: [
      {
        title: "Sole Authorised Representative",
        desc: "GT Group is BYD's sole authorised dealer in Georgia, delivering an international-standard experience in full compliance with the brand's requirements.",
      },
      {
        title: "Official Warranty and Service",
        desc: "Every vehicle owner benefits from an official warranty, genuine spare parts, and continuous support from a qualified technical team.",
      },
      {
        title: "Global Market Leader",
        desc: "BYD's portfolio combines the Blade Battery safety standard, an ultra-modern digital interface, and fast-charging technology — helping the brand maintain its leadership in the global new energy vehicle market.",
      },
      {
        title: "20+ Years of Experience",
        desc: "GT Group has operated successfully in the Georgian market for more than two decades, offering products and services aligned with international standards.",
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
      { value: "20+", label: "Years of Experience" },
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
    heroTitle: "ჩვენ შესახებ",
    heroSubtitle:
      "„ჯი-თი გრუპი“ 20 წელზე მეტია წარმატებით ოპერირებს საქართველოს ბაზარზე.",
    introTitle: "ჯი-თი გრუპი",
    introText:
      "დღეს კომპანია ლიდერ პოზიციებს ინარჩუნებს კომერციული, სასოფლო-სამეურნეო, სამშენებლო და საზღვაო ტექნიკის, ასევე მსუბუქი ავტომობილების იმპორტისა და სერვისის მიმართულებით. კომპანია მუდმივად აფართოებს საქმიანობის არეალს და მომხმარებელს სთავაზობს საერთაშორისო სტანდარტების პროდუქციასა და მომსახურებას ისეთი ბრენდებით, როგორიცაა Castrol, Ford Trucks, IVECO, New Holland და სხვები.",
    globalLabel: "BYD საქართველოში",
    globalText:
      "2026 წლიდან „ჯი-თი გრუპი“ BYD-ის ერთადერთი ოფიციალური დილერია საქართველოში — განახლებადი ენერგიის ავტომობილების (NEV) უმსხვილესი მწარმოებლისა და მსოფლიო ლიდერის ერთადერთი ავტორიზებული წარმომადგენელი საქართველოში. ამ პარტნიორობით „ჯი-თი გრუპი“ ბაზარზე ამკვიდრებს საერთაშორისო სტანდარტების შესაბამის გაყიდვებისა და სერვისის გამოცდილებას და BYD-ის მფლობელებს სრულ ოფიციალურ გარანტიას, ორიგინალ სათადარიგო ნაწილებსა და მაღალი დონის გაყიდვების შემდგომ მომსახურებაზე წვდომას სთავაზობს.",
    innovationLabel: "ჩვენი ძლიერი მხარეები",
    innovationTitle: "გამოცდილება მობილობასა და ინდუსტრიაში",
    innovationText:
      "GT ჯგუფი აერთიანებს ადგილობრივი ბაზრის ცოდნას საერთაშორისო დისტრიბუციის, ტექნიკური სერვისისა და კომპლექსური მომხმარებლის მხარდაჭერის მრავალწლიან გამოცდილებასთან. მისი მრავალპროფილიანი სტრუქტურა საშუალებას აძლევს კომპანიას მოემსახუროს კერძო მომხმარებლებს, ბიზნესს, საჯარო ორგანიზაციებსა და მსხვილ ინფრასტრუქტურულ პროექტებს საქართველოს მასშტაბით.",
    features: [
      {
        title: "ერთადერთი ავტორიზებული წარმომადგენელი",
        desc: "„ჯი-თი გრუპი“ არის BYD-ის ერთადერთი ავტორიზებული დილერი საქართველოში — საერთაშორისო დონის გამოცდილება ბრენდის სტანდარტების სრული დაცვით.",
      },
      {
        title: "ოფიციალური გარანტია და სერვისი",
        desc: "ყოველი ავტომობილის მფლობელი უზრუნველყოფილია ოფიციალური გარანტიით, ორიგინალი სათადარიგო ნაწილებითა და კვალიფიციური ტექნიკური გუნდის მუდმივი მხარდაჭერით.",
      },
      {
        title: "მსოფლიო ბაზრის ლიდერი",
        desc: "BYD-ის პორტფელი აერთიანებს Blade Battery-ის უსაფრთხოების სტანდარტს, ულტრათანამედროვე ციფრულ ინტერფეისსა და სწრაფი დამუხტვის ტექნოლოგიას — რის გამოც ბრენდი ინარჩუნებს ლიდერობას განახლებადი ენერგიის ავტომობილების მსოფლიო ბაზარზე.",
      },
      {
        title: "20+ წლიანი გამოცდილება",
        desc: "„ჯი-თი გრუპი“ ორ ათეულ წელზე მეტია წარმატებით ოპერირებს საქართველოს ბაზარზე და მომხმარებელს საერთაშორისო სტანდარტების პროდუქციასა და მომსახურებას სთავაზობს.",
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
      { value: "20+", label: "წლის გამოცდილება" },
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

function FeatureIcon({ index }: { index: number }) {
  const iconClass = "h-12 w-12";

  if (index === 0) {
    return (
      <svg
        aria-hidden="true"
        className={iconClass}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.96 11.96 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152A11.96 11.96 0 0 1 12 2.714Z"
        />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg
        aria-hidden="true"
        className={iconClass}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m11.42 15.17-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m1.404 3.563 2.496-3.03c.317-.384.74-.626 1.208-.766a4.5 4.5 0 0 0 6.229-5.476l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085"
        />
      </svg>
    );
  }

  if (index === 2) {
    return (
      <svg
        aria-hidden="true"
        className={iconClass}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3s-4.5 4.03-4.5 9 2.015 9 4.5 9ZM3.284 9.747A17.92 17.92 0 0 0 12 12c3.162 0 6.133-.815 8.716-2.253M3.284 14.253A17.92 17.92 0 0 1 12 12c3.162 0 6.133.815 8.716 2.253"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={iconClass}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6l4 2m5-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

export default async function AboutPage() {
  const locale = await getLocale();
  const c = locale === "ka" ? aboutContent.ka : aboutContent.en;

  return (
    <div className="overflow-hidden">
      {/* ── HERO ── */}
      <section
        className="theme-media-section relative flex min-h-[68vh] items-end pb-14 pt-36 md:pb-20 md:pt-44"
        style={{
          backgroundImage:
            "url('/images/aboutus/byd_about_bg_global_dark.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/15" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
        <div className="relative section-container">
          <ScrollReveal>
            <h1
              className="mb-6 max-w-[38.4rem] text-4xl font-bold leading-tight text-white sm:text-5xl md:text-[4rem]"
              style={{
                fontFamily: "var(--font-montserrat)",
                letterSpacing: "-0.02em",
              }}
            >
              {c.heroTitle}
            </h1>
            <p
              className="max-w-[33.6rem] text-base font-light leading-relaxed text-white/70 md:text-xl"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {c.heroSubtitle}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── INTRO — SPLIT STORY ── */}
      <section className="about-intro-section bg-[#1C1E1F] py-section-sm md:py-section-lg">
        <div className="section-container">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] xl:gap-20">
            <div>
              <ScrollReveal>
                <h2
                  className="mb-7 text-h3 font-semibold text-white md:text-h2"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {c.introTitle}
                </h2>
                <p
                  className="text-base font-light leading-8 text-white/70 md:text-lg"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {c.introText}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.12} className="mt-9 border-t border-white/10 pt-8">
                <h3
                  className="mb-4 text-xl font-semibold text-white"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {c.globalLabel}
                </h3>
                <p
                  className="text-base font-light leading-8 text-white/70"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {c.globalText}
                </p>
              </ScrollReveal>
            </div>

            <ScrollReveal direction="right">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src="/images/aboutus/byd_about_bg_hq_hero.jpg"
                  alt={
                    locale === "ka"
                      ? "BYD-ის სათავო ოფისი და საწარმოო კომპლექსი"
                      : "BYD headquarters and manufacturing complex"
                  }
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── FOUR PILLARS ── */}
      <section className="border-y border-white/[0.06] bg-[#090A0B] py-section-sm md:py-section-lg">
        <div className="section-container">
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {c.features.map((feat, i) => (
              <ScrollReveal key={feat.title} delay={i * 0.08}>
                <article className="h-full text-center">
                  <div className="mb-6 flex h-14 items-start justify-center text-byd-red">
                    <FeatureIcon index={i} />
                  </div>
                  <h3
                    className="mb-3 text-base font-semibold leading-6 text-white"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {feat.title}
                  </h3>
                  <p
                    className="text-sm font-light leading-7 text-white/65"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {feat.desc}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICE ── */}
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
