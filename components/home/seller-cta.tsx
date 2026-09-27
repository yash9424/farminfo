import { ArrowRight, Check, Plus } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import ctaImage from "@/public/images/mi/cta.jpg";

export function SellerCTA() {
  return (
    <section aria-labelledby="sell-title" className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="relative isolate overflow-hidden rounded-3xl bg-graphite-950 text-white">
        <Image src={ctaImage} alt="" fill placeholder="blur" sizes="100vw" className="-z-10 object-cover opacity-45" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(11_13_16/0.96)_20%,rgb(11_13_16/0.6)_70%,rgb(11_13_16/0.4))]" />
        <div aria-hidden className="bg-blueprint absolute inset-0 -z-10 opacity-60" />
        <Reveal className="container-x grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:py-24">
          <div>
            <p className="text-[0.6875rem] font-bold tracking-[0.2em] text-accent-400 uppercase">For sellers</p>
            <h2 id="sell-title" className="mt-4 text-[2.1rem] leading-[1.05] font-extrabold tracking-[-0.03em] sm:text-5xl">
              Have CNC or VMC Parts to Sell?
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-graphite-300 sm:text-lg">
              List your parts and connect with buyers looking for CNC &amp; VMC components.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={siteConfig.listCta.href} variant="accent" size="lg">
                <Plus aria-hidden />
                List Your Part
              </ButtonLink>
              <ButtonLink href="/parts" variant="glass" size="lg">
                Browse parts <ArrowRight />
              </ButtonLink>
            </div>
          </div>
          <ul className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-1">
            {[
              "Reach maintenance teams and buyers across India",
              "Show part numbers, specs and compatibility clearly",
              "Buyer enquiries come straight to you",
              "List new, used and refurbished spares",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-500 text-white">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden />
                </span>
                <span className="text-graphite-200">{t}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
