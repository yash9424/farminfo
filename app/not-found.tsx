import { ArrowRight, SearchX } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[78svh] items-center overflow-hidden bg-graphite-950 pt-24 text-white">
      <div aria-hidden className="bg-blueprint absolute inset-0" />
      <div className="container-x relative flex flex-col items-center text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-white/8 text-accent-400 ring-1 ring-white/15">
          <SearchX className="size-6" aria-hidden />
        </span>
        <p className="mt-8 text-7xl font-extrabold tracking-tight text-white/90 tabular">404</p>
        <h1 className="mt-3 text-3xl font-bold">This part isn’t in stock here.</h1>
        <p className="mt-3 max-w-md text-graphite-300">
          The page you were looking for doesn’t exist, or the listing has been removed.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/parts" variant="accent" size="lg">
            Find Parts <ArrowRight />
          </ButtonLink>
          <ButtonLink href="/" variant="glass" size="lg">
            Back to home
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
