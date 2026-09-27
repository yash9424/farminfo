import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { PartsExplorer } from "@/components/parts/explorer/parts-explorer";
import { DemoBadge } from "@/components/ui/badge";
import { getCategoryBySlug, getCity, getDataSource, getDistrict, getState } from "@/lib/parts";
import { parseSearchParams, type SearchParams } from "@/lib/query-params";

async function describe(sp: SearchParams) {
  const { query, sub, group } = parseSearchParams(sp);
  const cat = await getCategoryBySlug(sub ?? group ?? "");
  const state = query.state ? await getState(query.state) : null;
  const district = state && query.district ? await getDistrict(state.slug, query.district) : null;
  const city = district && query.city ? await getCity(state!.slug, district.slug, query.city) : null;
  const where = city?.name ?? district?.name ?? state?.name ?? null;
  return { q: query.q, cat, where };
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
  const { q, cat, where } = await describe(await searchParams);
  const what = q ? `“${q}”` : cat ? cat.name : "CNC & VMC Parts";
  const title = `${what}${where ? ` in ${where}` : ""} — Find Parts`;
  return {
    title,
    description: `Browse ${cat ? cat.name.toLowerCase() : "CNC & VMC machine parts"}${where ? ` in ${where}` : " across India"} — compare condition, price, specifications and seller location on MachInfo.`,
    alternates: { canonical: "/parts" },
  };
}

export default async function PartsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const { q, cat, where } = await describe(sp);
  const source = getDataSource();

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Parts" }]}
        eyebrow="Marketplace"
        title={q ? `Results for “${q}”` : cat ? cat.name : "CNC & VMC Machine Parts"}
        description={
          <>
            Spindles, servo motors, controls, ball screws, tooling and more from sellers
            {where ? ` in ${where}` : " across India"}.{" "}
            {source.isDemo && <DemoBadge tone="glass" label="Demo data" className="ml-1 align-middle" />}
          </>
        }
      />
      <div className="container-x py-8 lg:py-10">
        <PartsExplorer searchParams={sp} basePath="/parts" scopeLabel={where ?? "India"} />
      </div>
    </>
  );
}
