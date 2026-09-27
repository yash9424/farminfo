import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
        <Skeleton className="h-6 w-28" />
      </div>
    </div>
  );
}

/** Loading state for the listing (filters + cards). */
export function ExplorerSkeleton({ label = "Loading parts…" }: { label?: string }) {
  return (
    <div role="status" aria-label={label} className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] xl:gap-10">
      <div className="hidden space-y-4 rounded-2xl border border-line bg-white p-5 lg:block">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-10" />
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-4 w-3/4" />
        ))}
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
      <div>
        <div className="flex justify-between gap-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-44" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
