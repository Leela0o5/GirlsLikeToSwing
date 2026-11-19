import type { AlertSeverity, AppNotification, DealerUser, PortalId, SearchResult, Tone } from '@/types';
import { OWNER_VEHICLE_ID, buildServiceHistory, listingsMock, portalNotificationsMock, portalUsersMock, vehiclesMock } from '@/mocks';
import { formatDate, sohTone, vehicleName } from '@/utils/format';
import { mockRequest } from './apiClient';
import { ownerAlertsStore } from './ownerService';
import { serviceAlertsStore, ticketsStore } from './serviceCenterService';
import { getVehicleSync, matchesVehicleQuery } from './vehicleService';

// TODO(backend): GET /api/me  (role comes from auth once implemented)
export function getPortalUser(portal: PortalId): DealerUser {
  return portalUsersMock[portal];
}

// TODO(backend): GET /api/notifications
export function getNotifications(portal: PortalId): Promise<AppNotification[]> {
  return mockRequest(portalNotificationsMock[portal], 200);
}

const has = (q: string, ...fields: string[]) => fields.join(' ').toLowerCase().includes(q);

const severityTone: Record<AlertSeverity, Tone> = { critical: 'critical', warning: 'warning', info: 'neutral' };

const searchers: Record<PortalId, (q: string) => SearchResult[]> = {
  dealer: (q) =>
    vehiclesMock
      .filter((v) => matchesVehicleQuery(v, q))
      .map((v) => ({
        id: v.id,
        title: vehicleName(v),
        subtitle: `VIN ${v.vin}`,
        to: `/dealer/inventory?q=${encodeURIComponent(v.vin)}`,
        badge: { label: `SoH ${v.sohPercent}%`, tone: sohTone(v.sohPercent) },
      })),

  owner: (q) => {
    const alerts = ownerAlertsStore
      .get()
      .filter((a) => has(q, a.title, a.detail, a.category))
      .map((a) => ({ id: a.id, title: a.title, subtitle: `Alert · ${a.category}`, to: '/owner/alerts', badge: { label: a.severity, tone: severityTone[a.severity] } }));
    const records = buildServiceHistory(getVehicleSync(OWNER_VEHICLE_ID)!)
      .filter((r) => has(q, r.type, r.summary, r.center))
      .map((r) => ({ id: r.id, title: r.type, subtitle: `Service · ${formatDate(r.date)}`, to: '/owner/service' }));
    return [...alerts, ...records];
  },

  buyer: (q) =>
    listingsMock
      .filter((l) => matchesVehicleQuery(l.vehicle, q) || has(q, l.location, l.seller))
      .map((l) => ({
        id: l.id,
        title: vehicleName(l.vehicle),
        subtitle: `${l.location} · ${l.verification}`,
        to: `/buyer/listings/${l.id}`,
        badge: { label: `SoH ${l.vehicle.sohPercent}%`, tone: sohTone(l.vehicle.sohPercent) },
      })),

  service: (q) => {
    const tickets = ticketsStore
      .get()
      .filter((t) => {
        const v = getVehicleSync(t.vehicleId);
        return has(q, t.id, t.title, t.customer, v ? `${vehicleName(v)} ${v.vin}` : '');
      })
      .map((t) => ({ id: t.id, title: `${t.id} · ${t.title}`, subtitle: t.customer, to: `/service/tickets/${t.id}`, badge: { label: t.status, tone: 'neutral' as const } }));
    const alerts = serviceAlertsStore
      .get()
      .filter((a) => has(q, a.title, a.detail))
      .map((a) => ({ id: a.id, title: a.title, subtitle: 'Battery alert', to: '/service/alerts' }));
    const vehicles = vehiclesMock
      .filter((v) => matchesVehicleQuery(v, q))
      .map((v) => ({ id: v.id, title: vehicleName(v), subtitle: `Vehicle · VIN ${v.vin}`, to: `/service/vehicles/${v.id}` }));
    return [...tickets, ...alerts, ...vehicles];
  },
};

// TODO(backend): GET /api/search?portal=&q=
export function searchPortal(portal: PortalId, query: string): Promise<SearchResult[]> {
  const results = searchers[portal](query.trim().toLowerCase());
  return mockRequest(results.slice(0, 8), 200);
}
