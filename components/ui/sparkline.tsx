import { useId } from "react";
import type { PricePoint } from "@/lib/types";
import { cn, trendOf } from "@/lib/utils";

/** Tiny decorative 7-day trend line. Values are described in text elsewhere. */
export function Sparkline({
  points,
  change,
  className,
  width = 120,
  height = 36,
  color: colorOverride,
}: {
  points: PricePoint[];
  change: number | null;
  className?: string;
  width?: number;
  height?: number;
  /** Override the trend-derived colour (e.g. on dark cards) */
  color?: string;
}) {
  const uid = useId();
  if (points.length < 2) return null;
  const values = points.map((p) => p.modalPrice);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 3;
  const xy = values.map((v, i) => [
    (i / (values.length - 1)) * width,
    pad + (1 - (v - min) / range) * (height - pad * 2),
  ]);
  const line = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  const trend = trendOf(change);
  const color =
    colorOverride ??
    (trend === "down" ? "var(--color-down)" : trend === "up" ? "var(--color-up)" : "var(--color-muted)");
  const gid = `spark${uid.replace(/[^a-zA-Z0-9]/g, "")}`;
  const [lx, ly] = xy[xy.length - 1];

  return (
    <div className={cn("relative h-9 w-full", className)} aria-hidden>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 size-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gid})`} />
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* HTML dot so it stays round when the SVG stretches */}
      <span
        className="absolute size-2 -translate-1/2 rounded-full ring-2 ring-white"
        style={{ left: `${(lx / width) * 100}%`, top: `${(ly / height) * 100}%`, background: color }}
      />
    </div>
  );
}
