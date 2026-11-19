import type {
  AppNotification,
  BatteryPassport,
  DealerPerformance,
  DealerUser,
  DealershipLocation,
  KpiMetric,
  Recommendation,
  TrendSeries,
} from '@/types';
import { vehiclesMock } from './vehicles';

/* ------------------------------------------------------------------ */
/* DEMO DATA — every value in this file is simulated for UI purposes. */
/* ------------------------------------------------------------------ */

export const currentUserMock: DealerUser = {
  name: 'John Doe',
  role: 'Dealer Principal',
  dealership: 'State Auto Group',
  initials: 'JD',
};

export const kpisMock: KpiMetric[] = [
  { id: 'assessed', label: 'Vehicles Assessed', value: '248', icon: 'assessed', delta: '+12% vs last month', trend: 'up', tone: 'positive' },
  { id: 'health', label: 'Average Battery Health', value: '91', unit: '%', icon: 'health', delta: '+0.8 pts vs last month', trend: 'up', tone: 'positive' },
  { id: 'tradein', label: 'Pending Trade-ins', value: '18', icon: 'tradein', delta: '5 awaiting appraisal', trend: 'flat', tone: 'neutral' },
  { id: 'attention', label: 'Vehicles Requiring Attention', value: '7', icon: 'attention', delta: '2 new this week', trend: 'up', tone: 'warning' },
];

export const performanceMock: DealerPerformance = {
  score: 82,
  maxScore: 100,
  grade: 'A',
  gradeLabel: 'Excellent',
  summary: 'Your lot is outperforming 74% of regional dealers on battery health and assessment turnaround.',
  appraisalCompletion: 68,
  peakScore: 86,
  breakdown: [
    { label: 'Assessment coverage', value: 88 },
    { label: 'Avg. inventory SoH', value: 91 },
    { label: 'Turnaround time', value: 71 },
  ],
};

export const locationsMock: DealershipLocation[] = [
  { id: 'loc-01', code: 'SAG-01', name: 'State Auto Downtown', city: 'Columbus, OH', x: 16, y: 36, vehiclesOnLot: 64, status: 'online', isHub: true },
  { id: 'loc-02', code: 'SAG-02', name: 'State Auto Northgate', city: 'Westerville, OH', x: 44, y: 22, vehiclesOnLot: 48, status: 'online' },
  { id: 'loc-03', code: 'SAG-03', name: 'State Auto Riverside', city: 'Dublin, OH', x: 30, y: 72, vehiclesOnLot: 37, status: 'syncing', isHub: true },
  { id: 'loc-04', code: 'SAG-04', name: 'State Auto East', city: 'Reynoldsburg, OH', x: 56, y: 60, vehiclesOnLot: 52, status: 'online' },
];

/* Battery health trend: Jan 2025 → Nov 2026 actual, Dec 2026 → Dec 2027 forecast. */
const MONTHS = [
  'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25',
  'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26', 'Oct 26', 'Nov 26',
  'Dec 26', 'Jan 27', 'Feb 27', 'Mar 27', 'Apr 27', 'May 27', 'Jun 27', 'Jul 27', 'Aug 27', 'Sep 27', 'Oct 27', 'Nov 27', 'Dec 27',
];
const SOH_ACTUAL = [
  95.8, 95.6, 95.1, 94.9, 94.7, 94.2, 93.7, 93.5, 93.4, 93.1, 92.9, 92.8,
  92.6, 92.5, 92.2, 92.0, 91.8, 91.6, 91.3, 91.3, 91.2, 91.1, 91.0,
];
const ACTUAL_COUNT = SOH_ACTUAL.length;
const SOH_FORECAST = [90.8, 90.6, 90.5, 90.3, 90.1, 89.9, 89.7, 89.5, 89.3, 89.2, 89.0, 88.8, 88.6];

function buildSeries(scale: (soh: number) => number): TrendSeries['points'] {
  return MONTHS.map((month, i) => {
    const isActual = i < ACTUAL_COUNT;
    const soh = isActual ? SOH_ACTUAL[i] : SOH_FORECAST[i - ACTUAL_COUNT];
    const value = Math.round(scale(soh) * 10) / 10;
    return {
      month,
      actual: isActual ? value : null,
      // forecast line starts at the last actual point so the two lines join
      forecast: i >= ACTUAL_COUNT - 1 ? value : null,
    };
  });
}

export const trendSeriesMock: TrendSeries[] = [
  { metric: 'soh', label: 'Battery Health (SoH)', unit: '%', domain: [85, 100], points: buildSeries((s) => s) },
  { metric: 'range', label: 'Avg. Estimated Range', unit: ' mi', domain: [230, 290], points: buildSeries((s) => s * 2.846) },
  { metric: 'capacity', label: 'Usable Capacity', unit: ' kWh', domain: [65, 80], points: buildSeries((s) => s * 0.78) },
];

export const recommendationsMock: Recommendation[] = [
  {
    id: 'rec-inspection',
    title: 'Schedule Battery Inspection',
    summary: '3 vehicles have unusual temperature patterns.',
    priority: 'High',
    timeline: 'Within 7 days',
    impact: 'Prevent further degradation',
    ctaLabel: 'View Details',
    icon: 'thermometer',
    affectedVehicleIds: ['veh-003', 'veh-004', 'veh-009'],
    steps: [
      'Book a high-voltage technician inspection for each flagged vehicle.',
      'Check coolant loop and thermal management system for faults.',
      'Re-run the battery assessment after inspection and update the passport.',
    ],
  },
  {
    id: 'rec-fastcharge',
    title: 'Review Fast-Charging Patterns',
    summary: 'Identify vehicles with frequent fast-charging activity.',
    priority: 'Medium',
    timeline: 'Within 30 days',
    impact: 'Protect long-term SoH',
    ctaLabel: 'View Recommendations',
    icon: 'zap',
    affectedVehicleIds: ['veh-001', 'veh-005', 'veh-011'],
    steps: [
      'Review DC fast-charge share for vehicles above 40% of sessions.',
      'Share charging best-practice guidance with prior owners or buyers.',
      'Factor high fast-charge history into trade-in appraisal notes.',
    ],
  },
];

const featuredVehicle = vehiclesMock[0];

export const featuredPassportMock: BatteryPassport = {
  id: 'bp-001',
  vehicleId: featuredVehicle.id,
  vehicle: featuredVehicle,
  batterySerial: 'DEMO-5YJ3-EA1N-F123456',
  chemistry: 'NCA (Nickel Cobalt Aluminium)',
  nominalCapacityKwh: 82,
  usableCapacityKwh: 74.6,
  cycleCount: 212,
  fastChargeShare: 34,
  avgCellTempC: 27,
  estTradeInValue: 18750,
  estLifeRemaining: '8+ years',
  issuedAt: '2026-11-12',
  history: [
    { date: '2026-11-12', event: 'Passport issued (demo)', detail: 'Sample passport generated for dashboard preview.' },
    { date: '2026-11-10', event: 'Assessment logged (demo)', detail: 'Simulated SoH reading of 91% recorded.' },
    { date: '2026-06-03', event: 'Service visit (demo)', detail: 'Coolant check and tyre rotation.' },
    { date: '2025-09-21', event: 'Ownership transfer (demo)', detail: 'Vehicle acquired by second owner.' },
  ],
  cellBalance: [
    { module: 'M1', voltage: 3.87 },
    { module: 'M2', voltage: 3.86 },
    { module: 'M3', voltage: 3.88 },
    { module: 'M4', voltage: 3.85 },
  ],
};

export const notificationsMock: AppNotification[] = [
  { id: 'n1', title: 'Trade-in request received', body: '2023 Tesla Model Y submitted by a customer for appraisal.', time: '12 min ago', tone: 'neutral', read: false },
  { id: 'n2', title: 'Temperature anomaly flagged', body: '2020 Nissan Leaf shows elevated pack temperature (demo).', time: '1 hr ago', tone: 'critical', read: false },
  { id: 'n3', title: 'Assessment completed', body: '2022 Kia EV6 battery report is ready to review.', time: '3 hr ago', tone: 'positive', read: false },
  { id: 'n4', title: 'Location sync delayed', body: 'SAG-03 Riverside is re-syncing inventory data.', time: 'Yesterday', tone: 'warning', read: true },
];
