import type { PortalId } from '@/types';

export const ROUTES = {
  dashboard: '/dealer',
  inventory: '/dealer/inventory',
  assessments: '/dealer/assessments',
  tradeIns: '/dealer/trade-ins',
  passport: '/dealer/passport',
  passportDetail: (id: string) => `/dealer/passport/${id}`,
  service: '/dealer/service',
  reports: '/dealer/reports',
  settings: '/dealer/settings',
  help: '/dealer/help',
} as const;

export const PORTAL_BASE: Record<PortalId, string> = {
  dealer: '/dealer',
  owner: '/owner',
  buyer: '/buyer',
  service: '/service',
};

export const OWNER_ROUTES = {
  dashboard: '/owner',
  health: '/owner/health',
  charging: '/owner/charging',
  alerts: '/owner/alerts',
  service: '/owner/service',
  valuation: '/owner/valuation',
  passport: '/owner/passport',
  settings: '/owner/settings',
  help: '/owner/help',
} as const;

export const BUYER_ROUTES = {
  explore: '/buyer',
  listing: (id: string) => `/buyer/listings/${id}`,
  compare: '/buyer/compare',
  saved: '/buyer/saved',
  reports: '/buyer/reports',
  settings: '/buyer/settings',
  help: '/buyer/help',
} as const;

export const SERVICE_ROUTES = {
  dashboard: '/service',
  tickets: '/service/tickets',
  ticket: (id: string) => `/service/tickets/${id}`,
  inspections: '/service/inspections',
  alerts: '/service/alerts',
  history: '/service/history',
  vehicle: (id: string) => `/service/vehicles/${id}`,
  settings: '/service/settings',
  help: '/service/help',
} as const;

/** Passport detail lives under each portal so the shell (nav, user) stays consistent. */
export const passportPath = (portal: PortalId, passportId: string) => `${PORTAL_BASE[portal]}/passport/${passportId}`;
