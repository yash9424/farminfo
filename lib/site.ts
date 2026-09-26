/**
 * Absolute site URL for metadata, sitemap and robots.
 * Order: NEXT_PUBLIC_SITE_URL → Vercel's production domain → the deployment URL → localhost.
 * Empty or malformed values are ignored rather than crashing `new URL()`.
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];
  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      return new URL(withProtocol).origin;
    } catch {
      // try the next candidate
    }
  }
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "FarmInfo",
  tagline: "Gujarat Na Pak Na Bhav — Ekaj Jagyae.",
  title: "FarmInfo — Gujarat Market Yard Bhav",
  description:
    "Check agricultural crop prices and market yard bhav across Gujarat with FarmInfo.",
  url: resolveSiteUrl(),
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
