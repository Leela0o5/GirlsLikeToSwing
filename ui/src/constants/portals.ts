import {
  Bell,
  Building2,
  CarFront,
  CircleHelp,
  ClipboardCheck,
  ClipboardList,
  GitCompareArrows,
  Heart,
  History,
  LayoutDashboard,
  PlugZap,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Activity,
  BadgeDollarSign,
  FileText,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { PortalId } from '@/types';
import { PRIMARY_NAV, SECONDARY_NAV, type NavItem } from './navigation';
import { BUYER_ROUTES, OWNER_ROUTES, SERVICE_ROUTES, passportPath } from './routes';
import { featuredPassportMock } from '@/mocks/dealerDashboard';

export interface PortalConfig {
  id: PortalId;
  label: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  basePath: string;
  navSectionLabel: string;
  primaryNav: NavItem[];
  secondaryNav: NavItem[];
  searchPlaceholder: string;
  searchAllRoute?: (q: string) => string;
}

const helpAndSettings = (base: string): NavItem[] => [
  { label: 'Settings', to: `${base}/settings`, icon: Settings },
  { label: 'Help Center', to: `${base}/help`, icon: CircleHelp },
];

export const PORTALS: Record<PortalId, PortalConfig> = {
  dealer: {
    id: 'dealer',
    label: 'Dealer',
    tagline: 'Dealer Portal',
    description: 'Inventory battery health, trade-ins and dealership performance.',
    icon: Building2,
    basePath: '/dealer',
    navSectionLabel: 'Dealer',
    primaryNav: PRIMARY_NAV,
    secondaryNav: SECONDARY_NAV,
    searchPlaceholder: 'Search vehicles, dealers, or battery reports...',
    searchAllRoute: (q) => `/dealer/inventory?q=${encodeURIComponent(q)}`,
  },
  owner: {
    id: 'owner',
    label: 'Owner',
    tagline: 'Owner Portal',
    description: 'Your EV’s battery health, charging, alerts and passport.',
    icon: CarFront,
    basePath: OWNER_ROUTES.dashboard,
    navSectionLabel: 'My EV',
    primaryNav: [
      { label: 'Dashboard', to: OWNER_ROUTES.dashboard, icon: LayoutDashboard, end: true },
      { label: 'Battery Health', to: OWNER_ROUTES.health, icon: Activity },
      { label: 'Charging & Usage', to: OWNER_ROUTES.charging, icon: PlugZap },
      { label: 'Alerts', to: OWNER_ROUTES.alerts, icon: Bell },
      { label: 'Service History', to: OWNER_ROUTES.service, icon: Wrench },
      { label: 'Battery Passport', to: passportPath('owner', featuredPassportMock.id), icon: ShieldCheck },
      { label: 'Valuation', to: OWNER_ROUTES.valuation, icon: BadgeDollarSign },
    ],
    secondaryNav: helpAndSettings(OWNER_ROUTES.dashboard),
    searchPlaceholder: 'Search alerts or service records...',
  },
  buyer: {
    id: 'buyer',
    label: 'Buyer',
    tagline: 'Buyer Portal',
    description: 'Browse used EVs with verified battery health reports.',
    icon: ShoppingBag,
    basePath: BUYER_ROUTES.explore,
    navSectionLabel: 'Marketplace',
    primaryNav: [
      { label: 'Explore Listings', to: BUYER_ROUTES.explore, icon: Search, end: true },
      { label: 'Compare', to: BUYER_ROUTES.compare, icon: GitCompareArrows },
      { label: 'Saved Vehicles', to: BUYER_ROUTES.saved, icon: Heart },
      { label: 'Battery Reports', to: BUYER_ROUTES.reports, icon: FileText },
    ],
    secondaryNav: helpAndSettings(BUYER_ROUTES.explore),
    searchPlaceholder: 'Search make, model, location...',
    searchAllRoute: (q) => `${BUYER_ROUTES.explore}?q=${encodeURIComponent(q)}`,
  },
  service: {
    id: 'service',
    label: 'Service',
    tagline: 'Service Portal',
    description: 'Service tickets, battery inspections and alerts.',
    icon: Wrench,
    basePath: SERVICE_ROUTES.dashboard,
    navSectionLabel: 'Service Centre',
    primaryNav: [
      { label: 'Dashboard', to: SERVICE_ROUTES.dashboard, icon: LayoutDashboard, end: true },
      { label: 'Service Tickets', to: SERVICE_ROUTES.tickets, icon: ClipboardList },
      { label: 'Inspections', to: SERVICE_ROUTES.inspections, icon: ClipboardCheck },
      { label: 'Battery Alerts', to: SERVICE_ROUTES.alerts, icon: Bell },
      { label: 'Service History', to: SERVICE_ROUTES.history, icon: History },
    ],
    secondaryNav: helpAndSettings(SERVICE_ROUTES.dashboard),
    searchPlaceholder: 'Search tickets, VINs, customers...',
    searchAllRoute: (q) => `${SERVICE_ROUTES.tickets}?q=${encodeURIComponent(q)}`,
  },
};

export const PORTAL_ORDER: PortalId[] = ['dealer', 'owner', 'buyer', 'service'];
