import { ChevronRight } from "lucide-react";
import { ChangeBadge } from "@/components/ui/badge";
import { CropIcon } from "@/components/ui/crop-icon";
import type { Crop, Market, MarketPrice } from "@/lib/types";
import { formatINR, formatUpdated } from "@/lib/utils";

/** Mobile representation of one price row. */
export function PriceCard({
  price,
  crop,
  market,
  onSelect,
}: {
  price: MarketPrice;
  crop?: Crop;
  market?: Market;
  onSelect: () => void;
}) {
  const cropName = crop?.name ?? price.cropId;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-haspopup="dialog"
      aria-label={`${cropName}, ${market?.city ?? ""}, ${price.variety}: modal price ${formatINR(price.modalPrice)} per quintal. View details`}
      className="group w-full rounded-3xl border border-line/80 bg-white p-4 text-left shadow-soft transition-all duration-300 active:scale-[0.99] hover:border-forest-200 hover:shadow-lift"
    >
      <div className="flex items-center gap-3">
        <CropIcon cropId={price.cropId} size="sm" className="size-11" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg leading-tight text-forest-950">{cropName}</p>
          <p className="truncate text-[0.8125rem] text-muted">
            {market?.city ?? price.marketId} · {price.variety}
          </p>
        </div>
        <ChangeBadge value={price.changePercent} size="sm" />
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-3 gap-y-2 rounded-2xl bg-cream-100 px-3.5 py-3">
        <div>
          <p className="text-[0.625rem] font-bold tracking-[0.14em] text-muted uppercase">Modal</p>
          <p className="mt-0.5 font-display text-2xl leading-none text-forest-950 tabular">
            {formatINR(price.modalPrice)}
            <span className="ml-1 font-sans text-xs text-muted">/ Qtl</span>
          </p>
        </div>
        <div className="flex gap-4 text-right">
          <div>
            <p className="text-[0.625rem] font-bold tracking-[0.14em] text-muted uppercase">Min</p>
            <p className="mt-0.5 text-sm font-semibold text-ink-soft tabular">{formatINR(price.minPrice)}</p>
          </div>
          <div>
            <p className="text-[0.625rem] font-bold tracking-[0.14em] text-muted uppercase">Max</p>
            <p className="mt-0.5 text-sm font-semibold text-ink-soft tabular">{formatINR(price.maxPrice)}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted">
        <span>Updated {formatUpdated(price.updatedAt, price.date)}</span>
        <span className="flex items-center gap-0.5 font-semibold text-forest-700">
          Details
          <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </button>
  );
}
