import type { AlertSeverity, BatteryAlert, Inspection, InspectionStatus, ServiceRecord, ServiceTicket, TicketPriority, TicketStatus } from '@/types';
import {
  TECHNICIANS,
  buildChecklist,
  buildServiceHistory,
  inspectionsMock,
  maintenanceActionsMock,
  serviceAlertsMock,
  ticketsMock,
  vehiclesMock,
} from '@/mocks';
import { mockRequest } from './apiClient';
import { createStore, mockMutation, nowIso } from './mockStore';
import { getVehicleSync } from './vehicleService';

const ACTOR = 'Maria Chen';

export const ticketsStore = createStore<ServiceTicket[]>(structuredClone(ticketsMock));
export const inspectionsStore = createStore<Inspection[]>(structuredClone(inspectionsMock));
export const serviceAlertsStore = createStore<BatteryAlert[]>(structuredClone(serviceAlertsMock));

export function getMaintenanceActions() {
  return mockRequest(maintenanceActionsMock, 300);
}

// TODO(backend): GET /api/service/history
export function getAllServiceHistory(): Promise<ServiceRecord[]> {
  const records = vehiclesMock.flatMap((v) => buildServiceHistory(v)).sort((a, b) => b.date.localeCompare(a.date));
  return mockRequest(records, 350);
}

const logEntry = (text: string) => ({ id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, at: nowIso(), author: ACTOR, text });

function updateTicket(id: string, fn: (t: ServiceTicket) => ServiceTicket) {
  return mockMutation(ticketsStore, (list) => list.map((t) => (t.id === id ? fn(t) : t)));
}

// TODO(backend): PATCH /api/service/tickets/:id { status }
export function updateTicketStatus(id: string, status: TicketStatus) {
  return updateTicket(id, (t) => ({ ...t, status, activity: [...t.activity, logEntry(`Status changed from ${t.status} to ${status}.`)] }));
}

// TODO(backend): PATCH /api/service/tickets/:id/checklist/:itemId
export function toggleChecklistItem(ticketId: string, itemId: string) {
  return updateTicket(ticketId, (t) => {
    const item = t.checklist.find((c) => c.id === itemId);
    if (!item) return t;
    return {
      ...t,
      checklist: t.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c)),
      activity: [...t.activity, logEntry(`${item.done ? 'Unchecked' : 'Completed'}: ${item.label}.`)],
    };
  });
}

// TODO(backend): POST /api/service/tickets/:id/notes
export function addTicketNote(ticketId: string, text: string) {
  return updateTicket(ticketId, (t) => ({ ...t, activity: [...t.activity, logEntry(text)] }));
}

// TODO(backend): PATCH /api/service/inspections/:id
export function updateInspectionStatus(id: string, status: InspectionStatus) {
  const needsBay = status === 'Scheduled' || status === 'In Progress';
  const assignedBay = needsBay ? `Bay ${1 + (Number(id.slice(-1)) % 3)}` : null;
  return mockMutation(inspectionsStore, (list) => list.map((i) => (i.id === id ? { ...i, status, bay: i.bay ?? assignedBay } : i)));
}

// TODO(backend): POST /api/service/alerts/:id/acknowledge
export function acknowledgeServiceAlert(id: string) {
  return mockMutation(serviceAlertsStore, (list) => list.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
}

const priorityForSeverity: Record<AlertSeverity, TicketPriority> = { critical: 'Critical', warning: 'High', info: 'Medium' };

// TODO(backend): POST /api/service/tickets  (from alert)
export async function createTicketFromAlert(alertId: string): Promise<string> {
  const alert = serviceAlertsStore.get().find((a) => a.id === alertId);
  const vehicle = alert && getVehicleSync(alert.vehicleId);
  if (!alert || !vehicle) throw new Error('Alert not found');
  const nextNumber = Math.max(...ticketsStore.get().map((t) => Number(t.id.slice(2)))) + 1;
  const id = `T-${nextNumber}`;
  const ticket: ServiceTicket = {
    id,
    vehicleId: vehicle.id,
    customer: 'Customer on file',
    title: alert.title,
    description: alert.detail,
    priority: priorityForSeverity[alert.severity],
    status: 'Open',
    assignedTo: ACTOR.replace('Maria ', 'M. '),
    createdAt: nowIso(),
    dueDate: '2026-11-26',
    alertIds: [alert.id],
    checklist: buildChecklist(id, 0),
    activity: [logEntry(`Ticket created from alert “${alert.title}”.`)],
    recommendedActions: [alert.recommendation],
  };
  await mockMutation(ticketsStore, (list) => [ticket, ...list], 300);
  serviceAlertsStore.set((list) => list.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a)));
  return id;
}

export function ticketsForVehicle(vehicleId: string): ServiceTicket[] {
  return ticketsStore.get().filter((t) => t.vehicleId === vehicleId);
}

export function getTechnicians(): string[] {
  return TECHNICIANS;
}
