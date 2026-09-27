"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ArrowUpRight, CornerDownLeft, Layers, Loader2, MapPin, Package, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

interface Suggestion {
  type: "part" | "category" | "location";
  label: string;
  hint: string;
  href: string;
}

const ICONS = { part: Package, category: Layers, location: MapPin };

/** Global search panel: live suggestions from /api/search, Enter searches all parts. */
export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        const data = (await res.json()) as { suggestions: Suggestion[] };
        setResults(data.suggestions);
        setActive(-1);
      } catch {
        /* aborted or offline — keep previous suggestions */
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const shown = query.trim().length >= 2 ? results : [];

  function go(href: string) {
    onOpenChange(false);
    router.push(href);
  }
  function submit(q = query) {
    const term = q.trim();
    go(term ? `/parts?q=${encodeURIComponent(term)}` : "/parts");
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) {
          setQuery("");
          setResults([]);
        }
      }}
    >
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <m.div
                className="fixed inset-0 z-[80] bg-graphite-950/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content
              asChild
              forceMount
              aria-describedby={undefined}
              onOpenAutoFocus={(e) => {
                e.preventDefault();
                inputRef.current?.focus();
              }}
            >
              <m.div
                className="fixed inset-x-3 top-3 z-[81] mx-auto max-w-2xl overflow-hidden rounded-2xl border border-line bg-white shadow-float outline-none sm:top-[12vh]"
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <Dialog.Title className="sr-only">Search parts</Dialog.Title>
                <form
                  role="search"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (active >= 0 && shown[active]) go(shown[active].href);
                    else submit();
                  }}
                  className="flex items-center gap-3 border-b border-line px-4 sm:px-5"
                >
                  {loading ? (
                    <Loader2 className="size-5 shrink-0 animate-spin text-graphite-400" aria-hidden />
                  ) : (
                    <Search className="size-5 shrink-0 text-graphite-400" aria-hidden />
                  )}
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setActive((a) => Math.min(a + 1, shown.length - 1));
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setActive((a) => Math.max(a - 1, -1));
                      }
                    }}
                    role="combobox"
                    aria-expanded={shown.length > 0}
                    aria-controls={listId}
                    aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
                    aria-label="Search parts"
                    placeholder="Search spindle, servo motor, ball screw, controller…"
                    autoComplete="off"
                    enterKeyHint="search"
                    className="h-15 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-graphite-400 sm:text-[1.0625rem]"
                  />
                  <Dialog.Close className="grid size-9 place-items-center rounded-lg text-muted hover:bg-graphite-100" aria-label="Close search">
                    <X className="size-5" />
                  </Dialog.Close>
                </form>

                <div className="max-h-[60vh] overflow-y-auto overscroll-contain p-2 sm:p-3">
                  {shown.length > 0 ? (
                    <ul id={listId} role="listbox" aria-label="Suggestions">
                      {shown.map((s, i) => {
                        const Icon = ICONS[s.type];
                        return (
                          <li key={s.href} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                            <button
                              type="button"
                              onClick={() => go(s.href)}
                              onPointerMove={() => setActive(i)}
                              className={cn(
                                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left",
                                i === active ? "bg-graphite-100" : "hover:bg-graphite-50",
                              )}
                            >
                              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-graphite-100 text-graphite-600">
                                <Icon className="size-4" aria-hidden />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-[0.9375rem] font-semibold text-ink">{s.label}</span>
                                <span className="block truncate text-xs text-muted">{s.hint}</span>
                              </span>
                              <ArrowUpRight className="size-4 shrink-0 text-graphite-400" aria-hidden />
                            </button>
                          </li>
                        );
                      })}
                      <li>
                        <button
                          type="button"
                          onClick={() => submit()}
                          className="mt-1 flex w-full items-center justify-between rounded-xl bg-graphite-950 px-4 py-3 text-sm font-semibold text-white"
                        >
                          See all results for “{query.trim()}”
                          <CornerDownLeft className="size-4" aria-hidden />
                        </button>
                      </li>
                    </ul>
                  ) : query.trim().length >= 2 && !loading ? (
                    <div className="px-3 py-8 text-center">
                      <p className="font-semibold text-ink">No quick matches</p>
                      <button type="button" onClick={() => submit()} className="mt-2 text-sm font-semibold text-accent-600 hover:underline">
                        Search all parts for “{query.trim()}” →
                      </button>
                    </div>
                  ) : (
                    <div className="p-2">
                      <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-muted uppercase">Popular searches</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {siteConfig.popularSearches.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => submit(s)}
                            className="rounded-lg border border-line bg-graphite-50 px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:border-graphite-300 hover:bg-white"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </m.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
