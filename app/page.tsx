import { FeatureSection } from "@/components/home/feature-section";
import { FinalCTA } from "@/components/home/final-cta";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { FEATURED_MARKET_IDS, MarketGrid } from "@/components/home/market-grid";
import { MarketSnapshot } from "@/components/home/market-snapshot";
import { Stats } from "@/components/home/stats";
import {
  getDataSource,
  getDatasetStats,
  getFeaturedPrices,
  getMarketOverview,
} from "@/lib/market-data";

const SNAPSHOT_CROPS = ["wheat", "rice", "bajra", "groundnut", "cotton", "cumin"];
const TICKER_CROPS = [
  "wheat", "groundnut", "cotton", "cumin", "castor", "bajra",
  "sesame", "chana", "garlic", "onion", "rice", "maize",
];

// Prices change daily; regenerate the page at most every 30 minutes.
export const revalidate = 1800;

async function loadHomeData() {
  try {
    const [snapshot, ticker, stats, overview] = await Promise.all([
      getFeaturedPrices(SNAPSHOT_CROPS),
      getFeaturedPrices(TICKER_CROPS),
      getDatasetStats(),
      getMarketOverview(),
    ]);
    return { snapshot, ticker, stats, overview };
  } catch (error) {
    // The marketing page stays up even if the price source is unreachable;
    // price sections render their empty states instead.
    console.error("Home: market data unavailable", error);
    return { snapshot: [], ticker: [], stats: null, overview: [] };
  }
}

export default async function HomePage() {
  const { snapshot, ticker, stats, overview } = await loadHomeData();
  const source = getDataSource();

  const byId = new Map(overview.map((o) => [o.market.id, o]));
  const featuredMarkets = FEATURED_MARKET_IDS.map((id) => byId.get(id)).filter(
    (o): o is NonNullable<typeof o> => !!o,
  );
  // With a live source the headline ids may differ — fall back to the busiest yards
  const markets =
    featuredMarkets.length >= 6
      ? featuredMarkets
      : [...overview].sort((a, b) => b.cropCount - a.cropCount).slice(0, 10);

  return (
    <>
      <Hero featured={snapshot[0]} ticker={ticker} source={source} />
      {stats && <Stats stats={stats} />}
      <MarketSnapshot items={snapshot} source={source} />
      <HowItWorks />
      <FeatureSection />
      {markets.length > 0 && (
        <MarketGrid markets={markets} totalMarkets={overview.length} source={source} />
      )}
      <FinalCTA />
    </>
  );
}
