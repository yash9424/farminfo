import { ArrowRight, BadgeCheck, Cpu, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge, FeaturedBadge, NewBadge } from "@/components/ui/badge";
import type { PartView } from "@/lib/types";
import { CONDITION_LABEL, PRICE_TYPE_LABEL, cn, formatINR } from "@/lib/utils";

const NEW_WINDOW_MS = 21 * 86_400_000;
const SKIP_SPECS = new Set(["Brand", "Part Number", "Model"]);

/** A few category-relevant specs, shortened for a card. */
export function keySpecsOf(part: PartView, limit = 3): { label: string; value: string }[] {
  const preferred = part.subcategory?.keySpecs ?? part.category.keySpecs;
  const entries = Object.entries(part.specifications).filter(([k]) => !SKIP_SPECS.has(k));
  const ordered = [
    ...entries.filter(([k]) => preferred.includes(k)),
    ...entries.filter(([k]) => !preferred.includes(k)),
  ];
  return ordered.slice(0, limit).map(([label, value]) => ({ label, value: value.replace(/\s*\(.*\)$/, "") }));
}

export function isNewListing(part: Pick<PartView, "createdAt">, now = Date.now()) {
  return now - Date.parse(part.createdAt) < NEW_WINDOW_MS;
}

export function ConditionBadge({ condition, className }: { condition: PartView["condition"]; className?: string }) {
  const tone = condition === "new" ? "info" : condition === "refurbished" ? "accentSoft" : "neutral";
  return (
    <Badge tone={tone} className={className}>
      {CONDITION_LABEL[condition]}
    </Badge>
  );
}

export function PriceBlock({
  part,
  size = "md",
  className,
}: {
  part: Pick<PartView, "price" | "priceType" | "quantity">;
  size?: "md" | "lg";
  className?: string;
}) {
  const onRequest = part.price === undefined || part.priceType === "on_request";
  const lg = size === "lg";
  return (
    <div className={className}>
      {onRequest ? (
        <p className={cn("font-bold text-ink", lg ? "text-2xl" : "text-[1.0625rem]")}>Price on Request</p>
      ) : (
        <p className={cn("font-extrabold tracking-tight text-ink tabular", lg ? "text-[2.1rem] leading-none" : "text-[1.3rem] leading-tight")}>
          {formatINR(part.price!)}
          {part.quantity > 1 && <span className={cn("ml-1 font-semibold text-muted", lg ? "text-base" : "text-xs")}>/ unit</span>}
        </p>
      )}
      <p className={cn("text-muted", lg ? "mt-2 text-sm" : "mt-0.5 text-xs")}>
        {onRequest ? "Contact the seller for a quote" : PRICE_TYPE_LABEL[part.priceType]}
        {lg && !onRequest && " · excl. GST & shipping"}
      </p>
    </div>
  );
}

export function PartCard({
  part,
  layout = "grid",
  priority = false,
  className,
}: {
  part: PartView;
  layout?: "grid" | "list";
  priority?: boolean;
  className?: string;
}) {
  const specs = keySpecsOf(part);
  const sold = part.availability === "sold";
  const list = layout === "list";
  const typeName = part.subcategory?.name ?? part.category.name;
  const compat = part.compatibility?.cncControls?.[0] ?? part.compatibility?.machineModels?.[0];

  return (
    <article
      className={cn(
        "group relative flex overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-[box-shadow,transform,border-color] duration-500 ease-(--ease-out-expo)",
        "hover:-translate-y-1 hover:border-line-strong hover:shadow-lift focus-within:shadow-lift",
        list ? "flex-col sm:flex-row" : "flex-col",
        className,
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-graphite-100",
          list ? "aspect-[4/3] sm:aspect-auto sm:min-h-full sm:w-[36%]" : "aspect-[4/3]",
        )}
      >
        <Image
          src={part.images[0]}
          alt={`${part.title} — ${typeName}`}
          fill
          priority={priority}
          sizes={list ? "(min-width: 640px) 300px, 100vw" : "(min-width: 1280px) 360px, (min-width: 640px) 45vw, 100vw"}
          className={cn(
            "object-cover transition-transform duration-[900ms] ease-(--ease-out-expo) group-hover:scale-[1.05]",
            sold && "grayscale-[70%]",
          )}
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(11_13_16/0.28),transparent_45%)]" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {part.featured ? <FeaturedBadge /> : isNewListing(part) ? <NewBadge /> : null}
        </div>
        <ConditionBadge condition={part.condition} className="absolute top-3 right-3 shadow-sm" />
        {sold && (
          <div className="absolute inset-0 grid place-items-center bg-graphite-950/45">
            <span className="rounded-lg bg-white px-3 py-1.5 text-sm font-bold tracking-wide text-graphite-950 uppercase">Sold</span>
          </div>
        )}
      </div>

      <div className={cn("flex min-w-0 flex-1 flex-col", list ? "p-5 sm:p-6" : "p-4 sm:p-5")}>
        <p className="truncate text-[0.6875rem] font-bold tracking-[0.12em] text-accent-600 uppercase">{typeName}</p>
        <h3 className="mt-1.5 line-clamp-2 text-[1.0625rem] leading-snug font-bold text-ink">
          <Link href={`/parts/${part.slug}`} className="outline-none after:absolute after:inset-0 after:content-['']">
            {part.title}
          </Link>
        </h3>
        <p className="mt-1 truncate text-sm text-muted">
          {part.brand && part.brand.id !== "generic" ? part.brand.name : "Unbranded"}
          {part.partNumber && (
            <>
              <span className="mx-1.5 text-graphite-300">·</span>
              <span className="font-medium text-ink-soft tabular">P/N {part.partNumber}</span>
            </>
          )}
        </p>

        {specs.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Key specifications">
            {specs.map((s) => (
              <li key={s.label} title={s.label} className="max-w-full truncate rounded-md border border-line bg-graphite-50 px-2 py-1 text-xs font-medium text-ink-soft tabular">
                {s.value}
              </li>
            ))}
          </ul>
        )}

        {compat && (
          <p className="mt-2.5 flex items-center gap-1.5 text-xs text-muted">
            <Cpu className="size-3.5 shrink-0 text-graphite-400" aria-hidden />
            <span className="truncate">Fits {compat}</span>
          </p>
        )}

        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="size-4 shrink-0 text-graphite-400" aria-hidden />
          <span className="truncate">
            {part.place.city.name}, {part.place.state.name}
          </span>
        </p>

        <div className="mt-auto pt-4">
          <PriceBlock part={part} />
          <div className="mt-3.5 flex items-center justify-between gap-3 border-t border-line pt-3.5">
            <p className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-ink-soft">
              <span className="truncate">{part.seller.name}</span>
              {part.seller.verified && <BadgeCheck className="size-4 shrink-0 text-ok" aria-label="Verified seller" />}
            </p>
            <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-ink" aria-hidden>
              View Part
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
