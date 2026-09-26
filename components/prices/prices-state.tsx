"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, use, useCallback, useTransition } from "react";

export type FilterKey = "market" | "crop" | "date" | "q";
export type Filters = Record<FilterKey, string>;

interface PricesState {
  filters: Filters;
  isPending: boolean;
  setFilters: (patch: Partial<Filters>) => void;
  reset: () => void;
}

const Ctx = createContext<PricesState | null>(null);

/**
 * Filters live in the URL (`/prices?market=rajkot&crop=wheat`) so every view is
 * shareable. Changes navigate inside a transition: the server re-renders with the
 * new data while the current results stay visible in a pending state.
 */
export function PricesStateProvider({
  filters,
  children,
}: {
  filters: Filters;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const setFilters = useCallback(
    (patch: Partial<Filters>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, val] of Object.entries(patch)) {
        if (val) params.set(key, val);
        else params.delete(key);
      }
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [router, pathname, searchParams],
  );

  const reset = useCallback(() => {
    startTransition(() => router.replace(pathname, { scroll: false }));
  }, [router, pathname]);

  return <Ctx value={{ filters, isPending, setFilters, reset }}>{children}</Ctx>;
}

export function usePricesState() {
  const ctx = use(Ctx);
  if (!ctx) throw new Error("usePricesState must be used inside <PricesStateProvider>");
  return ctx;
}
