import type { BatteryReport, Listing } from '@/types';
import { listingsMock } from '@/mocks';
import { mockRequest } from './apiClient';
import { createStore } from './mockStore';
import { buildVehicleBundle } from './vehicleService';

export const MAX_COMPARE = 3;

// TODO(backend): GET /api/listings
export function getListings(): Promise<Listing[]> {
  return mockRequest(listingsMock, 400);
}

export function getListingSync(id: string): Listing | undefined {
  return listingsMock.find((l) => l.id === id);
}

// TODO(backend): GET /api/listings/:id/battery-report
export function getBatteryReport(listingId: string): Promise<BatteryReport | null> {
  const listing = getListingSync(listingId);
  if (!listing) return mockRequest(null);
  const bundle = buildVehicleBundle(listing.vehicle);
  return mockRequest({
    listing,
    telemetry: bundle.telemetry,
    degradation: bundle.degradation,
    serviceHistory: bundle.serviceHistory,
  });
}

/* ---------- buyer preferences (saved + compare), persisted per browser ---------- */

export interface BuyerPrefs {
  saved: string[];
  compare: string[];
}

export const buyerPrefsStore = createStore<BuyerPrefs>({ saved: ['lst-008'], compare: [] }, 'evbp.buyerPrefs.v1');

export function toggleSaved(id: string) {
  buyerPrefsStore.set((p) => ({ ...p, saved: p.saved.includes(id) ? p.saved.filter((x) => x !== id) : [...p.saved, id] }));
}

/** Adding to a full compare list is a no-op; the UI disables the button in that case. */
export function toggleCompare(id: string) {
  const { compare } = buyerPrefsStore.get();
  if (compare.includes(id)) {
    buyerPrefsStore.set((p) => ({ ...p, compare: compare.filter((x) => x !== id) }));
    return;
  }
  if (compare.length >= MAX_COMPARE) return;
  buyerPrefsStore.set((p) => ({ ...p, compare: [...compare, id] }));
}

export function clearCompare() {
  buyerPrefsStore.set((p) => ({ ...p, compare: [] }));
}

export function getAllListingsSync(): Listing[] {
  return listingsMock;
}
