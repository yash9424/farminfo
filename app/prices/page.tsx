import type { Metadata } from "next";
import { Suspense } from "react";
import { MarketSummary } from "@/components/prices/market-summary";
import { PriceFilters } from "@/components/prices/price-filters";
import { PriceResults } from "@/components/prices/price-results";
import { PricesStateProvider, type Filters } from "@/components/prices/prices-state";
import { PricesHeader } from "@/components/prices/prices-header";
import { PricesSkeleton } from "@/components/prices/prices-skeleton";
import { getI18n } from "@/lib/i18n";
import { getCrops, getMarketPrices, getMarkets } from "@/lib/market-data";
import { isISODate } from "@/lib/utils";
import { cityLabel, cropLabel, marketLabel } from "@/locales";

type SearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? "";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const [{ t }, markets, crops] = await Promise.all([getI18n(), getMarkets(), getCrops()]);
  const market = markets.find((m) => m.id === first(sp.market));
  const crop = crops.find((c) => c.id === first(sp.crop));
  const cropName = crop ? cropLabel(t, crop) : undefined;
  const parts = [cropName, market ? cityLabel(t, market) : undefined].filter(
    (p): p is string => !!p,
  );
  return {
    title: parts.length ? t.meta.pricesFilteredTitle(parts) : t.meta.pricesTitle,
    description: t.meta.pricesDescription(cropName, market ? marketLabel(t, market) : undefined),
    alternates: { canonical: "/prices" },
  };
}

export default async function PricesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const [{ t }, markets, crops] = await Promise.all([getI18n(), getMarkets(), getCrops()]);

  // Only accept known ids so a bad link degrades to "all"
  const filters: Filters = {
    market: markets.some((m) => m.id === first(sp.market)) ? first(sp.market) : "",
    crop: crops.some((c) => c.id === first(sp.crop)) ? first(sp.crop) : "",
    date: isISODate(first(sp.date)) ? first(sp.date) : "",
    q: first(sp.q).slice(0, 60),
  };

  const result = await getMarketPrices({
    marketId: filters.market || undefined,
    cropId: filters.crop || undefined,
    date: filters.date || undefined,
    search: filters.q || undefined,
  });
  const market = markets.find((m) => m.id === filters.market);

  return (
    <>
      <PricesHeader source={result.source} date={result.date} latestDate={result.latestDate} />

      <div className="bg-cream-100 pb-24">
        <Suspense fallback={<PricesSkeleton label={t.prices.loading} />}>
          <PricesStateProvider filters={filters}>
            <div className="relative z-30 -mt-10 lg:sticky lg:top-[4.5rem]">
              <div className="container-x pt-2">
                <PriceFilters
                  markets={markets}
                  crops={crops}
                  latestDate={result.latestDate}
                  earliestDate={result.earliestDate}
                />
              </div>
            </div>

            <div className="container-x mt-8 space-y-8">
              <MarketSummary
                market={market}
                prices={result.prices}
                date={result.date}
                source={result.source}
              />
              <PriceResults
                prices={result.prices}
                crops={crops}
                markets={markets}
                source={result.source}
              />
            </div>
          </PricesStateProvider>
        </Suspense>
      </div>
    </>
  );
}
