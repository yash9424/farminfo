import "server-only";

import { demoProvider } from "./demo/provider";
import type { PartsDataProvider } from "./provider";

/**
 * Provider registry (server-side only).
 *
 *   MACHINFO_DATA_PROVIDER=demo   (default)
 *
 * To go live, implement `PartsDataProvider` (e.g. `lib/data/api/provider.ts`
 * calling your REST/GraphQL API with a server-side key, or a Supabase/Postgres
 * client) and return it here for its provider name.
 */
export function getProvider(): PartsDataProvider {
  const name = process.env.MACHINFO_DATA_PROVIDER?.trim() || "demo";
  switch (name) {
    case "demo":
      return demoProvider;
    default:
      throw new Error(`Unknown MACHINFO_DATA_PROVIDER "${name}". See lib/data/index.ts.`);
  }
}
