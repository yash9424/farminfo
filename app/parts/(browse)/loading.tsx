import { ExplorerSkeleton } from "@/components/parts/explorer/explorer-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function PartsLoading() {
  return (
    <>
      <section className="bg-graphite-950 pt-24 pb-10 lg:pt-28 lg:pb-12">
        <div className="container-x space-y-4">
          <Skeleton className="h-4 w-40 bg-white/10" />
          <Skeleton className="h-10 w-2/3 max-w-lg bg-white/10" />
          <Skeleton className="h-4 w-1/2 max-w-md bg-white/10" />
        </div>
      </section>
      <div className="container-x py-8 lg:py-10">
        <ExplorerSkeleton />
      </div>
    </>
  );
}
