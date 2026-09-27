import Link from "next/link";
import { cn } from "@/lib/utils";

/** Spindle-and-toolpath mark */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      <rect width="32" height="32" rx="8" fill="var(--color-graphite-950)" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" fill="none" stroke="rgb(255 255 255 / 0.12)" />
      <path d="M9 23V10.5l7 7 7-7V23" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="17.5" r="2.1" fill="var(--color-accent-500)" />
    </svg>
  );
}

export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5 rounded-lg", className)} aria-label="MachInfo home">
      <LogoMark className="transition-transform duration-500 ease-(--ease-out-expo) group-hover:rotate-[-8deg]" />
      <span
        className={cn(
          "text-[1.3rem] leading-none font-extrabold tracking-[-0.04em] transition-colors duration-300",
          tone === "light" ? "text-white" : "text-ink",
        )}
      >
        Mach<span className="text-accent-500">Info</span>
      </span>
    </Link>
  );
}
