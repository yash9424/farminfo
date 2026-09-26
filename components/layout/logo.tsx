import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      <rect width="32" height="32" rx="9" fill="var(--color-forest-800)" />
      <path
        d="M16 25.5V13.2"
        stroke="var(--color-gold-300)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 15.4c0-4.3 2.7-7.2 7.2-7.6.2 4.4-2.6 7.6-7.2 7.6Z"
        fill="var(--color-gold-300)"
      />
      <path
        d="M16 19.6c0-3.6-2.3-6-6-6.3-.2 3.7 2.2 6.3 6 6.3Z"
        fill="var(--color-cream-100)"
      />
      <path d="M8 25.5h16" stroke="var(--color-forest-400)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  className,
  tone = "dark",
  ariaLabel = "FarmInfo home",
}: {
  className?: string;
  tone?: "dark" | "light";
  ariaLabel?: string;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5 rounded-lg", className)}
      aria-label={ariaLabel}
    >
      <LogoMark className="transition-transform duration-500 ease-(--ease-out-expo) group-hover:-rotate-6" />
      <span
        lang="en"
        className={cn(
          "font-display text-[1.35rem] leading-none font-semibold tracking-[-0.03em] transition-colors duration-300",
          tone === "light" ? "text-white" : "text-forest-950",
        )}
      >
        Farm<span className={tone === "light" ? "text-gold-300" : "text-forest-600"}>Info</span>
      </span>
    </Link>
  );
}
