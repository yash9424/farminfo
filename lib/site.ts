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
  name: "MachInfo",
  positioning: "CNC & VMC Machine Parts Marketplace",
  tagline: "Find the Right Part for Your Machine.",
  title: "MachInfo — CNC & VMC Machine Parts Marketplace in India",
  description:
    "Find CNC & VMC machine parts, spares and components from sellers across India. Search spindles, servo motors, ball screws, controllers, tool holders and more by category and location.",
  url: resolveSiteUrl(),
  nav: [
    { href: "/", label: "Home" },
    { href: "/parts", label: "Parts" },
    { href: "/categories", label: "Categories" },
    { href: "/locations", label: "Locations" },
    { href: "/about", label: "About" },
  ],
  listCta: { href: "/list-your-part", label: "List Your Part" },
  popularSearches: ["Spindle", "Servo Motor", "Ball Screw", "CNC Controller", "Tool Holder", "Linear Guideway", "CNC Chuck"],
} as const;
