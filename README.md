# FarmInfo

**Gujarat Na Pak Na Bhav — Ekaj Jagyae.**

A frontend-only Next.js site for checking agricultural market-yard (APMC) prices across Gujarat.

- `/` — Home: hero, coverage stats, today's market snapshot, how it works, market yards
- `/prices` — Market dashboard: filter by market, crop, date and free text; sortable table on desktop, cards on mobile, price details with a 7-day chart
- `/about` — Purpose, capabilities, Gujarat map, data transparency

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build && npm start
```

Requires Node 20.9+.

## Data

The UI never talks to a data source directly. Everything goes through one module:

```
lib/market-data.ts          ← the only data API the UI imports
  getMarkets() getCrops() getMarketPrices() getPricesByMarket() getPricesByCrop()
  getFeaturedPrices() getMarketOverview() getDatasetStats() getDataSource()

lib/data/provider.ts        ← MarketDataProvider interface (implement this for a new source)
lib/data/index.ts           ← picks the provider from server-side env vars
lib/data/demo-provider.ts   ← generated sample data (default)
lib/data/agmarknet-provider.ts ← live AGMARKNET / data.gov.in provider
lib/data/catalog.ts         ← crop + market reference catalogue, name matching
lib/types.ts                ← Market, Crop, MarketPrice, …
```

### Demo mode (default)

With no configuration FarmInfo runs on a **generated, deterministic demo dataset** — 30 Gujarat APMCs and 19 crops, with plausible prices. These are **not real prices**. Every place prices are shown carries a "Demo data" badge, and the About page and footer say so.

### Live mode (AGMARKNET via data.gov.in)

The live provider targets the Government of India open dataset
[Current Daily Price of Various Commodities from Various Markets (Mandi)](https://www.data.gov.in/resource/current-daily-price-various-commodities-various-markets-mandi)
(resource `9ef84268-d588-465a-a308-a864a43d0070`), filtered to Gujarat.

1. Register at <https://www.data.gov.in> and generate an API key (My Account).
2. Copy `.env.example` to `.env.local` and set `DATA_GOV_IN_API_KEY=...`.
3. Restart. The site switches to live data automatically; demo badges disappear and the source is shown.

The key is read **only on the server** (`server-only` modules, fetched in Server Components) and is never shipped to the browser. Responses are cached for an hour (`next: { revalidate: 3600 }`).

Notes on the live dataset:
- It publishes arrival **dates**, not timestamps, so "last updated" shows the date only.
- It typically holds only recent days, so the 7-day trend and day-on-day change use whatever history the API returns (shown as "—" when there is no previous day).
- Commodity names like `Cummin Seed(Jeera)` are mapped to catalogue crops in `lib/data/catalog.ts` (`matchCatalogCrop`). Unknown commodities still appear, under "Other".

If the live source fails, `/prices` shows an error state with retry. Home and About keep working, with their price sections empty. The site never silently falls back to fake prices.

### Adding another source

Implement `MarketDataProvider` (three methods: `getMarkets`, `getCrops`, `getDay`) and register it in `lib/data/index.ts`. No UI changes are needed.

## Project structure

```
app/                      routes, metadata, sitemap, robots, OG image, error/loading/404
components/layout/        Header, Footer, Logo
components/home/          Hero, Stats, MarketSnapshot, HowItWorks, FeatureSection, MarketGrid, FinalCTA
components/prices/        PriceFilters, MarketSummary, PriceTable, PriceCard, PriceDetails, PriceChart, state
components/about/         GujaratMap
components/ui/            Button, Card, Badge, Select (searchable), Search (debounced), Skeleton, EmptyState, CropIcon, Sparkline
components/motion/        Motion provider (lazy-loaded features), Reveal/Stagger, CountUp
```

## Credits

- Photography: Unsplash (Unsplash License) — see `public/images/CREDITS.json`.
- Gujarat boundary: [DataMeet maps](https://github.com/datameet/maps), CC BY 2.5 India (generated into `lib/gujarat-map.ts`).
