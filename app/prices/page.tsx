import type { Metadata } from "next";
import { Suspense } from "react";
import { MarketSummary } from "@/components/prices/market-summary";
import { PriceFilters } from "@/components/prices/price-filters";
import { PriceResults } from "@/components/prices/price-results";
import { PricesStateProvider, type Filters } from "@/components/prices/prices-state";
import { PricesHeader } from "@/components/prices/prices-header";
import { getCrops, getMarketPrices, getMarkets } from "@/lib/market-data";
import { isISODate } from "@/lib/utils";

type SearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? "";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const [markets, crops] = await Promise.all([getMarkets(), getCrops()]);
  const market = markets.find((m) => m.id === first(sp.market));
  const crop = crops.find((c) => c.id === first(sp.crop));
  const parts = [crop?.name, market?.city].filter(Boolean);
  const title = parts.length ? `${parts.join(" bhav in ")} — Market Prices` : "Market Prices";
  return {
    title,
    description: `Check ${crop ? crop.name.toLowerCase() : "agricultural crop"} prices${
      market ? ` at ${market.name}` : " across Gujarat market yards"
    } — minimum, maximum and modal bhav with a 7-day trend.`,
    alternates: { canonical: "/prices" },
  };
}

export default async function PricesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const [markets, crops] = await Promise.all([getMarkets(), getCrops()]);

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
        <Suspense>
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
