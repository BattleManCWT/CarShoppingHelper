/**
 * Lightweight, curated make/model catalog used to drive the Vehicle selector.
 * Not exhaustive — enough common US-market brands and models to label an
 * estimate without free-text typing. Users can still start from a preset.
 */

export const VEHICLE_CATALOG: Record<string, string[]> = {
  Acura: ["Integra", "TLX", "RDX", "MDX"],
  Audi: ["A3", "A4", "Q3", "Q5", "e-tron"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "i4"],
  Chevrolet: ["Malibu", "Equinox", "Traverse", "Silverado", "Bolt EV"],
  Ford: ["Escape", "Explorer", "F-150", "Mustang", "Mustang Mach-E"],
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "Odyssey"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Ioniq 5"],
  Jeep: ["Compass", "Cherokee", "Grand Cherokee", "Wrangler"],
  Kia: ["Forte", "K5", "Sportage", "Telluride", "EV6"],
  Lexus: ["ES", "IS", "NX", "RX"],
  Mazda: ["Mazda3", "CX-30", "CX-5", "CX-90"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE", "EQE"],
  Nissan: ["Sentra", "Altima", "Rogue", "Pathfinder", "Leaf"],
  Subaru: ["Impreza", "Legacy", "Crosstrek", "Forester", "Outback"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X"],
  Toyota: ["Corolla", "Camry", "RAV4", "Highlander", "Prius"],
  Volkswagen: ["Jetta", "Golf", "Tiguan", "Atlas", "ID.4"],
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
 * Relative depreciation factor per brand. 1.0 = the engine's baseline
 * depreciation curve (an average mainstream car). Below 1 = holds value better
 * (loses less); above 1 = depreciates faster than average. Rough,
 * resale-market-informed multipliers — not a guarantee for any single car.
 */
export const BRAND_DEPRECIATION: Record<string, number> = {
  Toyota: 0.85,
  Honda: 0.88,
  Subaru: 0.88,
  Lexus: 0.9,
  Mazda: 0.95,
  Jeep: 0.95,
  Kia: 1.0,
  Hyundai: 1.0,
  Acura: 1.05,
  Tesla: 1.05,
  Ford: 1.05,
  Chevrolet: 1.05,
  Volkswagen: 1.1,
  Nissan: 1.12,
  BMW: 1.28,
  Audi: 1.28,
  "Mercedes-Benz": 1.3,
};

/**
 * Model-specific overrides for notable outliers (trucks/off-road that hold
 * value unusually well, and EVs that historically shed it fast). Keyed by
 * "Brand Model". When absent, the brand factor applies.
 */
export const MODEL_DEPRECIATION: Record<string, number> = {
  "Jeep Wrangler": 0.75,
  "Ford F-150": 0.85,
  "Chevrolet Silverado": 0.9,
  "Toyota RAV4": 0.8,
  "Toyota Prius": 0.82,
  "Honda CR-V": 0.85,
  "Ford Mustang Mach-E": 1.25,
  "Chevrolet Bolt EV": 1.35,
  "Nissan Leaf": 1.4,
  "Hyundai Ioniq 5": 1.25,
  "Kia EV6": 1.25,
  "Volkswagen ID.4": 1.3,
  "Tesla Model S": 1.15,
  "Tesla Model X": 1.15,
};

/**
 * Depreciation factor for a specific vehicle: a model override if we have one,
 * otherwise the brand factor, otherwise the neutral baseline (1.0).
 */
export function depreciationFactor(brand: string, model: string): number {
  const key = `${brand} ${model}`.trim();
  return MODEL_DEPRECIATION[key] ?? BRAND_DEPRECIATION[brand] ?? 1;
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
