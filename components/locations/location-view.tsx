import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { PartsExplorer } from "@/components/parts/explorer/parts-explorer";
import { DemoBadge } from "@/components/ui/badge";
import type { Crumb } from "@/components/ui/breadcrumbs";
import { getCitySummaries, getDataSource, getParts, type CitySummary } from "@/lib/parts";
import type { SearchParams } from "@/lib/query-params";
import type { City, District, State } from "@/lib/types";
import { plural } from "@/lib/utils";

/**
 * Shared page body for /locations/[state], /[district] and /[city].
 * Works for any State → District → City in the catalogue.
 */
export async function LocationView({
  state,
  district,
  city,
  searchParams,
}: {
  state: State;
  district?: District;
  city?: City;
  searchParams: SearchParams;
}) {
  const place = city?.name ?? district?.name ?? state.name;
  const basePath = `/locations/${state.slug}${district ? `/${district.slug}` : ""}${city ? `/${city.slug}` : ""}`;
  const scope = { state: state.slug, district: district?.slug, city: city?.slug };
  const source = getDataSource();

  // categories available in this location (top groups with listings)
  const [overview, cities] = await Promise.all([
    getParts({ ...scope, pageSize: 1 }),
    city ? Promise.resolve([] as CitySummary[]) : getCitySummaries(state.slug, district?.slug),
  ]);

  const crumbs: Crumb[] = [
    { label: "India", href: "/locations" },
    { label: state.name, href: district ? `/locations/${state.slug}` : undefined },
    ...(district ? [{ label: `${district.name} District`, href: city ? `/locations/${state.slug}/${district.slug}` : undefined }] : []),
    ...(city ? [{ label: city.name }] : []),
    { label: "Parts" },
  ];

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow={city ? `${district?.name} District · ${state.name}` : district ? state.name : "India"}
        title={`CNC & VMC Machine Parts in ${place}${city ? `, ${state.name}` : ""}`}
        description={
          <>
            {plural(overview.total, "part listing")} from sellers in {place}.{" "}
            {source.isDemo && <DemoBadge tone="glass" label="Demo data" className="ml-1 align-middle" />}
          </>
        }
      >
        {overview.facets.categories.length > 0 && (
          <div className="mt-7">
            <p className="text-xs font-semibold text-graphite-400">Available categories</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {overview.facets.categories.map((c) => (
                <li key={c.value}>
                  <Link
                    href={`${basePath}?category=${c.value}`}
                    className="inline-flex gap-1.5 rounded-lg border border-white/15 bg-white/6 px-3 py-1.5 text-sm font-semibold text-graphite-200 transition-colors hover:bg-white/12 hover:text-white"
                  >
                    {c.label}
                    <span className="opacity-60 tabular">{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </PageHero>

      {cities.length > 0 && (
        <section aria-labelledby="loc-cities" className="border-b border-line bg-white">
          <div className="container-x py-6">
            <h2 id="loc-cities" className="text-sm font-bold text-ink">
              Cities in {place}
            </h2>
            <ul className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {cities.map((c) => (
                <li key={`${c.district.slug}-${c.city.slug}`} className="shrink-0">
                  <Link
                    href={`/locations/${c.state.slug}/${c.district.slug}/${c.city.slug}`}
                    className="group inline-flex items-center gap-2 rounded-xl border border-line bg-graphite-50 px-3 py-2 text-sm transition-colors hover:border-graphite-300 hover:bg-white"
                  >
                    <MapPin className="size-3.5 text-accent-500" aria-hidden />
                    <span className="font-semibold text-ink">{c.city.name}</span>
                    <span className="text-xs text-muted tabular">{c.count}</span>
                    <ArrowRight className="size-3.5 text-graphite-400 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <div className="container-x py-8 lg:py-10">
        <PartsExplorer searchParams={searchParams} basePath={basePath} fixed={scope} scopeLabel={city ? `${city.name}, ${state.name}` : place} />
      </div>
    </>
  );
}
