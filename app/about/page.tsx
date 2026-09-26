import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  ChartSpline,
  Compass,
  Database,
  Link2,
  Scale,
  ShieldCheck,
  Smartphone,
  Sprout,
  Store,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { GujaratMap } from "@/components/about/gujarat-map";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { DemoBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, SectionHeading } from "@/components/ui/card";
import { getDataSource, getDatasetStats, getMarkets } from "@/lib/market-data";
import { AGMARKNET_SOURCE_URL } from "@/lib/site";
import { formatLongDate } from "@/lib/utils";
import aboutImage from "@/public/images/about.jpg";
import marketImage from "@/public/images/market.jpg";

export const metadata: Metadata = {
  title: "About FarmInfo",
  description:
    "FarmInfo makes agricultural market-yard price information across Gujarat easier to discover and understand.",
  alternates: { canonical: "/about" },
};

export const revalidate = 1800;

const CAPABILITIES = [
  { icon: Store, title: "Market-wise prices", body: "Open any Gujarat APMC and see every crop it lists for the day." },
  { icon: Sprout, title: "Crop-wise prices", body: "Follow one crop — jeera, kapas, groundnut — across all yards." },
  { icon: Scale, title: "Price comparison", body: "Minimum, maximum and modal prices side by side, sortable." },
  { icon: Compass, title: "Market discovery", body: "Find yards across Saurashtra, Kutch, North, Central and South Gujarat." },
  { icon: ChartSpline, title: "Price trends", body: "A 7-day chart for every entry shows which way the bhav is moving." },
  { icon: Smartphone, title: "Mobile access", body: "Designed phone-first, with cards instead of cramped tables." },
];

export default async function AboutPage() {
  const source = getDataSource();
  const [stats, markets] = await Promise.all([
    getDatasetStats().catch(() => null),
    getMarkets().catch(() => []),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-forest-950 text-white">
        <Image
          src={aboutImage}
          alt="Aerial view of green paddy fields stretching toward distant hills"
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="hero-zoom -z-10 object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(7_32_22/0.95),rgb(7_32_22/0.55)_45%,rgb(7_32_22/0.35))]"
        />
        <div className="container-x pt-36 pb-16 lg:pb-24">
          <p className="rise text-[0.6875rem] font-bold tracking-[0.24em] text-gold-300 uppercase">
            About FarmInfo
          </p>
          <h1
            className="rise mt-5 max-w-4xl text-[2.5rem] leading-[1.03] font-medium tracking-[-0.03em] sm:text-6xl lg:text-7xl"
            style={{ "--d": "120ms" } as React.CSSProperties}
          >
            Making Market Information <em className="text-gold-200">Easier To Access.</em>
          </h1>
          <p
            className="rise mt-6 max-w-xl text-base leading-relaxed text-cream-100/85 sm:text-lg"
            style={{ "--d": "240ms" } as React.CSSProperties}
          >
            FarmInfo is designed to make agricultural market information easier to discover and
            understand — for farmers, traders and everyone who follows Gujarat’s market yards.
          </p>
        </div>
      </section>

      {/* Purpose */}
      <section aria-labelledby="purpose-title" className="bg-cream-100 py-20 lg:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <Eyebrow>Our purpose</Eyebrow>
            <h2 id="purpose-title" className="mt-4 text-[2.1rem] leading-[1.06] font-medium text-forest-950 sm:text-5xl">
              Prices shouldn’t be hard to find.
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted sm:text-lg">
              <p>
                Agricultural prices are often spread across different sources and interfaces —
                government portals, yard notice boards, newspapers, messages forwarded between
                phones. Each shows a slice, in its own format.
              </p>
              <p>
                FarmInfo aims to provide a cleaner way to explore market prices: one consistent view
                of minimum, maximum and modal bhav, organised by market and crop, that reads well on
                any phone.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-float">
              <Image
                src={marketImage}
                alt="A vendor at a produce market stall with heaped sacks of spices"
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 left-4 max-w-xs rounded-3xl border border-line bg-white p-5 shadow-lift sm:left-8">
              <p className="font-display text-lg leading-snug text-forest-950">
                “What is my crop fetching today — and where?”
              </p>
              <p className="mt-2 text-sm text-muted">The one question FarmInfo is built to answer.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What you can do */}
      <section aria-labelledby="capabilities-title" className="bg-white py-20 lg:py-32">
        <div className="container-x">
          <SectionHeading
            id="capabilities-title"
            eyebrow="What you can do"
            title="Everything you need to read the market."
            description="Six simple tools, one clean interface."
          />
          <Stagger as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
            {CAPABILITIES.map(({ icon: Icon, title, body }, i) => (
              <StaggerItem
                as="li"
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-line/70 bg-cream-50 p-7 transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-lift"
              >
                <span className="absolute top-6 right-7 font-display text-sm text-muted/60 tabular">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="grid size-12 place-items-center rounded-2xl bg-forest-900 text-gold-300 transition-transform duration-500 group-hover:-rotate-6">
                  <Icon className="size-5.5" strokeWidth={1.8} aria-hidden />
                </span>
                <h3 className="mt-6 text-xl text-forest-950">{title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Built for Gujarat */}
      <section aria-labelledby="gujarat-title" className="relative overflow-hidden bg-forest-950 py-20 text-white lg:py-32">
        <div aria-hidden className="absolute top-1/2 left-1/2 size-[48rem] -translate-1/2 rounded-full bg-forest-700/25 blur-3xl" />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <Eyebrow className="text-gold-300">Built for Gujarat</Eyebrow>
            <h2 id="gujarat-title" className="mt-4 text-[2.1rem] leading-[1.06] font-medium sm:text-5xl">
              From Kutch to Navsari, <em className="text-gold-200">one view.</em>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-cream-100/75 sm:text-lg">
              Gujarat’s yards each have a character — groundnut and cotton in Saurashtra, jeera and
              variyali at Unjha, potatoes at Deesa, garlic at Gondal. FarmInfo is organised around
              that geography, with Gujarati crop names built into search.
            </p>
            {stats && (
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-8">
                {[
                  [stats.marketCount, "Market yards"],
                  [stats.districtCount, "Districts"],
                  [stats.cropCount, "Crops"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <dt className="text-xs text-cream-300/70">{l}</dt>
                    <dd className="mt-1 font-display text-3xl text-white tabular">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            {source.isDemo && (
              <p className="mt-4 text-xs text-cream-300/60">Counts reflect the current demo dataset.</p>
            )}
          </Reveal>
          <Reveal delay={0.15} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 sm:p-8">
            <GujaratMap markets={markets} />
          </Reveal>
        </div>
      </section>

      {/* Data transparency */}
      <section id="data" aria-labelledby="data-title" className="scroll-mt-24 bg-cream-100 py-20 lg:py-32">
        <div className="container-x">
          <SectionHeading
            id="data-title"
            eyebrow="Data transparency"
            title="Where the numbers come from."
            description="Trust starts with being clear about sources, timing and limits."
          />

          <Reveal className="mt-12 overflow-hidden rounded-[2rem] border border-line/80 bg-white shadow-soft">
            <div className="grid lg:grid-cols-[1.2fr_1fr]">
              <div className="p-7 sm:p-10">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-2xl bg-forest-100 text-forest-700">
                    <ShieldCheck className="size-5" aria-hidden />
                  </span>
                  {source.isDemo ? <DemoBadge /> : null}
                </div>
                <blockquote
                  id="disclaimer"
                  className="mt-6 scroll-mt-28 border-l-2 border-gold-400 pl-5 font-display text-xl leading-snug text-forest-950 sm:text-2xl"
                >
                  FarmInfo displays market information sourced from available agricultural data
                  providers. Data availability, update frequency, and accuracy may vary by source.
                </blockquote>
                <p className="mt-6 text-[0.9375rem] leading-relaxed text-muted">
                  Prices are indicative and are not an offer to buy or sell. Always confirm the
                  current bhav with your APMC or commission agent before trading.
                  {source.isDemo && (
                    <>
                      {" "}
                      <strong className="font-semibold text-ink">
                        FarmInfo is currently running on generated demo data — the prices shown are
                        samples for demonstration, not real market prices.
                      </strong>
                    </>
                  )}
                </p>
              </div>

              <dl className="grid content-start gap-px border-t border-line bg-line lg:border-t-0 lg:border-l">
                <div className="bg-cream-50 p-6 sm:px-8">
                  <dt className="flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.14em] text-muted uppercase">
                    <CalendarClock className="size-4 text-forest-600" aria-hidden /> Last updated
                  </dt>
                  <dd className="mt-2 font-display text-xl text-forest-950">
                    {stats ? formatLongDate(stats.latestDate) : "Currently unavailable"}
                  </dd>
                  <dd className="text-sm text-muted">{source.updateFrequency}</dd>
                </div>
                <div className="bg-cream-50 p-6 sm:px-8">
                  <dt className="flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.14em] text-muted uppercase">
                    <Database className="size-4 text-forest-600" aria-hidden /> Data source
                  </dt>
                  <dd className="mt-2 font-display text-xl text-forest-950">{source.name}</dd>
                  <dd className="text-sm leading-relaxed text-muted">{source.description}</dd>
                </div>
                <div className="bg-cream-50 p-6 sm:px-8">
                  <dt className="flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.14em] text-muted uppercase">
                    <Link2 className="size-4 text-forest-600" aria-hidden /> Source link
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={source.isDemo ? AGMARKNET_SOURCE_URL : source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-forest-700 underline-offset-4 hover:underline"
                    >
                      {source.isDemo ? "AGMARKNET dataset on data.gov.in" : "Open data source"}
                      <ArrowUpRight className="size-4" aria-hidden />
                    </a>
                  </dd>
                  {source.isDemo && (
                    <dd className="mt-1 text-sm text-muted">
                      The official open dataset FarmInfo is built to connect to.
                    </dd>
                  )}
                </div>
              </dl>
            </div>
          </Reveal>

          <div className="mt-14 flex flex-col items-center gap-4 text-center">
            <p className="font-display text-2xl text-forest-950">Ready to check today’s bhav?</p>
            <ButtonLink href="/prices" size="lg">
              View Market Prices <ArrowRight />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
