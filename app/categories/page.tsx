import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { coverImage, getCategories, getCategoryCounts, getTopCategories } from "@/lib/parts";
import { plural } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Part Categories",
  description: "Browse CNC & VMC machine parts by category: spindles, servo motors & drives, CNC controls, ball screws, linear guideways, tooling, workholding, sensors, hydraulics and electrical spares.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const [groups, all, counts] = await Promise.all([getTopCategories(), getCategories(), getCategoryCounts()]);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Categories" }]}
        eyebrow="Categories"
        title="Every CNC & VMC Part Category"
        description="Pick a category to see listings, or jump straight to a specific part type."
      />
      <div className="container-x py-10 lg:py-14">
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((g, i) => {
            const subs = all.filter((c) => c.parentId === g.id);
            return (
              <li key={g.slug} className="flex">
                <article className="flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card">
                  <Link href={`/categories/${g.slug}`} className="group relative block aspect-[16/7] overflow-hidden bg-graphite-100">
                    <Image
                      src={coverImage(g.image, i)}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[900ms] ease-(--ease-out-expo) group-hover:scale-[1.05]"
                    />
                    <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(11_13_16/0.85),rgb(11_13_16/0.1))]" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <h2 className="text-xl font-bold text-white">{g.name}</h2>
                      <p className="mt-0.5 text-sm text-graphite-300">{plural(counts.get(g.slug) ?? 0, "listing")}</p>
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-sm leading-relaxed text-muted">{g.description}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {subs.map((s) => (
                        <li key={s.slug}>
                          <Link
                            href={`/categories/${s.slug}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-line bg-graphite-50 px-2.5 py-1 text-sm font-medium text-ink-soft transition-colors hover:border-graphite-300 hover:bg-white hover:text-ink"
                          >
                            {s.name}
                            {counts.get(s.slug) ? <span className="text-xs text-muted tabular">{counts.get(s.slug)}</span> : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link href={`/categories/${g.slug}`} className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-accent-600 hover:text-accent-700">
                      View Parts <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
