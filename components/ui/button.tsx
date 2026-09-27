import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  [
    "group/btn relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "rounded-xl font-semibold tracking-[-0.01em] select-none",
    "transition-[background-color,color,box-shadow,transform,border-color] duration-300 ease-(--ease-out-expo)",
    "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /** charcoal — the default action */
        primary:
          "bg-graphite-950 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] hover:bg-graphite-800",
        /** safety orange — the single most important action on a view */
        accent:
          "bg-accent-500 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_8px_22px_-10px_rgb(242_113_28/0.8)] hover:bg-accent-600",
        outline:
          "border border-line-strong bg-white text-ink hover:border-graphite-400 hover:bg-graphite-50",
        ghost: "text-ink hover:bg-graphite-100",
        /** translucent — on dark imagery */
        glass:
          "border border-white/20 bg-white/10 text-white backdrop-blur-md hover:border-white/35 hover:bg-white/16",
        light: "bg-white text-graphite-950 hover:bg-graphite-100",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-[0.9375rem]",
        lg: "h-13 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ComponentProps<"button"> & Variants) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export function ButtonLink({ className, variant, size, ...props }: ComponentProps<typeof Link> & Variants) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
