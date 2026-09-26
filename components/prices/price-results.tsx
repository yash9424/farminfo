"use client";

import * as m from "motion/react-m";
import { ChevronDown, SearchX } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useLanguage } from "@/components/i18n/language-provider";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { Crop, DataSourceInfo, Market, MarketPrice } from "@/lib/types";
import { cn } from "@/lib/utils";
import { cityLabel, cropLabel, intlLocale } from "@/locales";
import { PriceCard } from "./price-card";
import { PriceTable, type SortKey, type SortState } from "./price-table";
import { usePricesState } from "./prices-state";

// Chart + dialog code is only downloaded when a user opens a price.
const PriceDetails = dynamic(() => import("./price-details"), { ssr: false });

const PAGE = 40;

export function PriceResults({
  prices,
  crops,
  markets,
  source,
}: {
  prices: MarketPrice[];
  crops: Crop[];
  markets: Market[];
  source: DataSourceInfo;
}) {
  const { isPending, filters, reset } = usePricesState();
  const { t, locale } = useLanguage();
  const [sort, setSort] = useState<SortState>({ key: "market", dir: "asc" });
  const [visible, setVisible] = useState(PAGE);
  const [selected, setSelected] = useState<MarketPrice | null>(null);
  const [open, setOpen] = useState(false);
  const [lastKey, setLastKey] = useState("");

  const cropById = useMemo(() => new Map(crops.map((c) => [c.id, c])), [crops]);
  const marketById = useMemo(() => new Map(markets.map((m) => [m.id, m])), [markets]);

  // reset pagination whenever the filtered set changes
  const resultKey = `${filters.market}|${filters.crop}|${filters.date}|${filters.q}`;
  if (resultKey !== lastKey) {
    setLastKey(resultKey);
    setVisible(PAGE);
  }

  const sorted = useMemo(() => {
    const dir = sort.dir === "asc" ? 1 : -1;
    const val = (p: MarketPrice): string | number => {
      switch (sort.key) {
        case "crop":
          return cropLabel(t, cropById.get(p.cropId), p.cropId);
        case "market":
          return cityLabel(t, marketById.get(p.marketId), p.marketId);
        case "min":
          return p.minPrice;
        case "max":
          return p.maxPrice;
        case "modal":
          return p.modalPrice;
        case "change":
          return p.changePercent ?? -Infinity;
      }
    };
    return [...prices].sort((a, b) => {
      const va = val(a);
      const vb = val(b);
      const c =
        typeof va === "number"
          ? va - (vb as number)
          : va.localeCompare(vb as string, intlLocale(locale));
      return c * dir;
    });
  }, [prices, sort, cropById, marketById, t, locale]);

  function onSort(key: SortKey) {
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "crop" || key === "market" ? "asc" : "desc" },
    );
  }

  function select(p: MarketPrice) {
    setSelected(p);
    setOpen(true);
  }

  const rows = sorted.slice(0, visible);

  return (
    <div aria-busy={isPending} className="relative">
      {/* pending indicator */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-6 -top-3 h-0.5 overflow-hidden rounded-full transition-opacity duration-300",
          isPending ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="h-full w-1/3 rounded-full bg-forest-500 [animation:pending-bar_1.1s_ease-in-out_infinite]" />
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {isPending ? t.results.loading : t.results.found(prices.length)}
      </p>

      <m.div
        key={resultKey}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className={cn("transition-opacity duration-300", isPending && "pointer-events-none opacity-45")}
      >
        {prices.length === 0 ? (
          <EmptyState
            icon={SearchX}
            role="status"
            title={t.results.emptyTitle}
            description={t.results.emptyBody(filters.q || undefined)}
            action={<Button onClick={reset}>{t.results.resetFilters}</Button>}
          />
        ) : (
          <>
            <div className="hidden lg:block">
              <PriceTable
                rows={rows}
                cropById={cropById}
                marketById={marketById}
                sort={sort}
                onSort={onSort}
                onSelect={select}
              />
            </div>

            <div className="lg:hidden">
              <label className="mb-3 flex items-center justify-end gap-2 text-xs font-semibold text-muted">
                {t.results.sortLabel}
                <span className="relative">
                  <select
                    value={`${sort.key}:${sort.dir}`}
                    onChange={(e) => {
                      const [key, dir] = e.target.value.split(":") as [SortKey, "asc" | "desc"];
                      setSort({ key, dir });
                    }}
                    className="h-9 appearance-none rounded-full border border-line bg-white pr-8 pl-3.5 text-sm font-semibold text-ink"
                  >
                    <option value="crop:asc">{t.results.sort.cropAsc}</option>
                    <option value="market:asc">{t.results.sort.marketAsc}</option>
                    <option value="modal:desc">{t.results.sort.modalDesc}</option>
                    <option value="modal:asc">{t.results.sort.modalAsc}</option>
                    <option value="change:desc">{t.results.sort.changeDesc}</option>
                    <option value="change:asc">{t.results.sort.changeAsc}</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2" aria-hidden />
                </span>
              </label>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {rows.map((p) => (
                  <li key={p.id} className="min-w-0">
                    <PriceCard
                      price={p}
                      crop={cropById.get(p.cropId)}
                      market={marketById.get(p.marketId)}
                      onSelect={() => select(p)}
                    />
                  </li>
                ))}
              </ul>
            </div>

            {sorted.length > visible && (
              <div className="mt-6 flex flex-col items-center gap-2">
                <Button variant="outline" onClick={() => setVisible((v) => v + PAGE)}>
                  {t.results.showMore}
                  <ChevronDown />
                </Button>
                <p className="text-xs text-muted tabular">
                  {t.results.showing(rows.length, sorted.length)}
                </p>
              </div>
            )}
          </>
        )}
      </m.div>

      {selected && (
        <PriceDetails
          price={selected}
          open={open}
          onOpenChange={setOpen}
          crop={cropById.get(selected.cropId)}
          market={marketById.get(selected.marketId)}
          source={source}
        />
      )}
    </div>
  );
}
