"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ArrowDownUp, LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { SORT_OPTIONS } from "@/lib/query-params";
import { cn, plural } from "@/lib/utils";
import { useExplorer } from "./explorer-state";
import { FiltersPanel, type FilterContext } from "./filters-panel";

export interface ActiveChip {
  key: string;
  label: string;
  /** params to clear when removed */
  clear: Record<string, undefined>;
}

export function Toolbar({
  total,
  scopeLabel,
  chips,
  filterContext,
}: {
  total: number;
  scopeLabel: string;
  chips: ActiveChip[];
  filterContext: FilterContext;
}) {
  const { params, update, reset } = useExplorer();
  const [drawer, setDrawer] = useState(false);
  const view = params.get("view") === "list" ? "list" : "grid";
  const sort = params.get("sort") ?? "newest";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted" role="status" aria-live="polite">
          <span className="text-base font-bold text-ink tabular">{plural(total, "part")}</span>
          <span className="mx-1.5">·</span>
          {scopeLabel}
        </p>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-line-strong bg-white px-3.5 text-sm font-semibold text-ink lg:hidden"
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            Filters
            {chips.length > 0 && <span className="rounded-md bg-accent-500 px-1.5 text-xs text-white">{chips.length}</span>}
          </button>

          <label className="relative flex h-10 flex-1 items-center sm:flex-none">
            <span className="sr-only">Sort by</span>
            <ArrowDownUp className="pointer-events-none absolute left-3 size-4 text-graphite-400" aria-hidden />
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value === "newest" ? undefined : e.target.value })}
              className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-line-strong bg-white pr-4 pl-9 text-sm font-semibold text-ink outline-none focus:border-graphite-500 sm:w-auto"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <div role="group" aria-label="Layout" className="hidden h-10 items-center rounded-xl border border-line-strong bg-white p-1 sm:flex">
            {(["grid", "list"] as const).map((v) => {
              const Icon = v === "grid" ? LayoutGrid : List;
              return (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  aria-label={v === "grid" ? "Grid view" : "List view"}
                  onClick={() => update({ view: v === "grid" ? undefined : "list" }, { keepPage: true })}
                  className={cn(
                    "grid h-full w-9 place-items-center rounded-lg transition-colors",
                    view === v ? "bg-graphite-950 text-white" : "text-muted hover:text-ink",
                  )}
                >
                  <Icon className="size-4" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {chips.length > 0 && (
        <ul className="mt-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
          {chips.map((c) => (
            <li key={c.key}>
              <button
                type="button"
                onClick={() => update(c.clear)}
                className="group inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-white py-1 pr-1.5 pl-2.5 text-sm font-medium text-ink-soft hover:border-graphite-400"
                aria-label={`Remove filter: ${c.label}`}
              >
                {c.label}
                <X className="size-3.5 text-graphite-400 group-hover:text-ink" aria-hidden />
              </button>
            </li>
          ))}
          <li>
            <button type="button" onClick={reset} className="px-1 text-sm font-semibold text-accent-600 hover:text-accent-700">
              Clear all
            </button>
          </li>
        </ul>
      )}

      {/* mobile filter drawer */}
      <Dialog.Root open={drawer} onOpenChange={setDrawer}>
        <AnimatePresence>
          {drawer && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <m.div className="fixed inset-0 z-[70] bg-graphite-950/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount aria-describedby={undefined}>
                <m.div
                  className="fixed inset-y-0 left-0 z-[71] flex w-[min(24rem,92vw)] flex-col bg-white shadow-float outline-none"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-center justify-between border-b border-line px-5 py-4">
                    <Dialog.Title className="text-lg font-bold text-ink">Filter parts</Dialog.Title>
                    <Dialog.Close className="grid size-9 place-items-center rounded-lg hover:bg-graphite-100" aria-label="Close filters">
                      <X className="size-5" />
                    </Dialog.Close>
                  </div>
                  <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-3">
                    <FiltersPanel {...filterContext} />
                  </div>
                  <div className="border-t border-line p-4">
                    <Dialog.Close className="h-12 w-full rounded-xl bg-graphite-950 text-[0.9375rem] font-semibold text-white">
                      Show {plural(total, "part")}
                    </Dialog.Close>
                  </div>
                </m.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  );
}
