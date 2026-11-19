/**
 * Deterministic generators for per-vehicle DEMO data. Everything is derived
 * from the vehicle record + a seeded PRNG, so the same vehicle always shows
 * the same numbers in every portal. Not a model of real battery physics.
 */
import type {
  BatteryPassport,
  BatteryTelemetry,
  ChargingSession,
  ChargingSummary,
  ServiceRecord,
  TrendPoint,
  Vehicle,
} from '@/types';
import { specsFor } from './specs';
import { estimateLife } from '@/utils/battery';

export { estimateLife };

/* ---------- seeded PRNG ---------- */
export function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round1 = (n: number) => Math.round(n * 10) / 10;
const round2 = (n: number) => Math.round(n * 100) / 100;

/** Vehicles flagged with abnormal thermal / voltage behaviour in the demo. */
export const ANOMALY_VEHICLE_IDS = ['veh-003', 'veh-004', 'veh-009'];

/* ---------- calendar (demo "today" is Nov 2026) ---------- */
export const TREND_MONTHS = [
  'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25',
  'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26', 'Oct 26', 'Nov 26',
  'Dec 26', 'Jan 27', 'Feb 27', 'Mar 27', 'Apr 27', 'May 27', 'Jun 27', 'Jul 27', 'Aug 27', 'Sep 27', 'Oct 27', 'Nov 27', 'Dec 27',
];
export const ACTUAL_MONTHS = 23; // Jan 25 → Nov 26

function ageMonths(v: Vehicle) {
  return Math.max(12, (2026 - v.year) * 12 + 10);
}

/** Monthly SoH loss implied by current SoH and vehicle age. */
export function monthlyLoss(v: Vehicle) {
  return Math.min(0.6, Math.max(0.08, (100 - v.sohPercent) / ageMonths(v)));
}

/* ---------- degradation ---------- */
export function buildDegradation(v: Vehicle, scale: (soh: number) => number = (s) => s): TrendPoint[] {
  const rand = seeded(v.id + 'deg');
  const loss = monthlyLoss(v);
  return TREND_MONTHS.map((month, i) => {
    const isActual = i < ACTUAL_MONTHS;
    const fromNow = i - (ACTUAL_MONTHS - 1);
    const noise = isActual && fromNow !== 0 ? (rand() - 0.5) * 0.3 : 0;
    const soh = Math.min(100, v.sohPercent - loss * fromNow * (fromNow > 0 ? 0.92 : 1) + noise);
    const value = round1(scale(soh));
    return { month, actual: isActual ? value : null, forecast: i >= ACTUAL_MONTHS - 1 ? value : null };
  });
}

/* ---------- telemetry ---------- */
/** Keeps generated values consistent with hand-written records (e.g. the featured passport). */
const FAST_CHARGE_OVERRIDES: Record<string, number> = { 'veh-001': 34 };

export function buildTelemetry(v: Vehicle): BatteryTelemetry {
  const rand = seeded(v.id + 'tel');
  const anomaly = ANOMALY_VEHICLE_IDS.includes(v.id);
  const base = anomaly ? 31 : 25 + rand() * 2;
  const tempHistory = Array.from({ length: 24 }, (_, h) => {
    const wave = Math.sin(((h - 6) / 24) * Math.PI * 2) * 3;
    const spike = anomaly && (h === 17 || h === 18) ? 9 + rand() * 3 : 0;
    const avg = base + wave + (rand() - 0.5) + spike * 0.6;
    return {
      time: `${String(h).padStart(2, '0')}:00`,
      min: round1(avg - 1.4 - rand()),
      avg: round1(avg),
      max: round1(avg + 1.6 + rand() + spike * 0.5),
    };
  });
  const modules = 8;
  const moduleVoltages = Array.from({ length: modules }, (_, i) => ({
    module: `M${i + 1}`,
    voltage: round2(3.86 + (rand() - 0.5) * 0.03 - (anomaly && i === 5 ? 0.07 : 0)),
  }));
  const temps = tempHistory.map((t) => t.max);
  const avgV = moduleVoltages.reduce((s, m) => s + m.voltage, 0) / modules;
  const specs = specsFor(v);
  const fastShare = FAST_CHARGE_OVERRIDES[v.id] ?? (v.make === 'Tesla' ? 34 + Math.round(rand() * 12) : 15 + Math.round(rand() * 25));
  return {
    vehicleId: v.id,
    lastUpdated: '2026-11-19T08:40:00',
    packVoltage: Math.round(avgV * 96),
    cellTempAvgC: round1(tempHistory.reduce((s, t) => s + t.avg, 0) / 24),
    cellTempMaxC: round1(Math.max(...temps)),
    cellTempMinC: round1(Math.min(...tempHistory.map((t) => t.min))),
    coolantTempC: round1(base - 2 + rand()),
    tempHistory,
    moduleVoltages,
    charging: {
      lastChargeType: fastShare > 40 ? 'DC' : 'AC',
      lastChargeDate: '2026-11-18',
      avgChargePowerKw: round1(fastShare > 40 ? specs.maxDcChargeKw * 0.42 : 9.6),
      fastChargeShare: fastShare,
      avgDepthOfDischarge: 45 + Math.round(rand() * 25),
      chargeLimitPct: [80, 85, 90, 100][Math.floor(rand() * 4)],
    },
  };
}

/* ---------- charging & usage ---------- */
const CHARGE_LOCATIONS = ['Home wallbox', 'Home wallbox', 'Work charger', 'Supercharger · Easton', 'EVgo · Polaris', 'Home wallbox'];

export function buildCharging(v: Vehicle): ChargingSummary {
  const rand = seeded(v.id + 'chg');
  const weeks = ['Sep 28', 'Oct 5', 'Oct 12', 'Oct 19', 'Oct 26', 'Nov 2', 'Nov 9', 'Nov 16'];
  const weekly = weeks.map((week) => {
    const ac = Math.round(38 + rand() * 30);
    const dc = Math.round(rand() * 28);
    return { week, ac, dc, miles: Math.round((ac + dc) * 3.6) };
  });
  const sessions: ChargingSession[] = Array.from({ length: 10 }, (_, i) => {
    const location = CHARGE_LOCATIONS[Math.floor(rand() * CHARGE_LOCATIONS.length)];
    const type: 'AC' | 'DC' = location.startsWith('Home') || location.startsWith('Work') ? 'AC' : 'DC';
    const startSoc = 15 + Math.round(rand() * 35);
    const endSoc = type === 'DC' ? 75 + Math.round(rand() * 10) : 80 + Math.round(rand() * 10);
    const energyKwh = round1(((endSoc - startSoc) / 100) * specsFor(v).batteryKwh);
    const day = 18 - i * 2;
    return {
      id: `${v.id}-cs-${i + 1}`,
      date: `2026-${day > 0 ? '11' : '10'}-${String(day > 0 ? day : 31 + day).padStart(2, '0')}`,
      location,
      type,
      energyKwh,
      durationMin: type === 'DC' ? 22 + Math.round(rand() * 18) : 240 + Math.round(rand() * 200),
      startSoc,
      endSoc,
      peakTempC: round1(type === 'DC' ? 36 + rand() * 6 : 27 + rand() * 4),
    };
  });
  const lastFour = weekly.slice(-4);
  const monthEnergy = lastFour.reduce((s, w) => s + w.ac + w.dc, 0);
  return {
    weekly,
    sessions,
    monthEnergyKwh: monthEnergy,
    monthSessions: 14 + Math.round(rand() * 6),
    efficiencyMiPerKwh: round1(3.4 + rand() * 0.6),
    homeChargingShare: Math.round((lastFour.reduce((s, w) => s + w.ac, 0) / monthEnergy) * 100),
  };
}

/* ---------- service history ---------- */
const CENTERS = ['State Auto Service Centre', 'Columbus EV Care', 'Northgate Battery Clinic'];
const TECHS = ['M. Chen', 'R. Okafor', 'D. Alvarez', 'S. Patel'];

export function buildServiceHistory(v: Vehicle): ServiceRecord[] {
  const rand = seeded(v.id + 'svc');
  const loss = monthlyLoss(v);
  const base: Omit<ServiceRecord, 'id' | 'vehicleId' | 'center' | 'technician'>[] = [
    { date: '2026-06-03', type: 'Coolant service', summary: 'Battery coolant loop inspected and topped up. No leaks found.', sohAtService: round1(v.sohPercent + loss * 5) },
    { date: '2026-01-21', type: 'Software update', summary: 'BMS firmware updated to improve cell balancing.', sohAtService: round1(v.sohPercent + loss * 10) },
    { date: '2025-08-14', type: 'Battery inspection', summary: 'Annual battery health check. Pack within expected range.', sohAtService: round1(v.sohPercent + loss * 15) },
    { date: '2025-02-09', type: 'Tyre service', summary: 'Tyre rotation and alignment check.' },
    { date: '2024-07-30', type: 'Routine maintenance', summary: 'Cabin filter, brake fluid and 12V battery check.' },
  ];
  const count = 3 + Math.floor(rand() * 3);
  return base.slice(0, count).map((r, i) => ({
    ...r,
    id: `${v.id}-sr-${i + 1}`,
    vehicleId: v.id,
    center: CENTERS[Math.floor(rand() * CENTERS.length)],
    technician: TECHS[Math.floor(rand() * TECHS.length)],
  }));
}

/* ---------- valuation helpers ---------- */
export function estimateTradeIn(v: Vehicle): number {
  const specs = specsFor(v);
  const age = 2026 - v.year;
  const value = specs.msrpUsd * Math.pow(0.85, age) * (1 - v.odometerMiles / 400000) * (0.6 + (0.4 * v.sohPercent) / 100);
  return Math.round(value / 50) * 50;
}

/* ---------- passport ---------- */
export const passportIdFor = (vehicleId: string) => `bp-${vehicleId.replace('veh-', '')}`;

export function buildPassport(v: Vehicle): BatteryPassport {
  const tel = buildTelemetry(v);
  const specs = specsFor(v);
  const history = buildServiceHistory(v);
  return {
    id: passportIdFor(v.id),
    vehicleId: v.id,
    vehicle: v,
    batterySerial: `DEMO-${v.vin.slice(0, 4)}-${v.vin.slice(4, 8)}-${v.vin.slice(10)}`,
    chemistry: specs.chemistry,
    nominalCapacityKwh: specs.batteryKwh,
    usableCapacityKwh: round1((specs.batteryKwh * v.sohPercent) / 100),
    cycleCount: Math.round(v.odometerMiles / 210),
    fastChargeShare: tel.charging.fastChargeShare,
    avgCellTempC: Math.round(tel.cellTempAvgC),
    estTradeInValue: estimateTradeIn(v),
    estLifeRemaining: estimateLife(v.sohPercent),
    issuedAt: '2026-11-12',
    history: [
      { date: '2026-11-12', event: 'Passport issued (demo)', detail: 'Sample passport generated for preview.' },
      { date: '2026-11-10', event: 'Assessment logged (demo)', detail: `Simulated SoH reading of ${v.sohPercent}% recorded.` },
      ...history.slice(0, 2).map((h) => ({ date: h.date, event: `${h.type} (demo)`, detail: h.summary })),
    ],
    cellBalance: tel.moduleVoltages,
  };
}
