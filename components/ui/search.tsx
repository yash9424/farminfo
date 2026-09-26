"use client";

import { Search as SearchIcon, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Text search with built-in debounce. `onSearch` fires `delay` ms after typing stops. */
export function Search({
  label,
  value,
  onSearch,
  placeholder,
  delay = 350,
  className,
}: {
  label: string;
  value: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  delay?: number;
  className?: string;
}) {
  const id = useId();
  const [text, setText] = useState(value);
  const [synced, setSynced] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // keep in sync when the value changes from outside (e.g. "Reset filters")
  if (value !== synced) {
    setSynced(value);
    setText(value);
  }

  useEffect(() => () => clearTimeout(timer.current), []);

  function update(next: string) {
    setText(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch(next.trim()), delay);
  }

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[0.6875rem] font-bold tracking-[0.14em] text-muted uppercase">
        {label}
      </label>
      <div className="group relative">
        <SearchIcon
          className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-forest-600"
          aria-hidden
        />
        <input
          id={id}
          type="search"
          value={text}
          onChange={(e) => update(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              clearTimeout(timer.current);
              onSearch(text.trim());
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="search"
          className={cn(
            "h-12 w-full rounded-2xl border border-line bg-white pr-10 pl-10.5 text-[0.9375rem] font-medium text-ink transition-[border-color,box-shadow] duration-200 outline-none placeholder:font-normal placeholder:text-muted/80",
            "hover:border-forest-300 focus:border-forest-500 focus:ring-4 focus:ring-forest-500/12",
            "[&::-webkit-search-cancel-button]:appearance-none",
          )}
        />
        {text && (
          <button
            type="button"
            onClick={() => {
              clearTimeout(timer.current);
              setText("");
              onSearch("");
            }}
            aria-label="Clear search"
            className="absolute top-1/2 right-2.5 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-forest-900/6 hover:text-ink"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
