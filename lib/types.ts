/**
 * MachInfo domain model — a marketplace for CNC & VMC machine PARTS. Provider-agnostic: a REST/GraphQL/Supabase/Postgres
 * backend only needs to map its records into these shapes (see lib/data/provider.ts).
 */

/* ---------- catalogue ---------- */

export interface Category {
  id: string;
  slug: string;
  name: string;
  /** Short label for chips/nav, e.g. "Servo Motors" */
  shortName: string;
  description: string;
  /** Top-level categories have no parent; subcategories point at one */
  parentId: string | null;
  image?: string;
  /** Spec keys shown first on cards for this category */
  keySpecs: string[];
  /** Extra words that should match search (e.g. "servo amplifier") */
  keywords: string[];
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  country?: string;
}

/* ---------- locations: Country → State → District → City ---------- */

export interface Country {
  code: string; // "IN"
  slug: string; // "india"
  name: string;
}

export interface State {
  slug: string;
  name: string;
  countryCode: string;
  kind: "state" | "union-territory";
  /** Short display note, e.g. "Machine-tool & auto-component hubs" */
  tagline?: string;
}

export interface District {
  slug: string;
  name: string;
  stateSlug: string;
}

export interface City {
  slug: string;
  name: string;
  districtSlug: string;
  stateSlug: string;
  /** Marked for "Popular manufacturing hubs" */
  isHub?: boolean;
}

export interface LocationRef {
  country: string; // slug
  state: string; // slug
  district: string; // slug
  city: string; // slug
}

/** Location with resolved display names */
export interface ResolvedLocation {
  country: Country;
  state: State;
  district: District;
  city: City;
}

/* ---------- sellers ---------- */

export interface Seller {
  id: string;
  slug: string;
  name: string;
  type: "dealer" | "manufacturer" | "owner";
  location: LocationRef;
  verified: boolean;
  /** ISO date the seller joined */
  memberSince: string;
  isDemo?: boolean;
}

/* ---------- parts ---------- */

export type PartCondition = "new" | "used" | "refurbished";
export type PriceType = "fixed" | "negotiable" | "on_request";
export type Availability = "in_stock" | "sold";

/** What a part fits. All fields optional — sellers fill what they know. */
export interface Compatibility {
  /** Machine makers or families, e.g. "Most Taiwanese 850-size VMCs" */
  machineBrands?: string[];
  /** Machine models, e.g. "VMC 850", "VMC 1000" */
  machineModels?: string[];
  /** CNC controls, e.g. "FANUC 0i-MF", "Siemens 828D" */
  cncControls?: string[];
}

/** A CNC/VMC part, spare, component, accessory or replacement item. Never a complete machine. */
export interface Part {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  subcategoryId?: string;
  brandId?: string;
  model?: string;
  partNumber?: string;
  condition: PartCondition;
  /** Omitted when priceType is "on_request" */
  price?: number;
  priceType: PriceType;
  currency: "INR";
  /** Units available (1 for most used spares) */
  quantity: number;
  availability: Availability;
  images: string[];
  description: string;
  /** Ordered label → value; different fields per part type */
  specifications: Record<string, string>;
  compatibility?: Compatibility;
  location: LocationRef;
  sellerId: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  /** Generated sample listing — never presented as a real offer */
  isDemo: boolean;
}

/** Part with its references resolved for display */
export interface PartView extends Part {
  category: Category;
  subcategory?: Category;
  brand?: Brand;
  seller: Seller;
  place: ResolvedLocation;
}

/* ---------- querying ---------- */

export type SortKey = "newest" | "price_asc" | "price_desc" | "updated" | "featured";

export interface PartQuery {
  q?: string;
  /** Category or subcategory slug */
  category?: string;
  state?: string;
  district?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  /** Include listings without a public price when a price range is set */
  includeOnRequest?: boolean;
  condition?: PartCondition[];
  brand?: string[];
  availability?: Availability;
  sort?: SortKey;
  page?: number;
  pageSize?: number;
}

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface PartFacets {
  categories: FacetOption[];
  /** Subcategories of the selected category group (empty when none is selected) */
  subcategories: FacetOption[];
  brands: FacetOption[];
  conditions: FacetOption[];
  availability: FacetOption[];
  states: FacetOption[];
  /** Districts of the selected state; cities of the selected district */
  districts: FacetOption[];
  cities: FacetOption[];
  price: { min: number; max: number } | null;
  onRequestCount: number;
}

export interface PartResult {
  items: PartView[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  facets: PartFacets;
}

export interface DataSourceInfo {
  id: string;
  name: string;
  isDemo: boolean;
}

/* ---------- enquiries ---------- */

export interface EnquiryInput {
  partId: string;
  sellerId: string;
  name: string;
  phone: string;
  email: string;
  message: string;
}

export interface EnquiryResult {
  ok: boolean;
  reference?: string;
  error?: string;
  isDemo?: boolean;
}
