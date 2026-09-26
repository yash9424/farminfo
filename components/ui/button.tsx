import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  [
    "group/btn relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "rounded-full font-semibold tracking-[-0.01em] select-none",
    "transition-[background-color,color,box-shadow,transform,border-color] duration-300 ease-(--ease-out-expo)",
    "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-forest-800 text-cream-50 shadow-[0_1px_0_rgb(255_255_255/0.12)_inset,0_10px_24px_-10px_rgb(13_52_35/0.6)] hover:bg-forest-700 hover:shadow-[0_1px_0_rgb(255_255_255/0.12)_inset,0_16px_32px_-12px_rgb(13_52_35/0.7)]",
        gold:
          "bg-gold-400 text-forest-950 shadow-[0_1px_0_rgb(255_255_255/0.4)_inset,0_10px_28px_-10px_rgb(207_158_23/0.7)] hover:bg-gold-300",
        glass:
          "border border-white/25 bg-white/10 text-white backdrop-blur-md hover:border-white/40 hover:bg-white/18",
        outline:
          "border border-forest-900/15 bg-white/60 text-forest-900 hover:border-forest-900/30 hover:bg-white",
        ghost: "text-forest-900 hover:bg-forest-900/5",
        light: "bg-cream-50 text-forest-900 hover:bg-white shadow-soft",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-[0.9375rem]",
        lg: "h-13 px-7 text-base",
        icon: "size-11",
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
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export function ButtonLink({
  className,
  variant,
  size,
  ...props
}: ComponentProps<typeof Link> & Variants) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
