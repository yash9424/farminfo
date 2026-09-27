# MachInfo

**CNC & VMC Machine Parts Marketplace** — *Find the Right Part for Your Machine.*

MachInfo is an India-wide marketplace/directory for CNC & VMC machine **parts, spares, components and accessories** (never complete machines). Buyers search for a part, check specifications, compatibility, price and seller location, and **contact the seller**. There is no cart, checkout or payment.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run build && npm start
```

## Pages

| Route | Purpose |
|---|---|
| `/` | Hero search (keyword + state), popular searches, categories, featured parts, states, industrial cities, why/how, seller CTA |
| `/parts` | Marketplace: filters (search, category, part type, State → District → City, condition, price, brand, availability), sort, grid/list, pagination — all in the URL |
| `/parts/[slug]` | Part detail: gallery (fullscreen, zoom, keyboard, swipe), specs, compatibility, seller card, Contact Seller / Send Enquiry, related parts |
| `/categories`, `/categories/[slug]` | Category index; group or part-type listing |
| `/locations`, `/locations/[state]`, `/[district]`, `/[city]` | Location hierarchy for any state/district/city in the catalogue |
| `/about`, `/list-your-part` | About + buyer safety; seller listing form (demo) |

## Architecture

```
lib/parts.ts                 ← the ONLY data API the UI imports
  getParts() getPartBySlug() getFeaturedParts() getPartsByCategory() getPartsByLocation()
  searchParts() getRelatedParts() getCategories() getStates() getDistricts() getCities()
  getBrands() submitEnquiry() …
lib/data/provider.ts         ← PartsDataProvider interface (the backend seam)
lib/data/index.ts            ← provider registry (MACHINFO_DATA_PROVIDER)
lib/data/demo/               ← demo provider + generated dataset + image pools
lib/data/catalog/            ← category tree, India location hierarchy (all 36 states/UTs)
lib/types.ts                 ← Part, Category, Brand, Seller, State, District, City, …
lib/query-params.ts          ← URL ⇄ PartQuery (shareable filtered URLs)
app/actions/                 ← server actions: enquiry, listing submission
app/api/search/route.ts      ← suggestions for the global search panel
```

- `Part.specifications` is `Record<string, string>` — each part type has its own fields.
- `Part.compatibility` holds `cncControls`, `machineModels`, `machineBrands`.
- Categories are a tree (`parentId`) and locations a strict `Country → State → District → City` hierarchy; both are data, not code.

## Demo data

All listings are **generated demo data** (`isDemo: true`) and labelled "Demo listing / Demo data" in the UI:
96 parts across 11 category groups, 20 fictional sellers in 10 states. Sellers have **no contact details**; prices and part numbers are illustrative (part numbers deliberately don't follow any manufacturer's real numbering). Manufacturer names (FANUC, Siemens, HIWIN, …) identify part types/compatibility only. Enquiries and listing submissions show a demo success state and send nothing.

## Connecting a backend

1. Implement `PartsDataProvider` (`lib/data/provider.ts`) against your REST/GraphQL API, Supabase, MongoDB or Postgres — keep secrets server-side.
2. Register it in `lib/data/index.ts` and set `MACHINFO_DATA_PROVIDER`.
3. `submitEnquiry` is where leads go (CRM/email/WhatsApp API); `app/actions/listing.ts` is where new listings + image uploads plug in.
4. For large catalogues, add `queryParts(query)` to the provider and delegate from `getParts()` so filtering/pagination run in the database.

No UI changes are needed.

## Credits

Photography: Unsplash (Unsplash License) and Wikimedia Commons (CC BY) — see `public/images/mi/CREDITS.json`.
