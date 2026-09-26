/**
 * Domain types shared by the UI and the data layer.
 * These types are provider-agnostic: any market-data source (demo, AGMARKNET,
 * a future first-party API) must map its records into these shapes.
 */

export type CropCategory =
  | "Cereals"
  | "Pulses"
  | "Oilseeds"
  | "Spices"
  | "Fibre"
  | "Vegetables"
  | "Other";

export type GujaratRegion =
  | "Saurashtra"
  | "North Gujarat"
  | "Kutch"
  | "Central Gujarat"
  | "South Gujarat";

export interface Market {
  id: string;
  /** Display name, e.g. "Rajkot APMC" */
  name: string;
  city: string;
  district: string;
  state: string;
  region?: GujaratRegion;
}

export interface Crop {
  id: string;
  name: string;
  category: CropCategory;
  /** Alternate names used for search and API record matching */
  aliases: string[];
}

export interface PricePoint {
  /** ISO date, YYYY-MM-DD */
  date: string;
  modalPrice: number;
}

export interface MarketPrice {
  id: string;
  cropId: string;
  marketId: string;
  variety: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  /** Prices are quoted per quintal (100 kg) */
  unit: "Quintal";
  /** ISO date the price applies to, YYYY-MM-DD */
  date: string;
  /** ISO datetime the entry was published, or null when the source only gives a date */
  updatedAt: string | null;
  /** Day-on-day change of the modal price, or null when there is no previous day */
  changePercent: number | null;
  /** Up to 7 daily modal prices ending on `date`, oldest first */
  history: PricePoint[];
}

export type DataSourceKind = "demo" | "live";

export interface DataSourceInfo {
  id: "demo" | "agmarknet";
  kind: DataSourceKind;
  isDemo: boolean;
  name: string;
  /** Human readable description of where the numbers come from */
  description: string;
  url: string;
  updateFrequency: string;
}

export interface PriceQuery {
  marketId?: string;
  cropId?: string;
  /** ISO date, YYYY-MM-DD. Defaults to the latest available date. */
  date?: string;
  /** Free text: matches crop, variety, market, district */
  search?: string;
}

export interface PriceResult {
  prices: MarketPrice[];
  /** The date that was resolved for this result */
  date: string;
  latestDate: string;
  earliestDate: string;
  source: DataSourceInfo;
}

export interface MarketOverview {
  market: Market;
  cropCount: number;
}

export interface DatasetStats {
  marketCount: number;
  districtCount: number;
  cropCategoryCount: number;
  cropCount: number;
  priceEntryCount: number;
  latestDate: string;
  source: DataSourceInfo;
}

export interface FeaturedPrice {
  price: MarketPrice;
  crop: Crop;
  market: Market;
}
