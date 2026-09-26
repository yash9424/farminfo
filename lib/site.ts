export const siteConfig = {
  name: "FarmInfo",
  tagline: "Gujarat Na Pak Na Bhav — Ekaj Jagyae.",
  title: "FarmInfo — Gujarat Market Yard Bhav",
  description:
    "Check agricultural crop prices and market yard bhav across Gujarat with FarmInfo.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  nav: [
    { href: "/", label: "Home" },
    { href: "/prices", label: "Market Prices" },
    { href: "/about", label: "About" },
  ],
  cta: { href: "/prices", label: "Check Today's Bhav", short: "Today's Bhav" },
} as const;

/** Open-data source the live provider is built against */
export const AGMARKNET_SOURCE_URL =
  "https://www.data.gov.in/resource/current-daily-price-various-commodities-various-markets-mandi";
