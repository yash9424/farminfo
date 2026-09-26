import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/card";
import { CropIcon } from "@/components/ui/crop-icon";

const STEPS = [
  {
    n: "01",
    title: "Select Your Market",
    body: "Choose your Gujarat market yard — Rajkot, Gondal, Unjha or any other listed APMC.",
    art: <MarketArt />,
  },
  {
    n: "02",
    title: "Choose Your Crop",
    body: "Select wheat, rice, bajra, groundnut, cotton, jeera and more — or just search.",
    art: <CropArt />,
  },
  {
    n: "03",
    title: "Check Today's Bhav",
    body: "View minimum, maximum and modal prices with a 7-day view of price movement.",
    art: <TrendArt />,
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="relative overflow-hidden bg-white py-20 lg:py-32">
      <div aria-hidden className="bg-dots-dark absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="container-x relative">
        <SectionHeading
          id="how-title"
          align="center"
          eyebrow="How it works"
          title="Your bhav in three simple steps."
          description="No sign-up, no clutter. FarmInfo is built to answer one question quickly: what is my crop fetching today?"
        />

        <Stagger as="ol" className="relative mt-16 grid gap-5 md:grid-cols-3 lg:gap-8" stagger={0.14}>
          {/* connector line on desktop */}
          <li aria-hidden className="pointer-events-none absolute top-[5.5rem] right-[16%] left-[16%] hidden h-px bg-[repeating-linear-gradient(to_right,var(--color-forest-300)_0_6px,transparent_6px_12px)] md:block" />
          {STEPS.map((step) => (
            <StaggerItem as="li" key={step.n} className="group relative">
              <div className="flex h-full flex-col items-center rounded-3xl border border-line/70 bg-cream-50 px-6 pt-8 pb-9 text-center transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-lift">
                <div className="relative grid h-28 w-full place-items-center">{step.art}</div>
                <span className="mt-6 font-display text-sm font-semibold tracking-[0.2em] text-gold-600">
                  {step.n}
                </span>
                <h3 className="mt-2 text-2xl text-forest-950">{step.title}</h3>
                <p className="mt-3 max-w-xs text-[0.9375rem] leading-relaxed text-muted">{step.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function MarketArt() {
  return (
    <div className="relative">
      <div className="relative grid size-24 place-items-center rounded-[1.75rem] bg-forest-900 text-gold-300 shadow-lift transition-transform duration-700 group-hover:-rotate-3">
        <svg viewBox="0 0 48 48" className="size-12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M8 20 24 8l16 12" />
          <path d="M12 18v20h24V18" />
          <path d="M20 38V28h8v10" />
          <path d="M6 38h36" />
        </svg>
      </div>
      <span className="absolute -top-3 -right-6 rounded-full bg-white px-2.5 py-1 text-[0.6875rem] font-bold text-forest-800 shadow-soft transition-transform duration-700 group-hover:-translate-y-1">
        Rajkot
      </span>
      <span className="absolute -bottom-2 -left-8 rounded-full bg-gold-100 px-2.5 py-1 text-[0.6875rem] font-bold text-gold-700 shadow-soft transition-transform duration-700 group-hover:translate-y-1">
        Unjha
      </span>
    </div>
  );
}

function CropArt() {
  return (
    <div className="relative flex items-center">
      <CropIcon cropId="groundnut" size="lg" className="-mr-3 -rotate-12 shadow-soft transition-transform duration-700 group-hover:-translate-x-2 group-hover:-rotate-18" />
      <CropIcon cropId="wheat" size="xl" className="relative z-10 bg-white shadow-lift transition-transform duration-700 group-hover:-translate-y-2" />
      <CropIcon cropId="cotton" size="lg" className="-ml-3 rotate-12 shadow-soft transition-transform duration-700 group-hover:translate-x-2 group-hover:rotate-18" />
    </div>
  );
}

function TrendArt() {
  return (
    <div className="relative w-44 rounded-2xl bg-white p-4 shadow-lift transition-transform duration-700 group-hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <span className="h-2 w-12 rounded-full bg-forest-900/10" />
        <span className="rounded-full bg-up-soft px-1.5 py-0.5 text-[0.625rem] font-bold text-up">+2.4%</span>
      </div>
      <svg viewBox="0 0 140 48" className="mt-3 h-12 w-full" fill="none" aria-hidden>
        <path
          d="M2 40 C 20 38, 26 30, 40 32 S 62 20, 76 24 S 100 10, 112 14 S 130 6, 138 4"
          stroke="var(--color-forest-600)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="138" cy="4" r="3.5" fill="var(--color-gold-500)" />
      </svg>
    </div>
  );
}
