import type { Crop, DataSourceInfo, Market, MarketPrice } from "@/lib/types";

/** All unfiltered price rows for one date, plus the range the source can serve. */
export interface DayPrices {
  date: string;
  latestDate: string;
  earliestDate: string;
  prices: MarketPrice[];
}

/**
 * The single seam between the UI and any market-price source.
 *
 * To plug in a new source (a first-party API, a different open-data feed, ...)
 * implement this interface and register it in `lib/data/index.ts`.
 * Filtering, sorting and shaping for the UI happen in `lib/market-data.ts`,
 * so providers only need to return normalised rows.
 */
export interface MarketDataProvider {
  readonly source: DataSourceInfo;
  getMarkets(): Promise<Market[]>;
  getCrops(): Promise<Crop[]>;
  /** Rows for `date`, or for the latest available date when omitted / unavailable */
  getDay(date?: string): Promise<DayPrices>;
}
