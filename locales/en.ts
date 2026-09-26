import type { CropCategory } from "@/lib/types";

/**
 * English UI strings. `Dictionary` (below) is derived from this file, so the
 * Gujarati dictionary must provide every key — missing translations are a
 * type error.
 */
export const en = {
  meta: {
    title: "FarmInfo — Gujarat Market Yard Bhav",
    description: "Check agricultural crop prices and market yard bhav across Gujarat with FarmInfo.",
    pricesTitle: "Market Prices",
    pricesFilteredTitle: (parts: string[]) => `${parts.join(" bhav in ")} — Market Prices`,
    pricesDescription: (crop?: string, market?: string) =>
      `Check ${crop ? crop.toLowerCase() : "agricultural crop"} prices${
        market ? ` at ${market}` : " across Gujarat market yards"
      } — minimum, maximum and modal bhav with a 7-day trend.`,
    aboutTitle: "About FarmInfo",
    aboutDescription:
      "FarmInfo makes agricultural market-yard price information across Gujarat easier to discover and understand.",
  },

  common: {
    tagline: "Gujarat Na Pak Na Bhav — Ekaj Jagyae.",
    skipToContent: "Skip to content",
    demoData: "Demo data",
    demoDataTitle: "Sample prices for demonstration — not real market data",
    today: "Today",
    yesterday: "Yesterday",
    quintal: "Quintal",
    perQuintal: "/ Quintal",
    perQtl: "/ Qtl",
    quintalLong: "Quintal (100 kg)",
    changeUp: (pct: string) => `Up ${pct} from previous day`,
    changeDown: (pct: string) => `Down ${pct} from previous day`,
    unchanged: "Unchanged from previous day",
    noPrevious: "No previous price to compare",
    viewSource: "View source",
    learnMore: "learn more",
    backHome: "Back to home",
    tryAgain: "Try again",
  },

  language: {
    label: "Language",
    english: "English",
    gujarati: "ગુજરાતી",
  },

  nav: {
    home: "Home",
    prices: "Market Prices",
    about: "About",
    todayBhav: "Today's Bhav",
    checkTodayBhav: "Check Today's Bhav",
    primary: "Primary",
    mobile: "Mobile",
    footer: "Footer",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    logoAria: "FarmInfo home",
  },

  hero: {
    eyebrow: "Gujarat Agriculture Market",
    titleLine1: "Gujarat Na Pak Na Bhav,",
    titleLine2: "Have Ekaj Jagyae.",
    description:
      "Check the latest agricultural crop prices from market yards across Gujarat — simple, fast and easy.",
    primaryCta: "Check Today's Bhav",
    secondaryCta: "Explore Market Yards",
    imageAlt: "Farmland at sunrise with mist over the fields and hills beyond",
    todaysMarket: "Today's Market",
    cardAria: (crop: string, market: string) => `Today's market: ${crop} at ${market}`,
    range: (min: string, max: string) => `Range ${min} – ${max}`,
    tickerSample: "Sample bhav",
    tickerLatest: "Latest bhav",
  },

  stats: {
    aria: "Coverage",
    marketsLabel: "Gujarat Market Yards",
    marketsHint: "APMC yards in the current dataset",
    categoriesLabel: "Crop Categories",
    categoriesHint: (n: number) => `${n} crops across cereals, pulses, oilseeds & more`,
    entriesLabel: "Daily Price Entries",
    entriesHint: (date: string) => `Rows for ${date}`,
    districtsLabel: "Districts Covered",
    districtsHint: "Saurashtra, Kutch, North, Central & South",
    noteDemo:
      "Figures are computed from the FarmInfo demo dataset and will reflect real coverage once a live source is connected.",
    noteLive: (source: string) => `Figures are computed from ${source}.`,
  },

  snapshot: {
    eyebrow: "Market snapshot",
    titleA: "Aaj Na",
    titleB: "Market Bhav",
    description: "Quickly check what is happening across major agricultural markets.",
    allPrices: "All prices",
    viewAll: "View all market prices",
    empty: "No prices are available right now. Please check again later.",
  },

  how: {
    eyebrow: "How it works",
    title: "Your bhav in three simple steps.",
    description:
      "No sign-up, no clutter. FarmInfo is built to answer one question quickly: what is my crop fetching today?",
    steps: [
      {
        title: "Select Your Market",
        body: "Choose your Gujarat market yard — Rajkot, Gondal, Unjha or any other listed APMC.",
      },
      {
        title: "Choose Your Crop",
        body: "Select wheat, rice, bajra, groundnut, cotton, jeera and more — or just search.",
      },
      {
        title: "Check Today's Bhav",
        body: "View minimum, maximum and modal prices with a 7-day view of price movement.",
      },
    ],
  },

  feature: {
    eyebrow: "Built for farmers & traders",
    titleA: "Designed For The People Who",
    titleB: "Grow Gujarat.",
    body: "Market-yard prices are often scattered across notice boards, phone calls and hard-to-read portals. FarmInfo brings them into one calm, simple interface — so you can compare markets and decide where and when to sell with more confidence.",
    quote: "“Every season’s work deserves a fair price.”",
    imageAlt: "A farmer walking along a paddy field bund carrying bundles of rice seedlings",
    harvestAlt: "Close-up of a ripe wheat ear in evening light",
    items: [
      "Market-wise prices",
      "Crop-wise filtering",
      "Gujarat-focused data",
      "Simple price comparison",
      "Mobile friendly",
      "Fast access",
    ],
  },

  marketGrid: {
    eyebrow: "Market yards",
    title: "Markets Across Gujarat",
    description:
      "From Saurashtra’s groundnut and cotton hubs to Unjha’s spice yard — explore prices market by market.",
    viewAll: (n: number) => `View all ${n} yards`,
    cropsListed: (n: number) => `${n} crops listed`,
    noteDemo: "Crop counts reflect the latest date in the demo dataset.",
    noteLive: "Crop counts reflect the latest date in the data source.",
  },

  finalCta: {
    eyebrow: "FarmInfo",
    titleA: "Know Your Market.",
    titleB: "Know Your Price.",
    description: "Get a clearer view of agricultural market prices across Gujarat.",
    button: "View Market Prices",
  },

  footer: {
    blurb: "A simpler way to explore agricultural market-yard prices across Gujarat.",
    explore: "Explore",
    data: "Data",
    dataSource: "Data Source",
    dataDisclaimer: "Data Disclaimer",
    currentSource: "Current source",
    demoNote:
      "Prices shown are sample data for demonstration until a verified live source is connected.",
    rights: "© 2026 FarmInfo. All rights reserved.",
    indicative: "Prices are indicative. Always confirm with your market yard before trading.",
  },

  prices: {
    eyebrow: "Market dashboard",
    title: "Market Prices",
    subtitle: "Check agricultural crop prices across Gujarat market yards.",
    latestPrices: "Latest prices · ",
    showingFor: "Showing prices for ",
    samplePrices: "Sample prices —",
    loading: "Loading market prices…",
  },

  filters: {
    aria: "Filter market prices",
    market: "Market yard",
    allMarkets: "All markets",
    marketPlaceholder: "Search market or district…",
    crop: "Crop",
    allCrops: "All crops",
    cropPlaceholder: "Search crop…",
    date: "Date",
    search: "Search",
    searchPlaceholder: "wheat, rajkot, groundnut…",
    reset: "Reset",
    clearSearch: "Clear search",
    searchIn: (label: string) => `Search ${label.toLowerCase()}`,
    noMatches: (q: string) => `No matches for “${q}”`,
  },

  summary: {
    aria: "Summary",
    selectedMarket: "Selected market",
    allMarkets: "All markets",
    yardsInView: (n: number) => `${n} yards in view`,
    lastUpdated: "Last updated",
    numberOfCrops: "Number of crops",
    entries: (n: number) => `${n} price ${n === 1 ? "entry" : "entries"}`,
    dataSource: "Data source",
  },

  table: {
    caption:
      "Market prices in rupees per quintal. Select a crop to see details and a 7-day trend.",
    crop: "Crop",
    market: "Market",
    variety: "Variety",
    min: "Min",
    max: "Max",
    modal: "Modal",
    unit: "Unit",
    change: "Change",
    updated: "Updated",
    sortBy: "Sort by ",
    viewDetails: " — view details",
  },

  results: {
    loading: "Loading prices…",
    found: (n: number) => `${n} price ${n === 1 ? "entry" : "entries"} found`,
    emptyTitle: "No prices found",
    emptyBody: (q?: string) =>
      `We couldn't find prices for this combination${
        q ? ` matching “${q}”` : ""
      }. Try another market, crop or date — or clear the filters.`,
    resetFilters: "Reset filters",
    sortLabel: "Sort by",
    sort: {
      cropAsc: "Crop (A–Z)",
      marketAsc: "Market (A–Z)",
      modalDesc: "Price: high to low",
      modalAsc: "Price: low to high",
      changeDesc: "Biggest gainers",
      changeAsc: "Biggest fallers",
    },
    showMore: "Show more",
    showing: (shown: number, total: number) => `Showing ${shown} of ${total}`,
  },

  card: {
    modal: "Modal",
    min: "Min",
    max: "Max",
    updated: (when: string) => `Updated ${when}`,
    details: "Details",
    aria: (crop: string, market: string, variety: string, price: string) =>
      `${crop}, ${market}, ${variety}: modal price ${price} per quintal. View details`,
  },

  details: {
    close: "Close details",
    modalAverage: "Modal / average price",
    vsPrevious: "vs previous day",
    minimum: "Minimum price",
    maximum: "Maximum price",
    variety: "Variety",
    unit: "Unit",
    date: "Date",
    lastUpdated: "Last updated",
    trendTitle: (n: number) => `Price trend · ${n} days`,
    week: "Week",
    low: "Low",
    average: "Average",
    high: "High",
    source: "Source",
    compare: (crop: string) => `Compare ${crop} across all markets`,
  },

  chart: {
    caption: (crop: string, n: number) => `${crop} modal price, last ${n} days`,
    aria: (crop: string, n: number, from: string, to: string) =>
      `Line chart of ${crop} modal price over ${n} days, from ${from} to ${to}`,
    notEnough: "Not enough history yet to draw a trend for this entry.",
    tableCaption: (crop: string) => `${crop} modal price by day`,
    colDate: "Date",
    colModal: "Modal price (₹/quintal)",
  },

  errors: {
    pricesTitle: "We couldn't load market prices",
    pricesBody:
      "The price source didn't respond as expected. This is usually temporary — please try again in a moment.",
    reference: "Reference",
    rootTitle: "Something went wrong",
    rootBody: "We couldn't load this page. Please try again in a moment.",
    notFoundTitle: "This field is empty.",
    notFoundBody: "The page you were looking for doesn't exist or has moved.",
  },

  about: {
    heroEyebrow: "About FarmInfo",
    heroTitleA: "Making Market Information",
    heroTitleB: "Easier To Access.",
    heroBody:
      "FarmInfo is designed to make agricultural market information easier to discover and understand — for farmers, traders and everyone who follows Gujarat’s market yards.",
    heroAlt: "Aerial view of green paddy fields stretching toward distant hills",
    purposeEyebrow: "Our purpose",
    purposeTitle: "Prices shouldn’t be hard to find.",
    purposeP1:
      "Agricultural prices are often spread across different sources and interfaces — government portals, yard notice boards, newspapers, messages forwarded between phones. Each shows a slice, in its own format.",
    purposeP2:
      "FarmInfo aims to provide a cleaner way to explore market prices: one consistent view of minimum, maximum and modal bhav, organised by market and crop, that reads well on any phone.",
    marketAlt: "A vendor at a produce market stall with heaped sacks of spices",
    quote: "“What is my crop fetching today — and where?”",
    quoteSub: "The one question FarmInfo is built to answer.",
    capEyebrow: "What you can do",
    capTitle: "Everything you need to read the market.",
    capDescription: "Six simple tools, one clean interface.",
    capabilities: [
      { title: "Market-wise prices", body: "Open any Gujarat APMC and see every crop it lists for the day." },
      { title: "Crop-wise prices", body: "Follow one crop — jeera, kapas, groundnut — across all yards." },
      { title: "Price comparison", body: "Minimum, maximum and modal prices side by side, sortable." },
      { title: "Market discovery", body: "Find yards across Saurashtra, Kutch, North, Central and South Gujarat." },
      { title: "Price trends", body: "A 7-day chart for every entry shows which way the bhav is moving." },
      { title: "Mobile access", body: "Designed phone-first, with cards instead of cramped tables." },
    ],
    gujaratEyebrow: "Built for Gujarat",
    gujaratTitleA: "From Kutch to Navsari,",
    gujaratTitleB: "one view.",
    gujaratBody:
      "Gujarat’s yards each have a character — groundnut and cotton in Saurashtra, jeera and variyali at Unjha, potatoes at Deesa, garlic at Gondal. FarmInfo is organised around that geography, with Gujarati crop names built into search.",
    marketYards: "Market yards",
    districts: "Districts",
    crops: "Crops",
    countsDemo: "Counts reflect the current demo dataset.",
    dataEyebrow: "Data transparency",
    dataTitle: "Where the numbers come from.",
    dataDescription: "Trust starts with being clear about sources, timing and limits.",
    disclaimer:
      "FarmInfo displays market information sourced from available agricultural data providers. Data availability, update frequency, and accuracy may vary by source.",
    indicative:
      "Prices are indicative and are not an offer to buy or sell. Always confirm the current bhav with your APMC or commission agent before trading.",
    demoStrong:
      "FarmInfo is currently running on generated demo data — the prices shown are samples for demonstration, not real market prices.",
    lastUpdated: "Last updated",
    unavailable: "Currently unavailable",
    dataSource: "Data source",
    sourceLink: "Source link",
    agmarknetLink: "AGMARKNET dataset on data.gov.in",
    openSource: "Open data source",
    officialNote: "The official open dataset FarmInfo is built to connect to.",
    ready: "Ready to check today’s bhav?",
    viewPrices: "View Market Prices",
  },

  map: {
    title: (n: number, list: string) => `Map of Gujarat showing ${n} market yards, including ${list}`,
    regions: { kutch: "KUTCH", saurashtra: "SAURASHTRA", north: "NORTH" },
    major: "Major market yard",
    other: "Other listed yard",
    boundary: "Boundary:",
  },

  sources: {
    demo: {
      name: "FarmInfo demo dataset",
      description:
        "Generated sample prices used for design and development. These are not real market prices.",
      updateFrequency: "Regenerated daily (sample data)",
    },
    agmarknet: {
      name: "AGMARKNET via data.gov.in (Government of India)",
      description:
        "Daily mandi (market yard) arrival prices published by the Directorate of Marketing & Inspection and served through the Open Government Data (OGD) Platform India.",
      updateFrequency: "Daily, as published by each market",
    },
  } as Record<string, { name: string; description: string; updateFrequency: string }>,

  format: {
    /** Display name for a catalogue market, from its (translated) city */
    marketName: (city: string) => `${city} APMC`,
    district: (district: string) => `${district} district`,
  },

  /** Crop / place names. English falls back to the data's own names. */
  crops: {} as Record<string, string>,
  cities: {} as Record<string, string>,
  districts: {} as Record<string, string>,
  categories: {
    Cereals: "Cereals",
    Pulses: "Pulses",
    Oilseeds: "Oilseeds",
    Spices: "Spices",
    Fibre: "Fibre",
    Vegetables: "Vegetables",
    Other: "Other",
  } as Record<CropCategory, string>,
};

export type Dictionary = typeof en;
