import "server-only";

import { createAgmarknetProvider } from "./agmarknet-provider";
import { demoProvider } from "./demo-provider";
import type { MarketDataProvider } from "./provider";

/**
 * Provider registry. Selection (server-side env only — nothing here reaches the browser):
 *
 *   MARKET_DATA_PROVIDER = "demo" | "agmarknet"   (optional)
 *   DATA_GOV_IN_API_KEY  = <your data.gov.in key> (enables the live provider)
 *
 * With no configuration the site runs on the clearly-labelled demo dataset.
 * If a live provider is requested but misconfigured or unreachable, requests
 * fail loudly (error state) instead of silently falling back to fake prices.
 */
let cached: MarketDataProvider | undefined;

export function getProvider(): MarketDataProvider {
  if (cached) return cached;

  const apiKey = process.env.DATA_GOV_IN_API_KEY?.trim();
  const mode = process.env.MARKET_DATA_PROVIDER?.trim() || (apiKey ? "agmarknet" : "demo");

  if (mode === "agmarknet") {
    if (!apiKey) {
      throw new Error(
        "MARKET_DATA_PROVIDER=agmarknet requires DATA_GOV_IN_API_KEY (see .env.example).",
      );
    }
    cached = createAgmarknetProvider({
      apiKey,
      baseUrl: process.env.DATA_GOV_IN_BASE_URL?.trim() || undefined,
      resourceId: process.env.DATA_GOV_IN_RESOURCE_ID?.trim() || undefined,
      stateFilterKey: process.env.DATA_GOV_IN_STATE_FILTER_KEY?.trim() || undefined,
    });
  } else {
    cached = demoProvider;
  }
  return cached;
}
