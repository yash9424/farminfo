"use client";

import * as m from "motion/react-m";
import { useId, useMemo, useRef, useState } from "react";
import type { PricePoint } from "@/lib/types";
import { cn, formatINR, formatShortDay } from "@/lib/utils";

const W = 560;
const H = 220;
const PAD = { top: 18, right: 26, bottom: 30, left: 56 };

function niceTicks(min: number, max: number, count = 4) {
  const span = max - min || max * 0.1 || 1;
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((s) => s * mag).find((s) => s >= raw) ?? raw;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(v);
  return { lo, hi, ticks };
}

/** 7-day modal price trend with crosshair + tooltip. */
export function PriceChart({
  points,
  cropName,
  trend,
}: {
  points: PricePoint[];
  cropName: string;
  trend: "up" | "down" | "flat";
}) {
  const id = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const geo = useMemo(() => {
    const values = points.map((p) => p.modalPrice);
    const { lo, hi, ticks } = niceTicks(Math.min(...values), Math.max(...values));
    const iw = W - PAD.left - PAD.right;
    const ih = H - PAD.top - PAD.bottom;
    const x = (i: number) => PAD.left + (points.length === 1 ? iw / 2 : (i / (points.length - 1)) * iw);
    const y = (v: number) => PAD.top + (1 - (v - lo) / (hi - lo || 1)) * ih;
    const xy = points.map((p, i) => [x(i), y(p.modalPrice)] as const);
    const line = xy.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`).join(" ");
    const area = `${line} L${xy[xy.length - 1][0]} ${PAD.top + ih} L${xy[0][0]} ${PAD.top + ih} Z`;
    return { ticks, y, xy, line, area, ih };
  }, [points]);

  if (points.length < 2) {
    return (
      <p className="rounded-2xl bg-cream-100 px-4 py-8 text-center text-sm text-muted">
        Not enough history yet to draw a trend for this entry.
      </p>
    );
  }

  const color =
    trend === "down" ? "var(--color-down)" : trend === "up" ? "var(--color-forest-600)" : "var(--color-muted)";

  function pick(clientX: number) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const sx = ((clientX - rect.left) / rect.width) * W;
    let best = 0;
    geo.xy.forEach(([px], i) => {
      if (Math.abs(px - sx) < Math.abs(geo.xy[best][0] - sx)) best = i;
    });
    setActive(best);
  }

  const shown = active ?? points.length - 1;
  const [ax, ay] = geo.xy[shown];
  const tipLeft = (ax / W) * 100;

  return (
    <figure className="relative">
      <figcaption className="sr-only">
        {cropName} modal price, last {points.length} days
      </figcaption>
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full touch-pan-y select-none"
          role="img"
          aria-label={`Line chart of ${cropName} modal price over ${points.length} days, from ${formatINR(
            points[0].modalPrice,
          )} to ${formatINR(points[points.length - 1].modalPrice)}`}
          onPointerMove={(e) => pick(e.clientX)}
          onPointerDown={(e) => pick(e.clientX)}
          onPointerLeave={() => setActive(null)}
        >
          <defs>
            <linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.16" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* recessive grid + y axis labels */}
          {geo.ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={geo.y(t)}
                y2={geo.y(t)}
                stroke="var(--color-line)"
                strokeDasharray="2 4"
              />
              <text
                x={PAD.left - 10}
                y={geo.y(t)}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-muted text-[11px] tabular"
              >
                {formatINR(t)}
              </text>
            </g>
          ))}

          {/* x axis labels */}
          {points.map((p, i) => (
            <text
              key={p.date}
              x={geo.xy[i][0]}
              y={H - 8}
              textAnchor="middle"
              className={cn("text-[11px] tabular", i === shown ? "fill-ink font-semibold" : "fill-muted")}
            >
              {formatShortDay(p.date)}
            </text>
          ))}

          <m.path
            d={geo.area}
            fill={`url(#${id}-fill)`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <m.path
            d={geo.line}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* crosshair */}
          <line
            x1={ax}
            x2={ax}
            y1={PAD.top}
            y2={PAD.top + geo.ih}
            stroke="var(--color-ink)"
            strokeOpacity="0.18"
          />
          {geo.xy.map(([px, py], i) => (
            <circle
              key={i}
              cx={px}
              cy={py}
              r={i === shown ? 5 : 3}
              fill={i === shown ? color : "white"}
              stroke={i === shown ? "white" : color}
              strokeWidth={2}
              className="transition-[r] duration-200"
            />
          ))}
        </svg>

        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 -translate-y-2 rounded-xl bg-forest-950 px-3 py-2 text-center shadow-lift transition-[left] duration-200"
          style={{ left: `clamp(56px, ${tipLeft}%, calc(100% - 56px))`, top: `${(ay / H) * 100 - 28}%` }}
          aria-hidden
        >
          <p className="text-[10px] font-medium tracking-wide text-cream-300 uppercase">
            {formatShortDay(points[shown].date)}
          </p>
          <p className="text-sm font-bold text-white tabular">{formatINR(points[shown].modalPrice)}</p>
        </div>
      </div>

      {/* table view for screen readers */}
      <table className="sr-only">
        <caption>{cropName} modal price by day</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Modal price (₹/quintal)</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.date}>
              <td>{p.date}</td>
              <td>{p.modalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
