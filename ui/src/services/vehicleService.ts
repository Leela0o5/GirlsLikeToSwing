import type { BatteryTelemetry, ServiceRecord, TrendPoint, Vehicle, VehicleSpecs } from '@/types';
import {
  buildDegradation,
  buildServiceHistory,
  buildTelemetry,
  passportIdFor,
  specsFor,
  vehiclesMock,
} from '@/mocks';
import { mockRequest } from './apiClient';

export function matchesVehicleQuery(v: Vehicle, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [v.make, v.model, v.trim, String(v.year), v.vin, v.status, v.risk]
    .join(' ')
    .toLowerCase()
    .includes(q);
}

// TODO(backend): GET /api/vehicles?q=
export function searchVehicles(query = ''): Promise<Vehicle[]> {
  return mockRequest(vehiclesMock.filter((v) => matchesVehicleQuery(v, query)), 250);
}

export function getVehiclesByIds(ids: string[]): Vehicle[] {
  return vehiclesMock.filter((v) => ids.includes(v.id));
}

export function getVehicleSync(id: string): Vehicle | undefined {
  return vehiclesMock.find((v) => v.id === id);
}

export interface VehicleBundle {
  vehicle: Vehicle;
  specs: VehicleSpecs;
  telemetry: BatteryTelemetry;
  serviceHistory: ServiceRecord[];
  degradation: TrendPoint[];
  passportId: string;
}

export function buildVehicleBundle(vehicle: Vehicle): VehicleBundle {
  return {
    vehicle,
    specs: specsFor(vehicle),
    telemetry: buildTelemetry(vehicle),
    serviceHistory: buildServiceHistory(vehicle),
    degradation: buildDegradation(vehicle),
    passportId: passportIdFor(vehicle.id),
  };
}

// TODO(backend): GET /api/vehicles/:id/battery  (telemetry, history, degradation)
export function getVehicleBundle(id: string): Promise<VehicleBundle | null> {
  const vehicle = getVehicleSync(id);
  return mockRequest(vehicle ? buildVehicleBundle(vehicle) : null, 350);
}

export function getSohHistory(vehicle: Vehicle): TrendPoint[] {
  return buildDegradation(vehicle).filter((p) => p.actual !== null);
}
