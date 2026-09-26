import { PricesHeader } from "@/components/prices/prices-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function PricesLoading() {
  return (
    <>
      <PricesHeader />
      <div className="bg-cream-100 pb-24" role="status" aria-label="Loading market prices">
        <div className="container-x relative z-10 -mt-10 pt-2">
          <div className="rounded-[1.75rem] border border-line/80 bg-cream-50 p-3 shadow-lift sm:p-4">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-[1fr_1fr_0.8fr_1.3fr_auto]">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className={i === 3 ? "order-first col-span-2 lg:order-none lg:col-span-1" : undefined}>
                  <Skeleton className="mb-2 h-3 w-20" />
                  <Skeleton className="h-12 rounded-2xl" />
                </div>
              ))}
              <Skeleton className="h-12 self-end rounded-2xl lg:w-24" />
            </div>
          </div>
        </div>

        <div className="container-x mt-8 space-y-8">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="rounded-3xl border border-line/80 bg-white p-5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-4 h-7 w-32" />
                <Skeleton className="mt-2 h-3 w-20" />
              </div>
            ))}
          </div>

          {/* desktop table skeleton */}
          <div className="hidden overflow-hidden rounded-[1.75rem] border border-line/80 bg-white lg:block">
            <div className="border-b border-line bg-cream-100/70 px-4 py-4">
              <Skeleton className="h-3 w-2/3" />
            </div>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-line/60 px-4 py-3.5 last:border-0">
                <Skeleton className="size-9 rounded-xl" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="ml-auto h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>

          {/* mobile card skeletons */}
          <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="rounded-3xl border border-line/80 bg-white p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-11 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
                <Skeleton className="mt-4 h-16 rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
        <span className="sr-only">Loading market prices…</span>
      </div>
    </>
  );
}
