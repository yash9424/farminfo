import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getDataSource } from "@/lib/market-data";
import { siteConfig } from "@/lib/site";
import { Logo } from "./logo";

export function Footer() {
  const source = getDataSource();

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
            <Logo tone="light" />
            <p className="mt-5 font-display text-xl leading-snug text-cream-100">
              {siteConfig.tagline}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-cream-300/70">
              A simpler way to explore agricultural market-yard prices across Gujarat.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-sans text-xs font-bold tracking-[0.2em] text-gold-300 uppercase">
              Explore
            </h2>
            <ul className="mt-5 space-y-3 text-[0.9375rem]">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-sans text-xs font-bold tracking-[0.2em] text-gold-300 uppercase">
              Data
            </h2>
            <ul className="mt-5 space-y-3 text-[0.9375rem]">
              <li>
                <Link href="/about#data" className="transition-colors hover:text-white">
                  Data Source
                </Link>
              </li>
              <li>
                <Link href="/about#disclaimer" className="transition-colors hover:text-white">
                  Data Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/4 p-5">
            <p className="text-xs font-bold tracking-[0.2em] text-gold-300 uppercase">
              Current source
            </p>
            <p className="mt-3 text-sm leading-relaxed text-cream-100">{source.name}</p>
            {source.isDemo ? (
              <p className="mt-2 text-xs leading-relaxed text-cream-300/70">
                Prices shown are sample data for demonstration until a verified live source is
                connected.
              </p>
            ) : (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-gold-300 hover:text-gold-200"
              >
                View source <ArrowUpRight className="size-3.5" />
              </a>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-cream-300/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 FarmInfo. All rights reserved.</p>
          <p>Prices are indicative. Always confirm with your market yard before trading.</p>
        </div>
      </div>
    </footer>
  );
}
