/* ── Service catalogue ─────────────────────────────────────────────────
   Placeholder product data for the Spare Parts and Accessories shops.

   Shaped the way the admin panel will store it (see ADMIN_PANEL.md §6.3),
   so swapping this constant for a database read later is a one-file change.
   Nothing here is priced — every item routes to an enquiry, not a checkout. */

export type Localized = { en: string; ka: string };

export type CatalogShopId = "spare-parts" | "accessories";

export type CatalogOptionGroup = {
  id: string;
  label: Localized;
  values: { id: string; label: Localized }[];
};

export type CatalogItem = {
  slug: string;
  shop: CatalogShopId;
  category: string;
  sku: string;
  name: Localized;
  summary: Localized;
  description: Localized;
  /** Spec rows rendered as a table on the detail page. */
  specs: { label: Localized; value: Localized }[];
  /** Optional variant pickers, e.g. side, size, finish. */
  options: CatalogOptionGroup[];
  /** Model ids this item is listed against. */
  fitment: string[];
  availability: "in-stock" | "to-order";
};

export const CATALOG_CATEGORIES: Record<CatalogShopId, { id: string; label: Localized }[]> = {
  "spare-parts": [
    { id: "filters", label: { en: "Filters", ka: "ფილტრები" } },
    { id: "brakes", label: { en: "Brakes", ka: "მუხრუჭები" } },
    { id: "fluids", label: { en: "Fluids", ka: "სითხეები" } },
    { id: "electrical", label: { en: "Electrical", ka: "ელექტრო" } },
    { id: "exterior", label: { en: "Exterior", ka: "გარე დეტალები" } },
  ],
  accessories: [
    { id: "protection", label: { en: "Protection", ka: "დაცვა" } },
    { id: "storage", label: { en: "Storage", ka: "შენახვა" } },
    { id: "comfort", label: { en: "Comfort", ka: "კომფორტი" } },
    { id: "charging", label: { en: "Charging", ka: "დატენვა" } },
  ],
};

const ALL_MODELS = ["seal-06-dmi", "sealion-06-dmi", "sealion-06-ev", "yuan-up-ev", "yuan-up-dmi"];

const SIDE_OPTION: CatalogOptionGroup = {
  id: "side",
  label: { en: "Side", ka: "მხარე" },
  values: [
    { id: "left", label: { en: "Left", ka: "მარცხენა" } },
    { id: "right", label: { en: "Right", ka: "მარჯვენა" } },
  ],
};

const AXLE_OPTION: CatalogOptionGroup = {
  id: "axle",
  label: { en: "Axle", ka: "ღერძი" },
  values: [
    { id: "front", label: { en: "Front", ka: "წინა" } },
    { id: "rear", label: { en: "Rear", ka: "უკანა" } },
  ],
};

export const CATALOG_ITEMS: CatalogItem[] = [
  /* ── Spare parts ── */
  {
    slug: "cabin-air-filter",
    shop: "spare-parts",
    category: "filters",
    sku: "BYD-CAF-001",
    name: { en: "Cabin Air Filter", ka: "სალონის ჰაერის ფილტრი" },
    summary: { en: "Activated-carbon cabin filter", ka: "აქტიური ნახშირის სალონის ფილტრი" },
    description: {
      en: "Activated-carbon element for the cabin ventilation system. Replaced at every scheduled service or sooner in heavy urban use.",
      ka: "აქტიური ნახშირის ელემენტი სალონის ვენტილაციისთვის. იცვლება ყოველ დაგეგმილ მომსახურებაზე ან უფრო ადრე ინტენსიური ქალაქური გამოყენებისას.",
    },
    specs: [
      { label: { en: "Type", ka: "ტიპი" }, value: { en: "Activated carbon", ka: "აქტიური ნახშირი" } },
      { label: { en: "Service interval", ka: "შეცვლის ინტერვალი" }, value: { en: "15,000 km", ka: "15,000 კმ" } },
      { label: { en: "Fitting time", ka: "მონტაჟის დრო" }, value: { en: "~20 min", ka: "~20 წთ" } },
    ],
    options: [],
    fitment: ALL_MODELS,
    availability: "in-stock",
  },
  {
    slug: "brake-pad-set",
    shop: "spare-parts",
    category: "brakes",
    sku: "BYD-BPS-014",
    name: { en: "Brake Pad Set", ka: "სამუხრუჭე ხუნდების ნაკრები" },
    summary: { en: "Genuine pads, per axle", ka: "ორიგინალი ხუნდები, ღერძზე" },
    description: {
      en: "Genuine friction material matched to the regenerative braking calibration. Supplied as an axle set; wear sensors ordered separately where fitted.",
      ka: "ორიგინალი საფარი, მორგებული რეკუპერაციულ დამუხრუჭებაზე. მოწოდებულია ღერძის ნაკრებად; ცვეთის სენსორები ცალკე იკვეთება.",
    },
    specs: [
      { label: { en: "Supplied as", ka: "მოწოდება" }, value: { en: "Axle set (4 pads)", ka: "ღერძის ნაკრები (4 ცალი)" } },
      { label: { en: "Wear sensor", ka: "ცვეთის სენსორი" }, value: { en: "Sold separately", ka: "ცალკე იყიდება" } },
      { label: { en: "Fitting", ka: "მონტაჟი" }, value: { en: "Workshop recommended", ka: "რეკომენდებულია სერვისცენტრი" } },
    ],
    options: [AXLE_OPTION],
    fitment: ALL_MODELS,
    availability: "in-stock",
  },
  {
    slug: "brake-fluid-dot4",
    shop: "spare-parts",
    category: "fluids",
    sku: "BYD-BF-004",
    name: { en: "Brake Fluid DOT 4", ka: "სამუხრუჭე სითხე DOT 4" },
    summary: { en: "1 L sealed container", ka: "1 ლ დალუქული ჭურჭელი" },
    description: {
      en: "Specification-grade brake fluid for scheduled replacement. Hygroscopic — containers are supplied sealed and should be used on opening.",
      ka: "სპეციფიკაციის შესაბამისი სამუხრუჭე სითხე დაგეგმილი შეცვლისთვის. ჰიგროსკოპულია — მიეწოდება დალუქული და უნდა გამოიყენოთ გახსნისთანავე.",
    },
    specs: [
      { label: { en: "Grade", ka: "კლასი" }, value: { en: "DOT 4", ka: "DOT 4" } },
      { label: { en: "Volume", ka: "მოცულობა" }, value: { en: "1 litre", ka: "1 ლიტრი" } },
      { label: { en: "Replacement", ka: "შეცვლა" }, value: { en: "Every 2 years", ka: "ყოველ 2 წელიწადში" } },
    ],
    options: [],
    fitment: ALL_MODELS,
    availability: "in-stock",
  },
  {
    slug: "coolant-concentrate",
    shop: "spare-parts",
    category: "fluids",
    sku: "BYD-CL-021",
    name: { en: "Coolant Concentrate", ka: "გამაგრილებელი კონცენტრატი" },
    summary: { en: "Battery and drivetrain circuit", ka: "ბატარეისა და ტრანსმისიის კონტური" },
    description: {
      en: "Coolant for the high-voltage battery and drivetrain circuits. Mixing ratio and circuit filling must follow the service procedure.",
      ka: "გამაგრილებელი მაღალი ძაბვის ბატარეისა და ტრანსმისიის კონტურისთვის. შერევის პროპორცია და ჩასხმა უნდა შეესაბამებოდეს სერვისის პროცედურას.",
    },
    specs: [
      { label: { en: "Volume", ka: "მოცულობა" }, value: { en: "5 litres", ka: "5 ლიტრი" } },
      { label: { en: "Circuit", ka: "კონტური" }, value: { en: "HV battery / drivetrain", ka: "HV ბატარეა / ტრანსმისია" } },
      { label: { en: "Fitting", ka: "მონტაჟი" }, value: { en: "Workshop only", ka: "მხოლოდ სერვისცენტრი" } },
    ],
    options: [],
    fitment: ALL_MODELS,
    availability: "to-order",
  },
  {
    slug: "wiper-blade-set",
    shop: "spare-parts",
    category: "exterior",
    sku: "BYD-WB-008",
    name: { en: "Wiper Blade Set", ka: "საწმენდი ფრთების ნაკრები" },
    summary: { en: "Model-specific length pair", ka: "მოდელზე მორგებული წყვილი" },
    description: {
      en: "Front wiper blades in the lengths specified for the model. Using the correct pair avoids the sweep overlapping the A-pillar trim.",
      ka: "წინა საწმენდი ფრთები მოდელისთვის განსაზღვრული სიგრძით. სწორი წყვილი გამორიცხავს A-სვეტზე გადასვლას.",
    },
    specs: [
      { label: { en: "Supplied as", ka: "მოწოდება" }, value: { en: "Pair", ka: "წყვილი" } },
      { label: { en: "Position", ka: "პოზიცია" }, value: { en: "Front", ka: "წინა" } },
      { label: { en: "Fitting", ka: "მონტაჟი" }, value: { en: "Owner-fit", ka: "თავად მონტაჟი" } },
    ],
    options: [],
    fitment: ALL_MODELS,
    availability: "in-stock",
  },
  {
    slug: "12v-auxiliary-battery",
    shop: "spare-parts",
    category: "electrical",
    sku: "BYD-AB-012",
    name: { en: "12V Auxiliary Battery", ka: "12V დამხმარე ბატარეა" },
    summary: { en: "Low-voltage system battery", ka: "დაბალი ძაბვის სისტემის ბატარეა" },
    description: {
      en: "Auxiliary battery powering the low-voltage systems. Replacement requires a system reset so the charge strategy re-learns the new cell.",
      ka: "დამხმარე ბატარეა დაბალი ძაბვის სისტემებისთვის. შეცვლა საჭიროებს სისტემის განულებას, რომ დატენვის სტრატეგია ახალ ელემენტს მოერგოს.",
    },
    specs: [
      { label: { en: "Voltage", ka: "ძაბვა" }, value: { en: "12 V", ka: "12 ვ" } },
      { label: { en: "Reset required", ka: "საჭიროა განულება" }, value: { en: "Yes", ka: "დიახ" } },
      { label: { en: "Fitting", ka: "მონტაჟი" }, value: { en: "Workshop only", ka: "მხოლოდ სერვისცენტრი" } },
    ],
    options: [],
    fitment: ALL_MODELS,
    availability: "to-order",
  },
  {
    slug: "door-mirror-glass",
    shop: "spare-parts",
    category: "exterior",
    sku: "BYD-DMG-031",
    name: { en: "Door Mirror Glass", ka: "კარის სარკის შუშა" },
    summary: { en: "Heated, per side", ka: "გათბობით, მხარეზე" },
    description: {
      en: "Heated mirror glass supplied per side. Blind-spot indicator variants differ by specification — confirm against the VIN before ordering.",
      ka: "გათბობიანი სარკის შუშა მხარეზე. ბრმა ზონის ინდიკატორის ვერსიები განსხვავდება სპეციფიკაციით — შეკვეთამდე დაადასტურეთ VIN-ით.",
    },
    specs: [
      { label: { en: "Heated", ka: "გათბობა" }, value: { en: "Yes", ka: "დიახ" } },
      { label: { en: "Blind-spot indicator", ka: "ბრმა ზონის ინდიკატორი" }, value: { en: "Spec dependent", ka: "სპეციფიკაციაზეა დამოკიდებული" } },
      { label: { en: "Supplied as", ka: "მოწოდება" }, value: { en: "Single side", ka: "ერთი მხარე" } },
    ],
    options: [SIDE_OPTION],
    fitment: ALL_MODELS,
    availability: "to-order",
  },
  {
    slug: "pollen-filter-housing-clip",
    shop: "spare-parts",
    category: "filters",
    sku: "BYD-FC-047",
    name: { en: "Filter Housing Clip Set", ka: "ფილტრის კორპუსის სამაგრები" },
    summary: { en: "Retaining clips, set of four", ka: "სამაგრები, ოთხის ნაკრები" },
    description: {
      en: "Retaining clips for the cabin filter housing. Commonly replaced alongside the filter when the original clips have fatigued.",
      ka: "სალონის ფილტრის კორპუსის სამაგრები. ჩვეულებრივ იცვლება ფილტრთან ერთად, როცა ორიგინალი დაზიანებულია.",
    },
    specs: [
      { label: { en: "Quantity", ka: "რაოდენობა" }, value: { en: "4 pieces", ka: "4 ცალი" } },
      { label: { en: "Material", ka: "მასალა" }, value: { en: "Reinforced polymer", ka: "გამაგრებული პოლიმერი" } },
      { label: { en: "Fitting", ka: "მონტაჟი" }, value: { en: "Owner-fit", ka: "თავად მონტაჟი" } },
    ],
    options: [],
    fitment: ALL_MODELS,
    availability: "in-stock",
  },

  /* ── Accessories ── */
  {
    slug: "all-weather-floor-mats",
    shop: "accessories",
    category: "protection",
    sku: "BYD-FM-101",
    name: { en: "All-Weather Floor Mats", ka: "ყველა ამინდის ხალიჩები" },
    summary: { en: "Moulded set, raised edge", ka: "ჩამოსხმული ნაკრები, ამაღლებული კიდით" },
    description: {
      en: "Moulded rubber mats with a raised lip, cut to the model's floor pan and located on the factory anchor points so they cannot slide under the pedals.",
      ka: "ჩამოსხმული რეზინის ხალიჩები ამაღლებული კიდით, მორგებული მოდელის იატაკზე და დამაგრებული ქარხნულ სამაგრებზე, რომ პედლების ქვეშ არ გადაცურდეს.",
    },
    specs: [
      { label: { en: "Material", ka: "მასალა" }, value: { en: "Moulded TPE", ka: "ჩამოსხმული TPE" } },
      { label: { en: "Pieces", ka: "ცალი" }, value: { en: "4", ka: "4" } },
      { label: { en: "Anchors", ka: "სამაგრები" }, value: { en: "Factory points", ka: "ქარხნული წერტილები" } },
    ],
    options: [
      {
        id: "finish",
        label: { en: "Finish", ka: "ფერი" },
        values: [
          { id: "black", label: { en: "Black", ka: "შავი" } },
          { id: "grey", label: { en: "Grey", ka: "ნაცრისფერი" } },
        ],
      },
    ],
    fitment: ALL_MODELS,
    availability: "in-stock",
  },
  {
    slug: "boot-liner",
    shop: "accessories",
    category: "protection",
    sku: "BYD-BL-104",
    name: { en: "Boot Liner", ka: "საბარგულის საფარი" },
    summary: { en: "Full-depth, wipe-clean", ka: "სრული სიღრმის, ადვილად საწმენდი" },
    description: {
      en: "Full-depth liner with raised sides, shaped to the luggage compartment including the underfloor step where present.",
      ka: "სრული სიღრმის საფარი ამაღლებული გვერდებით, მორგებული საბარგულზე, იატაკქვეშა საფეხურის ჩათვლით.",
    },
    specs: [
      { label: { en: "Material", ka: "მასალა" }, value: { en: "Moulded TPE", ka: "ჩამოსხმული TPE" } },
      { label: { en: "Edge height", ka: "კიდის სიმაღლე" }, value: { en: "~50 mm", ka: "~50 მმ" } },
      { label: { en: "Fitting", ka: "მონტაჟი" }, value: { en: "Owner-fit", ka: "თავად მონტაჟი" } },
    ],
    options: [],
    fitment: ALL_MODELS,
    availability: "in-stock",
  },
  {
    slug: "charging-cable-bag",
    shop: "accessories",
    category: "charging",
    sku: "BYD-CB-118",
    name: { en: "Charging Cable Bag", ka: "დატენვის კაბელის ჩანთა" },
    summary: { en: "Padded, water-resistant", ka: "რბილი, წყალგამძლე" },
    description: {
      en: "Padded case that keeps the charging cable contained and the boot floor clean. Sized for the Mode 3 cable supplied with the vehicle.",
      ka: "რბილი ჩანთა, რომელიც კაბელს ინახავს და საბარგულს სუფთად ტოვებს. მორგებულია ავტომობილთან მოწოდებულ Mode 3 კაბელზე.",
    },
    specs: [
      { label: { en: "Fits", ka: "შეესაბამება" }, value: { en: "Mode 3 cable", ka: "Mode 3 კაბელი" } },
      { label: { en: "Closure", ka: "დახურვა" }, value: { en: "Full-length zip", ka: "სრული ზიპერი" } },
      { label: { en: "Water resistant", ka: "წყალგამძლე" }, value: { en: "Yes", ka: "დიახ" } },
    ],
    options: [],
    fitment: ALL_MODELS,
    availability: "in-stock",
  },
  {
    slug: "boot-organiser",
    shop: "accessories",
    category: "storage",
    sku: "BYD-BO-122",
    name: { en: "Boot Organiser", ka: "საბარგულის ორგანაიზერი" },
    summary: { en: "Collapsible, partitioned", ka: "დასაკეცი, გამყოფებით" },
    description: {
      en: "Collapsible organiser with movable partitions and a non-slip base. Folds flat when the full luggage volume is needed.",
      ka: "დასაკეცი ორგანაიზერი მოძრავი გამყოფებით და არასრიალა ფსკერით. იკეცება, როცა სრული მოცულობაა საჭირო.",
    },
    specs: [
      { label: { en: "Partitions", ka: "გამყოფები" }, value: { en: "Movable, 2", ka: "მოძრავი, 2" } },
      { label: { en: "Base", ka: "ფსკერი" }, value: { en: "Non-slip", ka: "არასრიალა" } },
      { label: { en: "Folds flat", ka: "იკეცება" }, value: { en: "Yes", ka: "დიახ" } },
    ],
    options: [],
    fitment: ALL_MODELS,
    availability: "in-stock",
  },
  {
    slug: "mud-flap-set",
    shop: "accessories",
    category: "protection",
    sku: "BYD-MF-131",
    name: { en: "Mud Flap Set", ka: "ტალახსაცავების ნაკრები" },
    summary: { en: "Front or rear pair", ka: "წინა ან უკანა წყვილი" },
    description: {
      en: "Contoured mud flaps that reduce stone chipping along the sills and lower doors. Supplied as an axle pair with fixings.",
      ka: "კონტურული ტალახსაცავები, რომლებიც ამცირებს ქვების დაზიანებას ზღურბლებსა და კარებზე. მოწოდებულია ღერძის წყვილად სამაგრებით.",
    },
    specs: [
      { label: { en: "Supplied as", ka: "მოწოდება" }, value: { en: "Axle pair", ka: "ღერძის წყვილი" } },
      { label: { en: "Fixings", ka: "სამაგრები" }, value: { en: "Included", ka: "შედის" } },
      { label: { en: "Fitting", ka: "მონტაჟი" }, value: { en: "Workshop recommended", ka: "რეკომენდებულია სერვისცენტრი" } },
    ],
    options: [AXLE_OPTION],
    fitment: ALL_MODELS,
    availability: "in-stock",
  },
  {
    slug: "sunshade-set",
    shop: "accessories",
    category: "comfort",
    sku: "BYD-SS-140",
    name: { en: "Window Sunshade Set", ka: "ფანჯრის დამჩრდილავები" },
    summary: { en: "Rear side windows", ka: "უკანა გვერდითი ფანჯრები" },
    description: {
      en: "Mesh shades shaped to the rear side glass, reducing cabin heat load without obstructing the mirrors or door seals.",
      ka: "ბადისებრი დამჩრდილავები უკანა გვერდით შუშებზე, ამცირებს სალონის გახურებას სარკეებისა და ლუქების შეფერხების გარეშე.",
    },
    specs: [
      { label: { en: "Coverage", ka: "დაფარვა" }, value: { en: "Rear side glass", ka: "უკანა გვერდითი შუშა" } },
      { label: { en: "Pieces", ka: "ცალი" }, value: { en: "2", ka: "2" } },
      { label: { en: "Fitting", ka: "მონტაჟი" }, value: { en: "Owner-fit", ka: "თავად მონტაჟი" } },
    ],
    options: [],
    fitment: ALL_MODELS,
    availability: "in-stock",
  },
  {
    slug: "portable-charger",
    shop: "accessories",
    category: "charging",
    sku: "BYD-PC-151",
    name: { en: "Portable Charging Unit", ka: "პორტატული დამტენი" },
    summary: { en: "Domestic socket charging", ka: "საყოფაცხოვრებო როზეტიდან დატენვა" },
    description: {
      en: "Portable unit for charging from a domestic socket. Intended as a backup rather than a primary method; a fixed wall unit is recommended for daily charging.",
      ka: "პორტატული მოწყობილობა საყოფაცხოვრებო როზეტიდან დასატენად. განკუთვნილია სარეზერვოდ; ყოველდღიური დატენვისთვის რეკომენდებულია სტაციონარული მოწყობილობა.",
    },
    specs: [
      { label: { en: "Supply", ka: "კვება" }, value: { en: "Domestic socket", ka: "საყოფაცხოვრებო როზეტი" } },
      { label: { en: "Cable length", ka: "კაბელის სიგრძე" }, value: { en: "5 m", ka: "5 მ" } },
      { label: { en: "Use", ka: "გამოყენება" }, value: { en: "Backup charging", ka: "სარეზერვო დატენვა" } },
    ],
    options: [],
    fitment: ALL_MODELS,
    availability: "to-order",
  },
  {
    slug: "seat-back-protector",
    shop: "accessories",
    category: "comfort",
    sku: "BYD-SB-163",
    name: { en: "Seat Back Protector", ka: "სავარძლის ზურგის დამცავი" },
    summary: { en: "Wipe-clean, per seat", ka: "ადვილად საწმენდი, სავარძელზე" },
    description: {
      en: "Wipe-clean panel protecting the front seat backs from shoe marks, with a cut-out for the seat-back pocket.",
      ka: "ადვილად საწმენდი პანელი წინა სავარძლის ზურგის დასაცავად, ჯიბისთვის ამოჭრილი ადგილით.",
    },
    specs: [
      { label: { en: "Supplied as", ka: "მოწოდება" }, value: { en: "Single", ka: "ერთეული" } },
      { label: { en: "Pocket cut-out", ka: "ჯიბის ამონაჭერი" }, value: { en: "Yes", ka: "დიახ" } },
      { label: { en: "Fitting", ka: "მონტაჟი" }, value: { en: "Owner-fit", ka: "თავად მონტაჟი" } },
    ],
    options: [],
    fitment: ALL_MODELS,
    availability: "in-stock",
  },
];

export function getShopItems(shop: CatalogShopId): CatalogItem[] {
  return CATALOG_ITEMS.filter((item) => item.shop === shop);
}

export function getCatalogItem(shop: CatalogShopId, slug: string): CatalogItem | undefined {
  return CATALOG_ITEMS.find((item) => item.shop === shop && item.slug === slug);
}

export function localized(value: Localized, locale: string): string {
  return locale === "ka" ? value.ka : value.en;
}
