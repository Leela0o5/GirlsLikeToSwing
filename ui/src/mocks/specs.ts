import type { VehicleSpecs } from '@/types';

/** DEMO DATA — approximate, illustrative model specifications. */
export const specsByModel: Record<string, VehicleSpecs> = {
  'Tesla Model 3': { batteryKwh: 82, drivetrain: 'AWD', motor: 'Dual motor', maxDcChargeKw: 250, epaRangeNewMiles: 358, bodyType: 'Sedan', seats: 5, msrpUsd: 47000, chemistry: 'NCA (Nickel Cobalt Aluminium)' },
  'Hyundai Ioniq 5': { batteryKwh: 77.4, drivetrain: 'AWD', motor: 'Dual motor', maxDcChargeKw: 235, epaRangeNewMiles: 256, bodyType: 'Crossover', seats: 5, msrpUsd: 52000, chemistry: 'NMC (Nickel Manganese Cobalt)' },
  'Ford Mustang Mach-E': { batteryKwh: 88, drivetrain: 'AWD', motor: 'Dual motor', maxDcChargeKw: 150, epaRangeNewMiles: 270, bodyType: 'SUV', seats: 5, msrpUsd: 51000, chemistry: 'NMC (Nickel Manganese Cobalt)' },
  'Nissan Leaf': { batteryKwh: 62, drivetrain: 'FWD', motor: 'Single motor', maxDcChargeKw: 100, epaRangeNewMiles: 215, bodyType: 'Hatchback', seats: 5, msrpUsd: 38000, chemistry: 'NMC (Nickel Manganese Cobalt)' },
  'Tesla Model Y': { batteryKwh: 81, drivetrain: 'AWD', motor: 'Dual motor', maxDcChargeKw: 250, epaRangeNewMiles: 330, bodyType: 'SUV', seats: 5, msrpUsd: 53000, chemistry: 'NCA (Nickel Cobalt Aluminium)' },
  'Chevrolet Bolt EUV': { batteryKwh: 65, drivetrain: 'FWD', motor: 'Single motor', maxDcChargeKw: 55, epaRangeNewMiles: 247, bodyType: 'Crossover', seats: 5, msrpUsd: 34000, chemistry: 'NMC (Nickel Manganese Cobalt)' },
  'BMW i4': { batteryKwh: 83.9, drivetrain: 'RWD', motor: 'Single motor', maxDcChargeKw: 205, epaRangeNewMiles: 301, bodyType: 'Gran Coupe', seats: 5, msrpUsd: 56000, chemistry: 'NMC (Nickel Manganese Cobalt)' },
  'Kia EV6': { batteryKwh: 77.4, drivetrain: 'RWD', motor: 'Single motor', maxDcChargeKw: 235, epaRangeNewMiles: 310, bodyType: 'Crossover', seats: 5, msrpUsd: 49000, chemistry: 'NMC (Nickel Manganese Cobalt)' },
  'Volkswagen ID.4': { batteryKwh: 82, drivetrain: 'AWD', motor: 'Dual motor', maxDcChargeKw: 135, epaRangeNewMiles: 255, bodyType: 'SUV', seats: 5, msrpUsd: 46000, chemistry: 'NMC (Nickel Manganese Cobalt)' },
  'Rivian R1T': { batteryKwh: 135, drivetrain: 'AWD', motor: 'Quad motor', maxDcChargeKw: 220, epaRangeNewMiles: 314, bodyType: 'Pickup', seats: 5, msrpUsd: 79000, chemistry: 'NMC (Nickel Manganese Cobalt)' },
  'Tesla Model S': { batteryKwh: 75, drivetrain: 'AWD', motor: 'Dual motor', maxDcChargeKw: 120, epaRangeNewMiles: 259, bodyType: 'Sedan', seats: 5, msrpUsd: 75000, chemistry: 'NCA (Nickel Cobalt Aluminium)' },
  'Volvo XC40 Recharge': { batteryKwh: 78, drivetrain: 'AWD', motor: 'Dual motor', maxDcChargeKw: 150, epaRangeNewMiles: 223, bodyType: 'SUV', seats: 5, msrpUsd: 55000, chemistry: 'NMC (Nickel Manganese Cobalt)' },
};

const FALLBACK_SPECS: VehicleSpecs = {
  batteryKwh: 75, drivetrain: 'AWD', motor: 'Dual motor', maxDcChargeKw: 150, epaRangeNewMiles: 260, bodyType: 'Sedan', seats: 5, msrpUsd: 48000, chemistry: 'NMC (Nickel Manganese Cobalt)',
};

export function specsFor(v: { make: string; model: string }): VehicleSpecs {
  return specsByModel[`${v.make} ${v.model}`] ?? FALLBACK_SPECS;
}
