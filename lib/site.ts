export const siteConfig = {
  name: "FarmInfo",
  tagline: "Gujarat Na Pak Na Bhav — Ekaj Jagyae.",
  title: "FarmInfo — Gujarat Market Yard Bhav",
  description:
    "Check agricultural crop prices and market yard bhav across Gujarat with FarmInfo.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Labels come from the locale dictionary (`t.nav[key]`) */
  nav: [
    { href: "/", key: "home" },
    { href: "/prices", key: "prices" },
    { href: "/about", key: "about" },
  ],
  cta: { href: "/prices" },
} as const;

/** Open-data source the live provider is built against */
export const AGMARKNET_SOURCE_URL =
  "https://www.data.gov.in/resource/current-daily-price-various-commodities-various-markets-mandi";
