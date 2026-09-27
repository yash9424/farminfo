"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, use, useCallback, useOptimistic, useTransition } from "react";
import { withParams } from "@/lib/query-params";
import { cn } from "@/lib/utils";

interface ExplorerState {
  params: URLSearchParams;
  isPending: boolean;
  /** Apply a patch to the URL; filter changes reset pagination */
  update: (patch: Record<string, string | undefined>, opts?: { keepPage?: boolean }) => void;
  reset: () => void;
}

const Ctx = createContext<ExplorerState | null>(null);

/**
 * Filters live in the URL. Changes navigate inside a transition: the server
 * re-renders the listing while the current results stay visible (dimmed).
 */
export function ExplorerStateProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  // Controls reflect the new value immediately while the server renders it
  const [optimisticQs, setOptimisticQs] = useOptimistic(searchParams.toString());

  const navigate = useCallback(
    (qs: string) => {
      startTransition(() => {
        setOptimisticQs(qs);
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [pathname, router, setOptimisticQs],
  );

  const update = useCallback(
    (patch: Record<string, string | undefined>, opts?: { keepPage?: boolean }) => {
      const href = withParams("", new URLSearchParams(optimisticQs), {
        ...(opts?.keepPage ? {} : { page: undefined }),
        ...patch,
      });
      navigate(href.replace(/^\?/, ""));
    },
    [navigate, optimisticQs],
  );

  const reset = useCallback(() => {
    const keep = new URLSearchParams();
    const view = new URLSearchParams(optimisticQs).get("view");
    if (view) keep.set("view", view);
    navigate(keep.toString());
  }, [navigate, optimisticQs]);

  return <Ctx value={{ params: new URLSearchParams(optimisticQs), isPending, update, reset }}>{children}</Ctx>;
}

export function useExplorer() {
  const ctx = use(Ctx);
  if (!ctx) throw new Error("useExplorer must be used inside <ExplorerStateProvider>");
  return ctx;
}

/** Dims results and shows a progress bar while new results load. */
export function PendingArea({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isPending } = useExplorer();
  return (
    <div aria-busy={isPending} className={cn("relative", className)}>
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 -top-3 h-0.5 overflow-hidden rounded-full transition-opacity duration-300",
          isPending ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="h-full w-1/3 rounded-full bg-accent-500 [animation:pending-bar_1.1s_ease-in-out_infinite]" />
      </div>
      <div className={cn("transition-opacity duration-300", isPending && "pointer-events-none opacity-50")}>{children}</div>
    </div>
  );
}
