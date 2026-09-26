import { CalendarClock, Layers, Map, Store, type LucideIcon } from "lucide-react";
import { CountUp } from "@/components/motion/count-up";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import type { DatasetStats } from "@/lib/types";
import { formatLongDate } from "@/lib/utils";

interface Stat {
  icon: LucideIcon;
  value: number;
  label: string;
  hint: string;
}

export function Stats({ stats }: { stats: DatasetStats }) {
  const items: Stat[] = [
    {
      icon: Store,
      value: stats.marketCount,
      label: "Gujarat Market Yards",
      hint: "APMC yards in the current dataset",
    },
    {
      icon: Layers,
      value: stats.cropCategoryCount,
      label: "Crop Categories",
      hint: `${stats.cropCount} crops across cereals, pulses, oilseeds & more`,
    },
    {
      icon: CalendarClock,
      value: stats.priceEntryCount,
      label: "Daily Price Entries",
      hint: `Rows for ${formatLongDate(stats.latestDate)}`,
    },
    {
      icon: Map,
      value: stats.districtCount,
      label: "Districts Covered",
      hint: "Saurashtra, Kutch, North, Central & South",
    },
  ];

  return (
    <section aria-label="Coverage" className="relative z-10 -mt-px bg-cream-100">
      <div className="container-x py-14 lg:py-20">
        <Stagger className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" amount={0.3}>
          {items.map(({ icon: Icon, value, label, hint }) => (
            <StaggerItem
              key={label}
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
            ? "Figures are computed from the FarmInfo demo dataset and will reflect real coverage once a live source is connected."
            : `Figures are computed from ${stats.source.name}.`}
        </p>
      </div>
    </section>
  );
}
