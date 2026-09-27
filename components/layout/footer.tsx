import Link from "next/link";
import { getDataSource, getFeaturedStates, getTopCategories } from "@/lib/parts";
import { siteConfig } from "@/lib/site";
import { Logo } from "./logo";

export async function Footer() {
  const [categories, featuredStates] = await Promise.all([getTopCategories(), getFeaturedStates()]);
  const source = getDataSource();

  return (
    <footer className="relative overflow-hidden bg-graphite-950 text-graphite-300">
      <div aria-hidden className="bg-blueprint pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-x relative pt-16 pb-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo tone="light" />
            <p className="mt-4 text-lg font-semibold text-white">{siteConfig.tagline}</p>
            <p className="mt-2 text-sm leading-relaxed text-graphite-400">
              Find CNC &amp; VMC machine parts, spares and components from sellers across India —
              then contact the seller directly.
            </p>
            {source.isDemo && (
              <p className="mt-5 rounded-xl border border-white/10 bg-white/4 p-3.5 text-xs leading-relaxed text-graphite-400">
                <span className="font-semibold text-graphite-200">Demo marketplace.</span> Listings, sellers
                and prices shown are sample data for demonstration, not real offers.
              </p>
            )}
          </div>

          <nav aria-label="Part categories">
            <h2 className="text-xs font-bold tracking-[0.18em] text-white uppercase">Categories</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.slice(0, 8).map((c) => (
                <li key={c.slug}>
                  <Link href={`/categories/${c.slug}`} className="transition-colors hover:text-white">
                    {c.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Browse by state">
            <h2 className="text-xs font-bold tracking-[0.18em] text-white uppercase">Locations</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {featuredStates.slice(0, 8).map((s) => (
                <li key={s.slug}>
                  <Link href={`/locations/${s.slug}`} className="transition-colors hover:text-white">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="text-xs font-bold tracking-[0.18em] text-white uppercase">MachInfo</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={siteConfig.listCta.href} className="font-semibold text-accent-400 transition-colors hover:text-accent-300">
                  {siteConfig.listCta.label} →
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-graphite-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 MachInfo. All rights reserved.</p>
          <p className="max-w-2xl md:text-right">
            MachInfo is a listing and discovery platform. Buyers deal directly with sellers; verify part
            numbers, condition and compatibility before purchase. Brand names identify parts and do not
            imply endorsement.
          </p>
        </div>
      </div>
    </footer>
  );
}
