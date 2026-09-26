import { ArrowRight, Sprout } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-forest-950 pt-24 text-white">
      <div aria-hidden className="bg-dots absolute inset-0 opacity-50" />
      <div className="container-x relative flex flex-col items-center text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-white/8 text-gold-300 ring-1 ring-white/15">
          <Sprout className="size-7" aria-hidden />
        </span>
        <p className="mt-8 font-display text-8xl text-gold-200/90">404</p>
        <h1 className="mt-4 text-3xl font-medium sm:text-4xl">This field is empty.</h1>
        <p className="mt-4 max-w-md text-cream-100/75">
          The page you were looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/prices" variant="gold" size="lg">
            Check Today&apos;s Bhav <ArrowRight />
          </ButtonLink>
          <ButtonLink href="/" variant="glass" size="lg">
            Back to home
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
