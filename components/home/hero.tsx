import { ArrowRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HeroSearch } from "@/components/search/hero-search";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import type { State } from "@/lib/types";
import heroImage from "@/public/images/mi/hero.jpg";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function Hero({
  states,
  stats,
  isDemo,
}: {
  states: State[];
  stats: { listings: number; sellers: number; states: number; categories: number };
  isDemo: boolean;
}) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-graphite-950 text-white">
      <div className="hero-zoom absolute inset-0 -z-10">
        <Image
          src={heroImage}
          alt="Close-up of precision CNC machine components"
          fill
          priority
          placeholder="blur"
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(95deg,rgb(11_13_16/0.94)_0%,rgb(11_13_16/0.78)_45%,rgb(11_13_16/0.35)_100%)]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(11_13_16/0.95),transparent_45%)]" />
      <div aria-hidden className="bg-blueprint absolute inset-0 -z-10 opacity-50 [mask-image:linear-gradient(to_right,black,transparent_75%)]" />

      <div className="container-x pt-32 pb-14 sm:pt-40 lg:pt-44 lg:pb-20">
        <div className="max-w-3xl">
          <p className="rise inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[0.6875rem] font-bold tracking-[0.2em] text-accent-300 uppercase backdrop-blur" style={d(60)}>
            <span className="size-1.5 rounded-full bg-accent-500" aria-hidden />
            India’s CNC &amp; VMC Parts Marketplace
          </p>
          <h1
            id="hero-title"
            className="rise mt-6 text-[2.55rem] leading-[1.03] font-extrabold tracking-[-0.035em] min-[400px]:text-[2.9rem] sm:text-6xl lg:text-[4.4rem]"
            style={d(140)}
          >
            Find the Right <span className="text-accent-400">CNC &amp; VMC</span> Part.
          </h1>
          <p className="rise mt-5 max-w-xl text-base leading-relaxed text-graphite-300 sm:text-lg" style={d(240)}>
            Discover machine parts, spares and components from sellers across India.
          </p>
        </div>

        <div className="rise mt-9 max-w-4xl" style={d(340)}>
          <HeroSearch states={states} />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-graphite-400">Popular:</span>
            {siteConfig.popularSearches.map((s) => (
              <Link
                key={s}
                href={`/parts?q=${encodeURIComponent(s)}`}
                className="rounded-lg border border-white/12 bg-white/6 px-3 py-1.5 text-sm font-medium text-graphite-200 backdrop-blur transition-colors hover:border-white/30 hover:bg-white/12 hover:text-white"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        <div className="rise mt-9 flex flex-col gap-3 sm:flex-row" style={d(440)}>
          <ButtonLink href="/parts" variant="light" size="lg">
            Find Parts
            <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
          </ButtonLink>
          <ButtonLink href={siteConfig.listCta.href} variant="glass" size="lg">
            <Plus aria-hidden />
            List Your Part
          </ButtonLink>
        </div>

        <dl className="rise mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4" style={d(540)}>
          {[
            [stats.listings, "Part listings"],
            [stats.categories, "Part categories"],
            [stats.sellers, "Sellers"],
            [stats.states, "States"],
          ].map(([value, label]) => (
            <div key={label} className="bg-graphite-950/70 px-5 py-4 backdrop-blur">
              <dt className="text-xs text-graphite-400">{label}</dt>
              <dd className="mt-1 text-2xl font-extrabold tracking-tight text-white tabular">{value}</dd>
            </div>
          ))}
        </dl>
        {isDemo && (
          <p className="mt-3 text-xs text-graphite-500">Figures reflect the current demo listings, not live marketplace inventory.</p>
        )}
      </div>
    </section>
  );
}
