import { Check } from "lucide-react";
import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/card";
import featureImage from "@/public/images/feature.jpg";
import harvestImage from "@/public/images/harvest.jpg";

const FEATURES = [
  "Market-wise prices",
  "Crop-wise filtering",
  "Gujarat-focused data",
  "Simple price comparison",
  "Mobile friendly",
  "Fast access",
];

export function FeatureSection() {
  return (
    <section aria-labelledby="feature-title" className="overflow-hidden bg-cream-100 py-20 lg:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-md lg:max-w-none" y={40}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-float">
            <Image
              src={featureImage}
              alt="A farmer walking along a paddy field bund carrying bundles of rice seedlings"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 28rem, 90vw"
              className="object-cover object-top transition-transform duration-[1.6s] ease-(--ease-out-expo) hover:scale-[1.03]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_32_22/0.55),transparent_45%)]"
            />
            <p className="absolute right-6 bottom-6 left-6 font-display text-xl leading-snug text-white italic sm:text-2xl">
              “Every season’s work deserves a fair price.”
            </p>
          </div>

          <div className="absolute -top-10 -right-3 hidden w-44 overflow-hidden rounded-3xl border-[6px] border-cream-100 shadow-lift sm:block lg:-right-10 lg:w-52">
            <div className="relative aspect-square">
              <Image
                src={harvestImage}
                alt="Close-up of a ripe wheat ear in evening light"
                fill
                placeholder="blur"
                sizes="13rem"
                className="object-cover"
              />
            </div>
          </div>

          <div
            aria-hidden
            className="absolute -top-6 -left-6 -z-10 size-40 rounded-full bg-gold-200/60 blur-3xl"
          />
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow>Built for farmers & traders</Eyebrow>
            <h2
              id="feature-title"
              className="mt-4 text-[2.1rem] leading-[1.06] font-medium text-forest-950 sm:text-5xl lg:text-[3.4rem]"
            >
              Designed For The People Who <em className="text-forest-600">Grow Gujarat.</em>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              Market-yard prices are often scattered across notice boards, phone calls and
              hard-to-read portals. FarmInfo brings them into one calm, simple interface — so you can
              compare markets and decide where and when to sell with more confidence.
            </p>
          </Reveal>

          <Stagger as="ul" className="mt-10 grid gap-3 sm:grid-cols-2" stagger={0.06}>
            {FEATURES.map((f) => (
              <StaggerItem
                as="li"
                key={f}
                className="flex items-center gap-3 rounded-2xl border border-line/70 bg-white/70 px-4 py-3.5 transition-colors duration-300 hover:bg-white"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-forest-800 text-gold-300">
                  <Check className="size-4" strokeWidth={2.6} aria-hidden />
                </span>
                <span className="text-[0.9375rem] font-semibold text-ink">{f}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
