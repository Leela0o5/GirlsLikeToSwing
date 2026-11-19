import type { BatteryAlert, ChecklistItem, Inspection, Recommendation, ServiceTicket, TicketStatus } from '@/types';

/* DEMO DATA — service centre queue for "State Auto Service Centre". */

export const TECHNICIANS = ['M. Chen', 'R. Okafor', 'D. Alvarez', 'S. Patel'];

const CHECKLIST = [
  'Visual inspection of HV battery enclosure',
  'Check coolant level and loop for leaks',
  'Read BMS fault codes',
  'Measure module voltage balance',
  'Thermal check under charge load',
  'Update battery passport record',
];

export function buildChecklist(ticketId: string, doneCount: number): ChecklistItem[] {
  return CHECKLIST.map((label, i) => ({ id: `${ticketId}-c${i + 1}`, label, done: i < doneCount }));
}

const doneFor: Record<TicketStatus, number> = { Open: 0, 'In Progress': 3, 'Awaiting Parts': 4, Completed: 6 };

type TicketSeed = Omit<ServiceTicket, 'checklist' | 'activity'> & { activity?: ServiceTicket['activity'] };

const seeds: TicketSeed[] = [
  {
    id: 'T-1042', vehicleId: 'veh-004', customer: 'Jordan Lee', title: 'Elevated pack temperature',
    description: 'Customer reports reduced range and a high-temperature warning after short drives.',
    priority: 'Critical', status: 'In Progress', assignedTo: 'M. Chen', createdAt: '2026-11-17T09:12:00', dueDate: '2026-11-20',
    alertIds: ['sa-1'], recommendedActions: ['Inspect coolant pump and thermal interface', 'Run cell-level thermal scan', 'Limit DC charging until resolved'],
  },
  {
    id: 'T-1041', vehicleId: 'veh-003', customer: 'Avery Brooks', title: 'Thermal anomaly during DC charging',
    description: 'Pack temperature spikes above 40 °C at the end of DC sessions.',
    priority: 'High', status: 'Open', assignedTo: 'R. Okafor', createdAt: '2026-11-16T14:30:00', dueDate: '2026-11-22',
    alertIds: ['sa-2'], recommendedActions: ['Check coolant loop flow rate', 'Verify charge-curve thermal derating', 'Update BMS firmware'],
  },
  {
    id: 'T-1040', vehicleId: 'veh-009', customer: 'Casey Nguyen', title: 'Module voltage imbalance (M6)',
    description: 'BMS reports module 6 consistently ~70 mV below pack average.',
    priority: 'High', status: 'Awaiting Parts', assignedTo: 'D. Alvarez', createdAt: '2026-11-14T10:05:00', dueDate: '2026-11-26',
    alertIds: ['sa-3'], recommendedActions: ['Perform balancing charge', 'Replace module 6 if imbalance persists', 'Re-assess SoH after repair'],
  },
  {
    id: 'T-1039', vehicleId: 'veh-011', customer: 'Riley Morgan', title: 'Pre-sale battery assessment',
    description: 'Private seller requests a verified battery assessment before listing.',
    priority: 'Medium', status: 'Open', assignedTo: 'S. Patel', createdAt: '2026-11-15T16:45:00', dueDate: '2026-11-25',
    alertIds: ['sa-4'], recommendedActions: ['Full capacity test', 'Issue updated battery passport'],
  },
  {
    id: 'T-1038', vehicleId: 'veh-001', customer: 'Priya Shah', title: 'Annual battery inspection',
    description: 'Scheduled annual battery health check requested via owner portal.',
    priority: 'Low', status: 'Open', assignedTo: 'M. Chen', createdAt: '2026-11-12T08:00:00', dueDate: '2026-12-15',
    alertIds: [], recommendedActions: ['Standard battery inspection checklist', 'Advise owner on fast-charging habits'],
  },
  {
    id: 'T-1037', vehicleId: 'veh-005', customer: 'Taylor Kim', title: 'Charge port inspection',
    description: 'Intermittent charge interruptions on DC chargers.',
    priority: 'Medium', status: 'In Progress', assignedTo: 'R. Okafor', createdAt: '2026-11-11T11:20:00', dueDate: '2026-11-21',
    alertIds: ['sa-5'], recommendedActions: ['Inspect charge port pins and latch', 'Check charge-port temperature sensor'],
  },
  {
    id: 'T-1036', vehicleId: 'veh-008', customer: 'Morgan Diaz', title: 'BMS software update',
    description: 'Apply manufacturer BMS update and verify cell balancing.',
    priority: 'Low', status: 'Completed', assignedTo: 'S. Patel', createdAt: '2026-11-06T09:00:00', dueDate: '2026-11-08',
    alertIds: [], recommendedActions: ['Confirm update applied', 'Record in battery passport'],
  },
  {
    id: 'T-1035', vehicleId: 'veh-012', customer: 'Jamie Fox', title: 'Coolant service',
    description: 'Scheduled battery coolant replacement.',
    priority: 'Low', status: 'Completed', assignedTo: 'D. Alvarez', createdAt: '2026-11-03T13:10:00', dueDate: '2026-11-05',
    alertIds: [], recommendedActions: ['Bleed coolant loop', 'Pressure test'],
  },
];

export const ticketsMock: ServiceTicket[] = seeds.map((s) => ({
  ...s,
  checklist: buildChecklist(s.id, doneFor[s.status]),
  activity: [
    { id: `${s.id}-a1`, at: s.createdAt, author: 'System', text: 'Ticket created (demo).' },
    ...(s.status !== 'Open' ? [{ id: `${s.id}-a2`, at: s.createdAt.replace(/T\d\d/, 'T15'), author: s.assignedTo, text: `Status changed to ${s.status}.` }] : []),
  ],
}));

export const serviceAlertsMock: BatteryAlert[] = [
  { id: 'sa-1', vehicleId: 'veh-004', title: 'Pack temperature above 45 °C', detail: 'Max cell temperature 46.2 °C recorded at 17:00.', severity: 'critical', category: 'temperature', createdAt: '2026-11-19T07:55:00', acknowledged: false, recommendation: 'Inspect cooling system immediately and restrict fast charging.' },
  { id: 'sa-2', vehicleId: 'veh-003', title: 'Unusual temperature pattern', detail: 'Repeated temperature spikes at end of DC sessions.', severity: 'warning', category: 'temperature', createdAt: '2026-11-18T19:10:00', acknowledged: false, recommendation: 'Schedule a thermal inspection within 7 days.' },
  { id: 'sa-3', vehicleId: 'veh-009', title: 'Module voltage imbalance', detail: 'Module M6 ~70 mV below pack average.', severity: 'warning', category: 'voltage', createdAt: '2026-11-18T10:40:00', acknowledged: true, recommendation: 'Run a balancing charge and re-measure.' },
  { id: 'sa-4', vehicleId: 'veh-011', title: 'Accelerated degradation', detail: 'SoH dropped 1.8 pts in 6 months (demo threshold 1.5).', severity: 'warning', category: 'health', createdAt: '2026-11-17T12:00:00', acknowledged: false, recommendation: 'Perform a full capacity test.' },
  { id: 'sa-5', vehicleId: 'veh-005', title: 'Charging session interrupted', detail: '3 DC sessions ended early in the last week.', severity: 'info', category: 'charging', createdAt: '2026-11-16T08:25:00', acknowledged: false, recommendation: 'Inspect charge port and communication module.' },
  { id: 'sa-6', vehicleId: 'veh-006', title: 'BMS update available', detail: 'Manufacturer released a battery management update.', severity: 'info', category: 'service', createdAt: '2026-11-15T09:00:00', acknowledged: false, recommendation: 'Apply the update at next visit.' },
  { id: 'sa-7', vehicleId: 'veh-010', title: 'Low state of charge in storage', detail: 'Vehicle stored at 12% SoC for 9 days.', severity: 'warning', category: 'charging', createdAt: '2026-11-14T17:30:00', acknowledged: false, recommendation: 'Charge to 50–60% for storage.' },
];

export const inspectionsMock: Inspection[] = [
  { id: 'IN-301', vehicleId: 'veh-004', reason: 'Critical temperature alert', dueDate: '2026-11-20', bay: 'Bay 2', status: 'In Progress', priority: 'Critical' },
  { id: 'IN-302', vehicleId: 'veh-003', reason: 'Unusual temperature pattern', dueDate: '2026-11-22', bay: null, status: 'Due', priority: 'High' },
  { id: 'IN-303', vehicleId: 'veh-009', reason: 'Voltage imbalance follow-up', dueDate: '2026-11-24', bay: 'Bay 1', status: 'Scheduled', priority: 'High' },
  { id: 'IN-304', vehicleId: 'veh-011', reason: 'Pre-sale assessment', dueDate: '2026-11-25', bay: null, status: 'Due', priority: 'Medium' },
  { id: 'IN-305', vehicleId: 'veh-002', reason: 'Annual battery inspection', dueDate: '2026-11-28', bay: 'Bay 3', status: 'Scheduled', priority: 'Low' },
  { id: 'IN-306', vehicleId: 'veh-006', reason: 'Post-update verification', dueDate: '2026-11-15', bay: 'Bay 1', status: 'Passed', priority: 'Low' },
  { id: 'IN-307', vehicleId: 'veh-010', reason: 'Deep-discharge check', dueDate: '2026-11-23', bay: null, status: 'Due', priority: 'Medium' },
];

export const maintenanceActionsMock: Recommendation[] = [
  {
    id: 'ma-thermal', title: 'Coolant loop inspection', summary: '3 vehicles show abnormal thermal behaviour.',
    priority: 'High', timeline: 'This week', impact: 'Prevent thermal damage', ctaLabel: 'View vehicles', icon: 'thermometer',
    affectedVehicleIds: ['veh-003', 'veh-004', 'veh-009'],
    steps: ['Pressure-test coolant loops on flagged vehicles.', 'Check pump duty cycle and inlet/outlet delta.', 'Log findings to each battery passport.'],
  },
  {
    id: 'ma-bms', title: 'Apply pending BMS updates', summary: '2 vehicles are on outdated battery firmware.',
    priority: 'Medium', timeline: 'Within 14 days', impact: 'Better cell balancing', ctaLabel: 'View vehicles', icon: 'zap',
    affectedVehicleIds: ['veh-006', 'veh-011'],
    steps: ['Confirm firmware version on each vehicle.', 'Apply update while connected to a stable power supply.', 'Verify balancing after first full charge.'],
  },
  {
    id: 'ma-annual', title: 'Book annual inspections', summary: '3 vehicles are due for annual battery checks.',
    priority: 'Low', timeline: 'Within 30 days', impact: 'Keep passports current', ctaLabel: 'View vehicles', icon: 'calendar',
    affectedVehicleIds: ['veh-001', 'veh-002', 'veh-012'],
    steps: ['Contact owners to schedule.', 'Run the standard inspection checklist.', 'Issue updated battery passports.'],
  },
];
