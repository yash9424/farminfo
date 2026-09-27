import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { CitySummary } from "@/lib/parts";
import { plural } from "@/lib/utils";

export function HubCities({ cities }: { cities: CitySummary[] }) {
  return (
    <section aria-labelledby="hubs-title" className="py-18 lg:py-24">
      <div className="container-x">
        <SectionHeading
          id="hubs-title"
          eyebrow="Manufacturing hubs"
          title="Popular Industrial Cities"
          description="Where India’s machine shops — and their spares — are concentrated."
        />
        <Stagger as="ul" className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" stagger={0.03}>
          {cities.map(({ city, state, district, count, categories }) => (
            <StaggerItem as="li" key={`${state.slug}-${city.slug}`}>
              <Link
                href={`/locations/${state.slug}/${district.slug}/${city.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-white p-4 shadow-card transition-[box-shadow,transform,border-color] duration-500 ease-(--ease-out-expo) hover:-translate-y-1 hover:border-line-strong hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-ink">{city.name}</h3>
                    <p className="truncate text-xs text-muted">{state.name}</p>
                  </div>
                  <ArrowUpRight className="size-4 shrink-0 text-graphite-400 transition-all duration-300 group-hover:rotate-45 group-hover:text-accent-500" aria-hidden />
                </div>
                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">
                  {categories.length ? categories.slice(0, 3).join(" · ") : "Browse local sellers"}
                </p>
                <span className="mt-auto pt-3 text-xs font-bold text-ink tabular">{count ? plural(count, "part") : "Browse"}</span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
