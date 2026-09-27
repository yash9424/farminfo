import { ArrowRight, BadgeCheck, Building2, CalendarClock, Cpu, Hash, MapPin, Package, ShieldAlert, Store, Wrench } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactActions } from "@/components/parts/detail/contact-actions";
import { Gallery } from "@/components/parts/detail/gallery";
import { ConditionBadge, PartCard, PriceBlock } from "@/components/parts/part-card";
import { Badge, DemoBadge, VerifiedBadge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { getAllPartSlugs, getPartBySlug, getRelatedParts, getSellerListingCount } from "@/lib/parts";
import { siteConfig } from "@/lib/site";
import { SELLER_TYPE_LABEL, formatMonthYear, plural, timeAgo } from "@/lib/utils";

export async function generateStaticParams() {
  return (await getAllPartSlugs()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/parts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const part = await getPartBySlug(slug);
  if (!part) return { title: "Part not found" };
  const where = `${part.place.city.name}, ${part.place.state.name}`;
  const type = part.subcategory?.name ?? part.category.name;
  return {
    title: `${part.title} — ${type} in ${part.place.city.name}`,
    description: `${part.title}${part.partNumber ? ` (P/N ${part.partNumber})` : ""}: ${part.condition} ${type.toLowerCase()} in ${where}. View specifications, compatibility, price and contact the seller on MachInfo.`,
    alternates: { canonical: `/parts/${part.slug}` },
    openGraph: {
      title: part.title,
      description: `${type} · ${where}`,
      images: [{ url: part.images[0], width: 1600, height: 1200, alt: part.title }],
    },
  };
}

export default async function PartPage({ params }: PageProps<"/parts/[slug]">) {
  const { slug } = await params;
  const part = await getPartBySlug(slug);
  if (!part) notFound();

  const [related, sellerCount] = await Promise.all([getRelatedParts(part, 4), getSellerListingCount(part.sellerId)]);
  const sold = part.availability === "sold";
  const type = part.subcategory ?? part.category;
  const compat = part.compatibility;
  const hasCompat = !!(compat?.cncControls?.length || compat?.machineModels?.length || compat?.machineBrands?.length);
  const locHref = `/locations/${part.place.state.slug}/${part.place.district.slug}/${part.place.city.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: part.title,
    image: part.images.map((i) => `${siteConfig.url}${i}`),
    description: part.description,
    sku: part.partNumber,
    brand: part.brand && part.brand.id !== "generic" ? { "@type": "Brand", name: part.brand.name } : undefined,
    category: type.name,
    itemCondition: `https://schema.org/${part.condition === "new" ? "NewCondition" : part.condition === "used" ? "UsedCondition" : "RefurbishedCondition"}`,
    ...(part.price !== undefined && !part.isDemo
      ? { offers: { "@type": "Offer", price: part.price, priceCurrency: "INR", availability: sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock" } }
      : {}),
  };

  return (
    <div className="bg-canvas pt-20 pb-28 lg:pt-24 lg:pb-20">
      <div className="container-x">
        <Breadcrumbs
          className="py-4"
          items={[
            { label: "Home", href: "/" },
            { label: "Parts", href: "/parts" },
            { label: part.category.shortName, href: `/categories/${part.category.slug}` },
            ...(part.subcategory ? [{ label: part.subcategory.name, href: `/categories/${part.subcategory.slug}` }] : []),
            { label: part.title },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-10">
          <Gallery images={part.images} title={part.title} />

          {/* summary panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <ConditionBadge condition={part.condition} />
                {sold ? <Badge tone="danger">Sold</Badge> : <Badge tone="ok">In stock{part.quantity > 1 ? ` · ${part.quantity} units` : ""}</Badge>}
                {part.seller.verified && <VerifiedBadge />}
                {part.isDemo && <DemoBadge />}
              </div>

              <p className="mt-4 text-xs font-bold tracking-[0.12em] text-accent-600 uppercase">{type.name}</p>
              <h1 className="mt-1.5 text-[1.6rem] leading-tight font-extrabold tracking-[-0.02em] text-ink sm:text-3xl">{part.title}</h1>

              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <dt className="text-xs text-muted">Brand</dt>
                  <dd className="font-semibold text-ink">{part.brand?.name ?? "—"}</dd>
                </div>
                {part.partNumber && (
                  <div>
                    <dt className="text-xs text-muted">Part number</dt>
                    <dd className="font-semibold text-ink tabular">{part.partNumber}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs text-muted">Location</dt>
                  <dd>
                    <Link href={locHref} className="inline-flex items-center gap-1 font-semibold text-ink hover:text-accent-600">
                      <MapPin className="size-3.5 text-graphite-400" aria-hidden />
                      {part.place.city.name}, {part.place.state.name}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Listed</dt>
                  <dd className="font-semibold text-ink">{timeAgo(part.createdAt)}</dd>
                </div>
              </dl>

              <div className="mt-6 border-t border-line pt-5">
                <PriceBlock part={part} size="lg" />
              </div>

              <div className="mt-6">
                <ContactActions slug={part.slug} title={part.title} sellerName={part.seller.name} sold={sold} />
              </div>

              <p className="mt-5 flex items-start gap-2 rounded-xl bg-graphite-50 p-3 text-xs leading-relaxed text-muted">
                <ShieldAlert className="mt-0.5 size-4 shrink-0 text-graphite-400" aria-hidden />
                MachInfo doesn’t process payments. Verify the part number, condition and compatibility with the seller before buying.
              </p>
            </div>
          </div>
        </div>

        {/* details */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-10">
          <div className="space-y-8">
            <section aria-labelledby="specs-title" className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-7">
              <h2 id="specs-title" className="flex items-center gap-2 text-lg font-bold text-ink">
                <Wrench className="size-5 text-accent-500" aria-hidden />
                Specifications
              </h2>
              <dl className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line">
                <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 bg-graphite-50 px-4 py-3 text-sm">
                  <dt className="text-muted">Category</dt>
                  <dd className="font-semibold text-ink">{type.name}</dd>
                </div>
                <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 px-4 py-3 text-sm">
                  <dt className="text-muted">Condition</dt>
                  <dd className="font-semibold text-ink capitalize">{part.condition}</dd>
                </div>
                {Object.entries(part.specifications).map(([k, v], i) => (
                  <div key={k} className={`grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 px-4 py-3 text-sm ${i % 2 === 0 ? "bg-graphite-50" : ""}`}>
                    <dt className="text-muted">{k}</dt>
                    <dd className="font-semibold break-words text-ink tabular">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="compat-title" className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-7">
              <h2 id="compat-title" className="flex items-center gap-2 text-lg font-bold text-ink">
                <Cpu className="size-5 text-accent-500" aria-hidden />
                Compatibility
              </h2>
              {hasCompat ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Compatible CNC Controls", items: compat?.cncControls, icon: Cpu },
                    { label: "Compatible Machine Models", items: compat?.machineModels, icon: Hash },
                    { label: "Compatible Machines / Brands", items: compat?.machineBrands, icon: Building2 },
                  ]
                    .filter((g) => g.items?.length)
                    .map(({ label, items, icon: Icon }) => (
                      <div key={label} className="rounded-xl border border-line bg-graphite-50 p-4">
                        <p className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-muted uppercase">
                          <Icon className="size-3.5" aria-hidden />
                          {label}
                        </p>
                        <ul className="mt-3 flex flex-wrap gap-1.5">
                          {items!.map((it) => (
                            <li key={it} className="rounded-md border border-line bg-white px-2 py-1 text-sm font-semibold text-ink">
                              {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">The seller hasn’t listed specific compatibility. Share your machine model and control in your enquiry.</p>
              )}
              <p className="mt-4 text-xs text-muted">Compatibility is stated by the seller. Always confirm against your machine’s manual or existing part number.</p>
            </section>

            <section aria-labelledby="desc-title" className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-7">
              <h2 id="desc-title" className="flex items-center gap-2 text-lg font-bold text-ink">
                <Package className="size-5 text-accent-500" aria-hidden />
                Description
              </h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{part.description}</p>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
                <CalendarClock className="size-3.5" aria-hidden />
                Listed {formatMonthYear(part.createdAt)} · updated {timeAgo(part.updatedAt)}
              </p>
            </section>
          </div>

          {/* seller */}
          <aside aria-labelledby="seller-title" className="lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
              <div className="bg-graphite-950 p-5 text-white sm:p-6">
                <p className="text-[0.6875rem] font-bold tracking-[0.18em] text-accent-400 uppercase">Seller</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/10 text-lg font-extrabold">
                    {part.seller.name
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")}
                  </span>
                  <div className="min-w-0">
                    <h2 id="seller-title" className="flex items-center gap-1.5 truncate text-lg font-bold">
                      {part.seller.name}
                      {part.seller.verified && <BadgeCheck className="size-4.5 shrink-0 text-ok" aria-label="Verified seller" />}
                    </h2>
                    <p className="text-sm text-graphite-400">{SELLER_TYPE_LABEL[part.seller.type]}</p>
                  </div>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-xs text-muted">Location</dt>
                    <dd className="font-semibold text-ink">
                      {part.place.city.name}, {part.place.state.name}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Seller since</dt>
                    <dd className="font-semibold text-ink">{formatMonthYear(part.seller.memberSince)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Listings</dt>
                    <dd className="font-semibold text-ink">{plural(sellerCount, "part")}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Verification</dt>
                    <dd className="font-semibold text-ink">{part.seller.verified ? "Verified" : "Not yet verified"}</dd>
                  </div>
                </dl>
                <div className="mt-5">
                  <ContactActions slug={part.slug} title={part.title} sellerName={part.seller.name} sold={sold} variant="seller" />
                </div>
                <Link
                  href={`/parts?q=${encodeURIComponent(part.seller.name)}`}
                  className="mt-3 flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-ink hover:bg-graphite-50"
                >
                  <Store className="size-4" aria-hidden />
                  View Seller Listings
                </Link>
                {part.seller.isDemo && (
                  <p className="mt-3 text-center text-xs text-muted">Sample seller for demonstration — no real contact details.</p>
                )}
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related-title" className="mt-16">
            <div className="flex items-end justify-between gap-4">
              <h2 id="related-title" className="text-2xl font-bold text-ink">
                You May Also Like
              </h2>
              <Link href={`/categories/${type.slug}`} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-accent-600 hover:text-accent-700">
                More {type.name} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {related.map((p) => (
                <li key={p.id} className="flex min-w-0">
                  <PartCard part={p} className="w-full" />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <ContactActions slug={part.slug} title={part.title} sellerName={part.seller.name} sold={sold} variant="sticky" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
