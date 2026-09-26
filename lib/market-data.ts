import "server-only";

import { cache } from "react";
import { getProvider } from "@/lib/data";
import type { DayPrices } from "@/lib/data/provider";
import type {
  Crop,
  DatasetStats,
  DataSourceInfo,
  FeaturedPrice,
  Market,
  MarketOverview,
  MarketPrice,
  PriceQuery,
  PriceResult,
} from "@/lib/types";
import { dictionaries } from "@/locales";

/**
 * Public data API for the UI.
 *
 * Components and pages import ONLY from this module; they never know which
 * provider (demo, AGMARKNET, ...) is behind it. Swap providers in `lib/data`.
 */

const loadDay = cache((date: string | undefined): Promise<DayPrices> =>
  getProvider().getDay(date),
);

export function getDataSource(): DataSourceInfo {
  return getProvider().source;
}

export const getMarkets = cache(async (): Promise<Market[]> => {
  const markets = await getProvider().getMarkets();
  return [...markets].sort((a, b) => a.name.localeCompare(b.name));
});

export const getCrops = cache(async (): Promise<Crop[]> => {
  const crops = await getProvider().getCrops();
  return [...crops].sort((a, b) => a.name.localeCompare(b.name));
});

/* ---------- filtering ---------- */

/** Lower-case, strip punctuation; keeps Gujarati letters and vowel signs (\p{M}). */
function normalise(text: string) {
  return text
    .normalize("NFC")
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const gu = dictionaries.gu;

function matchesSearch(
  price: MarketPrice,
  terms: string[],
  crop: Crop | undefined,
  market: Market | undefined,
) {
  const haystack = normalise(
    [
      crop?.name,
      ...(crop?.aliases ?? []),
      crop?.category,
      price.variety,
      market?.name,
      market?.city,
      market?.district,
      // Gujarati names, so "ઘઉં" or "રાજકોટ" search too
      gu.crops[price.cropId],
      gu.cities[price.marketId],
      market && gu.districts[market.district],
      crop && gu.categories[crop.category],
    ]
      .filter(Boolean)
      .join(" "),
  );
  return terms.every((t) => haystack.includes(t));
}

/**
 * Prices for the given filters. Filters combine (AND):
 * `{ marketId: "rajkot", cropId: "wheat" }` → wheat prices at Rajkot.
 */
export async function getMarketPrices(query: PriceQuery = {}): Promise<PriceResult> {
  const [day, markets, crops] = await Promise.all([
    loadDay(query.date),
    getMarkets(),
    getCrops(),
  ]);
  const marketById = new Map(markets.map((m) => [m.id, m]));
  const cropById = new Map(crops.map((c) => [c.id, c]));
  const terms = normalise(query.search ?? "").split(" ").filter(Boolean);

  const prices = day.prices
    .filter((p) => !query.marketId || p.marketId === query.marketId)
    .filter((p) => !query.cropId || p.cropId === query.cropId)
    .filter(
      (p) =>
        terms.length === 0 ||
        matchesSearch(p, terms, cropById.get(p.cropId), marketById.get(p.marketId)),
    )
    .sort((a, b) => {
      const ca = cropById.get(a.cropId)?.name ?? a.cropId;
      const cb = cropById.get(b.cropId)?.name ?? b.cropId;
      return (
        ca.localeCompare(cb) ||
        (marketById.get(a.marketId)?.name ?? "").localeCompare(
          marketById.get(b.marketId)?.name ?? "",
        ) ||
        a.variety.localeCompare(b.variety)
      );
    });

  return {
    prices,
    date: day.date,
    latestDate: day.latestDate,
    earliestDate: day.earliestDate,
    source: getProvider().source,
  };
}

export function getPricesByMarket(marketId: string, date?: string) {
  return getMarketPrices({ marketId, date });
}

export function getPricesByCrop(cropId: string, date?: string) {
  return getMarketPrices({ cropId, date });
}

/* ---------- home-page helpers ---------- */

/**
 * One representative price per requested crop (preferring `preferredMarketId`),
 * used for the hero card, ticker and "Aaj Na Market Bhav" snapshot.
 */
export async function getFeaturedPrices(
  cropIds: string[],
  preferredMarketId = "rajkot",
): Promise<FeaturedPrice[]> {
  const [day, markets, crops] = await Promise.all([loadDay(undefined), getMarkets(), getCrops()]);
  const marketById = new Map(markets.map((m) => [m.id, m]));
  const cropById = new Map(crops.map((c) => [c.id, c]));

  const out: FeaturedPrice[] = [];
  for (const cropId of cropIds) {
    const rows = day.prices.filter((p) => p.cropId === cropId);
    const price = rows.find((p) => p.marketId === preferredMarketId) ?? rows[0];
    const crop = cropById.get(cropId);
    const market = price ? marketById.get(price.marketId) : undefined;
    if (price && crop && market) out.push({ price, crop, market });
  }
  return out;
}

export async function getMarketOverview(): Promise<MarketOverview[]> {
  const [day, markets] = await Promise.all([loadDay(undefined), getMarkets()]);
  const counts = new Map<string, Set<string>>();
  for (const p of day.prices) {
    const set = counts.get(p.marketId) ?? new Set<string>();
    set.add(p.cropId);
    counts.set(p.marketId, set);
  }
  return markets.map((market) => ({ market, cropCount: counts.get(market.id)?.size ?? 0 }));
}

export async function getDatasetStats(): Promise<DatasetStats> {
  const [day, markets, crops] = await Promise.all([loadDay(undefined), getMarkets(), getCrops()]);
  return {
    marketCount: markets.length,
    districtCount: new Set(markets.map((m) => m.district)).size,
    cropCategoryCount: new Set(crops.map((c) => c.category)).size,
    cropCount: crops.length,
    priceEntryCount: day.prices.length,
    latestDate: day.latestDate,
    source: getProvider().source,
  };
}
