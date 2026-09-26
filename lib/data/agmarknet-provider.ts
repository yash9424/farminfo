import "server-only";

import { cache } from "react";

import { AGMARKNET_SOURCE_URL } from "@/lib/site";
import { addDays, isISODate, slugify } from "@/lib/utils";
import type {
  Crop,
  DataSourceInfo,
  Market,
  MarketPrice,
  PricePoint,
} from "@/lib/types";
import { matchCatalogCrop } from "./catalog";
import type { DayPrices, MarketDataProvider } from "./provider";

/**
 * LIVE PROVIDER — Government of India open data (AGMARKNET via data.gov.in).
 *
 * Dataset: "Current Daily Price of Various Commodities from Various Markets (Mandi)".
 * Access requires a free API key (https://www.data.gov.in → My Account). The key
 * is read on the SERVER from `DATA_GOV_IN_API_KEY` and is never sent to the browser.
 *
 * NOTE: this provider is built against the published record schema
 * (state, district, market, commodity, variety, grade, arrival_date, min_price,
 * max_price, modal_price). Field names are matched case-insensitively so the
 * "Variety-wise Daily Market Prices" resource (capitalised fields) also works.
 */

export interface AgmarknetConfig {
  apiKey: string;
  baseUrl?: string;
  resourceId?: string;
  /** Filter key used to restrict rows to Gujarat. `state.keyword` for the default resource. */
  stateFilterKey?: string;
  /** Seconds the upstream response is cached by Next.js */
  revalidateSeconds?: number;
}

const DEFAULT_BASE_URL = "https://api.data.gov.in";
const DEFAULT_RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const PAGE_SIZE = 500;
const MAX_PAGES = 8;
const HISTORY_DAYS = 7;

const source: DataSourceInfo = {
  id: "agmarknet",
  kind: "live",
  isDemo: false,
  name: "AGMARKNET via data.gov.in (Government of India)",
  description:
    "Daily mandi (market yard) arrival prices published by the Directorate of Marketing & Inspection and served through the Open Government Data (OGD) Platform India.",
  url: AGMARKNET_SOURCE_URL,
  updateFrequency: "Daily, as published by each market",
};

type RawRecord = Record<string, string | number | null | undefined>;

interface NormalisedRecord {
  district: string;
  market: string;
  commodity: string;
  variety: string;
  date: string; // ISO
  min: number;
  max: number;
  modal: number;
}

/** "26/09/2026" or "2026-09-26" → "2026-09-26" */
function parseArrivalDate(value: string): string | null {
  const dmy = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(value.trim());
  if (dmy) {
    const iso = `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
    return isISODate(iso) ? iso : null;
  }
  return isISODate(value.trim()) ? value.trim() : null;
}

function normalise(raw: RawRecord): NormalisedRecord | null {
  const lower: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    lower[k.toLowerCase()] = v == null ? "" : String(v);
  }
  const date = parseArrivalDate(lower.arrival_date ?? "");
  const min = Number(lower.min_price);
  const max = Number(lower.max_price);
  const modal = Number(lower.modal_price);
  if (!date || !lower.market || !lower.commodity) return null;
  if (![min, max, modal].every((n) => Number.isFinite(n) && n > 0)) return null;
  return {
    district: lower.district || "—",
    market: lower.market.trim(),
    commodity: lower.commodity.trim(),
    variety: lower.variety?.trim() || "Other",
    date,
    min,
    max,
    modal,
  };
}

function marketFrom(record: NormalisedRecord): Market {
  const city = record.market.replace(/\(.*?\)/g, "").trim() || record.market;
  return {
    id: slugify(record.market),
    name: record.market,
    city,
    district: record.district,
    state: "Gujarat",
  };
}

function cropFrom(commodity: string): Crop {
  const known = matchCatalogCrop(commodity);
  if (known) {
    return { id: known.id, name: known.name, category: known.category, aliases: known.aliases };
  }
  return {
    id: slugify(commodity),
    name: commodity.replace(/\s*\(.*?\)\s*/g, " ").trim() || commodity,
    category: "Other",
    aliases: [commodity.toLowerCase()],
  };
}

export function createAgmarknetProvider(config: AgmarknetConfig): MarketDataProvider {
  const baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
  const resourceId = config.resourceId ?? DEFAULT_RESOURCE_ID;
  const stateFilterKey = config.stateFilterKey ?? "state.keyword";
  const revalidate = config.revalidateSeconds ?? 3600;

  async function fetchPage(offset: number): Promise<{ records: RawRecord[]; total: number }> {
    const url = new URL(`${baseUrl}/resource/${resourceId}`);
    url.searchParams.set("api-key", config.apiKey);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", String(PAGE_SIZE));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set(`filters[${stateFilterKey}]`, "Gujarat");

    const res = await fetch(url, { next: { revalidate } });
    let body: { records?: RawRecord[]; total?: number | string; error?: string; message?: string } = {};
    try {
      body = await res.json();
    } catch {
      /* non-JSON error body */
    }
    if (!res.ok || body.error) {
      // Never echo the request URL (contains the key)
      throw new Error(
        `Market data source responded with ${res.status}${
          body.error || body.message ? `: ${body.error ?? body.message}` : ""
        }`,
      );
    }
    return { records: body.records ?? [], total: Number(body.total ?? 0) };
  }

  /** All Gujarat rows the API currently serves (paged), normalised. */
  const loadRecords = cache(async (): Promise<NormalisedRecord[]> => {
    const out: NormalisedRecord[] = [];
    let offset = 0;
    for (let page = 0; page < MAX_PAGES; page++) {
      const { records, total } = await fetchPage(offset);
      for (const raw of records) {
        const n = normalise(raw);
        if (n) out.push(n);
      }
      offset += PAGE_SIZE;
      if (records.length < PAGE_SIZE || (total > 0 && offset >= total)) break;
    }
    return out;
  });

  return {
    source,

    async getMarkets() {
      const seen = new Map<string, Market>();
      for (const r of await loadRecords()) {
        const m = marketFrom(r);
        if (!seen.has(m.id)) seen.set(m.id, m);
      }
      return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
    },

    async getCrops() {
      const seen = new Map<string, Crop>();
      for (const r of await loadRecords()) {
        const c = cropFrom(r.commodity);
        if (!seen.has(c.id)) seen.set(c.id, c);
      }
      return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
    },

    async getDay(requested?: string): Promise<DayPrices> {
      const records = await loadRecords();
      if (records.length === 0) {
        throw new Error("Market data source returned no Gujarat records");
      }
      const dates = [...new Set(records.map((r) => r.date))].sort();
      const latestDate = dates[dates.length - 1];
      const earliestDate = dates[0];
      const date = requested && dates.includes(requested) ? requested : latestDate;

      // Series per market|commodity|variety across the dates the API returned
      const series = new Map<string, PricePoint[]>();
      for (const r of records) {
        const key = `${slugify(r.market)}|${r.commodity}|${r.variety}`;
        const list = series.get(key) ?? [];
        list.push({ date: r.date, modalPrice: r.modal });
        series.set(key, list);
      }

      const prices: MarketPrice[] = [];
      for (const r of records) {
        if (r.date !== date) continue;
        const market = marketFrom(r);
        const crop = cropFrom(r.commodity);
        const key = `${market.id}|${r.commodity}|${r.variety}`;
        const windowStart = addDays(date, -(HISTORY_DAYS - 1));
        const history = (series.get(key) ?? [])
          .filter((p) => p.date >= windowStart && p.date <= date)
          .sort((a, b) => a.date.localeCompare(b.date));
        const prev = history.length > 1 ? history[history.length - 2].modalPrice : null;

        prices.push({
          id: `${market.id}_${crop.id}_${slugify(r.variety)}_${date}`,
          cropId: crop.id,
          marketId: market.id,
          variety: r.variety,
          minPrice: r.min,
          maxPrice: r.max,
          modalPrice: r.modal,
          unit: "Quintal",
          date,
          updatedAt: null, // the dataset publishes arrival dates, not timestamps
          changePercent: prev ? Math.round(((r.modal - prev) / prev) * 1000) / 10 : null,
          history,
        });
      }

      // Duplicate ids can occur when a market lists several grades of one variety
      const unique = new Map<string, MarketPrice>();
      for (const p of prices) if (!unique.has(p.id)) unique.set(p.id, p);

      return { date, latestDate, earliestDate, prices: [...unique.values()] };
    },
  };
}
