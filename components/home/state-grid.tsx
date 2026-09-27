import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import type { StateSummary } from "@/lib/parts";
import { plural } from "@/lib/utils";

export function StateGrid({ states, isDemo }: { states: StateSummary[]; isDemo: boolean }) {
  return (
    <section aria-labelledby="states-title" className="relative overflow-hidden bg-graphite-950 py-18 text-white lg:py-24">
      <div aria-hidden className="bg-blueprint absolute inset-0" />
      <div aria-hidden className="absolute -top-40 -right-40 size-[36rem] rounded-full bg-accent-500/10 blur-3xl" />
      <div className="container-x relative">
        <SectionHeading
          id="states-title"
          tone="dark"
          eyebrow="Browse by state"
          title="Find Parts Near You"
          description="Industrial spares are often needed today, not next week. Start with sellers in your state."
          action={
            <ButtonLink href="/locations" variant="glass">
              All locations <ArrowRight />
            </ButtonLink>
          }
        />
        <Stagger as="ul" className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" stagger={0.04}>
          {states.map(({ state, count, topCities }) => (
            <StaggerItem as="li" key={state.slug}>
              <Link
                href={`/locations/${state.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition-[background-color,border-color,transform] duration-500 ease-(--ease-out-expo) hover:-translate-y-1 hover:border-accent-500/40 hover:bg-white/[0.07]"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-white">{state.name}</h3>
                  <span className="shrink-0 rounded-md bg-white/10 px-1.5 py-0.5 text-[0.6875rem] font-bold text-graphite-200 tabular">
                    {plural(count, "part")}
                  </span>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-graphite-400">
                  {topCities.slice(0, 4).map(({ city }) => (
                    <li key={city.slug} className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-graphite-600" aria-hidden />
                      {city.name}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto flex items-center gap-1 pt-5 text-sm font-semibold text-accent-400">
                  Explore {state.name}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        {isDemo && <p className="mt-5 text-xs text-graphite-500">Counts reflect demo listings.</p>}
      </div>
    </section>
  );
}
