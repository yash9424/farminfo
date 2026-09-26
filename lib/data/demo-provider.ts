import "server-only";

import { addDays, isISODate, todayISO } from "@/lib/utils";
import type {
  Crop,
  DataSourceInfo,
  Market,
  MarketPrice,
  PricePoint,
} from "@/lib/types";
import {
  CROP_SEEDS,
  MARKET_SEEDS,
  REGION_CROP_POOLS,
  findCropSeed,
  type MarketSeed,
} from "./catalog";
import type { DayPrices, MarketDataProvider } from "./provider";

/**
 * DEMO PROVIDER — generated, not real.
 *
 * Produces plausible-looking, deterministic (seeded) prices so the whole UI can
 * be built and reviewed without an API key. Every surface that shows these
 * numbers must also show a "Demo data" label (see `source.isDemo`).
 */

const HISTORY_DAYS = 7;
const RETAINED_DAYS = 30;

const source: DataSourceInfo = {
  id: "demo",
  kind: "demo",
  isDemo: true,
  name: "FarmInfo demo dataset",
  description:
    "Generated sample prices used for design and development. These are not real market prices.",
  url: "/about#data",
  updateFrequency: "Regenerated daily (sample data)",
};

/* ---------- deterministic randomness ---------- */

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rand01(seed: string): number {
  // one-shot hash → [0, 1)
  return (hash(seed) % 100000) / 100000;
}

function dayNumber(iso: string): number {
  return Math.floor(Date.parse(`${iso}T00:00:00Z`) / 86_400_000);
}

/** Smooth-ish seeded random walk multiplier around 1 */
function walk(key: string, day: number): number {
  const p1 = rand01(`${key}:p1`) * Math.PI * 2;
  const p2 = rand01(`${key}:p2`) * Math.PI * 2;
  const trend = 0.032 * Math.sin(day / 6.1 + p1);
  const wobble = 0.018 * Math.sin(day / 2.3 + p2);
  const noise = (rand01(`${key}:n:${day}`) - 0.5) * 0.024;
  return 1 + trend + wobble + noise;
}

function roundPrice(value: number): number {
  const step = value >= 5000 ? 10 : value >= 1000 ? 5 : 1;
  return Math.round(value / step) * step;
}

/* ---------- catalogue selection ---------- */

function marketCropIds(m: MarketSeed): string[] {
  const pool = REGION_CROP_POOLS[m.region];
  const picked = new Set<string>(m.mustInclude ?? []);
  for (const cropId of pool) {
    if (rand01(`${m.id}:has:${cropId}`) < 0.78) picked.add(cropId);
  }
  // keep every market reasonably populated
  for (const cropId of pool) {
    if (picked.size >= 8) break;
    picked.add(cropId);
  }
  return CROP_SEEDS.map((c) => c.id).filter((id) => picked.has(id));
}

const marketCrops = new Map(MARKET_SEEDS.map((m) => [m.id, marketCropIds(m)]));

/* ---------- row generation ---------- */

function modalOn(base: number, key: string, day: number) {
  return roundPrice(base * walk(key, day));
}

function buildRow(
  market: MarketSeed,
  cropId: string,
  varietyIndex: number,
  date: string,
): MarketPrice | null {
  const crop = findCropSeed(cropId);
  const variety = crop?.varieties[varietyIndex];
  if (!crop || !variety) return null;

  const key = `${market.id}|${cropId}|${variety.name}`;
  const marketOffset = 1 + (rand01(`${market.id}:offset:${cropId}`) - 0.5) * 0.09;
  const base = crop.basePrice * variety.factor * marketOffset;
  const day = dayNumber(date);

  const history: PricePoint[] = [];
  for (let i = HISTORY_DAYS - 1; i >= 0; i--) {
    history.push({ date: addDays(date, -i), modalPrice: modalOn(base, key, day - i) });
  }
  const modalPrice = history[history.length - 1].modalPrice;
  const previous = history[history.length - 2].modalPrice;

  const lowSpread = 0.03 + rand01(`${key}:lo`) * 0.04;
  const highSpread = 0.03 + rand01(`${key}:hi`) * 0.045;
  const changePercent = Math.round(((modalPrice - previous) / previous) * 1000) / 10;

  // Published between 09:40 and 12:00 IST; never in the future for "today"
  const minutes = 9 * 60 + 40 + Math.floor(rand01(`${market.id}:time:${date}`) * 140);
  let updatedAt = `${date}T${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
    minutes % 60,
  ).padStart(2, "0")}:00+05:30`;
  if (Date.parse(updatedAt) > Date.now()) {
    updatedAt = new Date(Date.now() - 15 * 60_000).toISOString();
  }

  return {
    id: `${market.id}_${cropId}_${variety.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}_${date}`,
    cropId,
    marketId: market.id,
    variety: variety.name,
    minPrice: roundPrice(modalPrice * (1 - lowSpread)),
    maxPrice: roundPrice(modalPrice * (1 + highSpread)),
    modalPrice,
    unit: "Quintal",
    date,
    updatedAt,
    changePercent,
    history,
  };
}

function generateDay(date: string): MarketPrice[] {
  const rows: MarketPrice[] = [];
  for (const market of MARKET_SEEDS) {
    for (const cropId of marketCrops.get(market.id) ?? []) {
      const crop = findCropSeed(cropId);
      if (!crop) continue;
      const first = buildRow(market, cropId, 0, date);
      if (first) rows.push(first);
      // some crops list a second variety
      if (crop.varieties.length > 1 && rand01(`${market.id}:v2:${cropId}`) < 0.5) {
        const second = buildRow(market, cropId, 1, date);
        if (second) rows.push(second);
      }
    }
  }
  return rows;
}

/** Yards publish mid-morning: before 10:00 IST the latest day is yesterday. */
function latestPublishedDate(now = new Date()): string {
  const hourIST = Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", hour12: false }).format(now),
  );
  const today = todayISO(now);
  return hourIST < 10 ? addDays(today, -1) : today;
}

/* ---------- provider ---------- */

const markets: Market[] = MARKET_SEEDS.map(({ id, name, city, district, state, region }) => ({
  id,
  name,
  city,
  district,
  state,
  region,
}));

const crops: Crop[] = CROP_SEEDS.map(({ id, name, category, aliases }) => ({
  id,
  name,
  category,
  aliases,
}));

export const demoProvider: MarketDataProvider = {
  source,

  async getMarkets() {
    return markets;
  },

  async getCrops() {
    return crops;
  },

  async getDay(requested?: string): Promise<DayPrices> {
    const latestDate = latestPublishedDate();
    const earliestDate = addDays(latestDate, -(RETAINED_DAYS - 1));
    let date = isISODate(requested) ? requested : latestDate;
    if (date > latestDate) date = latestDate;
    if (date < earliestDate) date = earliestDate;
    return { date, latestDate, earliestDate, prices: generateDay(date) };
  },
};
