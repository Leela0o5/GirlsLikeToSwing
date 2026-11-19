import type { BatteryAlert, OwnerVehicleRegistration, ServiceAppointment, Valuation } from '@/types';

/* DEMO DATA — the owner portal previews a single registered vehicle. */

export const OWNER_VEHICLE_ID = 'veh-001';

export const ownerRegistrationMock: OwnerVehicleRegistration = {
  vehicleId: OWNER_VEHICLE_ID,
  plate: 'DEMO-EV1',
  color: 'Pearl White',
  registeredOn: '2022-03-14',
  ownerSince: '2025-09-21',
  warrantyUntil: '2030-03-14',
  homeCharger: 'Level 2 wallbox · 11 kW',
};

export const ownerAlertsMock: BatteryAlert[] = [
  {
    id: 'oa-1',
    vehicleId: OWNER_VEHICLE_ID,
    title: 'High pack temperature during fast charge',
    detail: 'Peak cell temperature reached 41 °C during a DC session on Nov 16.',
    severity: 'warning',
    category: 'temperature',
    createdAt: '2026-11-16T18:20:00',
    acknowledged: false,
    recommendation: 'Precondition the battery before DC fast charging, especially in warm weather.',
  },
  {
    id: 'oa-2',
    vehicleId: OWNER_VEHICLE_ID,
    title: 'Frequent DC fast charging',
    detail: '34% of charging sessions in the last 90 days were DC fast charges.',
    severity: 'warning',
    category: 'charging',
    createdAt: '2026-11-12T09:00:00',
    acknowledged: false,
    recommendation: 'Use home AC charging for daily needs and keep DC charging for longer trips.',
  },
  {
    id: 'oa-3',
    vehicleId: OWNER_VEHICLE_ID,
    title: 'Annual battery inspection due soon',
    detail: 'Your last battery inspection was in Aug 2025. An annual check is recommended.',
    severity: 'info',
    category: 'service',
    createdAt: '2026-11-10T08:00:00',
    acknowledged: false,
    recommendation: 'Book a battery inspection with a certified service centre.',
  },
  {
    id: 'oa-4',
    vehicleId: OWNER_VEHICLE_ID,
    title: 'Charge limit left at 100%',
    detail: 'The charge limit was set to 100% for 5 consecutive days.',
    severity: 'info',
    category: 'health',
    createdAt: '2026-10-28T07:30:00',
    acknowledged: true,
    recommendation: 'Set a daily charge limit of 80–90% to reduce long-term degradation.',
  },
];

export const ownerAppointmentsMock: ServiceAppointment[] = [
  { id: 'ap-1', date: '2026-12-15', type: 'Battery inspection', notes: 'Annual battery health check.', status: 'Confirmed' },
];

export const ownerValuationMock: Valuation = {
  vehicleId: OWNER_VEHICLE_ID,
  low: 17600,
  mid: 18750,
  high: 19900,
  asOf: '2026-11-19',
  factors: [
    { label: 'Battery health (SoH 91%)', impact: 1450 },
    { label: 'Complete service history', impact: 350 },
    { label: 'Regional EV demand', impact: 250 },
    { label: 'Fast-charging history', impact: -400 },
    { label: 'Mileage (45,000 mi)', impact: -1200 },
  ],
  history: [
    { month: 'Dec 25', value: 21400 },
    { month: 'Jan 26', value: 21150 },
    { month: 'Feb 26', value: 20900 },
    { month: 'Mar 26', value: 20700 },
    { month: 'Apr 26', value: 20450 },
    { month: 'May 26', value: 20200 },
    { month: 'Jun 26', value: 19950 },
    { month: 'Jul 26', value: 19700 },
    { month: 'Aug 26', value: 19450 },
    { month: 'Sep 26', value: 19200 },
    { month: 'Oct 26', value: 18950 },
    { month: 'Nov 26', value: 18750 },
  ],
};
