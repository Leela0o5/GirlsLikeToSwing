/**
 * Domain types shared by the Owner, Buyer and Service portals.
 * Shapes mirror what the future backend is expected to return.
 */
import type { Tone, TrendPoint, Vehicle } from './index';

export type PortalId = 'dealer' | 'owner' | 'buyer' | 'service';

/* ---------------- Vehicle specs & telemetry ---------------- */

export interface VehicleSpecs {
  batteryKwh: number;
  drivetrain: string;
  motor: string;
  maxDcChargeKw: number;
  epaRangeNewMiles: number;
  bodyType: string;
  seats: number;
  msrpUsd: number;
  chemistry: string;
}

export interface TemperaturePoint {
  time: string;
  min: number;
  avg: number;
  max: number;
}

export interface ModuleVoltage {
  module: string;
  voltage: number;
}

export interface ChargingProfile {
  lastChargeType: 'AC' | 'DC';
  lastChargeDate: string;
  avgChargePowerKw: number;
  fastChargeShare: number;
  avgDepthOfDischarge: number;
  chargeLimitPct: number;
}

export interface BatteryTelemetry {
  vehicleId: string;
  lastUpdated: string;
  packVoltage: number;
  cellTempAvgC: number;
  cellTempMaxC: number;
  cellTempMinC: number;
  coolantTempC: number;
  tempHistory: TemperaturePoint[];
  moduleVoltages: ModuleVoltage[];
  charging: ChargingProfile;
}

export interface ChargingSession {
  id: string;
  date: string;
  location: string;
  type: 'AC' | 'DC';
  energyKwh: number;
  durationMin: number;
  startSoc: number;
  endSoc: number;
  peakTempC: number;
}

export interface WeeklyCharging {
  week: string;
  ac: number;
  dc: number;
  miles: number;
}

export interface ChargingSummary {
  weekly: WeeklyCharging[];
  sessions: ChargingSession[];
  monthEnergyKwh: number;
  monthSessions: number;
  efficiencyMiPerKwh: number;
  homeChargingShare: number;
}

/* ---------------- Service & alerts ---------------- */

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertCategory = 'temperature' | 'voltage' | 'charging' | 'health' | 'service';

export interface BatteryAlert {
  id: string;
  vehicleId: string;
  title: string;
  detail: string;
  severity: AlertSeverity;
  category: AlertCategory;
  createdAt: string;
  acknowledged: boolean;
  recommendation: string;
}

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  date: string;
  type: 'Battery inspection' | 'Routine maintenance' | 'Software update' | 'Coolant service' | 'Tyre service' | 'Warranty repair';
  center: string;
  summary: string;
  technician: string;
  sohAtService?: number;
}

export type TicketPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TicketStatus = 'Open' | 'In Progress' | 'Awaiting Parts' | 'Completed';

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface ActivityEntry {
  id: string;
  at: string;
  author: string;
  text: string;
}

export interface ServiceTicket {
  id: string;
  vehicleId: string;
  customer: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: string;
  createdAt: string;
  dueDate: string;
  alertIds: string[];
  checklist: ChecklistItem[];
  activity: ActivityEntry[];
  recommendedActions: string[];
}

export type InspectionStatus = 'Due' | 'Scheduled' | 'In Progress' | 'Passed' | 'Failed';

export interface Inspection {
  id: string;
  vehicleId: string;
  reason: string;
  dueDate: string;
  bay: string | null;
  status: InspectionStatus;
  priority: TicketPriority;
}

export interface TechnicianLoad {
  name: string;
  openTickets: number;
}

/* ---------------- Owner ---------------- */

export interface OwnerVehicleRegistration {
  vehicleId: string;
  plate: string;
  color: string;
  registeredOn: string;
  ownerSince: string;
  warrantyUntil: string;
  homeCharger: string;
}

export interface ValuationFactor {
  label: string;
  /** USD impact on value, positive or negative */
  impact: number;
}

export interface Valuation {
  vehicleId: string;
  low: number;
  mid: number;
  high: number;
  asOf: string;
  factors: ValuationFactor[];
  history: { month: string; value: number }[];
}

export interface ServiceAppointment {
  id: string;
  date: string;
  type: string;
  notes: string;
  status: 'Requested' | 'Confirmed';
}

/* ---------------- Buyer ---------------- */

export type VerificationStatus = 'Verified' | 'Pending' | 'Expired';

export interface Listing {
  id: string;
  vehicleId: string;
  vehicle: Vehicle;
  specs: VehicleSpecs;
  price: number;
  location: string;
  seller: string;
  sellerType: 'Dealer' | 'Private';
  listedOn: string;
  assessedOn: string;
  verification: VerificationStatus;
  passportId: string;
  estTradeInValue: number;
  estLifeRemaining: string;
  highlights: string[];
}

export interface BatteryReport {
  listing: Listing;
  telemetry: BatteryTelemetry;
  degradation: TrendPoint[];
  serviceHistory: ServiceRecord[];
}

/* ---------------- Cross-portal ---------------- */

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  to: string;
  badge?: { label: string; tone: Tone };
}
