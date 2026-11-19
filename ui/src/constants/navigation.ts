import {
  BarChart3,
  BatteryCharging,
  CarFront,
  CircleHelp,
  LayoutDashboard,
  Repeat2,
  Settings,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { ROUTES } from './routes';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: number;
  /** Match the path exactly (used for index routes) */
  end?: boolean;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Dashboard', to: ROUTES.dashboard, icon: LayoutDashboard, end: true },
  { label: 'Vehicle Inventory', to: ROUTES.inventory, icon: CarFront },
  { label: 'Battery Assessments', to: ROUTES.assessments, icon: BatteryCharging },
  { label: 'Trade-in Requests', to: ROUTES.tradeIns, icon: Repeat2, badge: 18 },
  { label: 'Battery Passport', to: ROUTES.passport, icon: ShieldCheck },
  { label: 'Service & Maintenance', to: ROUTES.service, icon: Wrench },
  { label: 'Reports & Analytics', to: ROUTES.reports, icon: BarChart3 },
];

export const SECONDARY_NAV: NavItem[] = [
  { label: 'Settings', to: ROUTES.settings, icon: Settings },
  { label: 'Help Center', to: ROUTES.help, icon: CircleHelp, badge: 3 },
];
