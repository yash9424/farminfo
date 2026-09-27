import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocationView } from "@/components/locations/location-view";
import { getCities, getCity, getDistrict, getState } from "@/lib/parts";
import type { SearchParams } from "@/lib/query-params";

export async function generateStaticParams() {
  return (await getCities()).map((c) => ({ state: c.stateSlug, district: c.districtSlug, city: c.slug }));
}

async function resolve(s: string, d: string, c: string) {
  const [state, district, city] = await Promise.all([getState(s), getDistrict(s, d), getCity(s, d, c)]);
  return state && district && city ? { state, district, city } : null;
}

export async function generateMetadata({ params }: PageProps<"/locations/[state]/[district]/[city]">): Promise<Metadata> {
  const { state, district, city } = await params;
  const loc = await resolve(state, district, city);
  if (!loc) return { title: "Location not found" };
  return {
    title: `CNC & VMC Machine Parts in ${loc.city.name}, ${loc.state.name}`,
    description: `Find CNC & VMC spares in ${loc.city.name} (${loc.district.name} district, ${loc.state.name}): spindles, servo motors, ball screws, controls, tooling and more.`,
    alternates: { canonical: `/locations/${loc.state.slug}/${loc.district.slug}/${loc.city.slug}` },
  };
}

export default async function CityPage({ params, searchParams }: PageProps<"/locations/[state]/[district]/[city]">) {
  const { state, district, city } = await params;
  const loc = await resolve(state, district, city);
  if (!loc) notFound();
  return <LocationView {...loc} searchParams={(await searchParams) as SearchParams} />;
}
