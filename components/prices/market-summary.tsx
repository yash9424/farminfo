import { Clock, Database, Sprout, Store } from "lucide-react";
import { DemoBadge } from "@/components/ui/badge";
import { getI18n } from "@/lib/i18n";
import type { DataSourceInfo, Market, MarketPrice } from "@/lib/types";
import { formatLongDate, formatUpdated } from "@/lib/utils";
import { districtLabel, marketLabel, sourceText } from "@/locales";

export async function MarketSummary({
  market,
  prices,
  date,
  source,
}: {
  market?: Market;
  prices: MarketPrice[];
  date: string;
  source: DataSourceInfo;
}) {
  const { t, locale } = await getI18n();
  const cropCount = new Set(prices.map((p) => p.cropId)).size;
  const marketCount = new Set(prices.map((p) => p.marketId)).size;
  const latest = prices.reduce<string | null>(
    (acc, p) => (p.updatedAt && (!acc || p.updatedAt > acc) ? p.updatedAt : acc),
    null,
  );

  const cards = [
    {
      icon: Store,
      label: t.summary.selectedMarket,
      value: market ? marketLabel(t, market) : t.summary.allMarkets,
      sub: market
        ? t.format.district(districtLabel(t, market.district))
        : t.summary.yardsInView(marketCount),
    },
    {
      icon: Clock,
      label: t.summary.lastUpdated,
      value: prices.length ? formatUpdated(latest, date, locale) : "—",
      sub: formatLongDate(date, locale),
    },
    {
      icon: Sprout,
      label: t.summary.numberOfCrops,
      value: String(cropCount),
      sub: t.summary.entries(prices.length),
    },
  ];

  return (
    <section aria-label={t.summary.aria} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map(({ icon: Icon, label, value, sub }) => (
        <div key={label} className="min-w-0 rounded-3xl border border-line/80 bg-white p-4 shadow-soft sm:p-5">
          <p className="flex items-center gap-2 text-[0.625rem] font-bold tracking-[0.12em] text-muted uppercase sm:text-[0.6875rem]">
            <Icon className="size-4 text-forest-600" aria-hidden />
            {label}
          </p>
          <p className="mt-2.5 line-clamp-2 font-display text-lg leading-tight text-forest-950 tabular sm:mt-3 sm:text-2xl">{value}</p>
          <p className="mt-1 truncate text-xs text-muted sm:text-sm">{sub}</p>
        </div>
      ))}
      <div className="min-w-0 rounded-3xl border border-forest-800 bg-forest-900 p-4 text-cream-100 shadow-soft sm:p-5">
        <p className="flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.14em] text-gold-300 uppercase">
          <Database className="size-4" aria-hidden />
          {t.summary.dataSource}
        </p>
        <p className="mt-2.5 line-clamp-2 text-sm leading-snug font-semibold text-white sm:mt-3 sm:text-[0.9375rem]">
          {sourceText(t, source).name}
        </p>
        <div className="mt-2 flex items-center gap-2">
          {source.isDemo ? (
            <DemoBadge tone="glass" />
          ) : (
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-gold-300 underline-offset-4 hover:underline"
            >
              {t.common.viewSource}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
