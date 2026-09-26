import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Hand-drawn line illustrations for each crop (24×24, 1.6 stroke), each with its
 * own tint so crop cards read differently at a glance.
 */

type Glyph = { tint: string; ink: string; art: ReactNode };

const seedRow = (cx: number, cy: number, r: number, rot = 0) => (
  <ellipse cx={cx} cy={cy} rx={r} ry={r * 2.1} transform={`rotate(${rot} ${cx} ${cy})`} />
);

const GLYPHS: Record<string, Glyph> = {
  wheat: {
    tint: "bg-gold-100",
    ink: "text-gold-700",
    art: (
      <>
        <path d="M12 22V9" />
        {seedRow(12, 5, 1.3)}
        {seedRow(9.6, 9, 1.3, -38)}
        {seedRow(14.4, 9, 1.3, 38)}
        {seedRow(9.6, 13.2, 1.3, -38)}
        {seedRow(14.4, 13.2, 1.3, 38)}
        {seedRow(9.6, 17.4, 1.3, -38)}
        {seedRow(14.4, 17.4, 1.3, 38)}
      </>
    ),
  },
  rice: {
    tint: "bg-cream-200",
    ink: "text-earth-600",
    art: (
      <>
        <path d="M6 21.5c1-6 3.5-11.5 9.5-16" />
        <path d="M9.8 11.4c2.5-.2 4.8.7 6.7 2.6" />
        {seedRow(15.6, 5.2, 1.1, 50)}
        {seedRow(12.6, 7.4, 1.1, 60)}
        {seedRow(11.8, 4.2, 1.1, 20)}
        {seedRow(17.3, 14.6, 1.1, 130)}
        {seedRow(14.3, 12, 1.1, 110)}
        {seedRow(19, 11.8, 1.1, 100)}
      </>
    ),
  },
  bajra: {
    tint: "bg-earth-100",
    ink: "text-earth-600",
    art: (
      <>
        <rect x="8.6" y="2.5" width="6.8" height="14" rx="3.4" />
        <path d="M12 16.5v5.5M12 19.5c-2.2-.2-3.8-1.2-5-3M12 20.5c1.8-.4 3.2-1.4 4.2-3" />
        <path d="M10.5 6.2h.01M13.5 6.2h.01M12 8.4h.01M10.5 10.6h.01M13.5 10.6h.01M12 12.8h.01" strokeWidth="2.4" />
      </>
    ),
  },
  maize: {
    tint: "bg-gold-50",
    ink: "text-gold-600",
    art: (
      <>
        <ellipse cx="12" cy="9.5" rx="3.6" ry="7" />
        <path d="M10 5.5h4M8.7 8.5h6.6M8.7 11.5h6.6M9.6 14.5h4.8M12 2.7v13.6" opacity="0.8" />
        <path d="M8.5 12.5c-2.5 2-3.4 5.3-2.7 9 3-.9 5-3 6.2-5.3" />
        <path d="M15.5 12.5c2.5 2 3.4 5.3 2.7 9-3-.9-5-3-6.2-5.3" />
      </>
    ),
  },
  groundnut: {
    tint: "bg-earth-100",
    ink: "text-earth-700",
    art: (
      <>
        <path d="M7.4 10.2c-2.8 1.1-4 4.4-2.6 7 1.3 2.6 4.6 3.5 7.1 2.1 1-.6 1.8-.4 2.8 0 2.6 1 5.6-.3 6.5-3.1.9-2.7-.6-5.5-3.2-6.3-1.1-.3-1.7-.9-2.1-2-.9-2.6-3.8-3.8-6.3-2.8-2.4 1-3.4 3.6-2.2 5.1Z" />
        <path d="M9 13.2h.01M12.5 15.4h.01M15.8 13.6h.01M11.3 9.4h.01M17.4 16.8h.01" strokeWidth="2.2" />
      </>
    ),
  },
  cotton: {
    tint: "bg-forest-50",
    ink: "text-forest-700",
    art: (
      <>
        <path d="M12 4.2a3.4 3.4 0 0 1 3.3 2.6 3.4 3.4 0 0 1 2 6.1 3.4 3.4 0 0 1-5.3 2.7 3.4 3.4 0 0 1-5.3-2.7 3.4 3.4 0 0 1 2-6.1A3.4 3.4 0 0 1 12 4.2Z" />
        <path d="M12 8.6v3.8M9.4 12.2l2.6.2 2.6-.2" opacity="0.7" />
        <path d="M8 16.4 6.3 19.6M16 16.4l1.7 3.2M12 16.3V22" />
      </>
    ),
  },
  castor: {
    tint: "bg-down-soft",
    ink: "text-[#8a3b2f]",
    art: (
      <>
        <path d="M12 3.2c4.2 0 7 3.3 7 7.8 0 5.2-3.3 9.8-7 9.8s-7-4.6-7-9.8c0-4.5 2.8-7.8 7-7.8Z" />
        <path d="M12 3.2v2.2" />
        <path d="M9.2 9.2h.01M13.8 8.6h.01M11.2 12.6h.01M15.4 12.8h.01M9 15.8h.01M12.8 16.9h.01" strokeWidth="2.4" />
      </>
    ),
  },
  cumin: {
    tint: "bg-earth-50",
    ink: "text-earth-600",
    art: (
      <>
        <path d="M5.2 15.8c1.5-4.8 4.6-8 8-9.6 1.2-.6 2-.3 1.7 1-1.1 4.6-4.4 8.3-8.4 9.9-1.3.5-1.6 0-1.3-1.3Z" />
        <path d="M7.4 14.6c1.8-2.7 3.9-4.8 6.4-6.4" opacity="0.7" />
        <path d="M13 19.4c2.8-.7 5-2.4 6.4-5 .5-1 .2-1.5-.9-1.2-2.7.8-4.9 2.6-6.2 5-.5 1-.3 1.4.7 1.2Z" />
        <path d="M17.6 5.2c.8-1 1.8-1.7 3-2" />
      </>
    ),
  },
  sesame: {
    tint: "bg-cream-200",
    ink: "text-earth-500",
    art: (
      <>
        <path d="M8 4.5c1.8 1.6 2.6 3.6 2.3 5.5-.3 1.6-2.2 2-3.2.8-1.4-1.6-1.2-4.1.9-6.3Z" />
        <path d="M16.4 7.2c1.4 2 1.6 4.2.9 5.9-.6 1.5-2.5 1.5-3.2.2-1-1.9-.2-4.2 2.3-6.1Z" />
        <path d="M9.6 13.8c1.4 2 1.6 4.2.9 5.9-.6 1.5-2.5 1.5-3.2.2-1-1.9-.2-4.2 2.3-6.1Z" />
        <path d="M17 15.3c1 1.6 1.1 3.2.6 4.4-.5 1.1-1.9 1.1-2.4.1-.7-1.4-.1-3.1 1.8-4.5Z" />
      </>
    ),
  },
  mustard: {
    tint: "bg-gold-100",
    ink: "text-gold-600",
    art: (
      <>
        <circle cx="12" cy="7" r="2.2" />
        <path d="M12 4.8V3M14.2 7H16M9.8 7H8M13.6 5.4l1.2-1.2M10.4 5.4 9.2 4.2M13.6 8.6l1.2 1.2M10.4 8.6 9.2 9.8" />
        <path d="M12 9.2V22M12 15c-2-1.5-4.2-1.8-6-1 .8 2 3.3 2.9 6 2.2M12 18.5c2-1.5 4.2-1.8 6-1-.8 2-3.3 2.9-6 2.2" />
      </>
    ),
  },
  chana: {
    tint: "bg-gold-50",
    ink: "text-earth-600",
    art: (
      <>
        <path d="M12.6 4.4c4.4.2 7.3 3.7 6.9 8.1-.4 4.6-4 7.7-8.3 7.4-4.1-.3-6.8-3.7-6.5-7.6.3-3.3 2.5-5.5 4.7-6.4.9-.4 1-1 1.8-1.3.5-.2 1-.2 1.4-.2Z" />
        <path d="M11.2 4.5c.3 1.6-.2 2.8-1.4 3.6" />
        <path d="M9 12.6c.4 2.1 1.9 3.6 4 4" opacity="0.6" />
      </>
    ),
  },
  tur: {
    tint: "bg-gold-100",
    ink: "text-gold-700",
    art: (
      <>
        <circle cx="8.5" cy="9" r="3.6" />
        <circle cx="15.8" cy="8" r="3" />
        <circle cx="13" cy="15.6" r="3.8" />
        <path d="M7.4 8.2c.5-.9 1.4-1.3 2.3-1.2M11.8 14.6c.6-.9 1.6-1.3 2.6-1.1" opacity="0.6" />
      </>
    ),
  },
  moong: {
    tint: "bg-forest-100",
    ink: "text-forest-700",
    art: (
      <>
        <ellipse cx="9" cy="9" rx="3.2" ry="4.4" transform="rotate(-30 9 9)" />
        <ellipse cx="15.6" cy="10.8" rx="3" ry="4.1" transform="rotate(25 15.6 10.8)" />
        <ellipse cx="11" cy="17" rx="3" ry="4" transform="rotate(80 11 17)" />
        <path d="M8.4 8.2v2M15.9 10v2M10.2 17h2" strokeWidth="2" />
      </>
    ),
  },
  urad: {
    tint: "bg-ink/8",
    ink: "text-ink",
    art: (
      <>
        <ellipse cx="9.2" cy="9.4" rx="3.2" ry="4.3" transform="rotate(-25 9.2 9.4)" />
        <ellipse cx="15.4" cy="11" rx="3" ry="4" transform="rotate(30 15.4 11)" />
        <ellipse cx="11.4" cy="17.2" rx="2.9" ry="3.9" transform="rotate(85 11.4 17.2)" />
        <path d="M8.2 8.5l1.4 1.8M14.7 10.1l1.4 1.8M10.6 16.6l1.8 1" />
      </>
    ),
  },
  onion: {
    tint: "bg-[#f7e6ea]",
    ink: "text-[#8e3553]",
    art: (
      <>
        <path d="M12 2.8c.2 3.2-6.2 5.8-6.2 11.1A6.2 6.2 0 0 0 12 20a6.2 6.2 0 0 0 6.2-6.1c0-5.3-6.4-7.9-6.2-11.1Z" />
        <path d="M12 7c-1.8 2-2.8 4.3-2.8 7 0 2.3.9 4.3 2.8 6M12 7c1.8 2 2.8 4.3 2.8 7 0 2.3-.9 4.3-2.8 6" opacity="0.6" />
        <path d="M10.4 20.6 9.6 22M12 20.4V22M13.6 20.6l.8 1.4" />
      </>
    ),
  },
  potato: {
    tint: "bg-earth-100",
    ink: "text-earth-600",
    art: (
      <>
        <path d="M6.2 7.3c2.7-3.4 8.6-3.5 11.6-.6 3 2.9 2.6 8.3-.6 11.2-3 2.7-8.7 2.9-11.3-.5-2-2.7-2-7.1.3-10.1Z" />
        <path d="M9 9.2h.01M14.4 8.2h.01M12 13h.01M16.4 13.2h.01M8.8 15.6h.01" strokeWidth="2.4" />
      </>
    ),
  },
  garlic: {
    tint: "bg-cream-200",
    ink: "text-[#7a5a6b]",
    art: (
      <>
        <path d="M12 2.5v3.3" />
        <path d="M12 5.8c-4.4 2-7.2 5.2-7.2 9.1 0 3 2.5 5.6 5.7 5.6h3c3.2 0 5.7-2.6 5.7-5.6 0-3.9-2.8-7.1-7.2-9.1Z" />
        <path d="M12 6.4c-1.9 3-2.6 6.5-2 14M12 6.4c1.9 3 2.6 6.5 2 14M8.4 9.2c-1.5 3.1-1.8 6.6-.6 10.4M15.6 9.2c1.5 3.1 1.8 6.6.6 10.4" opacity="0.6" />
      </>
    ),
  },
  coriander: {
    tint: "bg-forest-50",
    ink: "text-forest-600",
    art: (
      <>
        <circle cx="8.2" cy="8.4" r="3.2" />
        <circle cx="15.8" cy="9" r="2.8" />
        <circle cx="11.8" cy="15.6" r="3.4" />
        <path d="M8.2 5.2v6.4M15.8 6.2v5.6M11.8 12.2v6.8" opacity="0.55" />
      </>
    ),
  },
  fennel: {
    tint: "bg-forest-100",
    ink: "text-forest-700",
    art: (
      <>
        <path d="M6 18.5C6.6 12.4 10 7.4 15.6 4.8c.9-.4 1.4 0 1 .9C14 11 10.4 15.4 7.3 19.3c-.6.7-1.3.3-1.3-.8Z" />
        <path d="M7.8 16.4c1.6-3.3 3.8-6.2 6.8-8.8" opacity="0.6" />
        <path d="M12.6 19.8c2.3-2.3 4.5-5 6-8.4.3-.8.9-.8 1.1.1.6 2.8-.7 6-3.3 7.9-1.3.9-2.6 1-3.6.8-.6-.1-.6-.1-.2-.4Z" />
      </>
    ),
  },
};

const FALLBACK: Glyph = {
  tint: "bg-forest-50",
  ink: "text-forest-700",
  art: (
    <>
      <path d="M12 21v-8" />
      <path d="M12 13c0-4.4 2.6-7.4 7-8 .2 4.6-2.6 8-7 8Z" />
      <path d="M12 15c0-3.6-2.2-6-5.8-6.4-.2 3.8 2.2 6.4 5.8 6.4Z" />
    </>
  ),
};

export function cropTint(cropId: string) {
  return GLYPHS[cropId]?.tint ?? FALLBACK.tint;
}

export function CropIcon({
  cropId,
  size = "md",
  className,
}: {
  cropId: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const g = GLYPHS[cropId] ?? FALLBACK;
  const box = {
    sm: "size-9 rounded-xl [&_svg]:size-5",
    md: "size-12 rounded-2xl [&_svg]:size-6",
    lg: "size-14 rounded-2xl [&_svg]:size-7",
    xl: "size-18 rounded-3xl [&_svg]:size-9",
  }[size];
  return (
    <span
      aria-hidden
      className={cn("grid shrink-0 place-items-center ring-1 ring-black/5 ring-inset", g.tint, g.ink, box, className)}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {g.art}
      </svg>
    </span>
  );
}
