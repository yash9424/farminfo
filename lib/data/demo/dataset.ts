import type { Brand, Compatibility, Part, PartCondition, PriceType, Seller } from "@/lib/types";
import { CITIES } from "../catalog/locations";
import { imagesFor } from "./images";

/**
 * DEMO DATASET — generated, not real.
 *
 * Sellers are fictional and have no contact details. Prices, stock and part
 * numbers are illustrative (part numbers use a generic format that does not
 * follow any manufacturer's real numbering). Every listing has `isDemo: true`
 * and is labelled in the UI. Manufacturer names identify what a part is/fits;
 * they do not imply the manufacturer is selling anything here.
 * Deterministic (seeded) so builds and screenshots are stable.
 */

/* ---------- deterministic randomness ---------- */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260927);
const pick = <T,>(list: readonly T[]): T => list[Math.floor(rand() * list.length)];
const between = (min: number, max: number) => min + rand() * (max - min);
const int = (min: number, max: number) => Math.round(between(min, max));

/* ---------- brands (component manufacturers) ---------- */

const B = (id: string, name: string, country: string): Brand => ({ id, slug: id, name, country });

export const DEMO_BRANDS: Brand[] = [
  B("fanuc", "FANUC", "Japan"),
  B("siemens", "Siemens", "Germany"),
  B("mitsubishi", "Mitsubishi Electric", "Japan"),
  B("yaskawa", "Yaskawa", "Japan"),
  B("delta", "Delta", "Taiwan"),
  B("heidenhain", "Heidenhain", "Germany"),
  B("hiwin", "HIWIN", "Taiwan"),
  B("thk", "THK", "Japan"),
  B("pmi", "PMI", "Taiwan"),
  B("skf", "SKF", "Sweden"),
  B("nsk", "NSK", "Japan"),
  B("omron", "Omron", "Japan"),
  B("schneider", "Schneider Electric", "France"),
  B("autonics", "Autonics", "South Korea"),
  B("yuken", "Yuken", "Japan"),
  B("rexroth", "Bosch Rexroth", "Germany"),
  B("smc", "SMC", "Japan"),
  B("kitagawa", "Kitagawa", "Japan"),
  B("rohm", "Röhm", "Germany"),
  B("posa", "POSA", "Taiwan"),
  B("kenturn", "Kenturn", "Taiwan"),
  B("duplomatic", "Duplomatic", "Italy"),
  B("lubsol", "Lubsol", "India"),
  B("groz", "Groz-Tools", "India"),
  B("generic", "Unbranded / OEM", "—"),
];

/* ---------- fictional sellers (no phone numbers or emails) ---------- */

const SELLER_ROWS: [string, string, Seller["type"], string, string, string, boolean, string][] = [
  ["northline", "Northline CNC Spares", "dealer", "gujarat", "rajkot", "rajkot", true, "2024-02-11"],
  ["axis-traders", "Precision Axis Traders", "dealer", "gujarat", "rajkot", "shapar", false, "2025-06-02"],
  ["vertex-tooling", "Vertex Tooling Co.", "dealer", "gujarat", "ahmedabad", "ahmedabad", true, "2023-11-20"],
  ["metalform", "Metalform Components", "dealer", "gujarat", "vadodara", "vadodara", true, "2024-08-15"],
  ["kinetic-spares", "Kinetic Spares Mart", "dealer", "maharashtra", "pune", "pune", true, "2023-07-03"],
  ["deccan-cnc", "Deccan CNC Exchange", "dealer", "maharashtra", "pune", "chakan", false, "2025-01-19"],
  ["harbour-electro", "Harbour Electro Controls", "dealer", "maharashtra", "mumbai", "mumbai", true, "2024-04-28"],
  ["plateau-engg", "Plateau Engineering Works", "owner", "maharashtra", "chhatrapati-sambhajinagar", "aurangabad", false, "2025-09-10"],
  ["coromandel", "Coromandel Machine Spares", "dealer", "tamil-nadu", "chennai", "chennai", true, "2023-05-22"],
  ["kovai-precision", "Kovai Precision Hub", "dealer", "tamil-nadu", "coimbatore", "coimbatore", true, "2024-10-01"],
  ["hosur-auto", "Hosur Auto Tooling", "owner", "tamil-nadu", "krishnagiri", "hosur", false, "2025-03-14"],
  ["peenya-cnc", "Peenya CNC Solutions", "dealer", "karnataka", "bengaluru-urban", "peenya", true, "2023-09-05"],
  ["garden-city", "Garden City Automation", "dealer", "karnataka", "bengaluru-urban", "bengaluru", false, "2025-07-21"],
  ["ncr-industrial", "NCR Industrial Spares", "dealer", "haryana", "faridabad", "faridabad", true, "2024-01-09"],
  ["cyber-city", "Cyber City Machine Works", "owner", "haryana", "gurugram", "manesar", false, "2025-11-30"],
  ["five-rivers", "Five Rivers Tool House", "dealer", "punjab", "ludhiana", "ludhiana", true, "2023-12-12"],
  ["charminar", "Charminar Precision Parts", "manufacturer", "telangana", "hyderabad", "hyderabad", true, "2024-06-18"],
  ["aravalli", "Aravalli Machine Spares", "dealer", "rajasthan", "alwar", "bhiwadi", false, "2025-04-07"],
  ["yamuna-tech", "Yamuna Tech Components", "dealer", "uttar-pradesh", "gautam-buddha-nagar", "noida", true, "2024-03-26"],
  ["okhla-spares", "Okhla Spares House", "owner", "delhi", "south-east-delhi", "okhla", false, "2025-08-02"],
];

export const DEMO_SELLERS: Seller[] = SELLER_ROWS.map(([id, name, type, state, district, city, verified, memberSince]) => ({
  id,
  slug: id,
  name,
  type,
  location: { country: "india", state, district, city },
  verified,
  memberSince,
  isDemo: true,
}));

/* ---------- part templates ---------- */

const FANUC_CTRL = ["FANUC 0i-MF", "FANUC 0i-TF", "FANUC 0i-MD", "FANUC 0i-TD"];
const SIEMENS_CTRL = ["Siemens 828D", "Siemens 808D"];
const MITSU_CTRL = ["Mitsubishi M80", "Mitsubishi M70"];
const VMC_MODELS = ["VMC 640", "VMC 850", "VMC 1060", "VMC 1160"];
const LATHE_MODELS = ["CNC lathe (8\" chuck)", "CNC lathe (10\" chuck)", "Turning centre 250"];

const some = <T,>(list: readonly T[], min = 1, max = 3): T[] => {
  const n = Math.min(list.length, int(min, max));
  const copy = [...list];
  const out: T[] = [];
  while (out.length < n) out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  return out;
};

type Spec = Record<string, string>;
interface Template {
  sub: string;
  group: string;
  pool: string;
  label: string;
  brands: string[];
  code: string; // part-number type code
  title: (brand: string, s: Spec) => string;
  specs: (brand: string) => Spec;
  compat: (brand: string) => Compatibility | undefined;
  price: [number, number]; // ₹ for a new part
  multiUnit?: boolean; // small consumables usually sold in quantity
  weight: number;
}

const ctrlFor = (brand: string) =>
  brand === "siemens" ? SIEMENS_CTRL : brand === "mitsubishi" ? MITSU_CTRL : FANUC_CTRL;

const T: Template[] = [
  // Spindles
  {
    sub: "vmc-spindle", group: "spindles", pool: "spindle", label: "VMC Spindle", brands: ["generic", "posa", "kenturn"], code: "SP",
    title: (b, s) => `${s.Taper} ${s["Max. Speed"].replace(" RPM", "")} RPM VMC Spindle`,
    specs: () => ({ Taper: pick(["BT40", "BT40", "BBT40", "BT30", "BT50"]), "Max. Speed": `${pick([6000, 8000, 10000, 12000])} RPM`, "Spindle Nose Dia.": `${pick([150, 170, 190])} mm`, Drive: pick(["Belt driven", "Direct drive"]), Cooling: pick(["Oil-jacket cooled", "Air cooled"]), Lubrication: "Grease packed", "Tool Clamping": "Disc-spring drawbar" }),
    compat: () => ({ machineModels: some(VMC_MODELS, 1, 3), machineBrands: ["Most Indian & Taiwanese 850-size VMCs"] }),
    price: [180000, 450000], weight: 4,
  },
  {
    sub: "cnc-spindle", group: "spindles", pool: "spindle", label: "CNC Lathe Spindle", brands: ["generic", "posa"], code: "SP",
    title: (b, s) => `CNC Lathe Spindle A2-${s["Spindle Nose"].replace("A2-", "")}`,
    specs: () => ({ "Spindle Nose": pick(["A2-5", "A2-6", "A2-8"]), "Max. Speed": `${pick([3500, 4000, 4500])} RPM`, "Bore Dia.": `${pick([56, 66, 86])} mm`, Bearings: "P4 angular contact (front & rear)", Drive: "Belt driven" }),
    compat: () => ({ machineModels: some(LATHE_MODELS, 1, 2) }),
    price: [120000, 350000], weight: 2,
  },
  {
    sub: "spindle-motor", group: "spindles", pool: "servo", label: "Spindle Motor", brands: ["fanuc", "siemens", "mitsubishi"], code: "SM",
    title: (b, s) => `${brandName(b)} Spindle Motor ${s["Rated Power"]}`,
    specs: () => ({ "Rated Power": `${pick([5.5, 7.5, 11, 15])} kW`, "Max. Speed": `${pick([6000, 8000, 10000])} RPM`, Voltage: "200 V AC, 3-phase", Cooling: "Fan cooled", Encoder: "Built-in (MZi sensor)", Mounting: "Flange" }),
    compat: (b) => ({ cncControls: some(ctrlFor(b), 1, 2) }),
    price: [90000, 300000], weight: 2,
  },
  {
    sub: "spindle-bearing", group: "spindles", pool: "bearing", label: "Spindle Bearing Set", brands: ["nsk", "skf"], code: "SB",
    title: (b, s) => `${brandName(b)} ${s.Designation} Spindle Bearing Set`,
    specs: () => ({ Designation: pick(["7014", "7016", "7018", "7212"]) + pick(["CTYNDULP4", "ACD/P4A"]), Type: "Angular contact ball bearing", Precision: "P4 (ABEC 7)", Arrangement: "Matched set (DB/DT)", Preload: "Light" }),
    compat: () => ({ machineModels: some(VMC_MODELS, 1, 2) }),
    price: [8000, 45000], multiUnit: true, weight: 2,
  },
  // Motors & drives
  {
    sub: "servo-motor", group: "motors-drives", pool: "servo", label: "Servo Motor", brands: ["fanuc", "fanuc", "siemens", "mitsubishi", "yaskawa", "delta"], code: "SV",
    title: (b, s) => `${brandName(b)} Servo Motor ${s.Torque}, ${s["Rated Speed"]}`,
    specs: () => ({ "Motor Type": "AC servo motor", "Rated Power": `${pick([0.75, 1.2, 1.8, 2.5, 3])} kW`, "Rated Speed": `${pick([2000, 3000, 4000])} RPM`, Torque: `${pick([4, 8, 12, 22, 30])} Nm`, Voltage: "200 V AC", "Encoder Type": pick(["Absolute, 1M ppr", "Absolute, 16M ppr", "Incremental"]), Brake: pick(["With brake", "Without brake"]), Shaft: pick(["Straight with key", "Taper"]) }),
    compat: (b) => ({ cncControls: some(ctrlFor(b), 1, 3), machineModels: rand() < 0.5 ? some(VMC_MODELS, 1, 2) : undefined }),
    price: [45000, 160000], weight: 7,
  },
  {
    sub: "servo-drive", group: "motors-drives", pool: "control", label: "Servo Drive", brands: ["fanuc", "siemens", "yaskawa", "delta", "mitsubishi"], code: "SD",
    title: (b, s) => `${brandName(b)} Servo Drive ${s.Axes}, ${s["Rated Current"]}`,
    specs: () => ({ Axes: pick(["1-axis", "2-axis", "3-axis"]), "Rated Current": `${pick([10, 20, 40, 80])} A`, "Input Voltage": "200–240 V AC", Interface: pick(["FSSB", "DRIVE-CLiQ", "MECHATROLINK-III", "Pulse/analog"]), Feedback: "Serial encoder" }),
    compat: (b) => ({ cncControls: some(ctrlFor(b), 1, 2) }),
    price: [35000, 140000], weight: 4,
  },
  {
    sub: "spindle-drive", group: "motors-drives", pool: "control", label: "Spindle Drive", brands: ["fanuc", "siemens"], code: "SPD",
    title: (b, s) => `${brandName(b)} Spindle Drive ${s["Rated Output"]}`,
    specs: () => ({ "Rated Output": `${pick([7.5, 11, 15, 22])} kW`, "Input Voltage": "200 V AC, 3-phase", Interface: pick(["FSSB", "DRIVE-CLiQ"]), Cooling: "Forced air" }),
    compat: (b) => ({ cncControls: some(ctrlFor(b), 1, 2) }),
    price: [60000, 250000], weight: 2,
  },
  {
    sub: "ac-drive", group: "motors-drives", pool: "control", label: "AC Drive (VFD)", brands: ["delta", "schneider", "yaskawa", "siemens"], code: "VF",
    title: (b, s) => `${brandName(b)} AC Drive ${s.Power}`,
    specs: () => ({ Power: `${pick([2.2, 3.7, 5.5, 7.5, 11])} kW`, "Input Voltage": "415 V AC, 3-phase", Control: "Sensorless vector / V/f", "Output Frequency": "0–599 Hz", Braking: "Built-in braking chopper" }),
    compat: () => undefined,
    price: [12000, 90000], weight: 3,
  },
  {
    sub: "stepper-motor", group: "motors-drives", pool: "servo", label: "Stepper Motor", brands: ["autonics", "generic"], code: "ST",
    title: (b, s) => `${brandName(b)} NEMA ${s["Frame Size"].replace("NEMA ", "")} Stepper Motor`,
    specs: () => ({ "Frame Size": pick(["NEMA 23", "NEMA 34"]), "Holding Torque": `${pick([1.2, 2.2, 4.5, 8.5])} Nm`, "Step Angle": "1.8°", Current: `${pick([2.8, 4.2, 6])} A` }),
    compat: () => undefined,
    price: [3000, 15000], multiUnit: true, weight: 1,
  },
  // Controls & electronics
  {
    sub: "cnc-controller", group: "cnc-controls", pool: "control", label: "CNC Controller", brands: ["fanuc", "siemens", "mitsubishi"], code: "CC",
    title: (b, s) => `${s["Control Series"]} CNC Controller`,
    specs: (b) => ({ "Control Series": pick(ctrlFor(b)), Type: pick(["Milling", "Turning"]), Display: `${pick([8.4, 10.4, 15])}" colour LCD`, "Max. Axes": `${pick([4, 5, 6])}`, Voltage: "24 V DC", Includes: pick(["Control unit only", "Control unit + MDI keypad", "Complete retrofit kit"]) }),
    compat: (b) => ({ machineBrands: ["Retrofit-compatible with most VMCs & lathes"], cncControls: some(ctrlFor(b), 1, 2) }),
    price: [150000, 600000], weight: 3,
  },
  {
    sub: "cnc-control-panel", group: "cnc-controls", pool: "control", label: "Machine Operator Panel", brands: ["fanuc", "siemens", "generic"], code: "OP",
    title: (b) => `${brandName(b)} Machine Operator Panel`,
    specs: () => ({ Type: "Machine operator panel (MOP)", Features: "Feed & spindle override, E-stop, MPG port", Interface: pick(["I/O Link", "PROFINET", "Parallel I/O"]), Voltage: "24 V DC" }),
    compat: (b) => ({ cncControls: some(ctrlFor(b === "generic" ? "fanuc" : b), 1, 3) }),
    price: [25000, 120000], weight: 2,
  },
  {
    sub: "plc", group: "cnc-controls", pool: "control", label: "PLC", brands: ["siemens", "mitsubishi", "omron", "delta"], code: "PL",
    title: (b, s) => `${brandName(b)} PLC ${s["I/O Points"]}`,
    specs: () => ({ Type: "Compact PLC CPU", "I/O Points": `${pick([16, 24, 32, 40])} I/O`, "Supply Voltage": "24 V DC", Communication: pick(["Ethernet + RS-485", "PROFINET", "CC-Link"]) }),
    compat: () => undefined,
    price: [12000, 80000], weight: 2,
  },
  {
    sub: "cnc-display", group: "cnc-controls", pool: "control", label: "CNC Display Unit", brands: ["fanuc", "siemens", "mitsubishi"], code: "DU",
    title: (b, s) => `${brandName(b)} ${s["Screen Size"]} CNC Display Unit`,
    specs: () => ({ "Screen Size": `${pick([8.4, 10.4, 15])}"`, Type: "Colour TFT LCD", Resolution: pick(["640 × 480", "800 × 600", "1024 × 768"]), Voltage: "24 V DC" }),
    compat: (b) => ({ cncControls: some(ctrlFor(b), 1, 3) }),
    price: [15000, 60000], weight: 2,
  },
  {
    sub: "power-supply", group: "cnc-controls", pool: "electrical", label: "Power Supply Module", brands: ["fanuc", "siemens", "omron"], code: "PS",
    title: (b, s) => `${brandName(b)} Power Supply Module ${s["Rated Output"]}`,
    specs: () => ({ "Rated Output": `${pick([5.5, 11, 15, 24])} kW`, "Input Voltage": "200 V AC, 3-phase", "DC Link": "300 V DC", Cooling: "Forced air" }),
    compat: (b) => ({ cncControls: some(ctrlFor(b === "omron" ? "fanuc" : b), 1, 2) }),
    price: [18000, 85000], weight: 2,
  },
  {
    sub: "control-board", group: "cnc-controls", pool: "control", label: "Control Board (PCB)", brands: ["fanuc", "siemens", "mitsubishi"], code: "PC",
    title: (b, s) => `${brandName(b)} ${s["Board Type"]} Board`,
    specs: () => ({ "Board Type": pick(["Main CPU", "Axis control", "Memory", "Display control"]), Condition: "Tested on test rig", Warranty: pick(["3 months", "6 months", "As-is"]) }),
    compat: (b) => ({ cncControls: some(ctrlFor(b), 1, 3) }),
    price: [15000, 100000], weight: 3,
  },
  {
    sub: "io-board", group: "cnc-controls", pool: "control", label: "I/O Module", brands: ["fanuc", "siemens"], code: "IO",
    title: (b, s) => `${brandName(b)} I/O Module ${s["I/O Points"]}`,
    specs: () => ({ "I/O Points": `${pick([48, 72, 96])} DI / ${pick([32, 48, 64])} DO`, Interface: pick(["I/O Link", "PROFINET"]), Voltage: "24 V DC" }),
    compat: (b) => ({ cncControls: some(ctrlFor(b), 1, 2) }),
    price: [9000, 45000], weight: 1,
  },
  // Mechanical
  {
    sub: "ball-screw", group: "mechanical-parts", pool: "ballscrew", label: "Ball Screw", brands: ["hiwin", "thk", "pmi"], code: "BS",
    title: (b, s) => `${brandName(b)} Ball Screw ${s.Diameter.replace(" mm", "")}×${s.Lead.replace(" mm", "")}, ${s.Length}`,
    specs: () => ({ Diameter: `${pick([25, 32, 40, 50])} mm`, Lead: `${pick([10, 12, 16, 20])} mm`, Length: `${pick([700, 900, 1100, 1350])} mm`, "Nut Type": pick(["Double nut, flanged", "Single nut, preloaded"]), "Accuracy Grade": pick(["C3 (ground)", "C5 (ground)", "C7 (rolled)"]), "End Machining": "Machined to drawing" }),
    compat: () => ({ machineModels: some(VMC_MODELS, 1, 2) }),
    price: [18000, 95000], weight: 4,
  },
  {
    sub: "linear-guideway", group: "mechanical-parts", pool: "linear", label: "Linear Guideway", brands: ["hiwin", "thk", "pmi"], code: "LG",
    title: (b, s) => `${brandName(b)} Linear Guideway Size ${s.Size}, ${s["Rail Length"]}`,
    specs: () => ({ Size: `${pick([25, 30, 35, 45])}`, "Rail Length": `${pick([800, 1000, 1200, 1500])} mm`, "Blocks Included": `${pick([2, 2, 4])}`, "Block Type": pick(["Flanged", "Square"]), Preload: pick(["Medium (Z1)", "Heavy (Z2)"]), "Accuracy Grade": pick(["H", "P"]) }),
    compat: () => ({ machineModels: some(VMC_MODELS, 1, 2) }),
    price: [8000, 60000], weight: 4,
  },
  {
    sub: "linear-bearing", group: "mechanical-parts", pool: "linear", label: "LM Block", brands: ["hiwin", "thk"], code: "LB",
    title: (b, s) => `${brandName(b)} LM Block Size ${s.Size}`,
    specs: () => ({ Size: `${pick([20, 25, 30, 35])}`, "Block Type": pick(["Flanged", "Square"]), Preload: "Medium (Z1)" }),
    compat: () => undefined,
    price: [2500, 12000], multiUnit: true, weight: 2,
  },
  {
    sub: "coupling", group: "mechanical-parts", pool: "bearing", label: "Servo Coupling", brands: ["generic", "rexroth"], code: "CP",
    title: (b, s) => `Servo Motor Coupling ${s.Bores}`,
    specs: () => ({ Type: pick(["Disc (backlash-free)", "Jaw (spider)", "Bellows"]), Bores: `${pick([14, 19, 22])} × ${pick([20, 25])} mm`, "Outer Dia.": `${pick([56, 68, 82])} mm`, "Rated Torque": `${pick([25, 50, 80])} Nm` }),
    compat: () => ({ machineModels: some(VMC_MODELS, 1, 2) }),
    price: [1500, 9000], multiUnit: true, weight: 2,
  },
  {
    sub: "bearings", group: "mechanical-parts", pool: "bearing", label: "Ball Screw Support Bearing", brands: ["nsk", "skf"], code: "BR",
    title: (b, s) => `${brandName(b)} ${s.Designation} Ball Screw Support Bearing`,
    specs: () => ({ Designation: `${pick([25, 30, 35, 40])}TAC${pick([62, 72])}B`, Type: "Angular contact thrust", Precision: "P4", Arrangement: pick(["DB", "DF", "DFD"]) }),
    compat: () => undefined,
    price: [4000, 25000], multiUnit: true, weight: 2,
  },
  {
    sub: "gears", group: "mechanical-parts", pool: "bearing", label: "Gear Set", brands: ["generic"], code: "GR",
    title: (b, s) => `Headstock Gear Set Module ${s.Module}`,
    specs: () => ({ Module: `${pick([2, 2.5, 3])}`, Teeth: `${int(28, 64)} / ${int(18, 40)}`, Material: "Case-hardened alloy steel", Finish: "Ground" }),
    compat: () => ({ machineModels: some(LATHE_MODELS, 1, 2) }),
    price: [3000, 25000], weight: 1,
  },
  // Tooling
  {
    sub: "bt-tool-holder", group: "tooling", pool: "toolholder", label: "BT Tool Holder", brands: ["groz", "generic", "posa"], code: "TH",
    title: (b, s) => `${s.Taper} ${s.Type} Tool Holder`,
    specs: () => ({ Taper: pick(["BT40", "BT40", "BT30", "BT50"]), Type: pick(["ER32 collet chuck", "Side lock (Weldon)", "Face mill arbor", "Shrink fit", "Hydraulic"]), "Gauge Length": `${pick([70, 100, 150])} mm`, Balance: "G2.5 @ 25,000 RPM", "Pull Stud": pick(["Included", "Not included"]) }),
    compat: () => ({ machineModels: some(VMC_MODELS, 2, 3) }),
    price: [1800, 9000], multiUnit: true, weight: 5,
  },
  {
    sub: "hsk-tool-holder", group: "tooling", pool: "toolholder", label: "HSK Tool Holder", brands: ["rohm", "posa"], code: "TH",
    title: (b, s) => `${brandName(b)} ${s.Taper} ${s.Type} Holder`,
    specs: () => ({ Taper: pick(["HSK-A63", "HSK-A100"]), Type: pick(["Shrink fit", "Hydraulic chuck", "ER collet chuck"]), "Gauge Length": `${pick([80, 100, 120])} mm`, Balance: "G2.5 @ 25,000 RPM" }),
    compat: () => ({ machineBrands: ["High-speed & 5-axis machining centres with HSK spindles"] }),
    price: [6000, 22000], multiUnit: true, weight: 2,
  },
  {
    sub: "er-collet", group: "tooling", pool: "toolholder", label: "ER Collet Set", brands: ["groz", "rohm", "generic"], code: "EC",
    title: (b, s) => `${s.Series} Collet Set (${s["Pieces"]})`,
    specs: () => ({ Series: pick(["ER32", "ER25", "ER16", "ER40"]), Pieces: `${pick([7, 11, 18])} pcs`, "Clamping Range": pick(["2–20 mm", "1–16 mm", "3–26 mm"]), Runout: "≤ 0.005 mm" }),
    compat: () => undefined,
    price: [2500, 12000], multiUnit: true, weight: 3,
  },
  {
    sub: "drill-chuck", group: "tooling", pool: "toolholder", label: "Keyless Drill Chuck", brands: ["rohm", "groz"], code: "DC",
    title: (b, s) => `${brandName(b)} Keyless Drill Chuck ${s["Clamping Range"]}`,
    specs: () => ({ "Clamping Range": pick(["1–13 mm", "1–16 mm", "3–16 mm"]), Mount: pick(["BT40 integral", "JT6 / MT3"]), Runout: "≤ 0.03 mm" }),
    compat: () => undefined,
    price: [2000, 9000], multiUnit: true, weight: 2,
  },
  // Workholding
  {
    sub: "cnc-chuck", group: "workholding", pool: "chuck", label: "CNC Power Chuck", brands: ["kitagawa", "rohm", "generic"], code: "CH",
    title: (b, s) => `${brandName(b)} ${s.Size} 3-Jaw Power Chuck`,
    specs: () => ({ Size: pick(['6"', '8"', '10"', '12"']), "Jaw Type": "3-jaw, serrated", "Through Hole": `${pick([45, 52, 66, 91])} mm`, "Max. Speed": `${pick([3000, 4000, 5000, 6000])} RPM`, Mounting: pick(["A2-5", "A2-6", "A2-8"]), Actuation: "Hydraulic (cylinder not included)" }),
    compat: () => ({ machineModels: some(LATHE_MODELS, 1, 2) }),
    price: [25000, 120000], weight: 4,
  },
  {
    sub: "hydraulic-chuck", group: "workholding", pool: "chuck", label: "Hydraulic Chuck & Cylinder Set", brands: ["kitagawa", "generic"], code: "HC",
    title: (b, s) => `${brandName(b)} ${s.Size} Hydraulic Chuck with Cylinder`,
    specs: () => ({ Size: pick(['8"', '10"']), "Jaw Type": "3-jaw", Cylinder: "Through-hole rotary cylinder", "Max. Pressure": "25 bar", "Max. Speed": `${pick([4000, 4500])} RPM` }),
    compat: () => ({ machineModels: some(LATHE_MODELS, 1, 2) }),
    price: [45000, 150000], weight: 2,
  },
  {
    sub: "vmc-vice", group: "workholding", pool: "chuck", label: "VMC Precision Vice", brands: ["groz", "generic"], code: "VC",
    title: (b, s) => `${s["Jaw Width"]} VMC Precision Vice`,
    specs: () => ({ "Jaw Width": `${pick([100, 125, 150, 160])} mm`, "Max. Opening": `${pick([150, 200, 250])} mm`, Type: pick(["Hydraulic-mechanical", "Mechanical"]), Accuracy: "0.01 / 100 mm" }),
    compat: () => ({ machineModels: some(VMC_MODELS, 2, 3) }),
    price: [9000, 45000], multiUnit: true, weight: 2,
  },
  {
    sub: "rotary-table", group: "workholding", pool: "chuck", label: "CNC Rotary Table (4th Axis)", brands: ["generic", "posa"], code: "RT",
    title: (b, s) => `CNC Rotary Table Ø${s["Table Dia."].replace(" mm", "")} (4th Axis)`,
    specs: () => ({ "Table Dia.": `${pick([170, 210, 255])} mm`, Indexing: "0.001°", "Clamping Torque": `${pick([350, 500, 800])} Nm`, Motor: "Servo motor (not included)", "Centre Height": `${pick([135, 160])} mm` }),
    compat: (b) => ({ machineModels: some(VMC_MODELS, 1, 2), cncControls: some(ctrlFor(b), 1, 2) }),
    price: [120000, 500000], weight: 2,
  },
  // Turret & ATC
  {
    sub: "cnc-turret", group: "turret-atc", pool: "turret", label: "CNC Turret", brands: ["duplomatic", "generic"], code: "TR",
    title: (b, s) => `${brandName(b)} ${s.Stations} CNC Lathe Turret`,
    specs: () => ({ Stations: `${pick([8, 10, 12])}-station`, Type: pick(["Servo turret", "Hydraulic turret"]), "Tool Shank": pick(["20 × 20 mm", "25 × 25 mm"]), "Indexing Time": "0.2 s (adjacent)" }),
    compat: () => ({ machineModels: some(LATHE_MODELS, 1, 2) }),
    price: [80000, 400000], weight: 2,
  },
  {
    sub: "tool-changer-arm", group: "turret-atc", pool: "turret", label: "ATC Arm", brands: ["generic", "posa"], code: "AT",
    title: (b, s) => `${s.Taper} ATC Double Arm`,
    specs: () => ({ Taper: pick(["BT40", "BT30"]), Type: "Double-arm tool changer", "Compatible Magazine": `${pick([20, 24, 30])}-tool`, "Tool-to-tool": "1.5 s" }),
    compat: () => ({ machineModels: some(VMC_MODELS, 1, 3) }),
    price: [25000, 95000], weight: 2,
  },
  {
    sub: "tool-magazine", group: "turret-atc", pool: "turret", label: "Tool Magazine", brands: ["generic"], code: "TM",
    title: (b, s) => `${s.Capacity} ${s.Taper} Tool Magazine`,
    specs: () => ({ Capacity: `${pick([20, 24, 30])}-tool`, Taper: pick(["BT40", "BT30"]), Type: pick(["Umbrella", "Arm type (disc)"]), Drive: "Geared motor with sensors" }),
    compat: () => ({ machineModels: some(VMC_MODELS, 1, 2) }),
    price: [60000, 250000], weight: 1,
  },
  {
    sub: "atc-sensors", group: "turret-atc", pool: "sensor", label: "ATC Pot Sensor Kit", brands: ["omron", "autonics"], code: "AS",
    title: (b) => `${brandName(b)} ATC Pot Sensor Kit`,
    specs: () => ({ Type: "Inductive proximity (M12)", Output: "PNP NO", Voltage: "12–24 V DC", "Kit Includes": `${pick([2, 3, 4])} sensors + brackets` }),
    compat: () => ({ machineModels: some(VMC_MODELS, 1, 3) }),
    price: [2000, 9000], multiUnit: true, weight: 1,
  },
  // Sensors
  {
    sub: "proximity-sensor", group: "sensors-automation", pool: "sensor", label: "Proximity Sensor", brands: ["omron", "autonics", "schneider"], code: "PX",
    title: (b, s) => `${brandName(b)} ${s.Size} Inductive Proximity Sensor`,
    specs: () => ({ Size: pick(["M8", "M12", "M18"]), Type: "Inductive", "Sensing Range": `${pick([2, 4, 8])} mm`, Output: pick(["PNP NO", "NPN NO"]), Voltage: "12–24 V DC" }),
    compat: () => undefined,
    price: [600, 4000], multiUnit: true, weight: 3,
  },
  {
    sub: "limit-switch", group: "sensors-automation", pool: "sensor", label: "Limit Switch", brands: ["omron", "schneider"], code: "LS",
    title: (b, s) => `${brandName(b)} ${s.Actuator} Limit Switch`,
    specs: () => ({ Actuator: pick(["Roller lever", "Plunger", "Roller plunger"]), Contacts: "1 NO + 1 NC", Rating: "10 A, 250 V AC", Protection: "IP67" }),
    compat: () => undefined,
    price: [800, 6000], multiUnit: true, weight: 2,
  },
  {
    sub: "encoder", group: "sensors-automation", pool: "sensor", label: "Encoder", brands: ["fanuc", "heidenhain", "autonics"], code: "EN",
    title: (b, s) => `${brandName(b)} ${s.Type} Encoder`,
    specs: () => ({ Type: pick(["Rotary absolute", "Rotary incremental", "Motor feedback (pulse coder)"]), Resolution: pick(["1,024 ppr", "2,500 ppr", "1M counts/rev", "16M counts/rev"]), Output: pick(["Serial", "Line driver", "TTL"]), Voltage: "5 V DC" }),
    compat: (b) => (b === "fanuc" ? { cncControls: some(FANUC_CTRL, 1, 3) } : undefined),
    price: [8000, 65000], weight: 3,
  },
  {
    sub: "linear-scale", group: "sensors-automation", pool: "sensor", label: "Linear Scale", brands: ["heidenhain", "generic"], code: "SC",
    title: (b, s) => `${brandName(b)} Linear Scale ${s["Measuring Length"]}`,
    specs: () => ({ "Measuring Length": `${pick([520, 720, 1020, 1240])} mm`, Accuracy: pick(["±3 µm", "±5 µm"]), Interface: pick(["EnDat 2.2", "1 Vpp", "TTL"]), Type: "Sealed glass scale" }),
    compat: () => ({ cncControls: ["FANUC 0i-MF", "Siemens 828D", "Heidenhain TNC 640"] }),
    price: [15000, 90000], weight: 2,
  },
  // Hydraulic & pneumatic
  {
    sub: "hydraulic-pump", group: "hydraulic-pneumatic", pool: "hydraulic", label: "Hydraulic Vane Pump", brands: ["yuken", "rexroth"], code: "HP",
    title: (b, s) => `${brandName(b)} Hydraulic Vane Pump ${s.Displacement}`,
    specs: () => ({ Type: "Variable displacement vane pump", Displacement: `${pick([8, 16, 22, 30])} cc/rev`, Pressure: `${pick([35, 70, 140])} bar`, Speed: "1,440 RPM", Mounting: "Foot / flange" }),
    compat: () => ({ machineBrands: ["Lathe & VMC hydraulic power packs"] }),
    price: [12000, 85000], weight: 3,
  },
  {
    sub: "solenoid-valve", group: "hydraulic-pneumatic", pool: "hydraulic", label: "Solenoid Valve", brands: ["yuken", "rexroth", "smc"], code: "SV",
    title: (b, s) => `${brandName(b)} ${s.Size} Solenoid Directional Valve`,
    specs: () => ({ Size: pick(["NG6 (CETOP 3)", "NG10 (CETOP 5)", "1/4\" pneumatic"]), Function: pick(["4/3 closed centre", "4/2 spring return", "5/2 single solenoid"]), Voltage: pick(["24 V DC", "220 V AC"]), "Max. Pressure": pick(["315 bar", "10 bar"]) }),
    compat: () => undefined,
    price: [2500, 25000], multiUnit: true, weight: 3,
  },
  {
    sub: "cylinders", group: "hydraulic-pneumatic", pool: "hydraulic", label: "Rotary Chuck Cylinder", brands: ["kitagawa", "generic"], code: "CY",
    title: (b, s) => `${brandName(b)} Rotary Chuck Cylinder ${s.Size}`,
    specs: () => ({ Size: `Ø${pick([100, 125, 150])} mm`, Type: "Through-hole hydraulic rotary cylinder", "Max. Pressure": "25 bar", "Max. Speed": `${pick([4500, 5500])} RPM` }),
    compat: () => ({ machineModels: some(LATHE_MODELS, 1, 2) }),
    price: [30000, 90000], weight: 2,
  },
  // Lubrication & cooling
  {
    sub: "lubrication-pump", group: "lubrication-cooling", pool: "lubrication", label: "Centralised Lubrication Unit", brands: ["lubsol", "generic"], code: "LU",
    title: (b, s) => `${brandName(b)} ${s.Capacity} Lubrication Unit`,
    specs: () => ({ Capacity: `${pick([2, 3, 4, 6])} L`, Type: pick(["Electric piston pump", "Gear pump, resistance system"]), Pressure: `${pick([15, 20, 30])} kgf/cm²`, Voltage: pick(["230 V AC", "24 V DC"]), "Level Switch": "Included" }),
    compat: () => ({ machineModels: some(VMC_MODELS, 1, 3), machineBrands: ["Most CNC lathes & VMCs"] }),
    price: [4000, 28000], multiUnit: true, weight: 3,
  },
  {
    sub: "coolant-pump", group: "lubrication-cooling", pool: "lubrication", label: "Coolant Pump", brands: ["generic", "lubsol"], code: "CL",
    title: (b, s) => `${s.Power} Coolant Pump (${s["Immersion Depth"]})`,
    specs: () => ({ Power: `${pick([0.1, 0.25, 0.37, 0.75])} kW`, Flow: `${pick([20, 40, 60, 100])} L/min`, "Immersion Depth": `${pick([120, 150, 200, 250])} mm`, Voltage: "415 V AC, 3-phase" }),
    compat: () => ({ machineBrands: ["Most CNC lathes & VMCs"] }),
    price: [3500, 22000], multiUnit: true, weight: 3,
  },
  // Electrical
  {
    sub: "contactors", group: "electrical-parts", pool: "electrical", label: "Contactor", brands: ["schneider", "siemens", "omron"], code: "CT",
    title: (b, s) => `${brandName(b)} ${s.Rating} Contactor`,
    specs: () => ({ Rating: `${pick([9, 12, 18, 25, 32])} A (AC-3)`, "Coil Voltage": pick(["24 V DC", "110 V AC", "230 V AC"]), Poles: "3-pole + 1 NO aux", Mounting: "DIN rail" }),
    compat: () => undefined,
    price: [900, 8000], multiUnit: true, weight: 3,
  },
  {
    sub: "relays", group: "electrical-parts", pool: "electrical", label: "Relay Module", brands: ["omron", "schneider"], code: "RL",
    title: (b, s) => `${brandName(b)} ${s["Coil Voltage"]} ${s.Type}`,
    specs: () => ({ Type: pick(["Interface relay module", "Slim relay (pack of 10)", "Safety relay"]), "Coil Voltage": "24 V DC", Contacts: pick(["1 C/O", "2 C/O"]), Rating: "6 A, 250 V AC" }),
    compat: () => undefined,
    price: [250, 6000], multiUnit: true, weight: 2,
  },
  {
    sub: "cooling-fans", group: "electrical-parts", pool: "electrical", label: "Panel Cooling Fan", brands: ["generic", "fanuc"], code: "FN",
    title: (b, s) => `${brandName(b)} ${s.Size} Cooling Fan`,
    specs: () => ({ Size: pick(["60 mm", "80 mm", "120 mm", "Spindle motor fan unit"]), Voltage: pick(["24 V DC", "200 V AC"]), Bearing: "Ball bearing" }),
    compat: (b) => (b === "fanuc" ? { cncControls: some(FANUC_CTRL, 1, 3) } : undefined),
    price: [800, 6000], multiUnit: true, weight: 2,
  },
  {
    sub: "cables", group: "electrical-parts", pool: "electrical", label: "Servo Cable Set", brands: ["fanuc", "siemens", "generic"], code: "CB",
    title: (b, s) => `${brandName(b)} Servo ${s.Type} ${s.Length}`,
    specs: () => ({ Type: pick(["Power & feedback cable set", "Encoder cable", "Power cable"]), Length: `${pick([5, 7, 10, 15])} m`, Rating: "Drag-chain rated, shielded" }),
    compat: (b) => ({ cncControls: some(ctrlFor(b === "generic" ? "fanuc" : b), 1, 2) }),
    price: [1500, 18000], multiUnit: true, weight: 2,
  },
  {
    sub: "transformers", group: "electrical-parts", pool: "electrical", label: "Control Transformer", brands: ["generic", "schneider"], code: "TF",
    title: (b, s) => `${s.Rating} Control Transformer ${s.Voltage}`,
    specs: () => ({ Rating: `${pick([1, 2, 3, 5, 7.5])} kVA`, Voltage: "415 V / 200 V AC, 3-phase", Type: "Isolation, dry type" }),
    compat: () => ({ machineBrands: ["Japanese-control machines needing 200 V supply"] }),
    price: [6000, 45000], weight: 1,
  },
];

function brandName(id: string) {
  return DEMO_BRANDS.find((b) => b.id === id)?.name ?? id;
}

/* ---------- generation ---------- */

const ANCHOR = Date.parse("2026-09-24T09:30:00+05:30");
const DAY = 86_400_000;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[×]/g, "x")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function weightedTemplate(): Template {
  const total = T.reduce((s, t) => s + t.weight, 0);
  let r = rand() * total;
  for (const t of T) {
    r -= t.weight;
    if (r <= 0) return t;
  }
  return T[0];
}

const NOTES: Record<PartCondition, string[]> = {
  new: [
    "Brand-new, unused part in original packing with the seller's standard warranty.",
    "New stock item. Bulk quantities can be discussed with the seller.",
  ],
  used: [
    "Used part removed from a working machine; tested before removal.",
    "Pre-owned spare in good working condition. Test video can be requested from the seller.",
  ],
  refurbished: [
    "Refurbished and bench-tested; worn components replaced.",
    "Reconditioned by the seller with a short service warranty.",
  ],
};

const roundPrice = (v: number) => (v >= 100000 ? Math.round(v / 1000) * 1000 : v >= 10000 ? Math.round(v / 500) * 500 : Math.round(v / 50) * 50);

function buildParts(count: number): Part[] {
  const parts: Part[] = [];
  const used = new Set<string>();

  for (let i = 0; i < count; i++) {
    const t = i < T.length ? T[i] : weightedTemplate(); // every template at least once
    const brand = pick(t.brands);
    const specs = t.specs(brand);
    const seller = DEMO_SELLERS[(i * 7 + Math.floor(rand() * 5)) % DEMO_SELLERS.length];
    const condition: PartCondition = rand() < 0.45 ? "new" : rand() < 0.7 ? "used" : "refurbished";

    const base = between(t.price[0], t.price[1]);
    const factor = condition === "new" ? 1 : condition === "refurbished" ? 0.62 : 0.45;
    const priceType: PriceType = rand() < 0.15 ? "on_request" : rand() < 0.55 ? "negotiable" : "fixed";
    const price = priceType === "on_request" ? undefined : roundPrice(base * factor);

    const title = t.title(brand, specs);
    let slug = slugify(`${brand === "generic" ? "" : brandName(brand)} ${title.replace(brandName(brand), "")}`);
    while (used.has(slug)) slug = `${slug}-${i}`;
    used.add(slug);

    const partNumber = `${t.code}-${int(1000, 9899)}-${pick(["A", "B", "C", "D"])}${int(1, 9)}`;
    const quantity = condition === "new" && t.multiUnit ? pick([2, 5, 10, 20, 25]) : 1;
    const created = ANCHOR - int(1, 150) * DAY - int(0, 8) * 3_600_000;
    const updated = Math.min(ANCHOR, created + int(0, 40) * DAY);
    const city = CITIES.find((c) => c.slug === seller.location.city && c.districtSlug === seller.location.district);

    parts.push({
      id: `p${String(i + 1).padStart(3, "0")}`,
      slug,
      title,
      categoryId: t.group,
      subcategoryId: t.sub,
      brandId: brand,
      model: undefined,
      partNumber,
      condition,
      price,
      priceType,
      currency: "INR",
      quantity,
      availability: rand() < 0.07 ? "sold" : "in_stock",
      images: imagesFor(t.pool, i),
      description: [
        `${title} listed by ${seller.name}${city ? `, ${city.name}` : ""}.`,
        pick(NOTES[condition]),
        "Confirm the exact part number, compatibility and condition with the seller before buying.",
      ].join(" "),
      specifications: {
        Brand: brandName(brand),
        "Part Number": partNumber,
        ...specs,
      },
      compatibility: t.compat(brand),
      location: { ...seller.location },
      sellerId: seller.id,
      featured: false,
      createdAt: new Date(created).toISOString(),
      updatedAt: new Date(updated).toISOString(),
      isDemo: true,
    });
  }

  // Feature a spread of in-stock parts across the main groups
  const seen = new Set<string>();
  for (const p of parts) {
    if (p.availability === "in_stock" && p.price !== undefined && !seen.has(p.categoryId) && seen.size < 8) {
      p.featured = true;
      seen.add(p.categoryId);
    }
  }
  return parts;
}

export const DEMO_PARTS: Part[] = buildParts(96);
