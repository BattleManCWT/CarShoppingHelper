/**
 * Lightweight, curated make/model catalog used to drive the Vehicle selector.
 * Not exhaustive — enough common US-market brands and models to label an
 * estimate without free-text typing. Users can still start from a preset.
 */

export const VEHICLE_CATALOG: Record<string, string[]> = {
  Acura: ["ILX", "Integra", "TLX", "RLX", "RDX", "MDX", "NSX", "ZDX"],
  "Alfa Romeo": ["Giulia", "Stelvio", "Tonale", "4C"],
  Audi: [
    "A3",
    "A4",
    "A5",
    "A6",
    "A7",
    "A8",
    "Q3",
    "Q5",
    "Q7",
    "Q8",
    "TT",
    "R8",
    "e-tron",
    "Q4 e-tron",
    "e-tron GT",
  ],
  BMW: [
    "2 Series",
    "3 Series",
    "4 Series",
    "5 Series",
    "7 Series",
    "8 Series",
    "X1",
    "X2",
    "X3",
    "X4",
    "X5",
    "X6",
    "X7",
    "Z4",
    "i3",
    "i4",
    "i5",
    "i7",
    "iX",
  ],
  Buick: [
    "Cascada",
    "Regal",
    "LaCrosse",
    "Encore",
    "Encore GX",
    "Envista",
    "Envision",
    "Enclave",
  ],
  Cadillac: [
    "ATS",
    "CTS",
    "CT4",
    "CT5",
    "CT6",
    "XTS",
    "XT4",
    "XT5",
    "XT6",
    "Escalade",
    "Lyriq",
  ],
  Chevrolet: [
    "Spark",
    "Sonic",
    "Cruze",
    "Malibu",
    "Impala",
    "Camaro",
    "Corvette",
    "Trax",
    "Trailblazer",
    "Equinox",
    "Blazer",
    "Traverse",
    "Tahoe",
    "Suburban",
    "Colorado",
    "Silverado",
    "Volt",
    "Bolt EV",
    "Bolt EUV",
    "Blazer EV",
    "Equinox EV",
    "Silverado EV",
  ],
  Chrysler: ["300", "Pacifica", "Voyager"],
  Dodge: [
    "Charger",
    "Challenger",
    "Durango",
    "Journey",
    "Grand Caravan",
    "Hornet",
  ],
  Fiat: ["500", "500L", "500X", "124 Spider"],
  Ford: [
    "Fiesta",
    "Focus",
    "Fusion",
    "Taurus",
    "Mustang",
    "EcoSport",
    "Escape",
    "Edge",
    "Flex",
    "Explorer",
    "Bronco Sport",
    "Bronco",
    "Expedition",
    "Maverick",
    "Ranger",
    "F-150",
    "Mustang Mach-E",
    "F-150 Lightning",
  ],
  Genesis: ["G70", "G80", "G90", "GV60", "GV70", "GV80"],
  GMC: [
    "Terrain",
    "Acadia",
    "Yukon",
    "Canyon",
    "Sierra",
    "Hummer EV",
  ],
  Honda: [
    "Fit",
    "Civic",
    "Insight",
    "Accord",
    "Clarity",
    "HR-V",
    "CR-V",
    "Passport",
    "Pilot",
    "Ridgeline",
    "Odyssey",
    "Prologue",
  ],
  Hyundai: [
    "Accent",
    "Elantra",
    "Sonata",
    "Veloster",
    "Venue",
    "Kona",
    "Tucson",
    "Santa Fe",
    "Palisade",
    "Santa Cruz",
    "Kona Electric",
    "Ioniq",
    "Ioniq 5",
    "Ioniq 6",
  ],
  Infiniti: ["Q50", "Q60", "QX30", "QX50", "QX55", "QX60", "QX80"],
  Jaguar: ["XE", "XF", "F-TYPE", "E-PACE", "F-PACE", "I-PACE"],
  Jeep: [
    "Renegade",
    "Patriot",
    "Compass",
    "Cherokee",
    "Grand Cherokee",
    "Wrangler",
    "Gladiator",
    "Wagoneer",
    "Grand Wagoneer",
  ],
  Kia: [
    "Rio",
    "Forte",
    "Optima",
    "K5",
    "Cadenza",
    "K900",
    "Stinger",
    "Soul",
    "Seltos",
    "Niro",
    "Sportage",
    "Sorento",
    "Telluride",
    "Sedona",
    "Carnival",
    "EV6",
    "EV9",
  ],
  "Land Rover": [
    "Discovery Sport",
    "Discovery",
    "Defender",
    "Range Rover Evoque",
    "Range Rover Velar",
    "Range Rover Sport",
    "Range Rover",
  ],
  Lexus: [
    "CT",
    "IS",
    "ES",
    "GS",
    "LS",
    "RC",
    "LC",
    "UX",
    "NX",
    "RX",
    "TX",
    "GX",
    "LX",
    "RZ",
  ],
  Lincoln: [
    "MKZ",
    "Continental",
    "MKC",
    "Corsair",
    "MKX",
    "Nautilus",
    "Aviator",
    "Navigator",
  ],
  Lucid: ["Air", "Gravity"],
  Maserati: ["Ghibli", "Quattroporte", "GranTurismo", "Grecale", "Levante"],
  Mazda: [
    "Mazda3",
    "Mazda6",
    "MX-5 Miata",
    "CX-3",
    "CX-30",
    "CX-5",
    "CX-50",
    "CX-9",
    "CX-70",
    "CX-90",
    "MX-30",
  ],
  "Mercedes-Benz": [
    "A-Class",
    "CLA",
    "C-Class",
    "CLS",
    "E-Class",
    "S-Class",
    "GLA",
    "GLB",
    "GLC",
    "GLE",
    "GLS",
    "G-Class",
    "SL",
    "EQB",
    "EQE",
    "EQS",
  ],
  Mini: ["Cooper", "Clubman", "Countryman"],
  Mitsubishi: [
    "Mirage",
    "Lancer",
    "Eclipse Cross",
    "Outlander Sport",
    "Outlander",
    "Outlander PHEV",
  ],
  Nissan: [
    "Versa",
    "Sentra",
    "Altima",
    "Maxima",
    "370Z",
    "Z",
    "GT-R",
    "Juke",
    "Kicks",
    "Rogue Sport",
    "Rogue",
    "Murano",
    "Pathfinder",
    "Armada",
    "Frontier",
    "Titan",
    "Leaf",
    "Ariya",
  ],
  Polestar: ["1", "2", "3"],
  Porsche: [
    "718 Boxster",
    "718 Cayman",
    "911",
    "Panamera",
    "Macan",
    "Cayenne",
    "Taycan",
  ],
  Ram: ["1500", "2500", "3500", "ProMaster"],
  Rivian: ["R1T", "R1S"],
  Subaru: [
    "Impreza",
    "Legacy",
    "WRX",
    "BRZ",
    "Crosstrek",
    "Forester",
    "Outback",
    "Ascent",
    "Solterra",
  ],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
  Toyota: [
    "Yaris",
    "Corolla",
    "Camry",
    "Avalon",
    "Crown",
    "86",
    "GR86",
    "GR Corolla",
    "GR Supra",
    "Prius",
    "Mirai",
    "C-HR",
    "Corolla Cross",
    "RAV4",
    "Venza",
    "Highlander",
    "Grand Highlander",
    "4Runner",
    "Sequoia",
    "Land Cruiser",
    "Tacoma",
    "Tundra",
    "Sienna",
    "bZ4X",
  ],
  Volkswagen: [
    "Beetle",
    "Jetta",
    "Passat",
    "Arteon",
    "Golf",
    "Taos",
    "Tiguan",
    "Atlas Cross Sport",
    "Atlas",
    "ID.4",
    "ID. Buzz",
  ],
  Volvo: [
    "S60",
    "S90",
    "V60",
    "V90",
    "XC40",
    "XC60",
    "XC90",
    "C40 Recharge",
    "EX30",
    "EX90",
  ],
};

export const VEHICLE_BRANDS = Object.keys(VEHICLE_CATALOG);

/** Model years offered in the picker: next model year down through ~30 back. */
export function vehicleYears(now = new Date().getFullYear()): number[] {
  const newest = now + 1;
  const oldest = now - 30;
  const years: number[] = [];
  for (let y = newest; y >= oldest; y--) years.push(y);
  return years;
}

/**
 * Published 5-year depreciation (fraction of the vehicle's price lost after
 * 5 years), per brand. Calibrated to the iSeeCars 2026 depreciation study
 * (950k used-car sales, Mar 2025 – Feb 2026; industry average 41.8%) and the
 * KBB Best Resale Value rankings. Brand rows are informed estimates that
 * average the brand's lineup; model rows below override them with the study's
 * per-model figures. Estimates, not a guarantee for any single car.
 */
export const BRAND_FIVE_YEAR_DEPRECIATION: Record<string, number> = {
  Porsche: 0.30,
  Toyota: 0.33,
  Honda: 0.34,
  Subaru: 0.35,
  Lexus: 0.37,
  Mazda: 0.40,
  GMC: 0.40,
  Chevrolet: 0.42,
  Ford: 0.42,
  Jeep: 0.42,
  Ram: 0.44,
  Acura: 0.45,
  Dodge: 0.45,
  Hyundai: 0.45,
  Kia: 0.45,
  Mitsubishi: 0.48,
  Nissan: 0.48,
  Volkswagen: 0.48,
  Buick: 0.50,
  Chrysler: 0.50,
  Mini: 0.50,
  Cadillac: 0.52,
  Volvo: 0.52,
  BMW: 0.53,
  Genesis: 0.53,
  Audi: 0.54,
  Lincoln: 0.54,
  Fiat: 0.55,
  Infiniti: 0.55,
  "Mercedes-Benz": 0.55,
  Rivian: 0.55,
  Tesla: 0.55,
  "Alfa Romeo": 0.58,
  Jaguar: 0.58,
  "Land Rover": 0.58,
  Polestar: 0.60,
  Lucid: 0.62,
  Maserati: 0.62,
};

/**
 * Per-model 5-year depreciation, keyed by "Brand Model". The first group is
 * taken directly from the iSeeCars 2026 study's best/worst-retention lists;
 * the second group is informed estimates for well-known outliers the study
 * didn't enumerate. When absent, the brand figure applies.
 */
export const MODEL_FIVE_YEAR_DEPRECIATION: Record<string, number> = {
  // iSeeCars 2026 — best value retention
  "Porsche 718 Cayman": 0.096,
  "Porsche 911": 0.111,
  "Chevrolet Corvette": 0.187,
  "Toyota Tacoma": 0.199,
  "Toyota Tundra": 0.212,
  "Honda Civic": 0.229,
  "Subaru BRZ": 0.237,
  "Toyota GR Supra": 0.24,
  "Toyota RAV4": 0.252,
  "Toyota 4Runner": 0.255,
  "Lexus RC": 0.266,
  "Ford Mustang": 0.268,
  "Toyota Corolla": 0.276,
  "Toyota Sienna": 0.285,
  "Honda HR-V": 0.288,
  "Honda CR-V": 0.289,
  "Subaru Crosstrek": 0.291,
  "Subaru Impreza": 0.292,
  "Subaru WRX": 0.298,
  "Ford Ranger": 0.302,
  "Honda Accord": 0.305,
  "Mazda MX-5 Miata": 0.315,
  "Toyota Prius": 0.321,
  // iSeeCars 2026 — worst value retention
  "Nissan Leaf": 0.631,
  "Infiniti QX80": 0.628,
  "Volkswagen ID.4": 0.621,
  "Tesla Model S": 0.62,
  "Land Rover Range Rover": 0.617,
  "BMW 7 Series": 0.616,
  "Tesla Model X": 0.612,
  "Ford Mustang Mach-E": 0.608,
  "BMW 5 Series": 0.595,
  "Infiniti QX60": 0.583,
  "Land Rover Range Rover Sport": 0.583,
  "Audi Q5": 0.582,
  "Land Rover Discovery": 0.579,
  "Tesla Model Y": 0.578,
  "Audi A8": 0.576,
  "Audi Q7": 0.572,
  "BMW X5": 0.571,
  "Cadillac Escalade": 0.57,
  "Nissan Armada": 0.57,
  "Audi A7": 0.565,
  "Hyundai Kona Electric": 0.565,
  "Jaguar F-PACE": 0.565,
  "Ford Expedition": 0.563,
  "Lincoln Navigator": 0.563,
  // Informed estimates for notable outliers not in the study lists
  "Toyota Land Cruiser": 0.30,
  "Jeep Gladiator": 0.31,
  "GMC Canyon": 0.33,
  "Jeep Wrangler": 0.33,
  "Honda Ridgeline": 0.34,
  "Ford F-150": 0.40,
  "Chevrolet Silverado": 0.40,
  "GMC Sierra": 0.40,
  "Hyundai Ioniq 5": 0.55,
  "Kia EV6": 0.55,
  "Chevrolet Bolt EV": 0.58,
  "Ford F-150 Lightning": 0.58,
  "GMC Hummer EV": 0.58,
  "Jaguar I-PACE": 0.62,
};

/** Industry-average 5-year depreciation (iSeeCars 2026) — unknown-brand fallback. */
const AVERAGE_FIVE_YEAR_DEPRECIATION = 0.418;

/**
 * Published figures are losses against the vehicle's price; our depreciation
 * basis is the OTD price, which also bakes in ~8% taxes/fees that are gone the
 * moment you buy. Resale dollars are the same either way, so residual-vs-OTD =
 * residual-vs-price ÷ OTD_MARKUP.
 */
const OTD_MARKUP = 1.08;

/** The engine's baseline curve loses 60% of OTD by year 5 (DEPRECIATION_CURVE). */
const BASELINE_CURVE_FIVE_YEAR_LOSS = 0.6;

/** Published 5-year loss for a vehicle: model override → brand → industry average. */
export function publishedFiveYearLoss(brand: string, model: string): number {
  const key = `${brand} ${model}`.trim();
  return (
    MODEL_FIVE_YEAR_DEPRECIATION[key] ??
    BRAND_FIVE_YEAR_DEPRECIATION[brand] ??
    AVERAGE_FIVE_YEAR_DEPRECIATION
  );
}

/**
 * Scale applied to the engine's baseline depreciation curve so that its 5-year
 * point lands on this vehicle's study-based residual (converted to the OTD
 * basis). <1 holds value better than the baseline curve; >1 sheds it faster.
 */
export function depreciationFactor(brand: string, model: string): number {
  const residualVsPrice = 1 - publishedFiveYearLoss(brand, model);
  const lossVsOtd = 1 - residualVsPrice / OTD_MARKUP;
  return lossVsOtd / BASELINE_CURVE_FIVE_YEAR_LOSS;
}

/** Vehicle age in years, derived from the model year (never negative). */
export function vehicleAge(year: number, now = new Date().getFullYear()): number {
  return Math.max(0, now - year);
}

/** Build the display name shown in results from the structured selections. */
export function buildVehicleName(
  year: number,
  brand: string,
  model: string
): string {
  return [year, brand, model].filter(Boolean).join(" ").trim();
}
