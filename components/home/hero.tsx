import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import { ChangeBadge, DemoBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { CropIcon } from "@/components/ui/crop-icon";
import { Sparkline } from "@/components/ui/sparkline";
import type { DataSourceInfo, FeaturedPrice } from "@/lib/types";
import { formatINR, formatUpdated } from "@/lib/utils";
import heroImage from "@/public/images/hero.jpg";

function delay(ms: number) {
  return { "--d": `${ms}ms` } as React.CSSProperties;
}

export function Hero({
  featured,
  ticker,
  source,
}: {
  featured?: FeaturedPrice;
  ticker: FeaturedPrice[];
  source: DataSourceInfo;
}) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-forest-950 text-white"
    >
      <div className="hero-zoom absolute inset-0 -z-10">
        <Image
          src={heroImage}
          alt="Farmland at sunrise with mist over the fields and hills beyond"
          fill
          priority
          placeholder="blur"
          quality={75}
          sizes="100vw"
          className="object-cover object-[60%_center]"
        />
      </div>
      {/* legibility: deep green from the bottom-left, warm sky kept visible top-right */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(7_32_22/0.96)_0%,rgb(7_32_22/0.7)_32%,rgb(7_32_22/0.12)_62%,rgb(7_32_22/0.35)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(7_32_22/0.72)_0%,rgb(7_32_22/0.25)_48%,transparent_75%)]"
      />
      <div aria-hidden className="bg-grain absolute inset-0 -z-10 opacity-[0.18] mix-blend-overlay" />

      <div className="container-x relative flex flex-1 flex-col justify-end pt-28 pb-10 lg:pb-14">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
          <div className="max-w-3xl">
            <p
              className="rise inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[0.6875rem] font-bold tracking-[0.22em] text-gold-200 uppercase ring-1 ring-white/15 backdrop-blur-md"
              style={delay(80)}
            >
              <MapPin className="size-3.5" aria-hidden />
              Gujarat Agriculture Market
            </p>
            <h1
              id="hero-title"
              className="mt-6 text-[2.6rem] leading-[1.02] font-medium tracking-[-0.035em] text-white min-[400px]:text-[3rem] sm:text-[4.25rem] lg:text-[5.25rem]"
            >
              <span className="rise block" style={delay(180)}>
                Gujarat Na Pak Na Bhav,
              </span>
              <span className="rise block text-gold-200 italic" style={delay(300)}>
                Have Ekaj Jagyae.
              </span>
            </h1>
            <p
              className="rise mt-6 max-w-xl text-base leading-relaxed text-cream-100/85 sm:text-lg"
              style={delay(440)}
            >
              Check the latest agricultural crop prices from market yards across Gujarat — simple,
              fast and easy.
            </p>
            <div className="rise mt-9 flex flex-col gap-3 sm:flex-row" style={delay(560)}>
              <ButtonLink href="/prices" variant="gold" size="lg">
                Check Today&apos;s Bhav
                <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
              </ButtonLink>
              <ButtonLink href="/#markets" variant="glass" size="lg">
                Explore Market Yards
              </ButtonLink>
            </div>
          </div>

          {featured && <HeroPriceCard featured={featured} source={source} />}
        </div>
      </div>

      {ticker.length > 0 && <Ticker items={ticker} isDemo={source.isDemo} />}
    </section>
  );
}

function HeroPriceCard({ featured, source }: { featured: FeaturedPrice; source: DataSourceInfo }) {
  const { price, crop, market } = featured;
  return (
    <div className="rise hidden sm:block" style={delay(700)}>
      <div className="animate-float">
        <article
          aria-label={`Today's market: ${crop.name} at ${market.name}`}
          className="relative w-full max-w-sm rounded-[1.75rem] border border-white/15 bg-white/[0.08] p-2 shadow-float backdrop-blur-2xl"
        >
          <div className="rounded-[1.35rem] bg-cream-50 p-5 text-ink">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.2em] text-forest-700 uppercase">
                <span className="relative flex size-2">
                  <span className="animate-pulse-ring absolute inset-0 rounded-full bg-forest-500" />
                  <span className="relative size-2 rounded-full bg-forest-500" />
                </span>
                Today&apos;s Market
              </p>
              {source.isDemo && <DemoBadge />}
            </div>

            <div className="mt-5 flex items-center gap-3.5">
              <CropIcon cropId={crop.id} size="md" />
              <div className="min-w-0">
                <p className="font-display text-xl leading-tight text-forest-950">{crop.name}</p>
                <p className="truncate text-sm text-muted">
                  {market.name} · {price.variety}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-end justify-between gap-3">
              <p className="tabular">
                <span className="font-display text-[2.4rem] leading-none font-medium tracking-tight text-forest-950">
                  {formatINR(price.modalPrice)}
                </span>
                <span className="ml-1.5 text-sm text-muted">/ Quintal</span>
              </p>
              <ChangeBadge value={price.changePercent} />
            </div>

            <Sparkline
              points={price.history}
              change={price.changePercent}
              className="mt-4 h-12"
              width={260}
              height={48}
            />

            <div className="mt-4 flex items-center justify-between border-t border-line pt-3.5 text-xs text-muted">
              <span className="tabular">
                Range {formatINR(price.minPrice)} – {formatINR(price.maxPrice)}
              </span>
              <span>{formatUpdated(price.updatedAt, price.date)}</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

function Ticker({ items, isDemo }: { items: FeaturedPrice[]; isDemo: boolean }) {
  const row = (hidden: boolean) =>
    items.map(({ price, crop, market }) => (
      <li
        key={`${hidden ? "b" : "a"}-${price.id}`}
        aria-hidden={hidden || undefined}
        className="flex shrink-0 items-center gap-3 px-6 text-sm"
      >
        <span className="font-semibold text-white">{crop.name}</span>
        <span className="text-cream-300/60">{market.city}</span>
        <span className="font-semibold text-gold-200 tabular">{formatINR(price.modalPrice)}</span>
        <ChangeBadge value={price.changePercent} size="sm" className="bg-white/10 text-white" />
        <span className="ml-3 size-1 rounded-full bg-white/25" aria-hidden />
      </li>
    ));

  return (
    <div className="rise relative border-t border-white/10 bg-forest-950/55 backdrop-blur-md" style={delay(900)}>
      <div className="flex items-center">
        <p className="relative z-10 hidden shrink-0 items-center gap-2 self-stretch border-r border-white/10 bg-forest-950 px-5 text-[0.6875rem] font-bold tracking-[0.2em] text-gold-300 uppercase sm:flex">
          {isDemo ? "Sample bhav" : "Latest bhav"}
        </p>
        <div className="relative flex-1 overflow-hidden py-3.5 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          <ul className="marquee-track flex w-max animate-marquee hover:[animation-play-state:paused]">
            {row(false)}
            {row(true)}
          </ul>
        </div>
      </div>
    </div>
  );
}
