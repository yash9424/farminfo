import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-line/80 bg-white shadow-soft",
        className,
      )}
      {...props}
    />
  );
}

export function Eyebrow({ className, children, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.22em] text-forest-600 uppercase",
        className,
      )}
      {...props}
    >
      <span className="h-px w-6 bg-current opacity-60" aria-hidden />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  id?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center [&>p:first-child]:justify-center",
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        id={id}
        className="mt-4 text-[2rem] leading-[1.08] font-medium text-forest-950 sm:text-[2.6rem] lg:text-[3rem]"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{description}</p>
      )}
    </div>
  );
}
