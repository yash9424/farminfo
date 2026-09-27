import "server-only";

import { cache } from "react";
import { HOME_CATEGORIES } from "@/lib/data/catalog/categories";
import { FEATURED_STATE_SLUGS, HUB_CITIES } from "@/lib/data/catalog/locations";
import { getProvider } from "@/lib/data";
import { coverFor } from "@/lib/data/demo/images";
import type {
  Brand,
  Category,
  City,
  DataSourceInfo,
  District,
  EnquiryInput,
  EnquiryResult,
  FacetOption,
  Part,
  PartFacets,
  PartQuery,
  PartResult,
  PartView,
  ResolvedLocation,
  Seller,
  SortKey,
  State,
} from "@/lib/types";

/**
 * Public data API for MachInfo (CNC & VMC parts). Pages and components import
 * ONLY from here — never from lib/data directly — so the backend can change freely.
 */

export const DEFAULT_PAGE_SIZE = 12;

/* ------------------------------------------------------------------ */
/* Reference data                                                      */
/* ------------------------------------------------------------------ */

export function getDataSource(): DataSourceInfo {
  return getProvider().source;
}

export const getCategories = cache(async (): Promise<Category[]> => getProvider().listCategories());
export const getBrands = cache(async (): Promise<Brand[]> => {
  const brands = await getProvider().listBrands();
  return [...brands].sort((a, b) => a.name.localeCompare(b.name));
});
export const getSellers = cache(async (): Promise<Seller[]> => getProvider().listSellers());
export const getCountry = cache(async () => getProvider().getCountry());
export const getStates = cache(async (): Promise<State[]> => {
  const states = await getProvider().listStates();
  return [...states].sort((a, b) => a.name.localeCompare(b.name));
});
export const getDistricts = cache(async (stateSlug?: string): Promise<District[]> => {
  const list = await getProvider().listDistricts(stateSlug);
  return [...list].sort((a, b) => a.name.localeCompare(b.name));
});
export const getCities = cache(async (stateSlug?: string, districtSlug?: string): Promise<City[]> => {
  const list = await getProvider().listCities(stateSlug, districtSlug);
  return [...list].sort((a, b) => a.name.localeCompare(b.name));
});

/** Cover photo for a category card (a backend would store a URL on the category). */
export function coverImage(pool: string | undefined, index = 0) {
  return coverFor(pool, index);
}

export async function getTopCategories() {
  return (await getCategories()).filter((c) => c.parentId === null);
}
export async function getSubcategories(parentId: string) {
  return (await getCategories()).filter((c) => c.parentId === parentId);
}
export async function getCategoryBySlug(slug: string) {
  return (await getCategories()).find((c) => c.slug === slug) ?? null;
}
export async function getState(slug: string) {
  return (await getStates()).find((s) => s.slug === slug) ?? null;
}
export async function getDistrict(stateSlug: string, districtSlug: string) {
  return (await getDistricts(stateSlug)).find((d) => d.slug === districtSlug) ?? null;
}
export async function getCity(stateSlug: string, districtSlug: string, citySlug: string) {
  return (await getCities(stateSlug, districtSlug)).find((c) => c.slug === citySlug) ?? null;
}

/* ------------------------------------------------------------------ */
/* Resolution                                                          */
/* ------------------------------------------------------------------ */

const getIndex = cache(async () => {
  const provider = getProvider();
  const [categories, brands, sellers, country, states, districts, cities] = await Promise.all([
    provider.listCategories(),
    provider.listBrands(),
    provider.listSellers(),
    provider.getCountry(),
    provider.listStates(),
    provider.listDistricts(),
    provider.listCities(),
  ]);
  return {
    category: new Map(categories.map((c) => [c.id, c])),
    categoryBySlug: new Map(categories.map((c) => [c.slug, c])),
    brand: new Map(brands.map((b) => [b.id, b])),
    seller: new Map(sellers.map((s) => [s.id, s])),
    country,
    state: new Map(states.map((s) => [s.slug, s])),
    district: new Map(districts.map((d) => [`${d.stateSlug}/${d.slug}`, d])),
    city: new Map(cities.map((c) => [`${c.stateSlug}/${c.districtSlug}/${c.slug}`, c])),
  };
});

type Index = Awaited<ReturnType<typeof getIndex>>;

function resolvePlace(ix: Index, loc: Part["location"]): ResolvedLocation {
  const state = ix.state.get(loc.state) ?? { slug: loc.state, name: loc.state, countryCode: "IN", kind: "state" as const };
  const district = ix.district.get(`${loc.state}/${loc.district}`) ?? { slug: loc.district, name: loc.district, stateSlug: loc.state };
  const city =
    ix.city.get(`${loc.state}/${loc.district}/${loc.city}`) ??
    { slug: loc.city, name: loc.city, districtSlug: loc.district, stateSlug: loc.state };
  return { country: ix.country, state, district, city };
}

function toView(ix: Index, m: Part): PartView | null {
  const category = ix.category.get(m.categoryId);
  const seller = ix.seller.get(m.sellerId);
  if (!category || !seller) return null;
  return {
    ...m,
    category,
    subcategory: m.subcategoryId ? ix.category.get(m.subcategoryId) : undefined,
    brand: m.brandId ? ix.brand.get(m.brandId) : undefined,
    seller,
    place: resolvePlace(ix, m.location),
  };
}

const getAllViews = cache(async (): Promise<PartView[]> => {
  const [parts, ix] = await Promise.all([getProvider().listParts(), getIndex()]);
  return parts.map((m) => toView(ix, m)).filter((m): m is PartView => m !== null);
});

/* ------------------------------------------------------------------ */
/* In-memory query engine                                               */
/* ------------------------------------------------------------------ */

function normalise(text: string) {
  return text.toLowerCase().replace(/[^\p{L}\p{N}\s.]/gu, " ").replace(/\s+/g, " ").trim();
}

function haystack(m: PartView) {
  return normalise(
    [
      m.title,
      m.brand?.name,
      m.model,
      m.partNumber,
      m.category.name,
      // group-level keywords (e.g. "servo", "motor") are too broad for part search;
      // the part's own type name + keywords are specific
      ...(m.subcategory ? [] : m.category.keywords),
      m.subcategory?.name,
      ...(m.subcategory?.keywords ?? []),
      m.place.city.name,
      m.place.district.name,
      m.place.state.name,
      m.seller.name,
      m.condition,
      ...Object.values(m.specifications),
      ...(m.compatibility?.cncControls ?? []),
      ...(m.compatibility?.machineModels ?? []),
      ...(m.compatibility?.machineBrands ?? []),
    ]
      .filter(Boolean)
      .join(" "),
  );
}

type Dim = "q" | "category" | "location" | "price" | "condition" | "brand" | "availability";

function matches(m: PartView, q: PartQuery, skip?: Dim): boolean {
  if (skip !== "q" && q.q) {
    const text = haystack(m);
    const terms = normalise(q.q).split(" ").filter(Boolean);
    if (!terms.every((t) => text.includes(t))) return false;
  }
  if (skip !== "category" && q.category) {
    if (m.category.slug !== q.category && m.subcategory?.slug !== q.category) return false;
  }
  if (skip !== "location") {
    if (q.state && m.location.state !== q.state) return false;
    if (q.district && m.location.district !== q.district) return false;
    if (q.city && m.location.city !== q.city) return false;
  }
  if (skip !== "price" && (q.minPrice !== undefined || q.maxPrice !== undefined)) {
    if (m.price === undefined) {
      if (!q.includeOnRequest) return false;
    } else {
      if (q.minPrice !== undefined && m.price < q.minPrice) return false;
      if (q.maxPrice !== undefined && m.price > q.maxPrice) return false;
    }
  }
  if (skip !== "condition" && q.condition?.length && !q.condition.includes(m.condition)) return false;
  if (skip !== "brand" && q.brand?.length && !(m.brand && q.brand.includes(m.brand.slug))) return false;
  if (skip !== "availability" && q.availability && m.availability !== q.availability) return false;
  return true;
}

function sortViews(list: PartView[], sort: SortKey = "newest") {
  const byDate = (k: "createdAt" | "updatedAt") => (a: PartView, b: PartView) => b[k].localeCompare(a[k]);
  const priceOf = (m: PartView) => m.price ?? null;
  const sorted = [...list];
  switch (sort) {
    case "price_asc":
    case "price_desc": {
      const dir = sort === "price_asc" ? 1 : -1;
      sorted.sort((a, b) => {
        const pa = priceOf(a);
        const pb = priceOf(b);
        if (pa === null && pb === null) return byDate("createdAt")(a, b);
        if (pa === null) return 1; // price on request last
        if (pb === null) return -1;
        return (pa - pb) * dir;
      });
      break;
    }
    case "updated":
      sorted.sort(byDate("updatedAt"));
      break;
    case "featured":
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || byDate("createdAt")(a, b));
      break;
    default:
      sorted.sort(byDate("createdAt"));
  }
  // sold listings stay visible but sink below available ones
  return sorted.sort((a, b) => Number(a.availability === "sold") - Number(b.availability === "sold"));
}

/** Stable re-order: all terms in the title > in the part type > elsewhere (specs, compatibility…). */
function rankByRelevance(list: PartView[], q: string) {
  const terms = normalise(q).split(" ").filter(Boolean);
  const score = (m: PartView) => {
    const title = normalise(`${m.title} ${m.partNumber ?? ""} ${m.brand?.name ?? ""}`);
    const type = normalise(`${m.subcategory?.name ?? ""} ${(m.subcategory?.keywords ?? []).join(" ")} ${m.category.name}`);
    if (terms.every((t) => title.includes(t))) return 2;
    if (terms.every((t) => type.includes(t) || title.includes(t))) return 1;
    return 0;
  };
  return list
    .map((m, i) => ({ m, i, s: score(m) }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map((x) => x.m);
}

function count<T>(items: T[], key: (i: T) => string | undefined) {
  const map = new Map<string, number>();
  for (const i of items) {
    const k = key(i);
    if (k) map.set(k, (map.get(k) ?? 0) + 1);
  }
  return map;
}

const CONDITION_LABEL = { new: "New", used: "Used", refurbished: "Refurbished" } as const;

async function buildFacets(all: PartView[], q: PartQuery): Promise<PartFacets> {
  const ix = await getIndex();
  const scope = (d: Dim) => all.filter((m) => matches(m, q, d));

  const catScope = scope("category");
  const cats = count(catScope, (m) => m.category.id);
  // subcategory counts within the selected group (the group comes from the sub if only a sub is set)
  const selected = q.category ? ix.categoryBySlug.get(q.category) : undefined;
  const groupId = selected ? (selected.parentId ?? selected.id) : undefined;
  const subCounts = groupId
    ? count(catScope.filter((m) => m.category.id === groupId), (m) => m.subcategory?.id)
    : new Map<string, number>();
  const subcategories: FacetOption[] = [...subCounts]
    .map(([id, n]) => ({ value: ix.category.get(id)!.slug, label: ix.category.get(id)!.name, count: n }))
    .sort((a, b) => a.label.localeCompare(b.label));
  const categories: FacetOption[] = [...cats]
    .map(([id, n]) => ({ value: ix.category.get(id)!.slug, label: ix.category.get(id)!.name, count: n }))
    .sort((a, b) => b.count - a.count);

  const brandCounts = count(scope("brand"), (m) => m.brand?.slug);
  const brands: FacetOption[] = [...brandCounts]
    .map(([slug, n]) => ({ value: slug, label: [...ix.brand.values()].find((b) => b.slug === slug)?.name ?? slug, count: n }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const condCounts = count(scope("condition"), (m) => m.condition);
  const conditions: FacetOption[] = (["new", "used", "refurbished"] as const)
    .filter((c) => condCounts.has(c))
    .map((c) => ({ value: c, label: CONDITION_LABEL[c], count: condCounts.get(c)! }));

  const availCounts = count(scope("availability"), (m) => m.availability);
  const availability: FacetOption[] = (["in_stock", "sold"] as const)
    .filter((a) => availCounts.has(a))
    .map((a) => ({ value: a, label: a === "in_stock" ? "In stock" : "Sold", count: availCounts.get(a)! }));

  const locScope = scope("location");
  const stateCounts = count(locScope, (m) => m.location.state);
  const districts: FacetOption[] = q.state
    ? [...count(locScope.filter((m) => m.location.state === q.state), (m) => m.location.district)]
        .map(([slug, n]) => ({ value: slug, label: ix.district.get(`${q.state}/${slug}`)?.name ?? slug, count: n }))
        .sort((a, b) => a.label.localeCompare(b.label))
    : [];
  const cities: FacetOption[] =
    q.state && q.district
      ? [...count(locScope.filter((m) => m.location.state === q.state && m.location.district === q.district), (m) => m.location.city)]
          .map(([slug, n]) => ({ value: slug, label: ix.city.get(`${q.state}/${q.district}/${slug}`)?.name ?? slug, count: n }))
          .sort((a, b) => a.label.localeCompare(b.label))
      : [];
  const states: FacetOption[] = [...stateCounts]
    .map(([slug, n]) => ({ value: slug, label: ix.state.get(slug)?.name ?? slug, count: n }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const priced = scope("price").map((m) => m.price).filter((p): p is number => p !== undefined);

  return {
    categories,
    subcategories,
    brands,
    conditions,
    availability,
    states,
    districts,
    cities,
    price: priced.length ? { min: Math.min(...priced), max: Math.max(...priced) } : null,
    onRequestCount: scope("price").filter((m) => m.price === undefined).length,
  };
}

/* ------------------------------------------------------------------ */
/* Listings                                                            */
/* ------------------------------------------------------------------ */

/** Filtered, sorted, paginated listings with facet counts for the filter UI. */
export async function getParts(query: PartQuery = {}): Promise<PartResult> {
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
  const all = await getAllViews();
  let filtered = sortViews(
    all.filter((m) => matches(m, query)),
    query.sort,
  );
  // With a keyword and the default sort, show the most relevant parts first
  if (query.q && (!query.sort || query.sort === "newest")) filtered = rankByRelevance(filtered, query.q);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(Math.max(1, query.page ?? 1), pageCount);
  return {
    items: filtered.slice((page - 1) * pageSize, page * pageSize),
    total: filtered.length,
    page,
    pageSize,
    pageCount,
    facets: await buildFacets(all, query),
  };
}

export async function getPartBySlug(slug: string): Promise<PartView | null> {
  const [part, ix] = await Promise.all([getProvider().getPartBySlug(slug), getIndex()]);
  return part ? toView(ix, part) : null;
}

export async function getFeaturedParts(limit = 8): Promise<PartView[]> {
  const all = await getAllViews();
  const featured = sortViews(all.filter((m) => m.featured && m.availability === "in_stock"), "newest");
  return featured.slice(0, limit);
}

export function getPartsByCategory(slug: string, query: PartQuery = {}) {
  return getParts({ ...query, category: slug });
}

export function getPartsByLocation(
  location: { state?: string; district?: string; city?: string },
  query: PartQuery = {},
) {
  return getParts({ ...query, ...location });
}

export interface SearchSuggestion {
  type: "part" | "category" | "location";
  label: string;
  hint: string;
  href: string;
}

/** Quick suggestions for the global search box. */
export async function searchParts(q: string, limit = 6): Promise<SearchSuggestion[]> {
  const term = normalise(q);
  if (!term) return [];
  const [all, categories, states] = await Promise.all([getAllViews(), getCategories(), getStates()]);
  const out: SearchSuggestion[] = [];

  for (const c of categories) {
    const words = normalise([c.name, c.shortName, ...c.keywords].join(" "));
    if (words.includes(term)) {
      out.push({ type: "category", label: c.name, hint: "Category", href: `/categories/${c.slug}` });
    }
  }
  const cities = await getCities();
  for (const city of cities) {
    if (normalise(city.name).startsWith(term)) {
      const state = states.find((s) => s.slug === city.stateSlug);
      out.push({
        type: "location",
        label: `Parts in ${city.name}`,
        hint: state?.name ?? "",
        href: `/locations/${city.stateSlug}/${city.districtSlug}/${city.slug}`,
      });
    }
  }
  const terms = term.split(" ");
  for (const m of sortViews(all, "featured")) {
    const text = haystack(m);
    if (terms.every((t) => text.includes(t))) {
      out.push({
        type: "part",
        label: m.title,
        hint: `${m.place.city.name}, ${m.place.state.name}`,
        href: `/parts/${m.slug}`,
      });
    }
  }
  const byType = (t: SearchSuggestion["type"], n: number) => out.filter((s) => s.type === t).slice(0, n);
  return [...byType("category", 2), ...byType("location", 2), ...byType("part", limit)];
}

/** Similar listings: same subcategory/category first, then same state. */
export async function getRelatedParts(part: PartView, limit = 4): Promise<PartView[]> {
  const all = (await getAllViews()).filter((m) => m.id !== part.id && m.availability === "in_stock");
  const score = (m: PartView) =>
    (part.subcategoryId && m.subcategoryId === part.subcategoryId ? 4 : 0) +
    (m.categoryId === part.categoryId ? 3 : 0) +
    (m.location.state === part.location.state ? 1 : 0) +
    (m.location.city === part.location.city ? 1 : 0);
  return [...all]
    .sort((a, b) => score(b) - score(a) || b.createdAt.localeCompare(a.createdAt))
    .filter((m) => score(m) > 0)
    .slice(0, limit);
}

export async function getSellerListingCount(sellerId: string) {
  return (await getAllViews()).filter((m) => m.sellerId === sellerId).length;
}

/* ------------------------------------------------------------------ */
/* Home / discovery helpers                                            */
/* ------------------------------------------------------------------ */

export async function getCategoryCounts(): Promise<Map<string, number>> {
  const all = await getAllViews();
  const map = new Map<string, number>();
  for (const m of all) {
    map.set(m.category.slug, (map.get(m.category.slug) ?? 0) + 1);
    if (m.subcategory) map.set(m.subcategory.slug, (map.get(m.subcategory.slug) ?? 0) + 1);
  }
  return map;
}

export async function getHomeCategories() {
  const [categories, counts] = await Promise.all([getCategories(), getCategoryCounts()]);
  return HOME_CATEGORIES.flatMap((card) => {
    const category = categories.find((c) => c.slug === card.slug);
    return category ? [{ ...card, category, count: counts.get(category.slug) ?? 0 }] : [];
  });
}

export interface StateSummary {
  state: State;
  count: number;
  topCities: { city: City; count: number }[];
  hubCities: City[];
}

export async function getStateSummaries(slugs?: string[]): Promise<StateSummary[]> {
  const [all, states, cities] = await Promise.all([getAllViews(), getStates(), getCities()]);
  const pickStates = slugs
    ? slugs.map((s) => states.find((x) => x.slug === s)).filter((s): s is State => !!s)
    : states;
  return pickStates.map((state) => {
    const inState = all.filter((m) => m.location.state === state.slug);
    const cityCounts = count(inState, (m) => `${m.location.district}/${m.location.city}`);
    const stateCities = cities.filter((c) => c.stateSlug === state.slug);
    const topCities = stateCities
      .map((city) => ({ city, count: cityCounts.get(`${city.districtSlug}/${city.slug}`) ?? 0 }))
      .sort((a, b) => b.count - a.count || Number(!!b.city.isHub) - Number(!!a.city.isHub));
    return {
      state,
      count: inState.length,
      topCities,
      hubCities: stateCities.filter((c) => c.isHub),
    };
  });
}

export async function getFeaturedStates(): Promise<State[]> {
  const states = await getStates();
  return FEATURED_STATE_SLUGS.map((slug) => states.find((s) => s.slug === slug)).filter((s): s is State => !!s);
}

export function getFeaturedStateSummaries() {
  return getStateSummaries(FEATURED_STATE_SLUGS);
}

export interface CitySummary {
  city: City;
  state: State;
  district: District;
  count: number;
  categories: string[];
}

async function summariseCity(stateSlug: string, districtSlug: string, citySlug: string): Promise<CitySummary | null> {
  const [all, state, district, city] = await Promise.all([
    getAllViews(),
    getState(stateSlug),
    getDistrict(stateSlug, districtSlug),
    getCity(stateSlug, districtSlug, citySlug),
  ]);
  if (!state || !district || !city) return null;
  const here = all.filter(
    (m) => m.location.state === stateSlug && m.location.district === districtSlug && m.location.city === citySlug,
  );
  const cats = [...count(here, (m) => m.category.shortName)].sort((a, b) => b[1] - a[1]).map(([name]) => name);
  return { city, state, district, count: here.length, categories: cats };
}

export async function getHubCitySummaries(): Promise<CitySummary[]> {
  const list = await Promise.all(HUB_CITIES.map(([s, d, c]) => summariseCity(s, d, c)));
  return list.filter((c): c is CitySummary => !!c);
}

export async function getCitySummaries(stateSlug: string, districtSlug?: string): Promise<CitySummary[]> {
  const cities = await getCities(stateSlug, districtSlug);
  const list = await Promise.all(cities.map((c) => summariseCity(c.stateSlug, c.districtSlug, c.slug)));
  return list.filter((c): c is CitySummary => !!c).sort((a, b) => b.count - a.count || a.city.name.localeCompare(b.city.name));
}

export async function getMarketplaceStats() {
  const [all, sellers] = await Promise.all([getAllViews(), getSellers()]);
  return {
    listings: all.length,
    available: all.filter((m) => m.availability === "in_stock").length,
    sellers: sellers.length,
    states: new Set(all.map((m) => m.location.state)).size,
    cities: new Set(all.map((m) => `${m.location.state}/${m.location.district}/${m.location.city}`)).size,
  };
}

/** Every part slug (for sitemap / static generation). */
export async function getAllPartSlugs() {
  return (await getAllViews()).map((m) => ({ slug: m.slug, updatedAt: m.updatedAt }));
}

/** Every location path that has listings (for static generation / sitemap). */
export async function getListedLocations() {
  const all = await getAllViews();
  const seen = new Map<string, { state: string; district: string; city: string }>();
  for (const m of all) {
    const key = `${m.location.state}/${m.location.district}/${m.location.city}`;
    if (!seen.has(key)) seen.set(key, { state: m.location.state, district: m.location.district, city: m.location.city });
  }
  return [...seen.values()];
}

/* ------------------------------------------------------------------ */
/* Enquiries                                                           */
/* ------------------------------------------------------------------ */

/** Forward a buyer enquiry to the provider (demo: nothing is sent). */
export async function submitEnquiry(input: EnquiryInput): Promise<EnquiryResult> {
  return getProvider().submitEnquiry(input);
}
