import { CalendarClock, Layers, Map, Store, type LucideIcon } from "lucide-react";
import { CountUp } from "@/components/motion/count-up";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { getI18n } from "@/lib/i18n";
import type { DatasetStats } from "@/lib/types";
import { formatLongDate } from "@/lib/utils";
import { sourceText } from "@/locales";

interface Stat {
  icon: LucideIcon;
  value: number;
  label: string;
  hint: string;
}

export async function Stats({ stats }: { stats: DatasetStats }) {
  const { t, locale } = await getI18n();
  const items: Stat[] = [
    {
      icon: Store,
      value: stats.marketCount,
      label: t.stats.marketsLabel,
      hint: t.stats.marketsHint,
    },
    {
      icon: Layers,
      value: stats.cropCategoryCount,
      label: t.stats.categoriesLabel,
      hint: t.stats.categoriesHint(stats.cropCount),
    },
    {
      icon: CalendarClock,
      value: stats.priceEntryCount,
      label: t.stats.entriesLabel,
      hint: t.stats.entriesHint(formatLongDate(stats.latestDate, locale)),
    },
    {
      icon: Map,
      value: stats.districtCount,
      label: t.stats.districtsLabel,
      hint: t.stats.districtsHint,
    },
  ];

  return (
    <section aria-label={t.stats.aria} className="relative z-10 -mt-px bg-cream-100">
      <div className="container-x py-14 lg:py-20">
        <Stagger className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" amount={0.3}>
          {items.map(({ icon: Icon, value, label, hint }, i) => (
            <StaggerItem
              key={i}
              className="group relative overflow-hidden rounded-3xl border border-line/80 bg-white p-5 shadow-soft transition-shadow duration-500 hover:shadow-lift sm:p-7"
            >
              <div
                aria-hidden
                className="absolute -top-16 -right-16 size-40 rounded-full bg-gold-100/60 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
              />
              <Icon className="relative size-5 text-forest-600" strokeWidth={1.8} aria-hidden />
              <p className="relative mt-6 font-display text-[2.4rem] leading-none font-medium tracking-tight text-forest-950 tabular sm:text-5xl">
                <CountUp value={value} />
              </p>
              <p className="relative mt-3 text-sm font-semibold text-ink sm:text-[0.9375rem]">
                {label}
              </p>
              <p className="relative mt-1 hidden text-xs leading-relaxed text-muted sm:block">
                {hint}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-5 text-center text-xs text-muted">
          {stats.source.isDemo
            ? t.stats.noteDemo
            : t.stats.noteLive(sourceText(t, stats.source).name)}
        </p>
      </div>
    </section>
  );
}
