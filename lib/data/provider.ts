import type {
  Brand,
  Category,
  City,
  Country,
  DataSourceInfo,
  District,
  EnquiryInput,
  EnquiryResult,
  Part,
  Seller,
  State,
} from "@/lib/types";

/**
 * The single seam between MachInfo's UI and any data backend.
 *
 * To connect a real backend (REST, GraphQL, Supabase, MongoDB, Postgres, …)
 * implement this interface and register it in `lib/data/index.ts`. Nothing in
 * `app/` or `components/` needs to change.
 *
 * `lib/parts.ts` currently filters, sorts, facets and paginates
 * `listParts()` in memory — fine for demo-sized data. For a large catalogue,
 * add a `queryParts(query: PartQuery)` method here and delegate to it from
 * `getParts()` so filtering and pagination happen in the database.
 */
export interface PartsDataProvider {
  readonly source: DataSourceInfo;

  // catalogue
  listCategories(): Promise<Category[]>;
  listBrands(): Promise<Brand[]>;
  listSellers(): Promise<Seller[]>;

  // locations
  getCountry(): Promise<Country>;
  listStates(): Promise<State[]>;
  listDistricts(stateSlug?: string): Promise<District[]>;
  listCities(stateSlug?: string, districtSlug?: string): Promise<City[]>;

  // listings
  listParts(): Promise<Part[]>;
  getPartBySlug(slug: string): Promise<Part | null>;

  // leads
  submitEnquiry(input: EnquiryInput): Promise<EnquiryResult>;
}
