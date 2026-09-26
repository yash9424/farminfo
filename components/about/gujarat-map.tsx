import { getI18n } from "@/lib/i18n";
import { GUJARAT_PATH, GUJARAT_VIEWBOX, MARKET_POINTS } from "@/lib/gujarat-map";
import type { Market } from "@/lib/types";
import { cityLabel } from "@/locales";

const LABELLED = new Set(["rajkot", "ahmedabad", "unjha", "bhuj", "surat", "bhavnagar", "junagadh", "vadodara", "palanpur"]);
const REGION_LABELS = [
  { key: "kutch", x: 200, y: 110 },
  { key: "saurashtra", x: 272, y: 362 },
  { key: "north", x: 500, y: 150 },
] as const;

/**
 * Gujarat outline from DataMeet open boundaries (see lib/gujarat-map.ts) with
 * market yards plotted at their towns' coordinates.
 */
export async function GujaratMap({ markets }: { markets: Market[] }) {
  const { t } = await getI18n();
  const { width, height } = GUJARAT_VIEWBOX;
  const plotted = markets.filter((m) => MARKET_POINTS[m.id]);

  return (
    <figure className="relative">
      <svg
        viewBox={`-10 -10 ${width + 20} ${height + 20}`}
        className="h-auto w-full"
        role="img"
        aria-labelledby="gj-map-title"
      >
        <title id="gj-map-title">
          {t.map.title(
            plotted.length,
            plotted
              .slice(0, 6)
              .map((m) => cityLabel(t, m))
              .join(", "),
          )}
        </title>
        <defs>
          <linearGradient id="gj-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-forest-800)" />
            <stop offset="100%" stopColor="var(--color-forest-900)" />
          </linearGradient>
          <pattern id="gj-dots" width="9" height="9" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.9" fill="rgb(255 255 255 / 0.1)" />
          </pattern>
          <filter id="gj-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#072016" floodOpacity="0.35" />
          </filter>
        </defs>

        <path d={GUJARAT_PATH} fill="url(#gj-fill)" filter="url(#gj-shadow)" />
        <path d={GUJARAT_PATH} fill="url(#gj-dots)" />
        <path
          d={GUJARAT_PATH}
          fill="none"
          stroke="var(--color-forest-400)"
          strokeOpacity="0.55"
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {REGION_LABELS.map((r) => (
          <text
            key={r.key}
            x={r.x}
            y={r.y}
            textAnchor="middle"
            className="fill-cream-100/35 text-[10px] font-bold tracking-[0.3em]"
          >
            {t.map.regions[r.key]}
          </text>
        ))}

        {plotted.map((m, i) => {
          const [x, y] = MARKET_POINTS[m.id];
          const label = LABELLED.has(m.id);
          return (
            <g key={m.id}>
              {label && (
                <circle cx={x} cy={y} r="4" className="fill-gold-300/40">
                  <animate
                    attributeName="r"
                    values="4;13;4"
                    dur="3.2s"
                    begin={`${(i % 7) * 0.45}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.9;0;0.9"
                    dur="3.2s"
                    begin={`${(i % 7) * 0.45}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              <circle
                cx={x}
                cy={y}
                r={label ? 4.2 : 2.8}
                className={label ? "fill-gold-300" : "fill-cream-100/80"}
                stroke="var(--color-forest-950)"
                strokeWidth="1.2"
              />
              {label && (
                <text
                  x={x + 8}
                  y={y + 3.5}
                  className="fill-white text-[11.5px] font-semibold"
                  paintOrder="stroke"
                  stroke="var(--color-forest-950)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                >
                  {cityLabel(t, m)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-cream-300/70">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-gold-300" aria-hidden /> {t.map.major}
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-cream-100/80" aria-hidden /> {t.map.other}
        </span>
        <span>
          {t.map.boundary}{" "}
          <a
            href="https://github.com/datameet/maps"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-white"
          >
            DataMeet
          </a>{" "}
          (CC BY 2.5 IN)
        </span>
      </figcaption>
    </figure>
  );
}
