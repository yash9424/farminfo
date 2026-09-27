import { cva, type VariantProps } from "class-variance-authority";
import { BadgeCheck, Sparkles, Star } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md font-semibold whitespace-nowrap [&_svg]:size-3.5",
  {
    variants: {
      tone: {
        neutral: "bg-graphite-100 text-graphite-700",
        dark: "bg-graphite-950/85 text-white backdrop-blur",
        accent: "bg-accent-500 text-white",
        accentSoft: "bg-accent-50 text-accent-700 ring-1 ring-accent-200 ring-inset",
        ok: "bg-ok-soft text-ok",
        info: "bg-info-soft text-info",
        danger: "bg-danger-soft text-danger",
        glass: "bg-white/12 text-white ring-1 ring-white/20 backdrop-blur",
        white: "bg-white/95 text-graphite-900 shadow-sm",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[0.6875rem]",
        md: "px-2 py-1 text-xs",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

export function Badge({
  className,
  tone,
  size,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone, size }), className)} {...props} />;
}

export function VerifiedBadge({ className, size = "md" }: { className?: string; size?: "sm" | "md" }) {
  return (
    <Badge tone="ok" size={size} className={className} title="Seller identity verified by MachInfo">
      <BadgeCheck aria-hidden />
      Verified Seller
    </Badge>
  );
}

export function FeaturedBadge({ className }: { className?: string }) {
  return (
    <Badge tone="accent" className={className}>
      <Star aria-hidden className="fill-current" />
      Featured
    </Badge>
  );
}

export function NewBadge({ className }: { className?: string }) {
  return (
    <Badge tone="white" className={className}>
      <Sparkles aria-hidden className="text-accent-500" />
      Just listed
    </Badge>
  );
}

/** Honest label on generated sample listings. */
export function DemoBadge({
  className,
  tone = "neutral",
  label = "Demo listing",
}: {
  className?: string;
  tone?: "neutral" | "glass" | "white";
  /** "Demo listing" on a single part, "Demo data" on pages/sections */
  label?: string;
}) {
  return (
    <Badge
      tone={tone}
      size="sm"
      className={cn("tracking-wide uppercase", className)}
      title="Sample data for demonstration — not real offers"
    >
      {label}
    </Badge>
  );
}
