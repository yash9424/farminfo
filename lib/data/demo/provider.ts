import "server-only";

import type { DataSourceInfo } from "@/lib/types";
import { CATEGORIES } from "../catalog/categories";
import { CITIES, DISTRICTS, INDIA, STATES } from "../catalog/locations";
import type { PartsDataProvider } from "../provider";
import { DEMO_BRANDS, DEMO_PARTS, DEMO_SELLERS } from "./dataset";

const source: DataSourceInfo = {
  id: "demo",
  name: "MachInfo demo parts listings",
  isDemo: true,
};

/** In-memory provider over the generated demo dataset. */
export const demoProvider: PartsDataProvider = {
  source,

  async listCategories() {
    return CATEGORIES;
  },
  async listBrands() {
    return DEMO_BRANDS;
  },
  async listSellers() {
    return DEMO_SELLERS;
  },

  async getCountry() {
    return INDIA;
  },
  async listStates() {
    return STATES;
  },
  async listDistricts(stateSlug) {
    return stateSlug ? DISTRICTS.filter((d) => d.stateSlug === stateSlug) : DISTRICTS;
  },
  async listCities(stateSlug, districtSlug) {
    return CITIES.filter(
      (c) => (!stateSlug || c.stateSlug === stateSlug) && (!districtSlug || c.districtSlug === districtSlug),
    );
  },

  async listParts() {
    return DEMO_PARTS;
  },
  async getPartBySlug(slug) {
    return DEMO_PARTS.find((m) => m.slug === slug) ?? null;
  },

  async submitEnquiry(input) {
    // Demo: nothing is sent anywhere. A real provider would POST to a leads API/CRM.
    await new Promise((r) => setTimeout(r, 700));
    const reference = `DEMO-${input.partId.toUpperCase()}-${Date.now().toString(36).slice(-5).toUpperCase()}`;
    return { ok: true, reference, isDemo: true };
  },
};
