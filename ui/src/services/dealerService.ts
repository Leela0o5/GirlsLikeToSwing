import type { BatteryPassport, DealerDashboardData, TrendMetric, TrendSeries } from '@/types';
import {
  buildPassport,
  featuredPassportMock,
  kpisMock,
  locationsMock,
  passportIdFor,
  performanceMock,
  recommendationsMock,
  trendSeriesMock,
  vehiclesMock,
} from '@/mocks';
import { mockRequest } from './apiClient';

// TODO(backend): GET /api/dealer/dashboard
export function getDealerDashboard(): Promise<DealerDashboardData> {
  return mockRequest({
    kpis: kpisMock,
    performance: performanceMock,
    locations: locationsMock,
    recommendations: recommendationsMock,
    featuredPassport: featuredPassportMock,
  });
}

// TODO(backend): GET /api/dealer/battery-trend?metric=soh
export function getBatteryTrend(metric: TrendMetric): Promise<TrendSeries> {
  const series = trendSeriesMock.find((s) => s.metric === metric) ?? trendSeriesMock[0];
  return mockRequest(series, 300);
}

// TODO(backend): GET /api/passports/:id  (shared by every portal)
export function getBatteryPassport(id: string): Promise<BatteryPassport | null> {
  if (id === featuredPassportMock.id) return mockRequest(featuredPassportMock);
  const vehicle = vehiclesMock.find((v) => passportIdFor(v.id) === id);
  return mockRequest(vehicle ? buildPassport(vehicle) : null);
}
