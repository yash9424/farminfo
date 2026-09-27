import { ArrowRight, Cpu, MapPinned, MessagesSquare, Plus, Search, ShieldCheck, Wrench } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { getDataSource, getMarketplaceStats, getTopCategories } from "@/lib/parts";
import { siteConfig } from "@/lib/site";
import aboutImage from "@/public/images/mi/about.jpg";

export const metadata: Metadata = {
  title: "About MachInfo",
  description: "MachInfo is India’s marketplace for CNC & VMC machine parts, spares and components — search a part, check specifications and compatibility, and contact the seller directly.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  { icon: Wrench, title: "Parts only", body: "MachInfo lists spares, components, accessories and replacement items for CNC & VMC machines — never complete machines." },
  { icon: Cpu, title: "Specifications first", body: "Each part type carries its own specification fields and a clear compatibility section for controls and machine models." },
  { icon: MapPinned, title: "India-wide, location-aware", body: "Every listing sits in a State → District → City hierarchy, so buyers can find sellers near them." },
  { icon: MessagesSquare, title: "Direct contact", body: "No cart, checkout or payments. Buyers send an enquiry and deal directly with the seller." },
];

export default async function AboutPage() {
  const [stats, categories] = await Promise.all([getMarketplaceStats(), getTopCategories()]);
  const source = getDataSource();

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow="About MachInfo"
        title="The fastest way to find a CNC or VMC part."
        description="When a spindle, servo or controller fails, a machine stops earning. MachInfo helps maintenance teams, job shops and traders find the right part — and the seller who has it — quickly."
      />

      <section className="container-x grid gap-10 py-14 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-20">
        <Reveal>
          <h2 className="text-[1.85rem] leading-tight font-bold text-ink sm:text-[2.2rem]">What MachInfo is</h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-muted">
            <p>
              MachInfo is a marketplace and directory for <strong className="text-ink">CNC &amp; VMC machine parts</strong>.
              Sellers — dealers, reconditioners and shops with surplus spares — list parts with photos, specifications,
              compatibility, price and location.
            </p>
            <p>
              Buyers search by part name, part number, brand or the machine it fits, compare listings, and contact the
              seller directly. There’s no checkout: MachInfo connects you, and you take the conversation forward.
            </p>
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
            {[
              [categories.length, "Part categories"],
              [stats.listings, "Listings"],
              [stats.states, "States"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="text-xs text-muted">{l}</dt>
                <dd className="mt-1 text-2xl font-extrabold text-ink tabular">{v}</dd>
              </div>
            ))}
          </dl>
          {source.isDemo && <p className="mt-3 text-xs text-muted">Figures reflect the current demo listings.</p>}
        </Reveal>
        <Reveal delay={0.1} className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line shadow-lift">
          <Image src={aboutImage} alt="Precision-machined components on engineering drawings" fill placeholder="blur" sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </Reveal>
      </section>

      <section className="border-y border-line bg-white py-14 lg:py-20">
        <div className="container-x">
          <h2 className="text-[1.85rem] font-bold text-ink sm:text-[2.2rem]">How MachInfo works</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map(({ icon: Icon, title, body }) => (
              <li key={title} className="rounded-2xl border border-line bg-canvas/60 p-6">
                <span className="grid size-10 place-items-center rounded-xl bg-graphite-950 text-accent-400">
                  <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                </span>
                <h3 className="mt-4 font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="trust" className="container-x py-14 lg:py-20">
        <div className="grid gap-8 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-10 lg:grid-cols-[auto_1fr] lg:gap-10">
          <span className="grid size-14 place-items-center rounded-2xl bg-ok-soft text-ok">
            <ShieldCheck className="size-7" aria-hidden />
          </span>
          <div>
            <h2 className="text-2xl font-bold text-ink">Buying safely on MachInfo</h2>
            <ul className="mt-4 grid gap-3 text-[0.9375rem] leading-relaxed text-muted sm:grid-cols-2">
              <li>• Confirm the exact part number and ask for photos of the label or nameplate.</li>
              <li>• Check compatibility with your control and machine model before paying.</li>
              <li>• For used parts, ask for a test video or bench-test report.</li>
              <li>• Prefer verified sellers, and agree warranty and return terms in writing.</li>
            </ul>
            <p className="mt-5 text-sm text-muted">
              MachInfo is a listing and discovery platform and is not a party to sales between buyers and sellers. Brand
              names identify parts and compatibility and do not imply endorsement by those manufacturers.
            </p>
            {source.isDemo && (
              <p className="mt-4 rounded-xl bg-accent-50 px-4 py-3 text-sm text-accent-700 ring-1 ring-accent-200">
                <strong>Demo marketplace:</strong> all listings, sellers, prices and part numbers currently shown are
                generated sample data for demonstration — not real offers.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="container-x pb-16 lg:pb-24">
        <div className="flex flex-col items-center gap-5 rounded-3xl bg-graphite-950 px-6 py-14 text-center text-white">
          <h2 className="text-3xl font-extrabold tracking-tight">Find a part, or list one.</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/parts" variant="light" size="lg">
              <Search aria-hidden /> Find Parts <ArrowRight />
            </ButtonLink>
            <ButtonLink href={siteConfig.listCta.href} variant="accent" size="lg">
              <Plus aria-hidden /> List Your Part
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
