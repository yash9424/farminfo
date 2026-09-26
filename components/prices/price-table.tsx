"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useLanguage } from "@/components/i18n/language-provider";
import { ChangeBadge } from "@/components/ui/badge";
import { CropIcon } from "@/components/ui/crop-icon";
import type { Crop, Market, MarketPrice } from "@/lib/types";
import { cn, formatINR, formatUpdated } from "@/lib/utils";
import { cityLabel, cropLabel } from "@/locales";

export type SortKey = "crop" | "market" | "min" | "max" | "modal" | "change";
export interface SortState {
  key: SortKey;
  dir: "asc" | "desc";
}

function SortHeader({
  label,
  k,
  sort,
  onSort,
  align = "left",
}: {
  label: string;
  k: SortKey;
  sort: SortState;
  onSort: (k: SortKey) => void;
  align?: "left" | "right";
}) {
  const { t } = useLanguage();
  const active = sort.key === k;
  const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <th
      scope="col"
      aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
      className={cn("px-4 py-3.5 font-bold", align === "right" && "text-right")}
    >
      <button
        type="button"
        onClick={() => onSort(k)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md uppercase transition-colors hover:text-forest-900",
          active && "text-forest-900",
          align === "right" && "flex-row-reverse",
        )}
      >
        <span className="sr-only">{t.table.sortBy}</span>
        {label}
        <Icon className={cn("size-3.5", !active && "opacity-40")} aria-hidden />
      </button>
    </th>
  );
}

export function PriceTable({
  rows,
  cropById,
  marketById,
  sort,
  onSort,
  onSelect,
}: {
  rows: MarketPrice[];
  cropById: Map<string, Crop>;
  marketById: Map<string, Market>;
  sort: SortState;
  onSort: (k: SortKey) => void;
  onSelect: (p: MarketPrice) => void;
}) {
  const { t, locale } = useLanguage();
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-line/80 bg-white shadow-soft">
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[60rem] border-collapse text-left">
          <caption className="sr-only">
            {t.table.caption}
          </caption>
          <thead className="border-b border-line bg-cream-100/70 text-[0.6875rem] tracking-[0.12em] text-muted">
            <tr>
              <SortHeader label={t.table.crop} k="crop" sort={sort} onSort={onSort} />
              <SortHeader label={t.table.market} k="market" sort={sort} onSort={onSort} />
              <th scope="col" className="px-4 py-3.5 font-bold uppercase">{t.table.variety}</th>
              <SortHeader label={t.table.min} k="min" sort={sort} onSort={onSort} align="right" />
              <SortHeader label={t.table.max} k="max" sort={sort} onSort={onSort} align="right" />
              <SortHeader label={t.table.modal} k="modal" sort={sort} onSort={onSort} align="right" />
              <th scope="col" className="px-4 py-3.5 font-bold uppercase">{t.table.unit}</th>
              <SortHeader label={t.table.change} k="change" sort={sort} onSort={onSort} align="right" />
              <th scope="col" className="px-4 py-3.5 text-right font-bold uppercase">{t.table.updated}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {rows.map((p) => {
              const crop = cropById.get(p.cropId);
              const market = marketById.get(p.marketId);
              return (
                <tr
                  key={p.id}
                  onClick={() => onSelect(p)}
                  className="group cursor-pointer text-[0.9375rem] transition-colors duration-200 hover:bg-forest-50/60"
                >
                  <th scope="row" className="px-4 py-3 text-left font-normal">
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(p);
                      }}
                      className="flex items-center gap-3 rounded-lg text-left"
                    >
                      <CropIcon cropId={p.cropId} size="sm" />
                      <span className="font-semibold text-ink group-hover:text-forest-800">
                        {cropLabel(t, crop, p.cropId)}
                        <span className="sr-only">{t.table.viewDetails}</span>
                      </span>
                    </button>
                  </th>
                  <td className="px-4 py-3 text-ink-soft">{cityLabel(t, market, p.marketId)}</td>
                  <td className="max-w-40 truncate px-4 py-3 text-muted" title={p.variety}>
                    {p.variety}
                  </td>
                  <td className="px-4 py-3 text-right text-ink-soft tabular">{formatINR(p.minPrice)}</td>
                  <td className="px-4 py-3 text-right text-ink-soft tabular">{formatINR(p.maxPrice)}</td>
                  <td className="px-4 py-3 text-right font-bold text-forest-950 tabular">
                    {formatINR(p.modalPrice)}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap text-muted">{t.common.perQuintal}</td>
                  <td className="px-4 py-3 text-right">
                    <ChangeBadge value={p.changePercent} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-right text-sm whitespace-nowrap text-muted">
                    {formatUpdated(p.updatedAt, p.date, locale)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
