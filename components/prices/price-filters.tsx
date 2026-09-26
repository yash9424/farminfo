"use client";

import { CalendarDays, RotateCcw, Store } from "lucide-react";
import { useId, useMemo } from "react";
import { CropIcon } from "@/components/ui/crop-icon";
import { Search } from "@/components/ui/search";
import { Select, type SelectOption } from "@/components/ui/select";
import type { Crop, CropCategory, Market } from "@/lib/types";
import { cn } from "@/lib/utils";
import { usePricesState } from "./prices-state";

const CATEGORY_ORDER: CropCategory[] = [
  "Cereals",
  "Pulses",
  "Oilseeds",
  "Spices",
  "Fibre",
  "Vegetables",
  "Other",
];

export function PriceFilters({
  markets,
  crops,
  latestDate,
  earliestDate,
}: {
  markets: Market[];
  crops: Crop[];
  latestDate: string;
  earliestDate: string;
}) {
  const { filters, setFilters, reset, isPending } = usePricesState();
  const dateId = useId();

  const marketOptions = useMemo<SelectOption[]>(
    () =>
      markets.map((m) => ({
        value: m.id,
        label: m.city,
        hint: m.district !== m.city ? m.district : undefined,
        keywords: [m.name, m.district],
      })),
    [markets],
  );

  const cropOptions = useMemo<SelectOption[]>(
    () =>
      [...crops]
        .sort(
          (a, b) =>
            CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) ||
            a.name.localeCompare(b.name),
        )
        .map((c) => ({
          value: c.id,
          label: c.name,
          group: c.category,
          keywords: c.aliases,
          icon: <CropIcon cropId={c.id} size="sm" className="size-7 rounded-lg [&_svg]:size-4" />,
        })),
    [crops],
  );

  const hasFilters = Boolean(filters.market || filters.crop || filters.q || filters.date);

  return (
    <div
      role="search"
      aria-label="Filter market prices"
      className="rounded-[1.75rem] border border-line/80 bg-cream-50/90 p-3 shadow-lift backdrop-blur-xl sm:p-4"
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-[1fr_1fr_0.8fr_1.3fr_auto] lg:items-end">
        <Select
          label="Market yard"
          value={filters.market}
          options={marketOptions}
          allLabel="All markets"
          placeholder="Search market or district…"
          icon={<Store />}
          onChange={(market) => setFilters({ market })}
        />
        <Select
          label="Crop"
          value={filters.crop}
          options={cropOptions}
          allLabel="All crops"
          placeholder="Search crop…"
          onChange={(crop) => setFilters({ crop })}
        />
        <div className="col-span-1">
          <label
            htmlFor={dateId}
            className="mb-1.5 block text-[0.6875rem] font-bold tracking-[0.14em] text-muted uppercase"
          >
            Date
          </label>
          <div className="relative">
            <CalendarDays
              className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-forest-600 max-[440px]:hidden"
              aria-hidden
            />
            <input
              id={dateId}
              type="date"
              value={filters.date || latestDate}
              min={earliestDate}
              max={latestDate}
              onChange={(e) => {
                const v = e.target.value;
                setFilters({ date: v && v !== latestDate ? v : "" });
              }}
              className="h-12 w-full rounded-2xl border border-line bg-white pr-2 pl-3 text-[0.9375rem] font-semibold min-[441px]:pr-3 min-[441px]:pl-10.5 text-ink transition-[border-color,box-shadow] outline-none hover:border-forest-300 focus:border-forest-500 focus:ring-4 focus:ring-forest-500/12"
            />
          </div>
        </div>
        <Search
          label="Search"
          value={filters.q}
          onSearch={(q) => setFilters({ q })}
          placeholder="wheat, rajkot, groundnut…"
          className="order-first col-span-2 lg:order-none lg:col-span-1"
        />
        <button
          type="button"
          onClick={reset}
          disabled={!hasFilters}
          className={cn(
            "col-span-1 inline-flex h-12 items-center justify-center gap-2 self-end rounded-2xl px-4 text-sm font-semibold transition-all duration-300",
            hasFilters
              ? "bg-forest-900 text-cream-50 hover:bg-forest-800"
              : "cursor-not-allowed bg-forest-900/5 text-muted",
          )}
        >
          <RotateCcw className={cn("size-4", isPending && "animate-spin [animation-direction:reverse]")} aria-hidden />
          Reset
        </button>
      </div>
    </div>
  );
}
