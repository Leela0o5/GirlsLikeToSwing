import type { Listing, VerificationStatus } from '@/types';
import { vehiclesMock } from './vehicles';
import { specsFor } from './specs';
import { estimateLife, estimateTradeIn, passportIdFor } from './builders';
import { featuredPassportMock } from './dealerDashboard';

/* DEMO DATA — fictional marketplace listings built on the shared vehicle set. */

interface ListingMeta {
  location: string;
  seller: string;
  sellerType: Listing['sellerType'];
  listedOn: string;
  assessedOn: string;
  verification: VerificationStatus;
  markup: number;
  highlights: string[];
}

const META: Record<string, ListingMeta> = {
  'veh-001': { location: 'Columbus, OH', seller: 'State Auto Downtown', sellerType: 'Dealer', listedOn: '2026-11-12', assessedOn: '2026-11-10', verification: 'Verified', markup: 1.16, highlights: ['One previous owner', 'Full service history'] },
  'veh-002': { location: 'Columbus, OH', seller: 'State Auto Downtown', sellerType: 'Dealer', listedOn: '2026-11-08', assessedOn: '2026-11-05', verification: 'Verified', markup: 1.15, highlights: ['800V fast charging', 'Low mileage'] },
  'veh-003': { location: 'Dublin, OH', seller: 'State Auto Riverside', sellerType: 'Dealer', listedOn: '2026-10-30', assessedOn: '2026-10-28', verification: 'Pending', markup: 1.12, highlights: ['Premium trim', 'Inspection scheduled'] },
  'veh-004': { location: 'Columbus, OH', seller: 'Private seller', sellerType: 'Private', listedOn: '2026-10-22', assessedOn: '2026-04-11', verification: 'Expired', markup: 1.1, highlights: ['Budget friendly', 'City commuter'] },
  'veh-005': { location: 'Reynoldsburg, OH', seller: 'State Auto East', sellerType: 'Dealer', listedOn: '2026-11-15', assessedOn: '2026-11-14', verification: 'Verified', markup: 1.18, highlights: ['Like-new battery', 'Tow hitch'] },
  'veh-006': { location: 'Westerville, OH', seller: 'State Auto Northgate', sellerType: 'Dealer', listedOn: '2026-11-03', assessedOn: '2026-11-01', verification: 'Verified', markup: 1.14, highlights: ['Super Cruise', 'Great value'] },
  'veh-007': { location: 'Dublin, OH', seller: 'State Auto Riverside', sellerType: 'Dealer', listedOn: '2026-11-11', assessedOn: '2026-11-09', verification: 'Verified', markup: 1.17, highlights: ['M Sport package', 'Premium audio'] },
  'veh-008': { location: 'Reynoldsburg, OH', seller: 'State Auto East', sellerType: 'Dealer', listedOn: '2026-11-06', assessedOn: '2026-11-04', verification: 'Verified', markup: 1.15, highlights: ['Heat pump', 'Vehicle-to-load'] },
  'veh-009': { location: 'Westerville, OH', seller: 'Private seller', sellerType: 'Private', listedOn: '2026-10-25', assessedOn: '2026-10-20', verification: 'Pending', markup: 1.1, highlights: ['AWD', 'Panoramic roof'] },
  'veh-010': { location: 'Columbus, OH', seller: 'State Auto Downtown', sellerType: 'Dealer', listedOn: '2026-11-09', assessedOn: '2026-11-07', verification: 'Verified', markup: 1.16, highlights: ['Large pack', 'Off-road ready'] },
  'veh-011': { location: 'Dublin, OH', seller: 'Private seller', sellerType: 'Private', listedOn: '2026-10-18', assessedOn: '2026-10-15', verification: 'Verified', markup: 1.12, highlights: ['Free supercharging (transferable)', 'Air suspension'] },
  'veh-012': { location: 'Reynoldsburg, OH', seller: 'State Auto East', sellerType: 'Dealer', listedOn: '2026-11-13', assessedOn: '2026-11-12', verification: 'Verified', markup: 1.15, highlights: ['Compact SUV', 'Google built-in'] },
};

export const listingsMock: Listing[] = vehiclesMock.map((vehicle) => {
  const meta = META[vehicle.id];
  const tradeIn = vehicle.id === featuredPassportMock.vehicleId ? featuredPassportMock.estTradeInValue : estimateTradeIn(vehicle);
  return {
    id: `lst-${vehicle.id.replace('veh-', '')}`,
    vehicleId: vehicle.id,
    vehicle,
    specs: specsFor(vehicle),
    price: Math.round((tradeIn * meta.markup) / 100) * 100,
    location: meta.location,
    seller: meta.seller,
    sellerType: meta.sellerType,
    listedOn: meta.listedOn,
    assessedOn: meta.assessedOn,
    verification: meta.verification,
    passportId: passportIdFor(vehicle.id),
    estTradeInValue: tradeIn,
    estLifeRemaining: estimateLife(vehicle.sohPercent),
    highlights: meta.highlights,
  };
});
