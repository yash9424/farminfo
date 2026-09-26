import type { Crop, CropCategory, DataSourceInfo, Market } from "@/lib/types";
import { en, type Dictionary } from "./en";
import { gu } from "./gu";

export type { Dictionary };

export const LOCALES = ["en", "gu"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** Cookie holding the visitor's language; readable on the server so pages render in it directly. */
export const LOCALE_COOKIE = "farminfo-lang";

export const dictionaries: Record<Locale, Dictionary> = { en, gu };

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** BCP 47 tag for Intl formatting and the <html lang> attribute */
export function intlLocale(locale: Locale) {
  return locale === "gu" ? "gu-IN" : "en-IN";
}

/* ---------- data-name helpers ----------
 * Underlying ids stay English (filters, URLs, API matching); these only change
 * what is displayed. Unknown names (e.g. from a live feed) fall back to the data. */

export function cropLabel(t: Dictionary, crop: Pick<Crop, "id" | "name"> | undefined, fallbackId = "") {
  if (!crop) return t.crops[fallbackId] ?? fallbackId;
  return t.crops[crop.id] ?? crop.name;
}

export function cityLabel(t: Dictionary, market: Pick<Market, "id" | "city"> | undefined, fallbackId = "") {
  if (!market) return t.cities[fallbackId] ?? fallbackId;
  return t.cities[market.id] ?? market.city;
}

export function marketLabel(t: Dictionary, market: Pick<Market, "id" | "name"> | undefined, fallbackId = "") {
  if (!market) return fallbackId;
  const city = t.cities[market.id];
  return city ? t.format.marketName(city) : market.name;
}

export function districtLabel(t: Dictionary, district: string) {
  return t.districts[district] ?? district;
}

export function categoryLabel(t: Dictionary, category: CropCategory) {
  return t.categories[category] ?? category;
}

export function sourceText(t: Dictionary, source: DataSourceInfo) {
  return (
    t.sources[source.id] ?? {
      name: source.name,
      description: source.description,
      updateFrequency: source.updateFrequency,
    }
  );
}
