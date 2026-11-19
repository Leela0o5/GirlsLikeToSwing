import { lazy, type ComponentType } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { BarChart3, BatteryCharging, CircleHelp, Repeat2, Settings, Wrench } from 'lucide-react';
import type { PortalId } from '@/types';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PlaceholderPage } from '@/pages/shared/PlaceholderPage';
import { NotFoundPage } from '@/pages/shared/NotFoundPage';
import { PortalChooserPage } from '@/pages/shared/PortalChooserPage';
import { PORTALS } from '@/constants/portals';
import { passportPath } from '@/constants/routes';
import { featuredPassportMock } from '@/mocks/dealerDashboard';

function page<K extends string>(loader: () => Promise<Record<K, ComponentType>>, name: K) {
  return lazy(() => loader().then((m) => ({ default: m[name] })));
}

const DealerDashboardPage = page(() => import('@/pages/dealer/DealerDashboardPage'), 'DealerDashboardPage');
const VehicleInventoryPage = page(() => import('@/pages/dealer/VehicleInventoryPage'), 'VehicleInventoryPage');
const BatteryPassportPage = page(() => import('@/pages/dealer/BatteryPassportPage'), 'BatteryPassportPage');
const PassportDetailPage = page(() => import('@/pages/shared/PassportDetailPage'), 'PassportDetailPage');
const OwnerDashboardPage = page(() => import('@/pages/owner/OwnerDashboardPage'), 'OwnerDashboardPage');
const OwnerBatteryHealthPage = page(() => import('@/pages/owner/OwnerBatteryHealthPage'), 'OwnerBatteryHealthPage');
const OwnerChargingPage = page(() => import('@/pages/owner/OwnerChargingPage'), 'OwnerChargingPage');
const OwnerAlertsPage = page(() => import('@/pages/owner/OwnerAlertsPage'), 'OwnerAlertsPage');
const OwnerServicePage = page(() => import('@/pages/owner/OwnerServicePage'), 'OwnerServicePage');
const OwnerValuationPage = page(() => import('@/pages/owner/OwnerValuationPage'), 'OwnerValuationPage');
const BuyerShell = page(() => import('@/components/buyer/BuyerShell'), 'BuyerShell');
const BuyerExplorePage = page(() => import('@/pages/buyer/BuyerExplorePage'), 'BuyerExplorePage');
const BuyerListingDetailPage = page(() => import('@/pages/buyer/BuyerListingDetailPage'), 'BuyerListingDetailPage');
const BuyerComparePage = page(() => import('@/pages/buyer/BuyerComparePage'), 'BuyerComparePage');
const BuyerSavedPage = page(() => import('@/pages/buyer/BuyerSavedPage'), 'BuyerSavedPage');
const BuyerReportsPage = page(() => import('@/pages/buyer/BuyerReportsPage'), 'BuyerReportsPage');
const ServiceDashboardPage = page(() => import('@/pages/service/ServiceDashboardPage'), 'ServiceDashboardPage');
const ServiceTicketsPage = page(() => import('@/pages/service/ServiceTicketsPage'), 'ServiceTicketsPage');
const ServiceTicketDetailPage = page(() => import('@/pages/service/ServiceTicketDetailPage'), 'ServiceTicketDetailPage');
const ServiceInspectionsPage = page(() => import('@/pages/service/ServiceInspectionsPage'), 'ServiceInspectionsPage');
const ServiceAlertsPage = page(() => import('@/pages/service/ServiceAlertsPage'), 'ServiceAlertsPage');
const ServiceHistoryPage = page(() => import('@/pages/service/ServiceHistoryPage'), 'ServiceHistoryPage');
const ServiceVehiclePage = page(() => import('@/pages/service/ServiceVehiclePage'), 'ServiceVehiclePage');

function commonRoutes(portal: PortalId) {
  const label = PORTALS[portal].tagline;
  return [
    <Route key="settings" path="settings" element={<PlaceholderPage title="Settings" description={`${label} preferences and account.`} icon={Settings} />} />,
    <Route key="help" path="help" element={<PlaceholderPage title="Help Center" description="Guides, FAQs and support." icon={CircleHelp} />} />,
    <Route key="passport-detail" path="passport/:id" element={<PassportDetailPage />} />,
    <Route key="404" path="*" element={<NotFoundPage />} />,
  ];
}

// `key` on each layout forces a fresh shell (search, notifications) when switching portals.
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PortalChooserPage />} />

      <Route path="/dealer" element={<DashboardLayout key="dealer" portal="dealer" />}>
        <Route index element={<DealerDashboardPage />} />
        <Route path="inventory" element={<VehicleInventoryPage />} />
        <Route path="passport" element={<BatteryPassportPage />} />
        <Route
          path="assessments"
          element={<PlaceholderPage title="Battery Assessments" description="Run and review battery health assessments." icon={BatteryCharging} planned={['Start a new assessment', 'Assessment history per vehicle', 'Downloadable assessment reports']} />}
        />
        <Route
          path="trade-ins"
          element={<PlaceholderPage title="Trade-in Requests" description="Review and appraise incoming EV trade-ins." icon={Repeat2} planned={['Incoming request queue', 'Battery-adjusted appraisal', 'Offer approval workflow']} />}
        />
        <Route
          path="service"
          element={<PlaceholderPage title="Service & Maintenance" description="Schedule inspections and track battery service." icon={Wrench} planned={['Inspection scheduling', 'Thermal system checks', 'Service history sync']} />}
        />
        <Route
          path="reports"
          element={<PlaceholderPage title="Reports & Analytics" description="Fleet-level battery analytics and exports." icon={BarChart3} planned={['Inventory SoH distribution', 'Regional benchmarks', 'CSV / PDF export']} />}
        />
        {commonRoutes('dealer')}
      </Route>

      <Route path="/owner" element={<DashboardLayout key="owner" portal="owner" />}>
        <Route index element={<OwnerDashboardPage />} />
        <Route path="health" element={<OwnerBatteryHealthPage />} />
        <Route path="charging" element={<OwnerChargingPage />} />
        <Route path="alerts" element={<OwnerAlertsPage />} />
        <Route path="service" element={<OwnerServicePage />} />
        <Route path="valuation" element={<OwnerValuationPage />} />
        <Route path="passport" element={<Navigate to={passportPath('owner', featuredPassportMock.id)} replace />} />
        {commonRoutes('owner')}
      </Route>

      <Route path="/buyer" element={<DashboardLayout key="buyer" portal="buyer" />}>
        <Route element={<BuyerShell />}>
          <Route index element={<BuyerExplorePage />} />
          <Route path="listings/:id" element={<BuyerListingDetailPage />} />
          <Route path="compare" element={<BuyerComparePage />} />
          <Route path="saved" element={<BuyerSavedPage />} />
          <Route path="reports" element={<BuyerReportsPage />} />
          <Route path="passport" element={<Navigate to="/buyer/reports" replace />} />
          {commonRoutes('buyer')}
        </Route>
      </Route>

      <Route path="/service" element={<DashboardLayout key="service" portal="service" />}>
        <Route index element={<ServiceDashboardPage />} />
        <Route path="tickets" element={<ServiceTicketsPage />} />
        <Route path="tickets/:id" element={<ServiceTicketDetailPage />} />
        <Route path="inspections" element={<ServiceInspectionsPage />} />
        <Route path="alerts" element={<ServiceAlertsPage />} />
        <Route path="history" element={<ServiceHistoryPage />} />
        <Route path="vehicles/:id" element={<ServiceVehiclePage />} />
        <Route path="passport" element={<Navigate to="/service" replace />} />
        {commonRoutes('service')}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
