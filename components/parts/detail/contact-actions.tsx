"use client";

import { Bookmark, BookmarkCheck, MessageSquareText, Phone } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { EnquiryDialog } from "./enquiry-dialog";

const KEY = "machinfo:saved";
const listeners = new Set<() => void>();

function readSaved(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

/** Saved parts are a per-browser convenience (localStorage). */
function useSaved(slug: string) {
  const saved = useSyncExternalStore(
    subscribe,
    () => readSaved().includes(slug),
    () => false,
  );
  const toggle = () => {
    const list = readSaved();
    const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
    listeners.forEach((l) => l());
  };
  return [saved, toggle] as const;
}

export function ContactActions({
  slug,
  title,
  sellerName,
  sold,
  variant = "panel",
}: {
  slug: string;
  title: string;
  sellerName: string;
  sold?: boolean;
  variant?: "panel" | "seller" | "sticky";
}) {
  const [open, setOpen] = useState(false);
  const [saved, toggleSaved] = useSaved(slug);

  const dialog = <EnquiryDialog open={open} onOpenChange={setOpen} slug={slug} title={title} sellerName={sellerName} />;

  if (variant === "sticky") {
    return (
      <>
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            disabled={sold}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent-500 font-semibold text-white disabled:bg-graphite-300"
          >
            <Phone className="size-4.5" aria-hidden />
            {sold ? "This part has been sold" : "Contact Seller"}
          </button>
        </div>
        {dialog}
      </>
    );
  }

  if (variant === "seller") {
    return (
      <>
        <div className="grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={() => setOpen(true)} disabled={sold} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-graphite-950 text-sm font-semibold text-white hover:bg-graphite-800 disabled:opacity-50">
            <Phone className="size-4" aria-hidden />
            Contact Seller
          </button>
          <button type="button" onClick={() => setOpen(true)} disabled={sold} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-line-strong bg-white text-sm font-semibold text-ink hover:border-graphite-400 disabled:opacity-50">
            <MessageSquareText className="size-4" aria-hidden />
            Send Enquiry
          </button>
        </div>
        {dialog}
      </>
    );
  }

  return (
    <>
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={sold}
          className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-accent-500 text-base font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_10px_24px_-12px_rgb(242_113_28/0.9)] transition-colors hover:bg-accent-600 disabled:bg-graphite-300 disabled:shadow-none"
        >
          <Phone className="size-4.5" aria-hidden />
          {sold ? "This part has been sold" : "Contact Seller"}
        </button>
        <div className="grid grid-cols-[1fr_auto] gap-2.5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            disabled={sold}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-line-strong bg-white text-[0.9375rem] font-semibold text-ink transition-colors hover:border-graphite-400 disabled:opacity-50"
          >
            <MessageSquareText className="size-4.5" aria-hidden />
            Send Enquiry
          </button>
          <button
            type="button"
            onClick={toggleSaved}
            aria-pressed={saved}
            aria-label={saved ? "Remove from saved parts" : "Save part"}
            className={cn(
              "flex h-12 items-center justify-center gap-2 rounded-xl border px-4 text-[0.9375rem] font-semibold transition-colors",
              saved ? "border-accent-300 bg-accent-50 text-accent-700" : "border-line-strong bg-white text-ink hover:border-graphite-400",
            )}
          >
            {saved ? <BookmarkCheck className="size-4.5" aria-hidden /> : <Bookmark className="size-4.5" aria-hidden />}
            <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>
      {dialog}
    </>
  );
}
