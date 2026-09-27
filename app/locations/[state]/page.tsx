import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocationView } from "@/components/locations/location-view";
import { getState, getStates } from "@/lib/parts";
import type { SearchParams } from "@/lib/query-params";

export async function generateStaticParams() {
  return (await getStates()).map((s) => ({ state: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/locations/[state]">): Promise<Metadata> {
  const { state: slug } = await params;
  const state = await getState(slug);
  if (!state) return { title: "Location not found" };
  return {
    title: `CNC & VMC Parts in ${state.name}`,
    description: `Find CNC & VMC machine parts, spares and components from sellers in ${state.name}. Browse by district and city.`,
    alternates: { canonical: `/locations/${state.slug}` },
  };
}

export default async function StatePage({ params, searchParams }: PageProps<"/locations/[state]">) {
  const { state: slug } = await params;
  const state = await getState(slug);
  if (!state) notFound();
  return <LocationView state={state} searchParams={(await searchParams) as SearchParams} />;
}
