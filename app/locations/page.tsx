import { ArrowRight, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { HubCities } from "@/components/home/hub-cities";
import { PageHero } from "@/components/layout/page-hero";
import { getHubCitySummaries, getMarketplaceStats, getStateSummaries } from "@/lib/parts";
import { cn, plural } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Browse Parts by Location",
  description: "Find CNC & VMC machine parts near you — browse sellers by state, district and city across India.",
  alternates: { canonical: "/locations" },
};

export default async function LocationsPage() {
  const [states, hubs, stats] = await Promise.all([getStateSummaries(), getHubCitySummaries(), getMarketplaceStats()]);
  const active = states.filter((s) => s.count > 0).sort((a, b) => b.count - a.count);
  const others = states.filter((s) => s.count === 0);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Locations" }]}
        eyebrow="India"
        title="Browse Parts by Location"
        description={`Sellers in ${plural(stats.states, "state")} and ${plural(stats.cities, "city", "cities")} — from Rajkot and Pune to Coimbatore and Ludhiana.`}
      />

      <section aria-labelledby="states-with" className="container-x py-10 lg:py-14">
        <h2 id="states-with" className="text-2xl font-bold text-ink">
          States with listings
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {active.map(({ state, count, topCities }) => (
            <li key={state.slug}>
              <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-ink">
                      <Link href={`/locations/${state.slug}`} className="hover:text-accent-600">
                        {state.name}
                      </Link>
                    </h3>
                    {state.tagline && <p className="mt-0.5 text-sm text-muted">{state.tagline}</p>}
                  </div>
                  <span className="shrink-0 rounded-md bg-graphite-100 px-2 py-1 text-xs font-bold text-ink tabular">{plural(count, "part")}</span>
                </div>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {topCities
                    .filter((c) => c.count > 0)
                    .slice(0, 6)
                    .map(({ city, count: n }) => (
                      <li key={`${city.districtSlug}-${city.slug}`}>
                        <Link
                          href={`/locations/${state.slug}/${city.districtSlug}/${city.slug}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-line bg-graphite-50 px-2.5 py-1 text-sm text-ink-soft hover:border-graphite-300 hover:bg-white"
                        >
                          <MapPin className="size-3 text-accent-500" aria-hidden />
                          {city.name}
                          <span className="text-xs text-muted tabular">{n}</span>
                        </Link>
                      </li>
                    ))}
                </ul>
                <Link href={`/locations/${state.slug}`} className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-accent-600 hover:text-accent-700">
                  Explore {state.name} <ArrowRight className="size-4" aria-hidden />
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <HubCities cities={hubs} />

      <section aria-labelledby="all-states" className="container-x pb-16 lg:pb-20">
        <h2 id="all-states" className="text-2xl font-bold text-ink">
          All states &amp; union territories
        </h2>
        <p className="mt-2 text-sm text-muted">Every state has a page — listings appear as sellers join.</p>
        <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {[...active, ...others]
            .sort((a, b) => a.state.name.localeCompare(b.state.name))
            .map(({ state, count }) => (
              <li key={state.slug}>
                <Link
                  href={`/locations/${state.slug}`}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-sm transition-colors",
                    count ? "border-line bg-white font-semibold text-ink hover:border-graphite-300" : "border-transparent bg-graphite-100/60 text-muted hover:bg-graphite-100",
                  )}
                >
                  <span className="truncate">{state.name}</span>
                  {count > 0 && <span className="text-xs text-muted tabular">{count}</span>}
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </>
  );
}
