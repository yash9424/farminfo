import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { PartsExplorer } from "@/components/parts/explorer/parts-explorer";
import { DemoBadge } from "@/components/ui/badge";
import { getCategories, getCategoryBySlug, getCategoryCounts, getDataSource } from "@/lib/parts";
import type { SearchParams } from "@/lib/query-params";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return { title: "Category not found" };
  return {
    title: `${cat.name} — CNC & VMC Parts`,
    description: `Find ${cat.name.toLowerCase()} for CNC and VMC machines from sellers across India. Compare condition, price, specifications and location.`,
    alternates: { canonical: `/categories/${cat.slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/categories/[slug]">) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();
  const sp = (await searchParams) as SearchParams;

  const [all, counts] = await Promise.all([getCategories(), getCategoryCounts()]);
  const parent = cat.parentId ? all.find((c) => c.id === cat.parentId) : undefined;
  const group = parent ?? cat;
  const siblings = all.filter((c) => c.parentId === group.id);
  const source = getDataSource();

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          ...(parent ? [{ label: parent.shortName, href: `/categories/${parent.slug}` }] : []),
          { label: cat.name },
        ]}
        eyebrow={parent ? parent.name : "Category"}
        title={cat.name}
        description={
          <>
            {cat.description || `Explore ${cat.name.toLowerCase()} for CNC & VMC machines from sellers across India.`}{" "}
            {source.isDemo && <DemoBadge tone="glass" label="Demo data" className="ml-1 align-middle" />}
          </>
        }
      >
        {siblings.length > 0 && (
          <nav aria-label={`${group.name} part types`} className="mt-7 -mx-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
            <ul className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
              <li>
                <Link
                  href={`/categories/${group.slug}`}
                  aria-current={cat.id === group.id ? "page" : undefined}
                  className={cn(
                    "inline-flex rounded-lg border px-3 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors",
                    cat.id === group.id ? "border-accent-500 bg-accent-500 text-white" : "border-white/15 bg-white/6 text-graphite-200 hover:bg-white/12",
                  )}
                >
                  All {group.shortName}
                </Link>
              </li>
              {siblings.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/categories/${s.slug}`}
                    aria-current={cat.id === s.id ? "page" : undefined}
                    className={cn(
                      "inline-flex gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors",
                      cat.id === s.id ? "border-accent-500 bg-accent-500 text-white" : "border-white/15 bg-white/6 text-graphite-200 hover:bg-white/12",
                    )}
                  >
                    {s.name}
                    {counts.get(s.slug) ? <span className="opacity-60 tabular">{counts.get(s.slug)}</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </PageHero>
      <div className="container-x py-8 lg:py-10">
        <PartsExplorer searchParams={sp} basePath={`/categories/${cat.slug}`} fixed={{ category: cat.slug }} scopeLabel={`${cat.name} · India`} />
      </div>
    </>
  );
}
