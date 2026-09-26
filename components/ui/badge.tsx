"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { ComponentProps } from "react";
import { useLanguage } from "@/components/i18n/language-provider";
import { cn, formatChange, trendOf } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap tabular",
  {
    variants: {
      tone: {
        neutral: "bg-forest-900/6 text-ink-soft",
        forest: "bg-forest-100 text-forest-800",
        gold: "bg-gold-100 text-gold-700",
        earth: "bg-earth-100 text-earth-700",
        up: "bg-up-soft text-up",
        down: "bg-down-soft text-down",
        glass: "bg-white/12 text-white ring-1 ring-white/20 backdrop-blur",
      },
      size: {
        sm: "px-2 py-0.5 text-[0.6875rem]",
        md: "px-2.5 py-1 text-xs",
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

/** ↑ +2.4% / ↓ -0.8% / — with an accessible label */
export function ChangeBadge({
  value,
  size = "md",
  className,
}: {
  value: number | null;
  size?: "sm" | "md";
  className?: string;
}) {
  const { t } = useLanguage();
  const trend = trendOf(value);
  const Icon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
  const pct = formatChange(value).replace(/[+-]/, "");
  const label =
    trend === "flat"
      ? value === null
        ? t.common.noPrevious
        : t.common.unchanged
      : trend === "up"
        ? t.common.changeUp(pct)
        : t.common.changeDown(pct);
  return (
    <Badge
      tone={trend === "up" ? "up" : trend === "down" ? "down" : "neutral"}
      size={size}
      className={className}
      aria-label={label}
      title={label}
    >
      <Icon aria-hidden className={size === "sm" ? "size-3" : "size-3.5"} strokeWidth={2.5} />
      <span aria-hidden>{value === null ? "—" : formatChange(value)}</span>
    </Badge>
  );
}

/** Honest label shown wherever generated sample prices are displayed. */
export function DemoBadge({
  className,
  tone = "gold",
}: {
  className?: string;
  tone?: "gold" | "glass";
}) {
  const { t } = useLanguage();
  return (
    <Badge
      tone={tone}
      size="sm"
      className={cn("uppercase tracking-[0.08em]", className)}
      title={t.common.demoDataTitle}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" aria-hidden />
      {t.common.demoData}
    </Badge>
  );
}
