import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedParts } from "@/components/home/featured-parts";
import { Hero } from "@/components/home/hero";
import { HubCities } from "@/components/home/hub-cities";
import { SellerCTA } from "@/components/home/seller-cta";
import { StateGrid } from "@/components/home/state-grid";
import { HowItWorks, WhyMachInfo } from "@/components/home/why-how";
import {
  getDataSource,
  getFeaturedParts,
  getFeaturedStateSummaries,
  getHomeCategories,
  getHubCitySummaries,
  getMarketplaceStats,
  getStates,
  getTopCategories,
} from "@/lib/parts";

export default async function HomePage() {
  const [states, stats, topCategories, categories, featured, stateSummaries, hubs] = await Promise.all([
    getStates(),
    getMarketplaceStats(),
    getTopCategories(),
    getHomeCategories(),
    getFeaturedParts(8),
    getFeaturedStateSummaries(),
    getHubCitySummaries(),
  ]);
  const source = getDataSource();

  return (
    <>
      <Hero
        states={states}
        stats={{ listings: stats.listings, sellers: stats.sellers, states: stats.states, categories: topCategories.length }}
        isDemo={source.isDemo}
      />
      <CategoryGrid items={categories} />
      <FeaturedParts parts={featured} isDemo={source.isDemo} />
      <StateGrid states={stateSummaries} isDemo={source.isDemo} />
      <HubCities cities={hubs} />
      <WhyMachInfo />
      <HowItWorks />
      <SellerCTA />
    </>
  );
}
