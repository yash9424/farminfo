import { Info } from "lucide-react";
import Link from "next/link";
import { DemoBadge } from "@/components/ui/badge";
import { Eyebrow } from "@/components/ui/card";
import type { DataSourceInfo } from "@/lib/types";
import { formatLongDate } from "@/lib/utils";

export function PricesHeader({
  source,
  date,
  latestDate,
}: {
  source?: DataSourceInfo;
  date?: string;
  latestDate?: string;
}) {
  const historic = date && latestDate && date !== latestDate;
  return (
    <section className="relative overflow-hidden bg-forest-950 pt-28 pb-20 text-white lg:pt-36 lg:pb-24">
      <div aria-hidden className="bg-dots absolute inset-0 opacity-50" />
      <div
        aria-hidden
        className="absolute -top-40 right-0 size-[34rem] translate-x-1/4 rounded-full bg-forest-600/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-40 left-10 size-80 rounded-full bg-gold-500/10 blur-3xl"
      />
      <div className="container-x relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <Eyebrow className="text-gold-300">Market dashboard</Eyebrow>
          <h1 className="mt-4 text-[2.6rem] leading-[1.02] font-medium tracking-[-0.03em] sm:text-6xl">
            Market Prices
          </h1>
          <p className="mt-4 text-base leading-relaxed text-cream-100/80 sm:text-lg">
            Check agricultural crop prices across Gujarat market yards.
          </p>
        </div>
        {source && date && (
          <div className="flex flex-col items-start gap-2 md:items-end">
            <p className="rounded-full bg-white/8 px-4 py-2 text-sm text-cream-100 ring-1 ring-white/12">
              {historic ? "Showing prices for " : "Latest prices · "}
              <span className="font-semibold text-white">{formatLongDate(date)}</span>
            </p>
            {source.isDemo && (
              <p className="flex items-center gap-2 text-xs text-cream-300/75">
                <DemoBadge tone="glass" />
                Sample prices —{" "}
                <Link href="/about#data" className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-white">
                  <Info className="size-3" aria-hidden /> learn more
                </Link>
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
