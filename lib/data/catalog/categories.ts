import type { Category } from "@/lib/types";

/**
 * Part category tree. Top-level groups have `parentId: null`; subcategories
 * point at their group. Add groups/subcategories here (or serve them from a
 * backend) — the UI renders whatever this returns.
 *
 * `image` names a photo pool in lib/data/demo/images.ts.
 */

interface Group {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  image: string;
  keySpecs: string[];
  keywords: string[];
  subs: [slug: string, name: string, keywords?: string[]][];
}

const GROUPS: Group[] = [
  {
    slug: "spindles",
    name: "Spindles & Spindle Parts",
    shortName: "Spindles",
    description: "CNC and VMC spindles, cartridges, spindle motors, bearings and pulleys.",
    image: "spindle",
    keySpecs: ["Taper", "Max. Speed", "Power", "Cooling"],
    keywords: ["spindle", "spindle head", "cartridge"],
    subs: [
      ["cnc-spindle", "CNC Spindle", ["lathe spindle"]],
      ["vmc-spindle", "VMC Spindle", ["bt40 spindle", "milling spindle"]],
      ["spindle-motor", "Spindle Motor"],
      ["spindle-cartridge", "Spindle Cartridge"],
      ["spindle-bearing", "Spindle Bearing", ["angular contact"]],
      ["spindle-pulley", "Spindle Pulley"],
    ],
  },
  {
    slug: "motors-drives",
    name: "Motors & Drives",
    shortName: "Servo Motors & Drives",
    description: "Servo motors, servo and spindle drives, AC drives and stepper motors.",
    image: "servo",
    keySpecs: ["Rated Power", "Rated Speed", "Torque", "Voltage"],
    keywords: ["servo", "motor", "drive", "amplifier", "vfd"],
    subs: [
      ["servo-motor", "Servo Motor", ["ac servo"]],
      ["servo-drive", "Servo Drive", ["servo amplifier", "servo pack"]],
      ["spindle-drive", "Spindle Drive", ["spindle amplifier"]],
      ["ac-drive", "AC Drive", ["vfd", "inverter", "variable frequency"]],
      ["stepper-motor", "Stepper Motor"],
      ["motor-components", "Motor Components", ["brake", "motor fan"]],
    ],
  },
  {
    slug: "cnc-controls",
    name: "CNC Controls & Electronics",
    shortName: "CNC Controls",
    description: "Controllers, operator panels, PLCs, displays, boards and power supplies.",
    image: "control",
    keySpecs: ["Control Series", "Type", "Voltage", "Interface"],
    keywords: ["controller", "cnc control", "control panel", "electronics", "board", "mmi"],
    subs: [
      ["cnc-controller", "CNC Controller"],
      ["cnc-control-panel", "CNC Control Panel", ["operator panel", "mop"]],
      ["plc", "PLC", ["plc module"]],
      ["cnc-display", "CNC Display", ["lcd", "screen", "monitor"]],
      ["cnc-keyboard", "CNC Keyboard", ["keypad", "mdi"]],
      ["servo-amplifier", "Servo Amplifier"],
      ["power-supply", "Power Supply", ["psm", "smps"]],
      ["control-board", "Control Board", ["main board", "pcb", "axis card"]],
      ["io-board", "I/O Board", ["io module", "i/o"]],
    ],
  },
  {
    slug: "mechanical-parts",
    name: "Mechanical Parts",
    shortName: "Mechanical",
    description: "Ball screws, linear guideways, bearings, couplings, gears and slides.",
    image: "bearing",
    keySpecs: ["Size", "Diameter", "Lead", "Length", "Accuracy Grade"],
    keywords: ["mechanical", "transmission"],
    subs: [
      ["ball-screw", "Ball Screw", ["ballscrew", "lead screw"]],
      ["ball-screw-nut", "Ball Screw Nut"],
      ["linear-guideway", "Linear Guideway", ["lm guide", "linear guide", "rail", "lm rail"]],
      ["linear-bearing", "Linear Bearing", ["lm block", "carriage"]],
      ["coupling", "Coupling", ["motor coupling"]],
      ["bearings", "Bearings", ["bearing"]],
      ["gears", "Gears", ["gear"]],
      ["pulleys", "Pulleys", ["pulley", "timing pulley"]],
      ["machine-slides", "Machine Slides", ["slide", "cross slide"]],
    ],
  },
  {
    slug: "tooling",
    name: "Tooling",
    shortName: "Tool Holders",
    description: "BT and HSK tool holders, collets, collet chucks, drill and milling chucks.",
    image: "toolholder",
    keySpecs: ["Taper", "Clamping Range", "Gauge Length", "Balance"],
    keywords: ["tool holder", "toolholder", "holder", "arbor"],
    subs: [
      ["tool-holder", "Tool Holder"],
      ["bt-tool-holder", "BT Tool Holder", ["bt40", "bt30", "bt50"]],
      ["hsk-tool-holder", "HSK Tool Holder", ["hsk63", "hsk-a63"]],
      ["collet", "Collet"],
      ["er-collet", "ER Collet", ["er32", "er25", "er16"]],
      ["collet-chuck", "Collet Chuck"],
      ["drill-chuck", "Drill Chuck"],
      ["milling-chuck", "Milling Chuck"],
    ],
  },
  {
    slug: "workholding",
    name: "Workholding",
    shortName: "CNC Chucks",
    description: "CNC, hydraulic and pneumatic chucks, vices and rotary tables.",
    image: "chuck",
    keySpecs: ["Size", "Jaw Type", "Through Hole", "Max. Speed"],
    keywords: ["chuck", "workholding", "vice", "vise", "fixture"],
    subs: [
      ["cnc-chuck", "CNC Chuck", ["3 jaw chuck", "power chuck"]],
      ["hydraulic-chuck", "Hydraulic Chuck"],
      ["pneumatic-chuck", "Pneumatic Chuck"],
      ["vmc-vice", "VMC Vice", ["vise"]],
      ["machine-vice", "Machine Vice"],
      ["rotary-table", "Rotary Table", ["4th axis", "indexer"]],
    ],
  },
  {
    slug: "turret-atc",
    name: "Turret & Tool Changer Parts",
    shortName: "Turret Parts",
    description: "Turrets, turret motors and couplings, ATC arms, magazines and sensors.",
    image: "turret",
    keySpecs: ["Stations", "Type", "Tool Shank", "Compatible Size"],
    keywords: ["turret", "atc", "tool changer", "magazine"],
    subs: [
      ["cnc-turret", "CNC Turret"],
      ["turret-motor", "Turret Motor"],
      ["turret-coupling", "Turret Coupling", ["curvic coupling"]],
      ["atc-parts", "ATC Parts"],
      ["tool-changer-arm", "Tool Changer Arm", ["atc arm", "double arm"]],
      ["tool-magazine", "Tool Magazine", ["tool pot", "carousel"]],
      ["atc-sensors", "ATC Sensors"],
    ],
  },
  {
    slug: "sensors-automation",
    name: "Sensors & Automation Parts",
    shortName: "Sensors",
    description: "Proximity sensors, limit switches, encoders, linear scales and position sensors.",
    image: "sensor",
    keySpecs: ["Type", "Sensing Range", "Output", "Voltage"],
    keywords: ["sensor", "switch", "feedback", "automation"],
    subs: [
      ["proximity-sensor", "Proximity Sensor", ["proxy", "inductive"]],
      ["limit-switch", "Limit Switch"],
      ["encoder", "Encoder", ["pulse coder", "rotary encoder"]],
      ["linear-scale", "Linear Scale", ["glass scale", "dro scale"]],
      ["pressure-sensor", "Pressure Sensor", ["pressure switch"]],
      ["position-sensor", "Position Sensor"],
    ],
  },
  {
    slug: "hydraulic-pneumatic",
    name: "Hydraulic & Pneumatic Parts",
    shortName: "Hydraulic Parts",
    description: "Hydraulic pumps and valves, pneumatic and solenoid valves, cylinders.",
    image: "hydraulic",
    keySpecs: ["Size", "Pressure", "Flow", "Voltage"],
    keywords: ["hydraulic", "pneumatic", "valve", "power pack"],
    subs: [
      ["hydraulic-pump", "Hydraulic Pump", ["vane pump", "power pack"]],
      ["hydraulic-valve", "Hydraulic Valve", ["directional valve"]],
      ["pneumatic-valve", "Pneumatic Valve"],
      ["solenoid-valve", "Solenoid Valve"],
      ["cylinders", "Cylinders", ["cylinder", "chuck cylinder"]],
      ["hydraulic-components", "Hydraulic Components", ["accumulator", "manifold"]],
    ],
  },
  {
    slug: "lubrication-cooling",
    name: "Lubrication & Cooling",
    shortName: "Lubrication Parts",
    description: "Lubrication units, oil and coolant pumps, coolant motors and filters.",
    image: "lubrication",
    keySpecs: ["Capacity", "Flow", "Pressure", "Voltage"],
    keywords: ["lubrication", "lube", "coolant", "oil"],
    subs: [
      ["lubrication-pump", "Lubrication Pump", ["lube pump", "centralised lubrication"]],
      ["oil-pump", "Oil Pump"],
      ["coolant-pump", "Coolant Pump"],
      ["coolant-motor", "Coolant Motor"],
      ["oil-filter", "Oil Filter", ["filter"]],
      ["lubrication-components", "Lubrication Components", ["distributor", "metering"]],
    ],
  },
  {
    slug: "electrical-parts",
    name: "Electrical & Replacement Parts",
    shortName: "Electrical Parts",
    description: "Contactors, relays, transformers, fans, cables, connectors, switches and fuses.",
    image: "electrical",
    keySpecs: ["Rating", "Voltage", "Poles", "Type"],
    keywords: ["electrical", "panel", "spares"],
    subs: [
      ["contactors", "Contactors", ["contactor"]],
      ["relays", "Relays", ["relay"]],
      ["transformers", "Transformers", ["transformer"]],
      ["cooling-fans", "Cooling Fans", ["panel fan", "fan"]],
      ["machine-fans", "Machine Fans"],
      ["cables", "Cables", ["cable", "encoder cable", "power cable"]],
      ["connectors", "Connectors", ["connector"]],
      ["switches", "Switches", ["switch", "selector"]],
      ["fuses", "Fuses", ["fuse"]],
    ],
  },
];

export const CATEGORIES: Category[] = GROUPS.flatMap((g) => [
  {
    id: g.slug,
    slug: g.slug,
    name: g.name,
    shortName: g.shortName,
    description: g.description,
    parentId: null,
    image: g.image,
    keySpecs: g.keySpecs,
    keywords: g.keywords,
  },
  ...g.subs.map(([slug, name, keywords]) => ({
    id: slug,
    slug,
    name,
    shortName: name,
    description: "",
    parentId: g.slug,
    image: g.image,
    keySpecs: g.keySpecs,
    keywords: keywords ?? [],
  })),
]);

/** Home "Explore Machine Parts" cards, in order (groups and key subcategories) */
export const HOME_CATEGORIES: { slug: string; title: string; blurb: string; image: string }[] = [
  { slug: "spindles", title: "Spindles", blurb: "CNC & VMC spindles, cartridges and bearings", image: "spindle" },
  { slug: "motors-drives", title: "Servo Motors & Drives", blurb: "Servo motors, amplifiers and spindle drives", image: "servo" },
  { slug: "cnc-controls", title: "CNC Controls", blurb: "Controllers, panels, PLCs and boards", image: "control" },
  { slug: "ball-screw", title: "Ball Screws", blurb: "Ground and rolled ball screws and nuts", image: "ballscrew" },
  { slug: "linear-guideway", title: "Linear Guideways", blurb: "LM rails and blocks for machine axes", image: "linear" },
  { slug: "tooling", title: "Tool Holders", blurb: "BT, HSK holders, collets and chucks", image: "toolholder" },
  { slug: "cnc-chuck", title: "CNC Chucks", blurb: "Power chucks, vices and rotary tables", image: "chuck" },
  { slug: "turret-atc", title: "Turret Parts", blurb: "Turrets, ATC arms and tool magazines", image: "turret" },
  { slug: "sensors-automation", title: "Sensors", blurb: "Proximity, limit switches, encoders, scales", image: "sensor" },
  { slug: "hydraulic-pneumatic", title: "Hydraulic Parts", blurb: "Pumps, valves, cylinders and fittings", image: "hydraulic" },
  { slug: "electrical-parts", title: "Electrical Parts", blurb: "Contactors, relays, fans, cables, fuses", image: "electrical" },
  { slug: "lubrication-cooling", title: "Lubrication Parts", blurb: "Lube units, oil and coolant pumps", image: "lubrication" },
];
