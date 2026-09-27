"use client";

import { CheckCircle2, ChevronDown, ImagePlus, Loader2, Send } from "lucide-react";
import { useActionState, useId } from "react";
import { submitListing, type ListingState } from "@/app/actions/listing";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-xl border bg-white px-3.5 text-[0.9375rem] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-graphite-400 focus:border-graphite-500 focus:ring-4 focus:ring-graphite-500/10";

function Row({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: (id: string, describedBy?: string) => React.ReactNode }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children(id, error ? `${id}-e` : undefined)}
      {error ? (
        <p id={`${id}-e`} className="mt-1 text-xs font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

function Select({ id, name, options, placeholder, error, describedBy }: { id: string; name: string; options: { value: string; label: string; group?: string }[]; placeholder: string; error?: string; describedBy?: string }) {
  return (
    <div className="relative">
      <select id={id} name={name} defaultValue="" aria-invalid={!!error} aria-describedby={describedBy} className={cn(field, "h-11 cursor-pointer appearance-none pr-9", error ? "border-danger" : "border-line-strong")}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-graphite-400" aria-hidden />
    </div>
  );
}

export function ListingForm({
  categories,
  states,
}: {
  categories: { value: string; label: string }[];
  states: { value: string; label: string }[];
}) {
  const [state, action, pending] = useActionState<ListingState, FormData>(submitListing, { status: "idle" });
  const fe = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-2xl border border-line bg-white p-8 text-center shadow-card">
        <CheckCircle2 className="mx-auto size-12 text-ok" aria-hidden />
        <h2 className="mt-4 text-xl font-bold text-ink">Listing received</h2>
        <p className="mt-2 text-sm text-muted">Reference {state.reference}</p>
        <p className="mx-auto mt-5 max-w-md rounded-xl bg-accent-50 px-4 py-3 text-sm text-accent-700 ring-1 ring-accent-200">
          Demo mode: listings aren’t stored yet. Once a backend is connected, your part will go live after a quick review.
        </p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="space-y-8 rounded-2xl border border-line bg-white p-5 shadow-card sm:p-8">
      <fieldset className="space-y-5">
        <legend className="text-lg font-bold text-ink">Part details</legend>
        <Row label="Part name" error={fe.title} hint="Include the brand and key rating, e.g. “FANUC Servo Motor 12 Nm, 3000 RPM”.">
          {(id, d) => <input id={id} name="title" aria-invalid={!!fe.title} aria-describedby={d} className={cn(field, "h-11", fe.title ? "border-danger" : "border-line-strong")} />}
        </Row>
        <div className="grid gap-5 sm:grid-cols-2">
          <Row label="Category" error={fe.category}>
            {(id, d) => <Select id={id} name="category" options={categories} placeholder="Choose category" error={fe.category} describedBy={d} />}
          </Row>
          <Row label="Condition" error={fe.condition}>
            {(id, d) => (
              <Select id={id} name="condition" options={[{ value: "new", label: "New" }, { value: "used", label: "Used" }, { value: "refurbished", label: "Refurbished" }]} placeholder="Choose condition" error={fe.condition} describedBy={d} />
            )}
          </Row>
          <Row label="Brand" hint="Optional">
            {(id) => <input id={id} name="brand" className={cn(field, "h-11 border-line-strong")} />}
          </Row>
          <Row label="Part / model number" hint="Optional — helps buyers match exactly">
            {(id) => <input id={id} name="partNumber" className={cn(field, "h-11 border-line-strong")} />}
          </Row>
          <Row label="Price (₹)" hint="Leave blank for “Price on request”">
            {(id) => <input id={id} name="price" inputMode="numeric" className={cn(field, "h-11 border-line-strong")} />}
          </Row>
          <Row label="Compatible with" hint="Optional — e.g. FANUC 0i-MF, VMC 850">
            {(id) => <input id={id} name="compatibility" className={cn(field, "h-11 border-line-strong")} />}
          </Row>
        </div>
        <Row label="Specifications & notes" hint="Optional — ratings, dimensions, test status, warranty">
          {(id) => <textarea id={id} name="notes" rows={4} className={cn(field, "border-line-strong py-3")} />}
        </Row>
        <div className="flex items-center gap-4 rounded-xl border-2 border-dashed border-line-strong bg-graphite-50 p-5 text-sm text-muted">
          <ImagePlus className="size-8 shrink-0 text-graphite-400" aria-hidden />
          <p>
            <span className="font-semibold text-ink">Photo upload</span> will be available once listings are connected to a
            backend. Clear photos of the part and its nameplate get the most enquiries.
          </p>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-lg font-bold text-ink">Location &amp; contact</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Row label="State" error={fe.state}>
            {(id, d) => <Select id={id} name="state" options={states} placeholder="Choose state" error={fe.state} describedBy={d} />}
          </Row>
          <Row label="City" error={fe.city}>
            {(id, d) => <input id={id} name="city" aria-invalid={!!fe.city} aria-describedby={d} className={cn(field, "h-11", fe.city ? "border-danger" : "border-line-strong")} />}
          </Row>
          <Row label="Your / business name" error={fe.name}>
            {(id, d) => <input id={id} name="name" autoComplete="organization" aria-invalid={!!fe.name} aria-describedby={d} className={cn(field, "h-11", fe.name ? "border-danger" : "border-line-strong")} />}
          </Row>
          <Row label="Mobile number" error={fe.phone}>
            {(id, d) => <input id={id} name="phone" type="tel" inputMode="tel" autoComplete="tel" aria-invalid={!!fe.phone} aria-describedby={d} className={cn(field, "h-11", fe.phone ? "border-danger" : "border-line-strong")} />}
          </Row>
        </div>
      </fieldset>

      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl bg-danger-soft px-4 py-2.5 text-sm font-medium text-danger">
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent-500 font-semibold text-white hover:bg-accent-600 disabled:opacity-70 sm:w-auto sm:px-8">
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
        {pending ? "Submitting…" : "Submit listing"}
      </button>
    </form>
  );
}
