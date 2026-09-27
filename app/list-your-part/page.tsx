import { BadgeCheck, Eye, MessagesSquare } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { ListingForm } from "@/components/sell/listing-form";
import { getCategories, getStates } from "@/lib/parts";

export const metadata: Metadata = {
  title: "List Your Part",
  description: "Sell CNC & VMC machine parts on MachInfo. List spindles, servo motors, controls, ball screws, tooling and more, and connect with buyers across India.",
  alternates: { canonical: "/list-your-part" },
};

export default async function ListYourPartPage() {
  const [categories, states] = await Promise.all([getCategories(), getStates()]);
  const groups = categories.filter((c) => c.parentId === null);
  const options = groups.flatMap((g) => [
    ...categories.filter((c) => c.parentId === g.id).map((c) => ({ value: c.slug, label: `${g.shortName} — ${c.name}` })),
  ]);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "List Your Part" }]}
        eyebrow="For sellers"
        title="Have CNC or VMC Parts to Sell?"
        description="List your parts and connect with buyers looking for CNC & VMC components across India."
      />
      <div className="container-x grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:py-14">
        <ListingForm categories={options} states={states.map((s) => ({ value: s.slug, label: s.name }))} />
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {[
            { icon: Eye, title: "Be found by part number", body: "Buyers search by part number, brand and the machine it fits — fill these in to show up." },
            { icon: MessagesSquare, title: "Enquiries come to you", body: "Buyers contact you directly. You agree price, shipping and payment with them." },
            { icon: BadgeCheck, title: "Get verified", body: "Verified sellers get a badge that builds buyer confidence." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-line bg-white p-5">
              <Icon className="size-5 text-accent-500" aria-hidden />
              <h2 className="mt-3 font-bold text-ink">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
          <p className="px-1 text-xs text-muted">Only CNC/VMC parts, spares, components and accessories can be listed — not complete machines.</p>
        </aside>
      </div>
    </>
  );
}
