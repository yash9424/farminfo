import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { coverImage } from "@/lib/parts";
import { plural } from "@/lib/utils";

export function CategoryGrid({
  items,
}: {
  items: { slug: string; title: string; blurb: string; image: string; count: number }[];
}) {
  return (
    <section aria-labelledby="categories-title" className="py-18 lg:py-24">
      <div className="container-x">
        <SectionHeading
          id="categories-title"
          eyebrow="Categories"
          title="Explore Machine Parts"
          description="From spindles and servo motors to ball screws, tool holders and electricals — organised the way maintenance teams search."
          action={
            <ButtonLink href="/categories" variant="outline">
              All categories <ArrowRight />
            </ButtonLink>
          }
        />
        <Stagger as="ul" className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4" stagger={0.04}>
          {items.map((c, i) => (
            <StaggerItem as="li" key={c.slug}>
              <Link
                href={`/categories/${c.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-[box-shadow,transform] duration-500 ease-(--ease-out-expo) hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-graphite-100">
                  <Image
                    src={coverImage(c.image, i)}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 300px, (min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-[900ms] ease-(--ease-out-expo) group-hover:scale-[1.06]"
                  />
                  <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(11_13_16/0.55),transparent_60%)]" />
                  {c.count > 0 && (
                    <span className="absolute bottom-2.5 left-2.5 rounded-md bg-white/95 px-1.5 py-0.5 text-[0.6875rem] font-bold text-ink tabular">
                      {plural(c.count, "listing")}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                  <h3 className="text-[0.9375rem] leading-tight font-bold text-ink sm:text-base">{c.title}</h3>
                  <p className="mt-1 line-clamp-2 hidden text-sm leading-snug text-muted sm:block">{c.blurb}</p>
                  <span className="mt-auto flex items-center gap-1 pt-3 text-sm font-semibold text-accent-600">
                    View Parts
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
