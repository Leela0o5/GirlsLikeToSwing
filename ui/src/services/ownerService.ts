import type {
  BatteryAlert,
  BatteryPassport,
  ChargingSummary,
  OwnerVehicleRegistration,
  ServiceAppointment,
  Valuation,
} from '@/types';
import {
  OWNER_VEHICLE_ID,
  buildCharging,
  featuredPassportMock,
  ownerAlertsMock,
  ownerAppointmentsMock,
  ownerRegistrationMock,
  ownerValuationMock,
} from '@/mocks';
import { mockRequest } from './apiClient';
import { createStore, mockMutation } from './mockStore';
import { buildVehicleBundle, getVehicleSync, type VehicleBundle } from './vehicleService';

export interface OwnerOverview extends VehicleBundle {
  registration: OwnerVehicleRegistration;
  charging: ChargingSummary;
  valuation: Valuation;
  passport: BatteryPassport;
}

// TODO(backend): GET /api/owner/vehicle
export function getOwnerOverview(): Promise<OwnerOverview> {
  const vehicle = getVehicleSync(OWNER_VEHICLE_ID)!;
  return mockRequest({
    ...buildVehicleBundle(vehicle),
    registration: ownerRegistrationMock,
    charging: buildCharging(vehicle),
    valuation: ownerValuationMock,
    passport: featuredPassportMock,
  });
}

/* ---------- mutable: alerts & appointments ---------- */

export const ownerAlertsStore = createStore<BatteryAlert[]>(structuredClone(ownerAlertsMock));
export const ownerAppointmentsStore = createStore<ServiceAppointment[]>(structuredClone(ownerAppointmentsMock));

// TODO(backend): POST /api/owner/alerts/:id/acknowledge
export function acknowledgeOwnerAlert(id: string) {
  return mockMutation(ownerAlertsStore, (alerts) => alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
}

// TODO(backend): POST /api/owner/appointments
export function requestServiceAppointment(input: Omit<ServiceAppointment, 'id' | 'status'>) {
  return mockMutation(
    ownerAppointmentsStore,
    (list) => [{ ...input, id: `ap-${Date.now()}`, status: 'Requested' as const }, ...list],
    400,
  );
}

/**
 * Indicative "what-if" valuation. Simple linear demo formula, NOT a pricing model.
 */
export function indicativeValue(base: Valuation, odometer: number, soh: number, currentOdometer: number, currentSoh: number) {
  const mid = base.mid + (currentOdometer - odometer) * 0.08 + (soh - currentSoh) * 350;
  const rounded = Math.max(2000, Math.round(mid / 50) * 50);
  return { low: Math.round((rounded * 0.94) / 50) * 50, mid: rounded, high: Math.round((rounded * 1.06) / 50) * 50 };
}
