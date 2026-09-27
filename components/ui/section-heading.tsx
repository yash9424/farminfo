import { cn } from "@/lib/utils";

export function Eyebrow({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.2em] text-accent-600 uppercase",
        className,
      )}
    >
      <span className="h-px w-5 bg-current" aria-hidden />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  id,
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  id?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={cn("flex flex-col gap-5 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow className={dark ? "text-accent-400" : undefined}>{eyebrow}</Eyebrow>}
        <h2
          id={id}
          className={cn(
            "mt-3 text-[1.85rem] leading-[1.1] font-bold sm:text-[2.35rem]",
            dark ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h2>
        {description && (
          <p className={cn("mt-3 text-base leading-relaxed sm:text-[1.0625rem]", dark ? "text-graphite-300" : "text-muted")}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
