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
        "relative flex flex-col items-center overflow-hidden rounded-2xl border border-dashed px-6 py-16 text-center sm:py-20",
        tone === "error" ? "border-danger/25 bg-danger-soft/40" : "border-line-strong bg-white/70",
        className,
      )}
    >
      <div className="bg-blueprint-dark pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div
        className={cn(
          "relative grid size-14 place-items-center rounded-2xl ring-8",
          tone === "error"
            ? "bg-danger-soft text-danger ring-danger-soft/50"
            : "bg-graphite-100 text-graphite-700 ring-graphite-100/50",
        )}
      >
        <Icon className="size-6" strokeWidth={1.7} aria-hidden />
      </div>
      <h3 className="relative mt-6 text-xl font-bold text-ink">{title}</h3>
      {description && (
        <div className="relative mt-2 max-w-md text-[0.9375rem] leading-relaxed text-muted">{description}</div>
      )}
      {action && <div className="relative mt-7 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}
