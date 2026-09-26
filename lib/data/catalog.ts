import type { Crop, CropCategory, GujaratRegion, Market } from "@/lib/types";

/**
 * Reference catalogue. Used by the demo provider to generate data and by the
 * live provider to enrich API records (category, friendly name, search aliases).
 * It is NOT a claim about what any real market trades on a given day.
 */

export interface CropSeed extends Crop {
  /** Indicative modal price in ₹/quintal used only by the demo generator */
  basePrice: number;
  varieties: { name: string; factor: number }[];
}

export const CROP_SEEDS: CropSeed[] = [
  {
    id: "wheat",
    name: "Wheat",
    category: "Cereals",
    aliases: ["wheat", "gehu", "ghau"],
    basePrice: 2450,
    varieties: [
      { name: "Lokwan", factor: 1 },
      { name: "Tukda", factor: 1.09 },
      { name: "Desi (147)", factor: 0.97 },
    ],
  },
  {
    id: "rice",
    name: "Rice",
    category: "Cereals",
    aliases: ["rice", "chokha", "chawal"],
    basePrice: 3180,
    varieties: [
      { name: "Kolam", factor: 1 },
      { name: "Basmati (Common)", factor: 1.55 },
    ],
  },
  {
    id: "bajra",
    name: "Bajra",
    category: "Cereals",
    aliases: ["bajra", "pearl millet", "bajri"],
    basePrice: 2280,
    varieties: [
      { name: "Hybrid", factor: 1 },
      { name: "Desi", factor: 1.04 },
    ],
  },
  {
    id: "maize",
    name: "Maize",
    category: "Cereals",
    aliases: ["maize", "corn", "makai"],
    basePrice: 2150,
    varieties: [
      { name: "Yellow (Hybrid)", factor: 1 },
      { name: "White", factor: 1.03 },
    ],
  },
  {
    id: "groundnut",
    name: "Groundnut",
    category: "Oilseeds",
    aliases: ["groundnut", "peanut", "mungfali", "sing"],
    basePrice: 5920,
    varieties: [
      { name: "Bold (G-20)", factor: 1 },
      { name: "Jada (Thick)", factor: 1.08 },
    ],
  },
  {
    id: "cotton",
    name: "Cotton (Kapas)",
    category: "Fibre",
    aliases: ["cotton", "kapas", "kapaas"],
    basePrice: 7120,
    varieties: [
      { name: "Shankar-6", factor: 1 },
      { name: "H-4 (Long Staple)", factor: 1.06 },
    ],
  },
  {
    id: "castor",
    name: "Castor Seed",
    category: "Oilseeds",
    aliases: ["castor", "erandi", "arandi"],
    basePrice: 6150,
    varieties: [{ name: "Castor Seed", factor: 1 }],
  },
  {
    id: "cumin",
    name: "Cumin (Jeera)",
    category: "Spices",
    aliases: ["cumin", "cummin", "jeera", "jiru"],
    basePrice: 18450,
    varieties: [
      { name: "Jeera (Cumin Seed)", factor: 1 },
      { name: "Unjha Super", factor: 1.05 },
    ],
  },
  {
    id: "sesame",
    name: "Sesame (Til)",
    category: "Oilseeds",
    aliases: ["sesame", "sesamum", "til", "gingelly"],
    basePrice: 9600,
    varieties: [
      { name: "White", factor: 1 },
      { name: "Black", factor: 1.15 },
    ],
  },
  {
    id: "mustard",
    name: "Mustard",
    category: "Oilseeds",
    aliases: ["mustard", "rapeseed", "rai", "sarson"],
    basePrice: 5500,
    varieties: [{ name: "Yellow", factor: 1 }],
  },
  {
    id: "chana",
    name: "Chana (Gram)",
    category: "Pulses",
    aliases: ["chana", "bengal gram", "chickpea", "gram"],
    basePrice: 5600,
    varieties: [
      { name: "Desi (Bold)", factor: 1 },
      { name: "Kabuli", factor: 1.42 },
    ],
  },
  {
    id: "tur",
    name: "Tur (Arhar)",
    category: "Pulses",
    aliases: ["tur", "arhar", "toor", "pigeon pea", "red gram"],
    basePrice: 7300,
    varieties: [{ name: "Desi", factor: 1 }],
  },
  {
    id: "moong",
    name: "Moong",
    category: "Pulses",
    aliases: ["moong", "mung", "green gram"],
    basePrice: 8100,
    varieties: [{ name: "Green", factor: 1 }],
  },
  {
    id: "urad",
    name: "Urad",
    category: "Pulses",
    aliases: ["urad", "urd", "black gram", "adad"],
    basePrice: 7000,
    varieties: [{ name: "Black", factor: 1 }],
  },
  {
    id: "onion",
    name: "Onion",
    category: "Vegetables",
    aliases: ["onion", "dungri", "kanda"],
    basePrice: 1350,
    varieties: [
      { name: "Red", factor: 1 },
      { name: "White", factor: 0.94 },
    ],
  },
  {
    id: "potato",
    name: "Potato",
    category: "Vegetables",
    aliases: ["potato", "batata", "bataka"],
    basePrice: 1650,
    varieties: [{ name: "Desi", factor: 1 }],
  },
  {
    id: "garlic",
    name: "Garlic",
    category: "Spices",
    aliases: ["garlic", "lasan", "lahsun"],
    basePrice: 12500,
    varieties: [
      { name: "Desi", factor: 1 },
      { name: "Bold", factor: 1.14 },
    ],
  },
  {
    id: "coriander",
    name: "Coriander Seed",
    category: "Spices",
    aliases: ["coriander", "dhania", "dhaniya"],
    basePrice: 7400,
    varieties: [
      { name: "Eagle", factor: 1 },
      { name: "Badami", factor: 0.95 },
    ],
  },
  {
    id: "fennel",
    name: "Fennel (Variyali)",
    category: "Spices",
    aliases: ["fennel", "saunf", "variyali"],
    basePrice: 8800,
    varieties: [{ name: "Variyali (Green)", factor: 1 }],
  },
];

export const CROP_CATEGORIES: CropCategory[] = [
  "Cereals",
  "Pulses",
  "Oilseeds",
  "Spices",
  "Fibre",
  "Vegetables",
];

/** Crops that are broadly traded in each region (demo generator only) */
export const REGION_CROP_POOLS: Record<GujaratRegion, string[]> = {
  Saurashtra: [
    "wheat", "bajra", "maize", "groundnut", "cotton", "cumin", "sesame",
    "chana", "tur", "moong", "urad", "onion", "garlic", "castor", "coriander",
  ],
  "North Gujarat": [
    "wheat", "bajra", "maize", "castor", "cumin", "mustard", "fennel",
    "coriander", "chana", "potato", "cotton", "sesame",
  ],
  Kutch: ["castor", "cumin", "cotton", "bajra", "wheat", "moong", "sesame", "groundnut"],
  "Central Gujarat": [
    "wheat", "rice", "maize", "bajra", "chana", "tur", "moong", "urad",
    "cotton", "potato", "onion", "castor",
  ],
  "South Gujarat": [
    "rice", "tur", "moong", "urad", "maize", "onion", "potato", "cotton", "groundnut",
  ],
};

export interface MarketSeed extends Market {
  region: GujaratRegion;
  /** Always traded here (demo generator) */
  mustInclude?: string[];
}

function seed(
  city: string,
  district: string,
  region: GujaratRegion,
  mustInclude?: string[],
  id?: string,
): MarketSeed {
  return {
    id: id ?? city.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: `${city} APMC`,
    city,
    district,
    state: "Gujarat",
    region,
    mustInclude,
  };
}

export const MARKET_SEEDS: MarketSeed[] = [
  // Headline markets first
  seed("Rajkot", "Rajkot", "Saurashtra", ["wheat", "rice", "bajra", "groundnut", "cotton", "cumin"]),
  seed("Gondal", "Rajkot", "Saurashtra", ["groundnut", "garlic", "wheat", "cotton"]),
  seed("Jamnagar", "Jamnagar", "Saurashtra", ["groundnut", "cotton", "bajra"]),
  seed("Ahmedabad", "Ahmedabad", "Central Gujarat", ["wheat", "rice", "potato", "onion"]),
  seed("Unjha", "Mehsana", "North Gujarat", ["cumin", "fennel", "coriander", "mustard"]),
  seed("Morbi", "Morbi", "Saurashtra", ["cotton", "groundnut"]),
  seed("Surendranagar", "Surendranagar", "Saurashtra", ["cotton", "castor", "cumin"]),
  seed("Junagadh", "Junagadh", "Saurashtra", ["groundnut", "wheat", "sesame"]),
  seed("Mehsana", "Mehsana", "North Gujarat", ["castor", "bajra", "cumin"]),
  seed("Bhavnagar", "Bhavnagar", "Saurashtra", ["onion", "groundnut", "cotton"]),
  // Wider network
  seed("Jetpur", "Rajkot", "Saurashtra"),
  seed("Dhoraji", "Rajkot", "Saurashtra"),
  seed("Veraval", "Gir Somnath", "Saurashtra"),
  seed("Porbandar", "Porbandar", "Saurashtra"),
  seed("Mahuva", "Bhavnagar", "Saurashtra", ["onion"]),
  seed("Amreli", "Amreli", "Saurashtra"),
  seed("Botad", "Botad", "Saurashtra", ["cotton"]),
  seed("Visnagar", "Mehsana", "North Gujarat"),
  seed("Palanpur", "Banaskantha", "North Gujarat"),
  seed("Deesa", "Banaskantha", "North Gujarat", ["potato", "bajra"]),
  seed("Patan", "Patan", "North Gujarat"),
  seed("Himmatnagar", "Sabarkantha", "North Gujarat"),
  seed("Bhuj", "Kutch", "Kutch"),
  seed("Anand", "Anand", "Central Gujarat"),
  seed("Nadiad", "Kheda", "Central Gujarat"),
  seed("Vadodara", "Vadodara", "Central Gujarat"),
  seed("Godhra", "Panchmahal", "Central Gujarat"),
  seed("Surat", "Surat", "South Gujarat"),
  seed("Bharuch", "Bharuch", "South Gujarat"),
  seed("Navsari", "Navsari", "South Gujarat"),
];

const cropIndex = new Map(CROP_SEEDS.map((c) => [c.id, c]));

export function findCropSeed(id: string) {
  return cropIndex.get(id);
}

/**
 * Map a free-text commodity name from an external source
 * ("Cummin Seed(Jeera)", "Bengal Gram(Gram)(Whole)") to a catalogue crop.
 */
export function matchCatalogCrop(commodity: string): CropSeed | undefined {
  const text = commodity.toLowerCase();
  const tokens = new Set(text.split(/[^a-z]+/).filter(Boolean));
  let best: { crop: CropSeed; score: number } | undefined;
  for (const crop of CROP_SEEDS) {
    for (const alias of crop.aliases) {
      const multiword = alias.includes(" ");
      const hit = multiword ? text.includes(alias) : tokens.has(alias);
      if (hit && (!best || alias.length > best.score)) {
        best = { crop, score: alias.length };
      }
    }
  }
  return best?.crop;
}
