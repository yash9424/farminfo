import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { getI18n } from "@/lib/i18n";
import ctaImage from "@/public/images/cta.jpg";

export async function FinalCTA() {
  const { t } = await getI18n();
  return (
    <section aria-labelledby="cta-title" className="bg-cream-100 px-3 py-3 sm:px-5 sm:py-5">
      <div className="relative isolate overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]">
        <Image
          src={ctaImage}
          alt=""
          fill
          placeholder="blur"
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(7_32_22/0.62),rgb(7_32_22/0.9))]"
        />
        <div aria-hidden className="bg-grain absolute inset-0 -z-10 opacity-20 mix-blend-overlay" />

        <Reveal className="container-x flex flex-col items-center py-24 text-center sm:py-32 lg:py-40">
          <p className="text-[0.6875rem] font-bold tracking-[0.24em] text-gold-300 uppercase">
            {t.finalCta.eyebrow}
          </p>
          <h2
            id="cta-title"
            className="mt-5 max-w-4xl text-[2.4rem] leading-[1.02] font-medium text-white sm:text-6xl lg:text-7xl"
          >
            {t.finalCta.titleA}
            <br />
            <em className="text-gold-200">{t.finalCta.titleB}</em>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-cream-100/85 sm:text-lg">
            {t.finalCta.description}
          </p>
          <ButtonLink href="/prices" variant="gold" size="lg" className="mt-10">
            {t.finalCta.button}
            <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
