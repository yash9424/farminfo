"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ArrowRight, MapPin, X } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useLanguage } from "@/components/i18n/language-provider";
import { ChangeBadge, DemoBadge } from "@/components/ui/badge";
import { CropIcon } from "@/components/ui/crop-icon";
import type { Crop, DataSourceInfo, Market, MarketPrice } from "@/lib/types";
import { formatINR, formatLongDate, formatUpdated, trendOf } from "@/lib/utils";
import { cropLabel, districtLabel, marketLabel, sourceText } from "@/locales";
import { PriceChart } from "./price-chart";

const DESKTOP = "(min-width: 768px)";

function useIsDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(DESKTOP);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(DESKTOP).matches,
    () => true,
  );
}

/**
 * Detail view for one price entry — a right-hand panel on desktop and a bottom
 * sheet on mobile. Radix provides focus trapping, Esc to close and aria wiring.
 */
export default function PriceDetails({
  price,
  open,
  onOpenChange,
  crop,
  market,
  source,
}: {
  price: MarketPrice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  crop?: Crop;
  market?: Market;
  source: DataSourceInfo;
}) {
  const desktop = useIsDesktop();
  const { t, locale } = useLanguage();
  const cropName = cropLabel(t, crop, price?.cropId ?? "");
  const history = price?.history ?? [];
  const weekFirst = history[0]?.modalPrice;
  const weekChange =
    price && weekFirst ? Math.round(((price.modalPrice - weekFirst) / weekFirst) * 1000) / 10 : null;
  const values = history.map((h) => h.modalPrice);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && price && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <m.div
                className="fixed inset-0 z-[60] bg-forest-950/45 backdrop-blur-[3px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <m.div
                initial={desktop ? { x: "100%" } : { y: "100%" }}
                animate={desktop ? { x: 0 } : { y: 0 }}
                exit={desktop ? { x: "100%" } : { y: "100%" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-x-0 bottom-0 z-[61] flex max-h-[92dvh] flex-col overflow-hidden rounded-t-[2rem] bg-cream-50 shadow-float outline-none md:inset-y-3 md:right-3 md:left-auto md:max-h-none md:w-[34rem] md:rounded-[2rem]"
              >
                <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-forest-900/15 md:hidden" aria-hidden />

                <div className="flex items-start gap-4 border-b border-line px-5 pt-4 pb-5 sm:px-7 md:pt-7">
                  <CropIcon cropId={price.cropId} size="lg" />
                  <div className="min-w-0 flex-1">
                    <Dialog.Title className="font-display text-[1.75rem] leading-tight text-forest-950">
                      {cropName}
                    </Dialog.Title>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                      <MapPin className="size-3.5" aria-hidden />
                      {marketLabel(t, market, price.marketId)}
                      {market && (
                        <span className="text-muted/70">· {districtLabel(t, market.district)}</span>
                      )}
                    </p>
                  </div>
                  <Dialog.Close
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-forest-900/5 text-ink transition-colors hover:bg-forest-900/10"
                    aria-label={t.details.close}
                  >
                    <X className="size-5" />
                  </Dialog.Close>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-6 pb-8 sm:px-7">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-[0.6875rem] font-bold tracking-[0.14em] text-muted uppercase">
                        {t.details.modalAverage}
                      </p>
                      <p className="mt-1 tabular">
                        <span className="font-display text-5xl leading-none font-medium tracking-tight text-forest-950">
                          {formatINR(price.modalPrice)}
                        </span>
                        <span className="ml-1.5 text-sm text-muted">{t.common.perQuintal}</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <ChangeBadge value={price.changePercent} />
                      <span className="text-xs text-muted">{t.details.vsPrevious}</span>
                    </div>
                  </div>

                  <dl className="mt-6 grid grid-cols-2 gap-2.5">
                    {[
                      [t.details.minimum, formatINR(price.minPrice)],
                      [t.details.maximum, formatINR(price.maxPrice)],
                      [t.details.variety, price.variety],
                      [t.details.unit, t.common.quintalLong],
                      [t.details.date, formatLongDate(price.date, locale)],
                      [t.details.lastUpdated, formatUpdated(price.updatedAt, price.date, locale)],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-2xl border border-line/70 bg-white px-4 py-3">
                        <dt className="text-[0.6875rem] font-bold tracking-[0.12em] text-muted uppercase">{k}</dt>
                        <dd className="mt-1 text-[0.9375rem] font-semibold break-words text-ink tabular">
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <section aria-labelledby="trend-title" className="mt-7 rounded-3xl border border-line/70 bg-white p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 id="trend-title" className="font-display text-lg text-forest-950">
                        {t.details.trendTitle(history.length)}
                      </h3>
                      {weekChange !== null && history.length > 1 && (
                        <span className="text-xs text-muted">
                          {t.details.week}: <span className="font-semibold text-ink">{weekChange > 0 ? "+" : ""}{weekChange}%</span>
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <PriceChart points={history} cropName={cropName} trend={trendOf(weekChange)} />
                    </div>
                    {values.length > 1 && (
                      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3 text-center text-xs text-muted">
                        <p>
                          {t.details.low} <span className="block text-sm font-semibold text-ink tabular">{formatINR(Math.min(...values))}</span>
                        </p>
                        <p>
                          {t.details.average}{" "}
                          <span className="block text-sm font-semibold text-ink tabular">
                            {formatINR(values.reduce((a, b) => a + b, 0) / values.length)}
                          </span>
                        </p>
                        <p>
                          {t.details.high} <span className="block text-sm font-semibold text-ink tabular">{formatINR(Math.max(...values))}</span>
                        </p>
                      </div>
                    )}
                  </section>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-cream-200/60 px-4 py-3 text-xs text-muted">
                    <span className="flex items-center gap-2">
                      {t.details.source}:{" "}
                      <span className="font-semibold text-ink-soft">{sourceText(t, source).name}</span>
                    </span>
                    {source.isDemo && <DemoBadge />}
                  </div>

                  <Link
                    href={`/prices?crop=${price.cropId}`}
                    onClick={() => onOpenChange(false)}
                    className="mt-5 flex items-center justify-between rounded-2xl bg-forest-900 px-5 py-4 text-sm font-semibold text-cream-50 transition-colors hover:bg-forest-800"
                  >
                    {t.details.compare(cropName)}
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </m.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
