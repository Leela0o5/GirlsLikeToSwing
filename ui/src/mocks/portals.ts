import type { AppNotification, DealerUser, PortalId } from '@/types';
import { currentUserMock, notificationsMock } from './dealerDashboard';

/* DEMO DATA — the signed-in user and notifications shown for each portal. */

export const portalUsersMock: Record<PortalId, DealerUser> = {
  dealer: currentUserMock,
  owner: { name: 'Priya Shah', role: 'Vehicle Owner', dealership: '2022 Tesla Model 3', initials: 'PS' },
  buyer: { name: 'Sam Rivera', role: 'Buyer', dealership: 'Browsing in Columbus, OH', initials: 'SR' },
  service: { name: 'Maria Chen', role: 'Lead Technician', dealership: 'State Auto Service Centre', initials: 'MC' },
};

export const portalNotificationsMock: Record<PortalId, AppNotification[]> = {
  dealer: notificationsMock,
  owner: [
    { id: 'on1', title: 'Battery health report ready', body: 'Your Nov 2026 battery report (demo) is available.', time: '2 hr ago', tone: 'positive', read: false },
    { id: 'on2', title: 'High temperature during charging', body: 'Peak 41 °C recorded during a DC session.', time: '3 days ago', tone: 'warning', read: false },
    { id: 'on3', title: 'Inspection confirmed', body: 'Battery inspection booked for Dec 15.', time: '1 week ago', tone: 'neutral', read: true },
  ],
  buyer: [
    { id: 'bn1', title: 'Price drop on a saved vehicle', body: '2022 Kia EV6 dropped by $400 (demo).', time: '1 hr ago', tone: 'positive', read: false },
    { id: 'bn2', title: 'New verified listing', body: '2023 Tesla Model Y with 97% SoH is now listed.', time: 'Yesterday', tone: 'neutral', read: false },
    { id: 'bn3', title: 'Assessment expired', body: 'The 2020 Nissan Leaf battery report is older than 6 months.', time: '2 days ago', tone: 'warning', read: true },
  ],
  service: [
    { id: 'sn1', title: 'Critical alert: pack temperature', body: '2020 Nissan Leaf exceeded 45 °C (demo).', time: '30 min ago', tone: 'critical', read: false },
    { id: 'sn2', title: 'New service request', body: 'Annual inspection requested by Priya Shah.', time: '4 hr ago', tone: 'neutral', read: false },
    { id: 'sn3', title: 'Parts arriving', body: 'Replacement module for T-1040 ships tomorrow.', time: 'Yesterday', tone: 'positive', read: true },
  ],
};
