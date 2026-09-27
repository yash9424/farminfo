/**
 * Demo listing photos (see public/images/mi/CREDITS.json), grouped by part type.
 * Real listings would store seller-uploaded image URLs instead.
 */
const BASE = "/images/mi";

export const IMAGE_POOLS: Record<string, string[]> = {
  spindle: ["spindle-1", "spindle-2", "spindle-3"],
  servo: ["servo-1", "servo-2", "servo-3"],
  control: ["control-1", "control-2", "control-3"],
  ballscrew: ["ballscrew-1", "ballscrew-2", "ballscrew-3"],
  linear: ["linear-1", "linear-2"],
  bearing: ["bearing-1", "bearing-2", "bearing-3"],
  toolholder: ["toolholder-1", "toolholder-2", "toolholder-3"],
  chuck: ["chuck-1", "chuck-2", "chuck-3"],
  turret: ["turret-1", "turret-2"],
  // sensor-2 shows a legible third-party logo, so it is not used for listings
  sensor: ["sensor-1", "electrical-2"],
  hydraulic: ["hydraulic-1", "hydraulic-2", "hydraulic-3"],
  lubrication: ["lubrication-1", "lubrication-2"],
  electrical: ["electrical-1", "electrical-2", "electrical-3"],
  parts: ["parts-1", "parts-2", "parts-3"],
};

export const imageUrl = (name: string) => `${BASE}/${name}.jpg`;

/** 2–4 gallery images for a listing: its type's photos, rotated so neighbours differ. */
export function imagesFor(pool: string, index: number): string[] {
  const own = IMAGE_POOLS[pool] ?? IMAGE_POOLS.parts;
  const rotated = own.map((_, k) => own[(index + k) % own.length]);
  const extra = IMAGE_POOLS.parts[index % IMAGE_POOLS.parts.length];
  return [...new Set([...rotated, ...(rotated.length < 3 ? [extra] : [])])].map(imageUrl);
}

/** Representative image for a category card */
export function coverFor(pool: string | undefined, index = 0): string {
  const own = IMAGE_POOLS[pool ?? "parts"] ?? IMAGE_POOLS.parts;
  return imageUrl(own[index % own.length]);
}
