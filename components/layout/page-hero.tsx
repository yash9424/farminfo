import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";
import { cn } from "@/lib/utils";

/** Dark page header used by listing/detail pages (sits under the solid header). */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  description,
  aside,
  children,
  className,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  aside?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden bg-graphite-950 pt-24 pb-10 text-white lg:pt-28 lg:pb-12", className)}>
      <div aria-hidden className="bg-blueprint absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div aria-hidden className="absolute -top-32 right-0 size-[30rem] translate-x-1/3 rounded-full bg-accent-500/10 blur-3xl" />
      <div className="container-x relative">
        <Breadcrumbs items={crumbs} tone="dark" />
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            {eyebrow && (
              <p className="text-[0.6875rem] font-bold tracking-[0.2em] text-accent-400 uppercase">{eyebrow}</p>
            )}
            <h1 className="mt-2 text-[2rem] leading-[1.08] font-extrabold tracking-[-0.03em] sm:text-[2.6rem]">{title}</h1>
            {description && <p className="mt-3 max-w-2xl text-base leading-relaxed text-graphite-300">{description}</p>}
          </div>
          {aside && <div className="shrink-0">{aside}</div>}
        </div>
        {children}
      </div>
    </section>
  );
}
