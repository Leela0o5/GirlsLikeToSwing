import type { Vehicle } from '@/types';

/** DEMO DATA — fictional inventory used across the dealer dashboard. */
export const vehiclesMock: Vehicle[] = [
  { id: 'veh-001', vin: '5YJ3E1EA1NF123456', year: 2022, make: 'Tesla', model: 'Model 3', trim: 'Long Range AWD', odometerMiles: 45000, sohPercent: 91, socPercent: 76, estRangeMiles: 259, risk: 'Low', status: 'Assessed', dealershipId: 'loc-02' },
  { id: 'veh-002', vin: 'KM8KRDAF4NU041872', year: 2022, make: 'Hyundai', model: 'Ioniq 5', trim: 'SEL AWD', odometerMiles: 31200, sohPercent: 94, socPercent: 64, estRangeMiles: 238, risk: 'Low', status: 'In stock', dealershipId: 'loc-01' },
  { id: 'veh-003', vin: '3FMTK3SU8MMA90211', year: 2021, make: 'Ford', model: 'Mustang Mach-E', trim: 'Premium', odometerMiles: 52800, sohPercent: 87, socPercent: 58, estRangeMiles: 214, risk: 'Moderate', status: 'Needs attention', dealershipId: 'loc-03' },
  { id: 'veh-004', vin: '1N4AZ1CP5LC310987', year: 2020, make: 'Nissan', model: 'Leaf', trim: 'SV Plus', odometerMiles: 61400, sohPercent: 79, socPercent: 81, estRangeMiles: 168, risk: 'High', status: 'Needs attention', dealershipId: 'loc-01' },
  { id: 'veh-005', vin: '7SAYGDEE3PF601245', year: 2023, make: 'Tesla', model: 'Model Y', trim: 'Long Range', odometerMiles: 18900, sohPercent: 97, socPercent: 88, estRangeMiles: 301, risk: 'Low', status: 'Trade-in pending', dealershipId: 'loc-04' },
  { id: 'veh-006', vin: '1G1FY6S07N4110563', year: 2022, make: 'Chevrolet', model: 'Bolt EUV', trim: 'Premier', odometerMiles: 27600, sohPercent: 93, socPercent: 49, estRangeMiles: 228, risk: 'Low', status: 'In stock', dealershipId: 'loc-02' },
  { id: 'veh-007', vin: 'WBY33AW07PCM40876', year: 2023, make: 'BMW', model: 'i4', trim: 'eDrive40', odometerMiles: 22300, sohPercent: 95, socPercent: 72, estRangeMiles: 268, risk: 'Low', status: 'Trade-in pending', dealershipId: 'loc-03' },
  { id: 'veh-008', vin: 'KNDC4DLC2N5034519', year: 2022, make: 'Kia', model: 'EV6', trim: 'Wind RWD', odometerMiles: 38700, sohPercent: 90, socPercent: 67, estRangeMiles: 279, risk: 'Low', status: 'Assessed', dealershipId: 'loc-04' },
  { id: 'veh-009', vin: 'WVGDMPE29MP017643', year: 2021, make: 'Volkswagen', model: 'ID.4', trim: 'Pro S', odometerMiles: 48100, sohPercent: 86, socPercent: 55, estRangeMiles: 214, risk: 'Moderate', status: 'Needs attention', dealershipId: 'loc-02' },
  { id: 'veh-010', vin: '7FCTGAAA6NN009874', year: 2022, make: 'Rivian', model: 'R1T', trim: 'Adventure', odometerMiles: 29400, sohPercent: 92, socPercent: 70, estRangeMiles: 289, risk: 'Low', status: 'In stock', dealershipId: 'loc-01' },
  { id: 'veh-011', vin: '5YJSA1E23HF198765', year: 2019, make: 'Tesla', model: 'Model S', trim: '75D', odometerMiles: 88200, sohPercent: 82, socPercent: 62, estRangeMiles: 212, risk: 'Moderate', status: 'Trade-in pending', dealershipId: 'loc-03' },
  { id: 'veh-012', vin: 'YV4ED3UR4N2765432', year: 2022, make: 'Volvo', model: 'XC40 Recharge', trim: 'Twin Ultimate', odometerMiles: 34500, sohPercent: 89, socPercent: 83, estRangeMiles: 199, risk: 'Low', status: 'Assessed', dealershipId: 'loc-04' },
];
