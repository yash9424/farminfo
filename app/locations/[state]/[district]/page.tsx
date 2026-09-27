import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocationView } from "@/components/locations/location-view";
import { getDistrict, getDistricts, getState } from "@/lib/parts";
import type { SearchParams } from "@/lib/query-params";

export async function generateStaticParams() {
  return (await getDistricts()).map((d) => ({ state: d.stateSlug, district: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/locations/[state]/[district]">): Promise<Metadata> {
  const { state: s, district: d } = await params;
  const [state, district] = await Promise.all([getState(s), getDistrict(s, d)]);
  if (!state || !district) return { title: "Location not found" };
  return {
    title: `CNC & VMC Parts in ${district.name} District, ${state.name}`,
    description: `CNC & VMC machine parts from sellers in ${district.name} district, ${state.name}.`,
    alternates: { canonical: `/locations/${state.slug}/${district.slug}` },
  };
}

export default async function DistrictPage({ params, searchParams }: PageProps<"/locations/[state]/[district]">) {
  const { state: s, district: d } = await params;
  const [state, district] = await Promise.all([getState(s), getDistrict(s, d)]);
  if (!state || !district) notFound();
  return <LocationView state={state} district={district} searchParams={(await searchParams) as SearchParams} />;
}
