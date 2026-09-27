import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** ₹18,50,000 — Indian digit grouping */
export function formatINR(value: number): string {
  return inr.format(value);
}

/** ₹18.5 L / ₹1.2 Cr — compact Indian units for chips and filters */
export function formatINRCompact(value: number): string {
  if (value >= 1_00_00_000) return `₹${trim(value / 1_00_00_000)} Cr`;
  if (value >= 1_00_000) return `₹${trim(value / 1_00_000)} L`;
  if (value >= 1_000) return `₹${trim(value / 1_000)}K`;
  return `₹${value}`;
}

function trim(n: number) {
  return (Math.round(n * 100) / 100).toString();
}

export const PRICE_TYPE_LABEL = {
  fixed: "Fixed price",
  negotiable: "Negotiable",
  on_request: "Price on request",
} as const;

export const CONDITION_LABEL = {
  new: "New",
  used: "Used",
  refurbished: "Refurbished",
} as const;

export const SELLER_TYPE_LABEL = {
  dealer: "Dealer",
  manufacturer: "Manufacturer",
  owner: "Direct owner",
} as const;

/** "3 days ago", "2 months ago" — relative to `now` */
export function timeAgo(iso: string, now: Date = new Date()): string {
  const seconds = Math.max(0, (now.getTime() - Date.parse(iso)) / 1000);
  const units: [number, string][] = [
    [31_536_000, "year"],
    [2_592_000, "month"],
    [604_800, "week"],
    [86_400, "day"],
    [3_600, "hour"],
    [60, "minute"],
  ];
  for (const [size, name] of units) {
    const n = Math.floor(seconds / size);
    if (n >= 1) return `${n} ${name}${n > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

/** "Sep 2024" */
export function formatMonthYear(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(iso),
  );
}

export function plural(n: number, one: string, many = `${one}s`) {
  return `${n.toLocaleString("en-IN")} ${n === 1 ? one : many}`;
}
