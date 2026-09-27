import type { City, Country, District, State } from "@/lib/types";

/**
 * India location hierarchy: Country → State/UT → District → City.
 *
 * All 36 states and union territories are listed. Districts and cities are
 * seeded for the main manufacturing regions; add more rows (or load them
 * from a backend) and every location page works without code changes.
 */

export const INDIA: Country = { code: "IN", slug: "india", name: "India" };

function st(slug: string, name: string, tagline?: string, kind: State["kind"] = "state"): State {
  return { slug, name, countryCode: "IN", kind, tagline };
}

export const STATES: State[] = [
  st("andhra-pradesh", "Andhra Pradesh", "Visakhapatnam & Sri City industrial corridors"),
  st("arunachal-pradesh", "Arunachal Pradesh"),
  st("assam", "Assam"),
  st("bihar", "Bihar"),
  st("chhattisgarh", "Chhattisgarh"),
  st("goa", "Goa"),
  st("gujarat", "Gujarat", "Machine tools, auto parts & engineering clusters"),
  st("haryana", "Haryana", "Automotive and auto-component manufacturing"),
  st("himachal-pradesh", "Himachal Pradesh"),
  st("jharkhand", "Jharkhand"),
  st("karnataka", "Karnataka", "Aerospace, machine tools & precision engineering"),
  st("kerala", "Kerala"),
  st("madhya-pradesh", "Madhya Pradesh", "Pithampur & Indore manufacturing belts"),
  st("maharashtra", "Maharashtra", "Pune, Mumbai & Aurangabad engineering hubs"),
  st("manipur", "Manipur"),
  st("meghalaya", "Meghalaya"),
  st("mizoram", "Mizoram"),
  st("nagaland", "Nagaland"),
  st("odisha", "Odisha"),
  st("punjab", "Punjab", "Ludhiana's machine-tool and fastener industry"),
  st("rajasthan", "Rajasthan", "Bhiwadi, Jaipur & Jodhpur industrial areas"),
  st("sikkim", "Sikkim"),
  st("tamil-nadu", "Tamil Nadu", "Chennai auto corridor & Coimbatore pumps and motors"),
  st("telangana", "Telangana", "Hyderabad aerospace & defence manufacturing"),
  st("tripura", "Tripura"),
  st("uttar-pradesh", "Uttar Pradesh", "Noida, Ghaziabad & Kanpur industrial zones"),
  st("uttarakhand", "Uttarakhand"),
  st("west-bengal", "West Bengal", "Howrah's heavy engineering tradition"),
  st("andaman-and-nicobar-islands", "Andaman and Nicobar Islands", undefined, "union-territory"),
  st("chandigarh", "Chandigarh", undefined, "union-territory"),
  st("dadra-and-nagar-haveli-and-daman-and-diu", "Dadra and Nagar Haveli and Daman and Diu", undefined, "union-territory"),
  st("delhi", "Delhi NCR", "Okhla, Bawana & NCR manufacturing", "union-territory"),
  st("jammu-and-kashmir", "Jammu and Kashmir", undefined, "union-territory"),
  st("ladakh", "Ladakh", undefined, "union-territory"),
  st("lakshadweep", "Lakshadweep", undefined, "union-territory"),
  st("puducherry", "Puducherry", undefined, "union-territory"),
];

/** [stateSlug, districtSlug, districtName, cities[[slug, name, isHub?]]] */
type Row = [string, string, string, [string, string, boolean?][]];

const ROWS: Row[] = [
  // Gujarat
  ["gujarat", "rajkot", "Rajkot", [["rajkot", "Rajkot", true], ["gondal", "Gondal"], ["jetpur", "Jetpur"], ["shapar", "Shapar"]]],
  ["gujarat", "ahmedabad", "Ahmedabad", [["ahmedabad", "Ahmedabad", true], ["sanand", "Sanand"], ["changodar", "Changodar"]]],
  ["gujarat", "vadodara", "Vadodara", [["vadodara", "Vadodara"], ["savli", "Savli"]]],
  ["gujarat", "surat", "Surat", [["surat", "Surat"], ["hazira", "Hazira"]]],
  ["gujarat", "morbi", "Morbi", [["morbi", "Morbi"]]],
  ["gujarat", "jamnagar", "Jamnagar", [["jamnagar", "Jamnagar"]]],
  ["gujarat", "bhavnagar", "Bhavnagar", [["bhavnagar", "Bhavnagar"]]],
  ["gujarat", "mehsana", "Mehsana", [["mehsana", "Mehsana"], ["kadi", "Kadi"]]],
  ["gujarat", "kutch", "Kutch", [["gandhidham", "Gandhidham"]]],
  // Maharashtra
  ["maharashtra", "pune", "Pune", [["pune", "Pune", true], ["pimpri-chinchwad", "Pimpri-Chinchwad"], ["chakan", "Chakan"]]],
  ["maharashtra", "mumbai", "Mumbai", [["mumbai", "Mumbai", true]]],
  ["maharashtra", "thane", "Thane", [["thane", "Thane"], ["bhiwandi", "Bhiwandi"], ["vasai-virar", "Vasai-Virar"]]],
  ["maharashtra", "nashik", "Nashik", [["nashik", "Nashik"], ["ambad", "Ambad"]]],
  ["maharashtra", "chhatrapati-sambhajinagar", "Chhatrapati Sambhajinagar", [["aurangabad", "Aurangabad", true], ["waluj", "Waluj"]]],
  ["maharashtra", "nagpur", "Nagpur", [["nagpur", "Nagpur"]]],
  ["maharashtra", "kolhapur", "Kolhapur", [["kolhapur", "Kolhapur"]]],
  // Tamil Nadu
  ["tamil-nadu", "chennai", "Chennai", [["chennai", "Chennai", true], ["ambattur", "Ambattur"], ["guindy", "Guindy"]]],
  ["tamil-nadu", "kancheepuram", "Kancheepuram", [["sriperumbudur", "Sriperumbudur"]]],
  ["tamil-nadu", "coimbatore", "Coimbatore", [["coimbatore", "Coimbatore", true]]],
  ["tamil-nadu", "krishnagiri", "Krishnagiri", [["hosur", "Hosur"]]],
  ["tamil-nadu", "madurai", "Madurai", [["madurai", "Madurai"]]],
  ["tamil-nadu", "salem", "Salem", [["salem", "Salem"]]],
  // Karnataka
  ["karnataka", "bengaluru-urban", "Bengaluru Urban", [["bengaluru", "Bengaluru", true], ["peenya", "Peenya"]]],
  ["karnataka", "mysuru", "Mysuru", [["mysuru", "Mysuru"]]],
  ["karnataka", "belagavi", "Belagavi", [["belagavi", "Belagavi"]]],
  ["karnataka", "dharwad", "Dharwad", [["hubballi", "Hubballi"]]],
  // Haryana
  ["haryana", "faridabad", "Faridabad", [["faridabad", "Faridabad", true]]],
  ["haryana", "gurugram", "Gurugram", [["gurugram", "Gurugram", true], ["manesar", "Manesar"]]],
  ["haryana", "sonipat", "Sonipat", [["kundli", "Kundli"]]],
  ["haryana", "panipat", "Panipat", [["panipat", "Panipat"]]],
  // Punjab
  ["punjab", "ludhiana", "Ludhiana", [["ludhiana", "Ludhiana", true]]],
  ["punjab", "jalandhar", "Jalandhar", [["jalandhar", "Jalandhar"]]],
  ["punjab", "sahibzada-ajit-singh-nagar", "Sahibzada Ajit Singh Nagar", [["mohali", "Mohali"]]],
  ["punjab", "amritsar", "Amritsar", [["amritsar", "Amritsar"]]],
  // Telangana
  ["telangana", "hyderabad", "Hyderabad", [["hyderabad", "Hyderabad", true]]],
  ["telangana", "medchal-malkajgiri", "Medchal–Malkajgiri", [["kukatpally", "Kukatpally"], ["balanagar", "Balanagar"]]],
  ["telangana", "sangareddy", "Sangareddy", [["patancheru", "Patancheru"]]],
  // Rajasthan
  ["rajasthan", "jaipur", "Jaipur", [["jaipur", "Jaipur"]]],
  ["rajasthan", "alwar", "Alwar", [["bhiwadi", "Bhiwadi"], ["neemrana", "Neemrana"]]],
  ["rajasthan", "jodhpur", "Jodhpur", [["jodhpur", "Jodhpur"]]],
  ["rajasthan", "udaipur", "Udaipur", [["udaipur", "Udaipur"]]],
  // Delhi NCR
  ["delhi", "new-delhi", "New Delhi", [["new-delhi", "New Delhi"]]],
  ["delhi", "south-east-delhi", "South East Delhi", [["okhla", "Okhla"]]],
  ["delhi", "north-west-delhi", "North West Delhi", [["bawana", "Bawana"]]],
  // Uttar Pradesh
  ["uttar-pradesh", "gautam-buddha-nagar", "Gautam Buddha Nagar", [["noida", "Noida"], ["greater-noida", "Greater Noida"]]],
  ["uttar-pradesh", "ghaziabad", "Ghaziabad", [["ghaziabad", "Ghaziabad"]]],
  ["uttar-pradesh", "kanpur-nagar", "Kanpur Nagar", [["kanpur", "Kanpur"]]],
  ["uttar-pradesh", "lucknow", "Lucknow", [["lucknow", "Lucknow"]]],
  // Others
  ["andhra-pradesh", "visakhapatnam", "Visakhapatnam", [["visakhapatnam", "Visakhapatnam"]]],
  ["madhya-pradesh", "indore", "Indore", [["indore", "Indore"]]],
  ["madhya-pradesh", "dhar", "Dhar", [["pithampur", "Pithampur"]]],
  ["west-bengal", "kolkata", "Kolkata", [["kolkata", "Kolkata"]]],
  ["west-bengal", "howrah", "Howrah", [["howrah", "Howrah"]]],
];

export const DISTRICTS: District[] = ROWS.map(([stateSlug, slug, name]) => ({ stateSlug, slug, name }));

export const CITIES: City[] = ROWS.flatMap(([stateSlug, districtSlug, , cities]) =>
  cities.map(([slug, name, isHub]) => ({ slug, name, districtSlug, stateSlug, isHub: !!isHub })),
);

/** States featured in "Find Machines Near You", in order */
export const FEATURED_STATE_SLUGS = [
  "gujarat",
  "maharashtra",
  "tamil-nadu",
  "karnataka",
  "haryana",
  "punjab",
  "telangana",
  "rajasthan",
  "delhi",
  "uttar-pradesh",
];

/** "Popular manufacturing hubs", in order: [state, district, city] */
export const HUB_CITIES: [string, string, string][] = [
  ["gujarat", "rajkot", "rajkot"],
  ["gujarat", "ahmedabad", "ahmedabad"],
  ["maharashtra", "pune", "pune"],
  ["maharashtra", "mumbai", "mumbai"],
  ["karnataka", "bengaluru-urban", "bengaluru"],
  ["tamil-nadu", "chennai", "chennai"],
  ["tamil-nadu", "coimbatore", "coimbatore"],
  ["telangana", "hyderabad", "hyderabad"],
  ["haryana", "faridabad", "faridabad"],
  ["haryana", "gurugram", "gurugram"],
  ["punjab", "ludhiana", "ludhiana"],
  ["maharashtra", "chhatrapati-sambhajinagar", "aurangabad"],
];
