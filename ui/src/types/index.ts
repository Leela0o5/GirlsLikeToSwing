/**
 * Shared domain types. These mirror the shapes we expect from the future
 * backend API, so swapping mock services for real ones needs no UI changes.
 */

export type Trend = 'up' | 'down' | 'flat';
export type Tone = 'positive' | 'warning' | 'critical' | 'neutral';
export type Priority = 'High' | 'Medium' | 'Low';
export type RiskLevel = 'Low' | 'Moderate' | 'High';

export type KpiIcon =
  | 'assessed'
  | 'health'
  | 'tradein'
  | 'attention'
  | 'soc'
  | 'range'
  | 'life'
  | 'temperature'
  | 'tickets'
  | 'inspection'
  | 'alert'
  | 'completed'
  | 'listings'
  | 'verified'
  | 'value'
  | 'charging';

export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  unit?: string;
  icon: KpiIcon;
  /** e.g. "+12% vs last month" */
  delta: string;
  trend: Trend;
  tone: Tone;
}

export interface DealerPerformance {
  score: number;
  maxScore: number;
  grade: string;
  gradeLabel: string;
  summary: string;
  appraisalCompletion: number;
  peakScore: number;
  breakdown: { label: string; value: number }[];
}

export interface DealershipLocation {
  id: string;
  code: string;
  name: string;
  city: string;
  /** Position on the illustrative map, as % of width/height */
  x: number;
  y: number;
  vehiclesOnLot: number;
  status: 'online' | 'syncing' | 'offline';
  isHub?: boolean;
}

export type TrendMetric = 'soh' | 'range' | 'capacity';

export interface TrendPoint {
  month: string;
  actual: number | null;
  forecast: number | null;
}

export interface TrendSeries {
  metric: TrendMetric;
  label: string;
  unit: string;
  domain: [number, number];
  points: TrendPoint[];
}

export interface Recommendation {
  id: string;
  title: string;
  summary: string;
  priority: Priority;
  timeline?: string;
  impact?: string;
  ctaLabel: string;
  icon: 'thermometer' | 'zap' | 'calendar';
  affectedVehicleIds: string[];
  steps: string[];
}

export interface Vehicle {
  id: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  odometerMiles: number;
  sohPercent: number;
  socPercent: number;
  estRangeMiles: number;
  risk: RiskLevel;
  status: 'In stock' | 'Trade-in pending' | 'Needs attention' | 'Assessed';
  dealershipId: string;
}

export interface BatteryPassport {
  id: string;
  vehicleId: string;
  vehicle: Vehicle;
  batterySerial: string;
  chemistry: string;
  nominalCapacityKwh: number;
  usableCapacityKwh: number;
  cycleCount: number;
  fastChargeShare: number;
  avgCellTempC: number;
  estTradeInValue: number;
  estLifeRemaining: string;
  issuedAt: string;
  history: { date: string; event: string; detail: string }[];
  cellBalance: { module: string; voltage: number }[];
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  tone: Tone;
  read: boolean;
}

export interface DealerUser {
  name: string;
  role: string;
  dealership: string;
  initials: string;
}

export interface DealerDashboardData {
  kpis: KpiMetric[];
  performance: DealerPerformance;
  locations: DealershipLocation[];
  recommendations: Recommendation[];
  featuredPassport: BatteryPassport;
}

export * from './domain';
