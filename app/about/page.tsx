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
import { getI18n } from "@/lib/i18n";
import { getDataSource, getDatasetStats, getMarkets } from "@/lib/market-data";
import { AGMARKNET_SOURCE_URL } from "@/lib/site";
import { formatLongDate } from "@/lib/utils";
import { sourceText } from "@/locales";
import aboutImage from "@/public/images/about.jpg";
import marketImage from "@/public/images/market.jpg";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: t.meta.aboutTitle,
    description: t.meta.aboutDescription,
    alternates: { canonical: "/about" },
  };
}

const CAPABILITY_ICONS = [Store, Sprout, Scale, Compass, ChartSpline, Smartphone];

export default async function AboutPage() {
  const { t, locale } = await getI18n();
  const source = getDataSource();
  const sourceInfo = sourceText(t, source);
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
          alt={t.about.heroAlt}
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
            {t.about.heroEyebrow}
          </p>
          <h1
            className="rise mt-5 max-w-4xl text-[2.5rem] leading-[1.03] font-medium tracking-[-0.03em] sm:text-6xl lg:text-7xl"
            style={{ "--d": "120ms" } as React.CSSProperties}
          >
            {t.about.heroTitleA} <em className="text-gold-200">{t.about.heroTitleB}</em>
          </h1>
          <p
            className="rise mt-6 max-w-xl text-base leading-relaxed text-cream-100/85 sm:text-lg"
            style={{ "--d": "240ms" } as React.CSSProperties}
          >
            {t.about.heroBody}
          </p>
        </div>
      </section>

      {/* Purpose */}
      <section aria-labelledby="purpose-title" className="bg-cream-100 py-20 lg:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <Eyebrow>{t.about.purposeEyebrow}</Eyebrow>
            <h2 id="purpose-title" className="mt-4 text-[2.1rem] leading-[1.06] font-medium text-forest-950 sm:text-5xl">
              {t.about.purposeTitle}
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted sm:text-lg">
              <p>{t.about.purposeP1}</p>
              <p>{t.about.purposeP2}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-float">
              <Image
                src={marketImage}
                alt={t.about.marketAlt}
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 left-4 max-w-xs rounded-3xl border border-line bg-white p-5 shadow-lift sm:left-8">
              <p className="font-display text-lg leading-snug text-forest-950">
                {t.about.quote}
              </p>
              <p className="mt-2 text-sm text-muted">{t.about.quoteSub}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What you can do */}
      <section aria-labelledby="capabilities-title" className="bg-white py-20 lg:py-32">
        <div className="container-x">
          <SectionHeading
            id="capabilities-title"
            eyebrow={t.about.capEyebrow}
            title={t.about.capTitle}
            description={t.about.capDescription}
          />
          <Stagger as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
            {t.about.capabilities.map(({ title, body }, i) => {
              const Icon = CAPABILITY_ICONS[i];
              return (
              <StaggerItem
                as="li"
                key={i}
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
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Built for Gujarat */}
      <section aria-labelledby="gujarat-title" className="relative overflow-hidden bg-forest-950 py-20 text-white lg:py-32">
        <div aria-hidden className="absolute top-1/2 left-1/2 size-[48rem] -translate-1/2 rounded-full bg-forest-700/25 blur-3xl" />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <Eyebrow className="text-gold-300">{t.about.gujaratEyebrow}</Eyebrow>
            <h2 id="gujarat-title" className="mt-4 text-[2.1rem] leading-[1.06] font-medium sm:text-5xl">
              {t.about.gujaratTitleA} <em className="text-gold-200">{t.about.gujaratTitleB}</em>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-cream-100/75 sm:text-lg">
              {t.about.gujaratBody}
            </p>
            {stats && (
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-8">
                {[
                  [stats.marketCount, t.about.marketYards],
                  [stats.districtCount, t.about.districts],
                  [stats.cropCount, t.about.crops],
                ].map(([v, l]) => (
                  <div key={l}>
                    <dt className="text-xs text-cream-300/70">{l}</dt>
                    <dd className="mt-1 font-display text-3xl text-white tabular">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            {source.isDemo && (
              <p className="mt-4 text-xs text-cream-300/60">{t.about.countsDemo}</p>
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
            eyebrow={t.about.dataEyebrow}
            title={t.about.dataTitle}
            description={t.about.dataDescription}
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
                  {t.about.disclaimer}
                </blockquote>
                <p className="mt-6 text-[0.9375rem] leading-relaxed text-muted">
                  {t.about.indicative}
                  {source.isDemo && (
                    <>
                      {" "}
                      <strong className="font-semibold text-ink">{t.about.demoStrong}</strong>
                    </>
                  )}
                </p>
              </div>

              <dl className="grid content-start gap-px border-t border-line bg-line lg:border-t-0 lg:border-l">
                <div className="bg-cream-50 p-6 sm:px-8">
                  <dt className="flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.14em] text-muted uppercase">
                    <CalendarClock className="size-4 text-forest-600" aria-hidden /> {t.about.lastUpdated}
                  </dt>
                  <dd className="mt-2 font-display text-xl text-forest-950">
                    {stats ? formatLongDate(stats.latestDate, locale) : t.about.unavailable}
                  </dd>
                  <dd className="text-sm text-muted">{sourceInfo.updateFrequency}</dd>
                </div>
                <div className="bg-cream-50 p-6 sm:px-8">
                  <dt className="flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.14em] text-muted uppercase">
                    <Database className="size-4 text-forest-600" aria-hidden /> {t.about.dataSource}
                  </dt>
                  <dd className="mt-2 font-display text-xl text-forest-950">{sourceInfo.name}</dd>
                  <dd className="text-sm leading-relaxed text-muted">{sourceInfo.description}</dd>
                </div>
                <div className="bg-cream-50 p-6 sm:px-8">
                  <dt className="flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.14em] text-muted uppercase">
                    <Link2 className="size-4 text-forest-600" aria-hidden /> {t.about.sourceLink}
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={source.isDemo ? AGMARKNET_SOURCE_URL : source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-forest-700 underline-offset-4 hover:underline"
                    >
                      {source.isDemo ? t.about.agmarknetLink : t.about.openSource}
                      <ArrowUpRight className="size-4" aria-hidden />
                    </a>
                  </dd>
                  {source.isDemo && (
                    <dd className="mt-1 text-sm text-muted">
                      {t.about.officialNote}
                    </dd>
                  )}
                </div>
              </dl>
            </div>
          </Reveal>

          <div className="mt-14 flex flex-col items-center gap-4 text-center">
            <p className="font-display text-2xl text-forest-950">{t.about.ready}</p>
            <ButtonLink href="/prices" size="lg">
              {t.about.viewPrices} <ArrowRight />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
