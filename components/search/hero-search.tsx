"use client";

import { ChevronDown, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The primary search: part keywords + optional state, submitted to /parts.
 * Works without JS too (it's a plain GET form).
 */
export function HeroSearch({
  states,
  className,
}: {
  states: { slug: string; name: string }[];
  className?: string;
}) {
  const router = useRouter();
  const inputId = useId();
  const stateId = useId();
  const [q, setQ] = useState("");
  const [state, setState] = useState("");

  return (
    <form
      role="search"
      action="/parts"
      onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (q.trim()) params.set("q", q.trim());
        if (state) params.set("state", state);
        const qs = params.toString();
        router.push(qs ? `/parts?${qs}` : "/parts");
      }}
      className={cn(
        "flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-float ring-1 ring-black/5 sm:flex-row sm:items-center sm:gap-0",
        className,
      )}
    >
      <label htmlFor={inputId} className="sr-only">
        Search parts
      </label>
      <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
        <Search className="size-5 shrink-0 text-graphite-400" aria-hidden />
        <input
          id={inputId}
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search spindle, servo motor, ball screw, controller…"
          autoComplete="off"
          enterKeyHint="search"
          className="h-12 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-graphite-400 sm:h-14 sm:text-[1.0625rem]"
        />
      </div>

      <div className="relative flex items-center border-t border-line sm:w-56 sm:border-t-0 sm:border-l">
        <MapPin className="pointer-events-none absolute left-3 size-4.5 text-accent-500" aria-hidden />
        <label htmlFor={stateId} className="sr-only">
          Location
        </label>
        <select
          id={stateId}
          name="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="h-12 w-full cursor-pointer appearance-none bg-transparent pr-9 pl-9 text-[0.9375rem] font-medium text-ink outline-none sm:h-14"
        >
          <option value="">All India</option>
          {states.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 size-4 text-graphite-400" aria-hidden />
      </div>

      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 text-[0.9375rem] font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2)] transition-colors hover:bg-accent-600 sm:h-14 sm:px-7"
      >
        <Search className="size-4.5" aria-hidden />
        Search
      </button>
    </form>
  );
}
