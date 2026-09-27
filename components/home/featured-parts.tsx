import { ArrowRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { PartCard } from "@/components/parts/part-card";
import { DemoBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import type { PartView } from "@/lib/types";

export function FeaturedParts({ parts, isDemo }: { parts: PartView[]; isDemo: boolean }) {
  if (parts.length === 0) return null;
  return (
    <section aria-labelledby="featured-title" className="border-y border-line bg-white py-18 lg:py-24">
      <div className="container-x">
        <SectionHeading
          id="featured-title"
          eyebrow="Featured"
          title="Featured Parts"
          description={
            <>
              Hand-picked spares from sellers across India.{" "}
              {isDemo && <DemoBadge label="Demo data" className="ml-1 align-middle" />}
            </>
          }
          action={
            <ButtonLink href="/parts?sort=featured" variant="outline">
              View all parts <ArrowRight />
            </ButtonLink>
          }
        />
        <Stagger as="ul" className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" stagger={0.05}>
          {parts.map((p) => (
            <StaggerItem as="li" key={p.id} className="flex min-w-0">
              <PartCard part={p} className="w-full" />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
