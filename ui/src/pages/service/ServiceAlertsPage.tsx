import { useState } from 'react';
import type { AlertSeverity, BatteryAlert } from '@/types';
import { serviceAlertsStore, ticketsStore } from '@/services';
import { useInitialLoading, useStore } from '@/hooks/useStore';
import { Card } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { NativeSelect } from '@/components/ui/field';
import { PageHeader } from '@/components/common/PageHeader';
import { DemoBadge } from '@/components/common/DemoBadge';
import { AlertList } from '@/components/battery';
import { AlertActions } from '@/components/service/AlertActions';

type Filter = 'active' | 'acknowledged' | 'all';

const matchesFilter: Record<Filter, (a: BatteryAlert) => boolean> = {
  active: (a) => !a.acknowledged,
  acknowledged: (a) => a.acknowledged,
  all: () => true,
};
const SEVERITY_ORDER: Record<AlertSeverity, number> = { critical: 0, warning: 1, info: 2 };

export function ServiceAlertsPage() {
  const alerts = useStore(serviceAlertsStore);
  useStore(ticketsStore); // re-render when a ticket is created from an alert
  const loading = useInitialLoading();
  const [filter, setFilter] = useState<Filter>('active');
  const [severity, setSeverity] = useState<'all' | AlertSeverity>('all');

  const rows = alerts
    .filter(matchesFilter[filter])
    .filter((a) => severity === 'all' || a.severity === severity)
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || b.createdAt.localeCompare(a.createdAt));
  const active = alerts.filter((a) => !a.acknowledged).length;

  return (
    <>
      <PageHeader title="Battery Alerts" description="Alerts reported by connected vehicles. Turn an alert into a service ticket in one click." actions={<DemoBadge label="Simulated alerts" />} />
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Tabs
            label="Filter alerts"
            value={filter}
            onChange={setFilter}
            tabs={[
              { id: 'active', label: 'Active', count: active },
              { id: 'acknowledged', label: 'Acknowledged', count: alerts.length - active },
              { id: 'all', label: 'All', count: alerts.length },
            ]}
          />
          <NativeSelect aria-label="Filter by severity" value={severity} onChange={(e) => setSeverity(e.target.value as 'all' | AlertSeverity)} className="h-9 w-44 rounded-full bg-canvas text-xs">
            <option value="all">All severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </NativeSelect>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <AlertList alerts={rows} showVehicle actions={(a) => <AlertActions alert={a} />} />
        )}
      </Card>
    </>
  );
}
