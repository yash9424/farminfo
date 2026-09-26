import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getI18n } from "@/lib/i18n";
import { getDataSource } from "@/lib/market-data";
import { siteConfig } from "@/lib/site";
import { sourceText } from "@/locales";
import { Logo } from "./logo";

export async function Footer() {
  const source = getDataSource();
  const { t } = await getI18n();
  const sourceInfo = sourceText(t, source);

  return (
    <footer className="relative overflow-hidden bg-forest-950 text-cream-200">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-forest-700/30 blur-3xl"
        aria-hidden
      />
      <div className="container-x relative pt-16 pb-10 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="max-w-sm">
            <Logo tone="light" ariaLabel={t.nav.logoAria} />
            <p className="mt-5 font-display text-xl leading-snug text-cream-100">
              {t.common.tagline}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-cream-300/70">{t.footer.blurb}</p>
          </div>

          <nav aria-label={t.nav.footer}>
            <h2 className="font-sans text-xs font-bold tracking-[0.2em] text-gold-300 uppercase">
              {t.footer.explore}
            </h2>
            <ul className="mt-5 space-y-3 text-[0.9375rem]">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {t.nav[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-sans text-xs font-bold tracking-[0.2em] text-gold-300 uppercase">
              {t.footer.data}
            </h2>
            <ul className="mt-5 space-y-3 text-[0.9375rem]">
              <li>
                <Link href="/about#data" className="transition-colors hover:text-white">
                  {t.footer.dataSource}
                </Link>
              </li>
              <li>
                <Link href="/about#disclaimer" className="transition-colors hover:text-white">
                  {t.footer.dataDisclaimer}
                </Link>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/4 p-5">
            <p className="text-xs font-bold tracking-[0.2em] text-gold-300 uppercase">
              {t.footer.currentSource}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-cream-100">{sourceInfo.name}</p>
            {source.isDemo ? (
              <p className="mt-2 text-xs leading-relaxed text-cream-300/70">{t.footer.demoNote}</p>
            ) : (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-gold-300 hover:text-gold-200"
              >
                {t.common.viewSource} <ArrowUpRight className="size-3.5" />
              </a>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-cream-300/60 sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer.rights}</p>
          <p>{t.footer.indicative}</p>
        </div>
      </div>
    </footer>
  );
}
