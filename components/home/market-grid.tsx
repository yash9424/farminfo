import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/card";
import { getI18n } from "@/lib/i18n";
import type { DataSourceInfo, MarketOverview } from "@/lib/types";
import { cn } from "@/lib/utils";
import { cityLabel, districtLabel } from "@/locales";

/** Headline yards shown on the home page, in display order */
export const FEATURED_MARKET_IDS = [
  "rajkot",
  "gondal",
  "jamnagar",
  "ahmedabad",
  "unjha",
  "morbi",
  "surendranagar",
  "junagadh",
  "mehsana",
  "bhavnagar",
];

export async function MarketGrid({
  markets,
  totalMarkets,
  source,
}: {
  markets: MarketOverview[];
  totalMarkets: number;
  source: DataSourceInfo;
}) {
  const { t } = await getI18n();
  return (
    <section
      id="markets"
      aria-labelledby="markets-title"
      className="relative overflow-hidden bg-forest-950 py-20 text-white lg:py-32"
    >
      <div aria-hidden className="bg-dots absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="absolute top-0 right-0 size-[36rem] translate-x-1/3 -translate-y-1/3 rounded-full bg-forest-600/25 blur-3xl"
      />
      <div className="container-x relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="markets-title"
            eyebrow={t.marketGrid.eyebrow}
            title={<span className="text-white">{t.marketGrid.title}</span>}
            description={<span className="text-cream-300/80">{t.marketGrid.description}</span>}
            className="[&>p:first-child]:text-gold-300"
          />
          <Link
            href="/prices"
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 md:self-auto"
          >
            {t.marketGrid.viewAll(totalMarkets)} <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <Stagger
          as="ul"
          className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5"
          stagger={0.05}
        >
          {markets.map(({ market, cropCount }, i) => (
            <StaggerItem as="li" key={market.id}>
              <Link
                href={`/prices?market=${market.id}`}
                className={cn(
                  "group relative flex h-full min-h-40 flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-500 ease-(--ease-out-expo) hover:-translate-y-1 hover:border-gold-300/40 hover:bg-white/[0.08]",
                )}
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-sm text-gold-300/80 tabular">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <ArrowUpRight
                    className="size-4 text-white/40 transition-all duration-500 group-hover:rotate-45 group-hover:text-gold-300"
                    aria-hidden
                  />
                </div>
                <div className="mt-6">
                  <h3 className="font-display text-[1.2rem] leading-tight [overflow-wrap:anywhere] text-white sm:text-[1.4rem]">
                    {cityLabel(t, market)}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-cream-300/70">
                    <MapPin className="size-3" aria-hidden />
                    {t.format.district(districtLabel(t, market.district))}
                  </p>
                  <p className="mt-4 inline-flex rounded-full bg-white/8 px-2.5 py-1 text-xs font-semibold text-cream-100 tabular">
                    {t.marketGrid.cropsListed(cropCount)}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-6 text-xs text-cream-300/60">
          {source.isDemo ? t.marketGrid.noteDemo : t.marketGrid.noteLive}
        </p>
      </div>
    </section>
  );
}
