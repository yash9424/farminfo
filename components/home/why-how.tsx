import { ClipboardList, Cpu, MapPinned, MessagesSquare, Search, ShieldCheck, SlidersHorizontal, Wrench } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const WHY = [
  { icon: Wrench, title: "Parts, not machines", body: "Every listing is a spare, component or accessory for CNC & VMC machines." },
  { icon: Cpu, title: "Compatibility up front", body: "Sellers state the controls and machine models a part fits — FANUC, Siemens, Mitsubishi and more." },
  { icon: MapPinned, title: "Location-based discovery", body: "Filter by state, district and city to find a part you can collect or receive fast." },
  { icon: ClipboardList, title: "Real specifications", body: "Part numbers, ratings and dimensions shown per part type — not a one-size template." },
  { icon: ShieldCheck, title: "Direct seller contact", body: "No cart, no middleman checkout. Send an enquiry and deal directly with the seller." },
];

const STEPS = [
  { icon: Search, title: "Search for a Part", body: "Search by part name, part number, brand or the machine it fits." },
  { icon: SlidersHorizontal, title: "Compare Parts & Sellers", body: "Filter by condition, price and location to shortlist." },
  { icon: ClipboardList, title: "Check Specifications", body: "Confirm ratings, dimensions and compatibility." },
  { icon: MessagesSquare, title: "Contact Seller", body: "Send an enquiry and take it forward directly." },
];

export function WhyMachInfo() {
  return (
    <section aria-labelledby="why-title" className="border-y border-line bg-white py-18 lg:py-24">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <SectionHeading
            id="why-title"
            eyebrow="Why MachInfo"
            title="Built for the people who keep machines running."
            description="A breakdown shouldn’t mean days of phone calls. MachInfo brings CNC & VMC spares from across India into one searchable, specification-first marketplace."
          />
        </Reveal>
        <Stagger as="ul" className="grid gap-3 sm:grid-cols-2" stagger={0.06}>
          {WHY.map(({ icon: Icon, title, body }, i) => (
            <StaggerItem
              as="li"
              key={title}
              className={`rounded-2xl border border-line bg-canvas/60 p-5 ${i === 0 ? "sm:col-span-2" : ""}`}
            >
              <span className="grid size-10 place-items-center rounded-xl bg-graphite-950 text-accent-400">
                <Icon className="size-5" strokeWidth={1.8} aria-hidden />
              </span>
              <h3 className="mt-4 text-base font-bold text-ink">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="py-18 lg:py-24">
      <div className="container-x">
        <SectionHeading id="how-title" eyebrow="How it works" title="From breakdown to the right part in four steps." />
        <Stagger as="ol" className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <StaggerItem as="li" key={title} className="group relative rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-xl border border-line bg-graphite-50 text-ink transition-colors duration-500 group-hover:border-accent-200 group-hover:bg-accent-50 group-hover:text-accent-600">
                  <Icon className="size-5.5" strokeWidth={1.8} aria-hidden />
                </span>
                <span className="text-3xl font-extrabold tracking-tight text-graphite-200 tabular">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
              {i < STEPS.length - 1 && (
                <span aria-hidden className="absolute top-12 -right-3 hidden h-px w-6 bg-[repeating-linear-gradient(to_right,var(--color-graphite-300)_0_4px,transparent_4px_8px)] lg:block" />
              )}
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
