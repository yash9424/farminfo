"use client";

import { ChevronDown, RotateCcw, Search, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { PRICE_PRESETS } from "@/lib/query-params";
import type { FacetOption, PartFacets } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useExplorer } from "./explorer-state";

export interface FilterContext {
  facets: PartFacets;
  /** Filters fixed by the page (e.g. a category or location page) are hidden */
  fixed: { category?: boolean; sub?: boolean; location?: boolean };
  /** Group label for the selected category, when derived from a subcategory */
  groupSlug?: string;
}

function Section({
  title,
  children,
  defaultOpen = true,
  count,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  count?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <section className="border-b border-line py-4 last:border-b-0">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={id}
          className="flex w-full items-center justify-between gap-2 text-left text-sm font-bold text-ink"
        >
          <span>
            {title}
            {count ? <span className="ml-2 rounded-md bg-accent-500 px-1.5 py-0.5 text-[0.625rem] text-white">{count}</span> : null}
          </span>
          <ChevronDown className={cn("size-4 text-graphite-400 transition-transform duration-300", open && "rotate-180")} aria-hidden />
        </button>
      </h3>
      <div id={id} hidden={!open} className="mt-3">
        {children}
      </div>
    </section>
  );
}

function OptionRow({
  type,
  name,
  checked,
  onChange,
  label,
  count,
}: {
  type: "checkbox" | "radio";
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-sm text-ink-soft hover:bg-graphite-50">
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="size-4 shrink-0 cursor-pointer accent-[var(--color-accent-500)]"
      />
      <span className={cn("min-w-0 flex-1 truncate", checked && "font-semibold text-ink")}>{label}</span>
      {count !== undefined && <span className="shrink-0 text-xs text-muted tabular">{count}</span>}
    </label>
  );
}

function SelectRow({
  label,
  value,
  options,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  options: FacetOption[];
  onChange: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-muted">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-line-strong bg-white pr-8 pl-3 text-sm font-medium text-ink outline-none focus:border-graphite-500 disabled:cursor-not-allowed disabled:bg-graphite-50 disabled:text-graphite-400"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label} ({o.count})
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-graphite-400" aria-hidden />
      </div>
    </div>
  );
}

/** Keyword box with debounce, kept in sync with the URL. */
function KeywordFilter() {
  const { params, update } = useExplorer();
  const urlValue = params.get("q") ?? "";
  const [text, setText] = useState(urlValue);
  const [synced, setSynced] = useState(urlValue);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  if (urlValue !== synced) {
    setSynced(urlValue);
    setText(urlValue);
  }
  useEffect(() => () => clearTimeout(timer.current), []);
  const id = useId();
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        Search within results
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-graphite-400" aria-hidden />
      <input
        id={id}
        type="search"
        value={text}
        onChange={(e) => {
          const v = e.target.value;
          setText(v);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => update({ q: v.trim() || undefined }), 350);
        }}
        placeholder="Part name, number, brand…"
        className="h-10 w-full rounded-lg border border-line-strong bg-white pr-8 pl-9 text-sm text-ink outline-none placeholder:text-graphite-400 focus:border-graphite-500 [&::-webkit-search-cancel-button]:appearance-none"
      />
      {text && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            clearTimeout(timer.current);
            setText("");
            update({ q: undefined });
          }}
          className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted hover:bg-graphite-100"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}

function PriceFilter({ facets }: { facets: PartFacets }) {
  const { params, update } = useExplorer();
  const preset = params.get("price") ?? "";
  const [min, setMin] = useState(params.get("min") ?? "");
  const [max, setMax] = useState(params.get("max") ?? "");
  const minId = useId();
  const maxId = useId();
  return (
    <div className="space-y-0.5">
      <OptionRow type="radio" name="price" checked={!preset && !params.get("min") && !params.get("max")} onChange={() => update({ price: undefined, min: undefined, max: undefined })} label="Any price" />
      {PRICE_PRESETS.map((p) => (
        <OptionRow
          key={p.value}
          type="radio"
          name="price"
          checked={preset === p.value}
          onChange={() => update({ price: p.value, min: undefined, max: undefined })}
          label={p.label}
        />
      ))}
      <form
        className="flex items-end gap-2 pt-2"
        onSubmit={(e) => {
          e.preventDefault();
          update({ price: undefined, min: min || undefined, max: max || undefined });
        }}
      >
        <div className="min-w-0 flex-1">
          <label htmlFor={minId} className="mb-1 block text-xs text-muted">Min ₹</label>
          <input id={minId} inputMode="numeric" value={min} onChange={(e) => setMin(e.target.value.replace(/\D/g, ""))} placeholder="0" className="h-9 w-full rounded-lg border border-line-strong px-2.5 text-sm outline-none focus:border-graphite-500" />
        </div>
        <div className="min-w-0 flex-1">
          <label htmlFor={maxId} className="mb-1 block text-xs text-muted">Max ₹</label>
          <input id={maxId} inputMode="numeric" value={max} onChange={(e) => setMax(e.target.value.replace(/\D/g, ""))} placeholder="Any" className="h-9 w-full rounded-lg border border-line-strong px-2.5 text-sm outline-none focus:border-graphite-500" />
        </div>
        <button type="submit" className="h-9 rounded-lg bg-graphite-950 px-3 text-sm font-semibold text-white hover:bg-graphite-800">
          Go
        </button>
      </form>
      {facets.onRequestCount > 0 && (
        <div className="pt-2">
          <OptionRow
            type="checkbox"
            name="onrequest"
            checked={params.get("onrequest") === "1"}
            onChange={() => update({ onrequest: params.get("onrequest") === "1" ? undefined : "1" })}
            label="Include “Price on Request”"
            count={facets.onRequestCount}
          />
        </div>
      )}
    </div>
  );
}

function toggleInList(current: string | null, value: string) {
  const set = new Set((current ?? "").split(",").filter(Boolean));
  if (set.has(value)) set.delete(value);
  else set.add(value);
  return [...set].join(",") || undefined;
}

export function FiltersPanel({ facets, fixed, groupSlug }: FilterContext) {
  const { params, update, reset } = useExplorer();
  const [allBrands, setAllBrands] = useState(false);
  const group = params.get("category") ?? groupSlug ?? "";
  const sub = params.get("sub") ?? "";
  const brands = new Set((params.get("brand") ?? "").split(",").filter(Boolean));
  const conditions = new Set((params.get("condition") ?? "").split(",").filter(Boolean));
  const brandList = allBrands ? facets.brands : facets.brands.slice(0, 8);
  const hasFilters = [...params.keys()].some((k) => !["view", "sort", "page"].includes(k));

  return (
    <div>
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-base font-bold text-ink">Filters</h2>
        {hasFilters && (
          <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 hover:text-accent-700">
            <RotateCcw className="size-3.5" aria-hidden />
            Reset
          </button>
        )}
      </div>

      <KeywordFilter />

      {!fixed.category && (
        <Section title="Category" count={group ? 1 : 0}>
          <div className="space-y-0.5">
            <OptionRow type="radio" name="category" checked={!group} onChange={() => update({ category: undefined, sub: undefined })} label="All categories" />
            {facets.categories.map((c) => (
              <OptionRow
                key={c.value}
                type="radio"
                name="category"
                checked={group === c.value}
                onChange={() => update({ category: c.value, sub: undefined })}
                label={c.label}
                count={c.count}
              />
            ))}
          </div>
        </Section>
      )}

      {!fixed.sub && facets.subcategories.length > 0 && (
        <Section title="Part type" count={sub ? 1 : 0}>
          <div className="space-y-0.5">
            <OptionRow type="radio" name="sub" checked={!sub} onChange={() => update({ sub: undefined })} label="All types" />
            {facets.subcategories.map((c) => (
              <OptionRow key={c.value} type="radio" name="sub" checked={sub === c.value} onChange={() => update({ sub: c.value })} label={c.label} count={c.count} />
            ))}
          </div>
        </Section>
      )}

      {!fixed.location && (
        <Section title="Location" count={params.get("state") ? 1 : 0}>
          <div className="space-y-2.5">
            <p className="text-xs text-muted">India</p>
            <SelectRow
              label="State"
              value={params.get("state") ?? ""}
              options={facets.states}
              placeholder="All states"
              onChange={(v) => update({ state: v || undefined, district: undefined, city: undefined })}
            />
            <SelectRow
              label="District"
              value={params.get("district") ?? ""}
              options={facets.districts}
              placeholder={params.get("state") ? "All districts" : "Select a state first"}
              disabled={!params.get("state")}
              onChange={(v) => update({ district: v || undefined, city: undefined })}
            />
            <SelectRow
              label="City"
              value={params.get("city") ?? ""}
              options={facets.cities}
              placeholder={params.get("district") ? "All cities" : "Select a district first"}
              disabled={!params.get("district")}
              onChange={(v) => update({ city: v || undefined })}
            />
          </div>
        </Section>
      )}

      {facets.conditions.length > 0 && (
        <Section title="Condition" count={conditions.size}>
          <div className="space-y-0.5">
            {facets.conditions.map((c) => (
              <OptionRow
                key={c.value}
                type="checkbox"
                name="condition"
                checked={conditions.has(c.value)}
                onChange={() => update({ condition: toggleInList(params.get("condition"), c.value) })}
                label={c.label}
                count={c.count}
              />
            ))}
          </div>
        </Section>
      )}

      <Section title="Price" count={params.get("price") || params.get("min") || params.get("max") ? 1 : 0}>
        <PriceFilter key={`${params.get("min")}-${params.get("max")}`} facets={facets} />
      </Section>

      {facets.brands.length > 0 && (
        <Section title="Brand" count={brands.size}>
          <div className="space-y-0.5">
            {brandList.map((b) => (
              <OptionRow
                key={b.value}
                type="checkbox"
                name="brand"
                checked={brands.has(b.value)}
                onChange={() => update({ brand: toggleInList(params.get("brand"), b.value) })}
                label={b.label}
                count={b.count}
              />
            ))}
            {facets.brands.length > 8 && (
              <button type="button" onClick={() => setAllBrands((v) => !v)} className="mt-1 px-1.5 text-sm font-semibold text-accent-600 hover:text-accent-700">
                {allBrands ? "Show fewer" : `Show all ${facets.brands.length} brands`}
              </button>
            )}
          </div>
        </Section>
      )}

      {facets.availability.length > 1 && (
        <Section title="Availability" defaultOpen={false} count={params.get("availability") ? 1 : 0}>
          <div className="space-y-0.5">
            <OptionRow type="radio" name="availability" checked={!params.get("availability")} onChange={() => update({ availability: undefined })} label="All listings" />
            {facets.availability.map((a) => (
              <OptionRow
                key={a.value}
                type="radio"
                name="availability"
                checked={params.get("availability") === a.value}
                onChange={() => update({ availability: a.value })}
                label={a.label}
                count={a.count}
              />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
