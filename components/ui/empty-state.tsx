import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  tone = "neutral",
  className,
  role,
}: {
  icon: LucideIcon;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  tone?: "neutral" | "error";
  className?: string;
  role?: "status" | "alert";
}) {
  return (
    <div
      role={role}
      className={cn(
        "relative flex flex-col items-center overflow-hidden rounded-3xl border border-dashed px-6 py-16 text-center sm:py-20",
        tone === "error" ? "border-down/25 bg-down-soft/40" : "border-forest-900/15 bg-white/60",
        className,
      )}
    >
      <div className="bg-dots-dark pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div
        className={cn(
          "relative grid size-16 place-items-center rounded-2xl ring-8",
          tone === "error"
            ? "bg-down-soft text-down ring-down-soft/50"
            : "bg-cream-200 text-forest-700 ring-cream-200/50",
        )}
      >
        <Icon className="size-7" strokeWidth={1.6} aria-hidden />
      </div>
      <h3 className="relative mt-6 font-display text-2xl text-forest-950">{title}</h3>
      {description && (
        <div className="relative mt-2 max-w-md text-[0.9375rem] leading-relaxed text-muted">
          {description}
        </div>
      )}
      {action && <div className="relative mt-7 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}
