import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TZ = "Asia/Kolkata";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** ₹2,450 — Indian digit grouping (₹1,84,500) */
export function formatINR(value: number): string {
  return inr.format(value);
}

/** 2.4 → "+2.4%", -0.8 → "-0.8%", null → "—" */
export function formatChange(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "—";
  if (Math.abs(value) < 0.05) return "0.0%";
  const abs = Math.abs(value).toFixed(1);
  return `${value > 0 ? "+" : "-"}${abs}%`;
}

export type Trend = "up" | "down" | "flat";

export function trendOf(change: number | null): Trend {
  if (change === null || Math.abs(change) < 0.05) return "flat";
  return change > 0 ? "up" : "down";
}

/** YYYY-MM-DD for "now" in Gujarat (IST), independent of server timezone */
export function todayISO(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function isISODate(value: string | undefined | null): value is string {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

function dayDiff(aISO: string, bISO: string) {
  return Math.round(
    (Date.parse(`${aISO}T00:00:00Z`) - Date.parse(`${bISO}T00:00:00Z`)) / 86_400_000,
  );
}

/** "Today", "Yesterday", or "12 Sep 2026" */
export function formatDay(iso: string, now: Date = new Date()): string {
  const diff = dayDiff(todayISO(now), iso);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${iso}T00:00:00Z`));
}

/** "12 Sep" for chart axes */
export function formatShortDay(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export function formatLongDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T00:00:00Z`));
}

function formatTime(isoDateTime: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(new Date(isoDateTime))
    .replace(/\b(am|pm)\b/i, (m) => m.toUpperCase());
}

/**
 * "Today, 10:42 AM" — when the source only provides a date, the time is omitted
 * rather than invented.
 */
export function formatUpdated(
  updatedAt: string | null,
  date: string,
  now: Date = new Date(),
): string {
  const day = updatedAt ? formatDay(todayISO(new Date(updatedAt)), now) : formatDay(date, now);
  return updatedAt ? `${day}, ${formatTime(updatedAt)}` : day;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
