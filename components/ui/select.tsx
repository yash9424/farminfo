"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Check, ChevronDown, Search as SearchIcon } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  /** Secondary text, e.g. district */
  hint?: string;
  /** Group heading, e.g. crop category */
  group?: string;
  /** Extra words that should match search */
  keywords?: string[];
  icon?: ReactNode;
}

/**
 * Searchable single-select (ARIA combobox + listbox). Scales to long lists:
 * type to filter, arrow keys to move, Enter to choose, Esc to close.
 */
export function Select({
  label,
  value,
  options,
  onChange,
  allLabel,
  placeholder = "Search…",
  icon,
  className,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  /** Label of the empty-value option, e.g. "All markets" */
  allLabel: string;
  placeholder?: string;
  icon?: ReactNode;
  className?: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const all: SelectOption = { value: "", label: allLabel };
  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [{ value: "", label: allLabel }, ...options];
    // rank: label starts with query > label contains query > other fields match
    const rank = (o: SelectOption) => {
      const label = o.label.toLowerCase();
      if (label.startsWith(q)) return 0;
      if (label.includes(q)) return 1;
      const other = [o.hint, o.group, ...(o.keywords ?? [])].filter(Boolean) as string[];
      return other.some((t) => t.toLowerCase().includes(q)) ? 2 : -1;
    };
    return options
      .map((o, i) => ({ o, r: rank(o), i }))
      .filter((x) => x.r >= 0)
      .sort((a, b) => a.r - b.r || a.i - b.i)
      .map((x) => x.o);
  }, [options, query, allLabel]);

  function openList() {
    setQuery("");
    const idx = Math.max(0, [all, ...options].findIndex((o) => o.value === value));
    setActive(idx);
    setOpen(true);
  }

  function close(focusTrigger = true) {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  }

  function choose(opt: SelectOption) {
    onChange(opt.value);
    close();
  }

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function onKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => Math.min(a + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(filtered.length - 1);
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[active]) choose(filtered[active]);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  const listId = `${id}-list`;
  const optionId = (i: number) => `${id}-opt-${i}`;

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <span id={`${id}-label`} className="mb-1.5 block text-[0.6875rem] font-bold tracking-[0.14em] text-muted uppercase">
        {label}
      </span>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-value`}
        onClick={() => (open ? close() : openList())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            openList();
          }
        }}
        className={cn(
          "flex h-12 w-full items-center gap-2.5 rounded-2xl border bg-white px-3.5 text-left text-[0.9375rem] transition-[border-color,box-shadow] duration-200",
          open
            ? "border-forest-500 ring-4 ring-forest-500/12"
            : "border-line hover:border-forest-300",
        )}
      >
        {selected?.icon ?? (icon && <span className="text-forest-600 max-[440px]:hidden [&_svg]:size-4.5">{icon}</span>)}
        <span id={`${id}-value`} className={cn("flex-1 truncate", selected ? "font-semibold text-ink" : "text-ink-soft")}>
          {selected?.label ?? allLabel}
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-muted transition-transform duration-300", open && "rotate-180")}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-full z-40 mt-2 min-w-64 origin-top overflow-hidden rounded-2xl border border-line bg-white shadow-lift"
          >
            <div className="flex items-center gap-2 border-b border-line px-3.5">
              <SearchIcon className="size-4 text-muted" aria-hidden />
              <input
                ref={inputRef}
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={filtered[active] ? optionId(active) : undefined}
                aria-autocomplete="list"
                aria-label={`Search ${label.toLowerCase()}`}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                className="h-11 w-full bg-transparent text-[0.9375rem] outline-none placeholder:text-muted/70"
              />
            </div>
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              aria-label={label}
              className="max-h-72 overflow-y-auto overscroll-contain p-1.5"
            >
              {filtered.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-muted">No matches for “{query}”</li>
              )}
              {filtered.map((opt, i) => {
                const showGroup = !query && opt.group && opt.group !== filtered[i - 1]?.group;
                const isSelected = opt.value === value;
                return (
                  <li key={opt.value || "__all"} role="presentation">
                    {showGroup && (
                      <p className="px-3 pt-3 pb-1 text-[0.625rem] font-bold tracking-[0.16em] text-muted uppercase" aria-hidden>
                        {opt.group}
                      </p>
                    )}
                    <div
                      id={optionId(i)}
                      role="option"
                      aria-selected={isSelected}
                      data-index={i}
                      onPointerMove={() => setActive(i)}
                      onClick={() => choose(opt)}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-[0.9375rem]",
                        i === active ? "bg-forest-50 text-forest-900" : "text-ink",
                      )}
                    >
                      {opt.icon}
                      <span className={cn("flex-1 truncate", isSelected && "font-semibold")}>{opt.label}</span>
                      {opt.hint && <span className="shrink-0 text-xs text-muted">{opt.hint}</span>}
                      {isSelected && <Check className="size-4 shrink-0 text-forest-600" aria-hidden />}
                    </div>
                  </li>
                );
              })}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
