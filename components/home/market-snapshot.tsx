import { ArrowRight, ArrowUpRight, Clock } from "lucide-react";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { ChangeBadge, DemoBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/card";
import { CropIcon } from "@/components/ui/crop-icon";
import { Sparkline } from "@/components/ui/sparkline";
import type { DataSourceInfo, FeaturedPrice } from "@/lib/types";
import { cn, formatINR, formatUpdated } from "@/lib/utils";

export function MarketSnapshot({
  items,
  source,
}: {
  items: FeaturedPrice[];
  source: DataSourceInfo;
}) {
  return (
    <section aria-labelledby="snapshot-title" className="bg-cream-100 pb-20 lg:pb-32">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="snapshot-title"
            eyebrow="Market snapshot"
            title={
              <>
                Aaj Na <em className="text-forest-600">Market Bhav</em>
              </>
            }
            description="Quickly check what is happening across major agricultural markets."
          />
          <div className="flex items-center gap-3">
            {source.isDemo && <DemoBadge />}
            <ButtonLink href="/prices" variant="outline" className="hidden md:inline-flex">
              All prices <ArrowRight />
            </ButtonLink>
          </div>
        </div>

        {items.length === 0 ? (
          <p className="mt-12 rounded-3xl border border-dashed border-line p-10 text-center text-muted">
            No prices are available right now. Please check again later.
          </p>
        ) : (
          <Stagger as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
            {items.map((item, i) => (
              <StaggerItem as="li" key={item.price.id}>
                <SnapshotCard item={item} featured={i === 0} />
              </StaggerItem>
            ))}
          </Stagger>
        )}

        <ButtonLink href="/prices" variant="outline" className="mt-8 w-full md:hidden">
          View all market prices <ArrowRight />
        </ButtonLink>
      </div>
    </section>
  );
}

function SnapshotCard({ item, featured }: { item: FeaturedPrice; featured: boolean }) {
  const { price, crop, market } = item;
  return (
    <Link
      href={`/prices?market=${market.id}&crop=${crop.id}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-500 ease-(--ease-out-expo) hover:-translate-y-1",
        featured
          ? "border-forest-800 bg-forest-900 text-white shadow-lift hover:shadow-float"
          : "border-line/80 bg-white shadow-soft hover:border-forest-200 hover:shadow-lift",
      )}
    >
      {featured && (
        <div aria-hidden className="bg-dots pointer-events-none absolute inset-0 opacity-60" />
      )}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <CropIcon cropId={crop.id} />
          <div>
            <h3
              className={cn(
                "font-display text-xl leading-tight",
                featured ? "text-white" : "text-forest-950",
              )}
            >
              {crop.name}
            </h3>
            <p className={cn("text-sm", featured ? "text-cream-300/75" : "text-muted")}>
              {crop.category}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "grid size-9 place-items-center rounded-full transition-all duration-500 group-hover:rotate-45",
            featured ? "bg-white/10 text-white" : "bg-forest-50 text-forest-700",
          )}
          aria-hidden
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <div className="relative mt-7 flex items-end justify-between gap-4">
        <p className="tabular">
          <span
            className={cn(
              "font-display text-[2.1rem] leading-none font-medium tracking-tight",
              featured ? "text-white" : "text-forest-950",
            )}
          >
            {formatINR(price.modalPrice)}
          </span>
          <span className={cn("ml-1 text-sm", featured ? "text-cream-300/75" : "text-muted")}>
            / Qtl
          </span>
        </p>
        <ChangeBadge
          value={price.changePercent}
          className={featured ? "bg-white/12 text-white" : undefined}
        />
      </div>

      <div className="relative mt-4">
        <Sparkline
          points={price.history}
          change={price.changePercent}
          color={featured ? "var(--color-gold-300)" : undefined}
          className="h-10"
        />
      </div>

      <div
        className={cn(
          "relative mt-auto flex items-center justify-between gap-3 border-t pt-4 text-xs",
          featured ? "border-white/10 text-cream-300/75" : "border-line text-muted",
        )}
      >
        <span className="truncate font-medium">{market.name}</span>
        <span className="flex shrink-0 items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden />
          {formatUpdated(price.updatedAt, price.date)}
        </span>
      </div>
    </Link>
  );
}
