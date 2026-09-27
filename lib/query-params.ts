import type { Availability, PartCondition, PartQuery, SortKey } from "@/lib/types";

/**
 * URL ⇄ PartQuery. Shared by server pages (parsing) and client filters (writing),
 * so every filtered view is a shareable URL:
 *   /parts?q=servo&category=motors-drives&sub=servo-motor&state=gujarat&district=rajkot&city=rajkot
 */

export type SearchParams = Record<string, string | string[] | undefined>;

export const PRICE_PRESETS = [
  { value: "u5k", label: "Under ₹5,000", min: undefined, max: 5_000 },
  { value: "5k-25k", label: "₹5,000 – ₹25,000", min: 5_000, max: 25_000 },
  { value: "25k-1l", label: "₹25,000 – ₹1 Lakh", min: 25_000, max: 1_00_000 },
  { value: "1l-5l", label: "₹1 Lakh – ₹5 Lakh", min: 1_00_000, max: 5_00_000 },
  { value: "5l", label: "₹5 Lakh +", min: 5_00_000, max: undefined },
] as const;

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "updated", label: "Recently Updated" },
  { value: "featured", label: "Featured" },
];

const CONDITIONS: PartCondition[] = ["new", "used", "refurbished"];
const SORTS = SORT_OPTIONS.map((s) => s.value);

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
const list = (v: string | string[] | undefined) =>
  (first(v) ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
const num = (v: string | string[] | undefined) => {
  const n = Number(first(v));
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};
const slug = (v: string | string[] | undefined) => {
  const s = first(v);
  return s && /^[a-z0-9-]{1,80}$/.test(s) ? s : undefined;
};

export interface ParsedParams {
  query: PartQuery;
  view: "grid" | "list";
  /** Selected category group (may be derived from `sub`) */
  group?: string;
  sub?: string;
  pricePreset?: string;
}

export function parseSearchParams(sp: SearchParams): ParsedParams {
  const group = slug(sp.category);
  const sub = slug(sp.sub);
  const preset = PRICE_PRESETS.find((p) => p.value === first(sp.price));
  const minPrice = preset ? preset.min : num(sp.min);
  const maxPrice = preset ? preset.max : num(sp.max);
  const availability = first(sp.availability) as Availability | undefined;
  const sort = first(sp.sort) as SortKey | undefined;

  return {
    query: {
      q: first(sp.q)?.slice(0, 80),
      category: sub ?? group,
      state: slug(sp.state),
      district: slug(sp.state) ? slug(sp.district) : undefined,
      city: slug(sp.state) && slug(sp.district) ? slug(sp.city) : undefined,
      minPrice,
      maxPrice,
      includeOnRequest: first(sp.onrequest) === "1",
      condition: list(sp.condition).filter((c): c is PartCondition => CONDITIONS.includes(c as PartCondition)),
      brand: list(sp.brand).filter((b) => /^[a-z0-9-]{1,40}$/.test(b)),
      availability: availability === "in_stock" || availability === "sold" ? availability : undefined,
      sort: sort && SORTS.includes(sort) ? sort : "newest",
      page: Math.max(1, Math.floor(num(sp.page) ?? 1)),
    },
    view: first(sp.view) === "list" ? "list" : "grid",
    group,
    sub,
    pricePreset: preset?.value,
  };
}

/** Build an href from current params with a patch applied (undefined/"" removes a key). */
export function withParams(
  basePath: string,
  current: URLSearchParams | Record<string, string>,
  patch: Record<string, string | undefined>,
) {
  const params = new URLSearchParams(current instanceof URLSearchParams ? current : Object.entries(current));
  for (const [k, v] of Object.entries(patch)) {
    if (v) params.set(k, v);
    else params.delete(k);
  }
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Flatten Next's searchParams object to plain string pairs. */
export function toStringRecord(sp: SearchParams): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) {
    const f = first(v);
    if (f) out[k] = f;
  }
  return out;
}
