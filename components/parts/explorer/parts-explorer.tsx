import { ChevronLeft, ChevronRight, PackageSearch } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { PartCard } from "@/components/parts/part-card";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getCategoryBySlug, getParts } from "@/lib/parts";
import { PRICE_PRESETS, parseSearchParams, toStringRecord, withParams, type SearchParams } from "@/lib/query-params";
import type { PartQuery, PartResult } from "@/lib/types";
import { CONDITION_LABEL, cn, formatINRCompact } from "@/lib/utils";
import { ExplorerStateProvider, PendingArea } from "./explorer-state";
import { FiltersPanel, type FilterContext } from "./filters-panel";
import { Toolbar, type ActiveChip } from "./toolbar";
import { ExplorerSkeleton } from "./explorer-skeleton";

/**
 * The marketplace listing: filters + toolbar + results + pagination.
 * Used by /parts, category pages and location pages; `fixed` pins the page's
 * own category/location so those filters are applied and hidden.
 */
export async function PartsExplorer({
  searchParams,
  basePath,
  fixed = {},
  scopeLabel = "India",
}: {
  searchParams: SearchParams;
  basePath: string;
  fixed?: Pick<PartQuery, "category" | "state" | "district" | "city">;
  scopeLabel?: string;
}) {
  const parsed = parseSearchParams(searchParams);
  const query: PartQuery = { ...parsed.query, ...stripUndefined(fixed) };
  // On a category-group page, a chosen part type (sub) narrows within the group
  if (fixed.category && parsed.sub) query.category = parsed.sub;
  const result = await getParts(query);

  const fixedCategory = fixed.category ? await getCategoryBySlug(fixed.category) : null;
  const filterContext: FilterContext = {
    facets: result.facets,
    fixed: {
      category: !!fixed.category,
      sub: !!fixedCategory?.parentId,
      location: !!fixed.state,
    },
  };
  const chips = await buildChips(parsed, fixed, result);
  const current = toStringRecord(searchParams);

  return (
    <Suspense fallback={<ExplorerSkeleton />}>
      <ExplorerStateProvider>
        <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] xl:gap-10">
          <aside aria-label="Filters" className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain rounded-2xl border border-line bg-white p-5 shadow-card scrollbar-none">
              <FiltersPanel {...filterContext} />
            </div>
          </aside>

          <div className="min-w-0">
            <Toolbar total={result.total} scopeLabel={scopeLabel} chips={chips} filterContext={filterContext} />
            <PendingArea className="mt-6">
              {result.items.length === 0 ? (
                <EmptyState
                  icon={PackageSearch}
                  role="status"
                  title="No parts found."
                  description="Try changing your location or filters — or search a broader part name."
                  action={
                    <>
                      <ButtonLink href={basePath}>Clear filters</ButtonLink>
                      <ButtonLink href="/parts" variant="outline">
                        Browse all parts
                      </ButtonLink>
                    </>
                  }
                />
              ) : (
                <>
                  <ul
                    className={cn(
                      "grid gap-4",
                      parsed.view === "list" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
                    )}
                  >
                    {result.items.map((p, i) => (
                      <li key={p.id} className="flex min-w-0">
                        <PartCard part={p} layout={parsed.view} priority={i < 3} className="w-full" />
                      </li>
                    ))}
                  </ul>
                  <Pagination result={result} basePath={basePath} current={current} />
                </>
              )}
            </PendingArea>
          </div>
        </div>
      </ExplorerStateProvider>
    </Suspense>
  );
}

function stripUndefined<T extends object>(o: T): Partial<T> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<T>;
}

async function buildChips(
  parsed: ReturnType<typeof parseSearchParams>,
  fixed: Pick<PartQuery, "category" | "state" | "district" | "city">,
  result: PartResult,
): Promise<ActiveChip[]> {
  const q = parsed.query;
  const f = result.facets;
  const label = (list: { value: string; label: string }[], v?: string) => list.find((o) => o.value === v)?.label ?? v;
  const chips: ActiveChip[] = [];
  if (q.q) chips.push({ key: "q", label: `“${q.q}”`, clear: { q: undefined } });
  if (!fixed.category && parsed.group) {
    chips.push({ key: "category", label: label(f.categories, parsed.group) ?? parsed.group, clear: { category: undefined, sub: undefined } });
  }
  if (parsed.sub && !(fixed.category === parsed.sub)) {
    const sub = await getCategoryBySlug(parsed.sub);
    chips.push({ key: "sub", label: sub?.name ?? parsed.sub, clear: { sub: undefined } });
  }
  if (!fixed.state && q.state) chips.push({ key: "state", label: label(f.states, q.state) ?? q.state, clear: { state: undefined, district: undefined, city: undefined } });
  if (!fixed.state && q.district) chips.push({ key: "district", label: label(f.districts, q.district) ?? q.district, clear: { district: undefined, city: undefined } });
  if (!fixed.state && q.city) chips.push({ key: "city", label: label(f.cities, q.city) ?? q.city, clear: { city: undefined } });
  for (const c of q.condition ?? []) {
    const rest = (q.condition ?? []).filter((x) => x !== c).join(",");
    chips.push({ key: `cond-${c}`, label: CONDITION_LABEL[c], clear: { condition: rest || undefined } as Record<string, undefined> });
  }
  for (const b of q.brand ?? []) {
    const rest = (q.brand ?? []).filter((x) => x !== b).join(",");
    chips.push({ key: `brand-${b}`, label: label(f.brands, b) ?? b, clear: { brand: rest || undefined } as Record<string, undefined> });
  }
  if (parsed.pricePreset) {
    chips.push({ key: "price", label: PRICE_PRESETS.find((p) => p.value === parsed.pricePreset)!.label, clear: { price: undefined } });
  } else if (q.minPrice !== undefined || q.maxPrice !== undefined) {
    const text = `${q.minPrice ? formatINRCompact(q.minPrice) : "₹0"} – ${q.maxPrice ? formatINRCompact(q.maxPrice) : "any"}`;
    chips.push({ key: "price", label: text, clear: { min: undefined, max: undefined } });
  }
  if (q.includeOnRequest) chips.push({ key: "onrequest", label: "Incl. price on request", clear: { onrequest: undefined } });
  if (q.availability) chips.push({ key: "availability", label: q.availability === "sold" ? "Sold" : "In stock", clear: { availability: undefined } });
  return chips;
}

function Pagination({ result, basePath, current }: { result: PartResult; basePath: string; current: Record<string, string> }) {
  if (result.pageCount <= 1) return null;
  const { page, pageCount } = result;
  const href = (p: number) => withParams(basePath, current, { page: p === 1 ? undefined : String(p) });
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1,
  );
  const item = "grid h-10 min-w-10 place-items-center rounded-xl px-3 text-sm font-semibold transition-colors";
  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={href(page - 1)} scroll className={cn(item, "border border-line-strong bg-white hover:border-graphite-400")} aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </Link>
      ) : null}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && p - pages[i - 1] > 1 && <span className="px-1 text-muted">…</span>}
          <Link
            href={href(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(item, p === page ? "bg-graphite-950 text-white" : "border border-line-strong bg-white hover:border-graphite-400")}
          >
            {p}
          </Link>
        </span>
      ))}
      {page < pageCount ? (
        <Link href={href(page + 1)} className={cn(item, "border border-line-strong bg-white hover:border-graphite-400")} aria-label="Next page">
          <ChevronRight className="size-4" />
        </Link>
      ) : null}
    </nav>
  );
}
