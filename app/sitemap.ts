import type { MetadataRoute } from "next";
import { getAllPartSlugs, getCategories, getListedLocations } from "@/lib/parts";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();
  const [parts, categories, locations] = await Promise.all([getAllPartSlugs(), getCategories(), getListedLocations()]);

  const states = [...new Set(locations.map((l) => l.state))];
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/parts`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/categories`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/locations`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/list-your-part`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ...categories.map((c) => ({ url: `${base}/categories/${c.slug}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.7 })),
    ...states.map((s) => ({ url: `${base}/locations/${s}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.6 })),
    ...locations.map((l) => ({ url: `${base}/locations/${l.state}/${l.district}/${l.city}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.6 })),
    ...parts.map((p) => ({ url: `${base}/parts/${p.slug}`, lastModified: new Date(p.updatedAt), changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
