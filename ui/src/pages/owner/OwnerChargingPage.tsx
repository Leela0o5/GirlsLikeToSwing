import { useAsync } from '@/hooks/useAsync';
import { getOwnerOverview } from '@/services';
import { useState } from 'react';
import { Home, Lightbulb, Zap } from 'lucide-react';
import type { ChargingSession } from '@/types';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { ErrorState, EmptyState } from '@/components/common/StateViews';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { DemoBadge } from '@/components/common/DemoBadge';
import { DataTable, type Column } from '@/components/common/DataTable';
import { KeyValueList } from '@/components/common/KeyValueList';
import { ChargingCard } from '@/components/battery';
import { formatDate } from '@/utils/format';

type SessionFilter = 'all' | 'AC' | 'DC';

const columns: Column<ChargingSession>[] = [
  { key: 'date', header: 'Date', rowHeader: true, render: (s) => formatDate(s.date) },
  { key: 'loc', header: 'Location', render: (s) => s.location },
  {
    key: 'type',
    header: 'Type',
    render: (s) => (
      <Badge tone={s.type === 'DC' ? 'warning' : 'positive'} size="sm">
        {s.type === 'DC' ? <Zap aria-hidden="true" /> : <Home aria-hidden="true" />} {s.type}
      </Badge>
    ),
  },
  { key: 'soc', header: 'SoC', render: (s) => `${s.startSoc}% → ${s.endSoc}%` },
  { key: 'kwh', header: 'Energy', align: 'right', render: (s) => `${s.energyKwh} kWh` },
  { key: 'dur', header: 'Duration', align: 'right', render: (s) => (s.durationMin >= 60 ? `${Math.floor(s.durationMin / 60)}h ${s.durationMin % 60}m` : `${s.durationMin} min`) },
  { key: 'temp', header: 'Peak temp', align: 'right', render: (s) => <span className={s.peakTempC >= 40 ? 'font-semibold text-danger' : undefined}>{s.peakTempC} °C</span> },
];

export function OwnerChargingPage() {
  const { data, loading, error } = useAsync(getOwnerOverview, []);
  const [filter, setFilter] = useState<SessionFilter>('all');

  if (error) return <ErrorState message="Unable to load charging data." />;
  if (loading || !data) return <PageSkeleton withSide={false} />;

  const { charging, telemetry: t, registration } = data;
  const sessions = charging.sessions.filter((s) => filter === 'all' || s.type === filter);
  const count = (type: 'AC' | 'DC') => charging.sessions.filter((s) => s.type === type).length;

  return (
    <>
      <PageHeader title="Charging & Usage" description="How and where you charge, and how much you drive." actions={<DemoBadge />} />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <div className="min-w-0 space-y-5">
          <ChargingCard summary={charging} fastChargeShare={t.charging.fastChargeShare} />
          <Card className="p-0 sm:p-0" aria-labelledby="sessions-title">
            <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-4 sm:p-6 sm:pb-4">
              <div>
                <h2 id="sessions-title" className="text-[17px] font-semibold text-ink">Recent charging sessions</h2>
                <p className="text-xs text-muted">Last 10 sessions</p>
              </div>
              <Tabs
                label="Filter sessions"
                value={filter}
                onChange={setFilter}
                tabs={[
                  { id: 'all', label: 'All', count: charging.sessions.length },
                  { id: 'AC', label: 'AC', count: count('AC') },
                  { id: 'DC', label: 'DC fast', count: count('DC') },
                ]}
              />
            </div>
            <DataTable
              rows={sessions}
              columns={columns}
              getRowId={(s) => s.id}
              caption="Recent charging sessions"
              empty={<EmptyState title="No sessions of this type" />}
            />
          </Card>
        </div>
        <div className="min-w-0 space-y-5">
          <Card aria-labelledby="profile-title">
            <CardHeader titleId="profile-title" title="Charging profile" />
            <KeyValueList
              items={[
                { label: 'Home charger', value: registration.homeCharger },
                { label: 'Daily charge limit', value: `${t.charging.chargeLimitPct}%` },
                { label: 'Last charge', value: `${t.charging.lastChargeType} · ${formatDate(t.charging.lastChargeDate)}` },
                { label: 'Avg charge power', value: `${t.charging.avgChargePowerKw} kW` },
                { label: 'Home/work charging', value: `${charging.homeChargingShare}%` },
                { label: 'Efficiency', value: `${charging.efficiencyMiPerKwh} mi/kWh` },
              ]}
            />
          </Card>
          <Card aria-labelledby="tips-title">
            <CardHeader
              titleId="tips-title"
              title="Charging tips"
              icon={
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-brand-50 text-primary" aria-hidden="true">
                  <Lightbulb className="size-4" />
                </span>
              }
            />
            <ul className="space-y-2.5 text-sm text-ink">
              <li>• Set your daily limit to 80–90% and charge to 100% only before long trips.</li>
              <li>• Precondition the battery before DC fast charging to limit heat.</li>
              <li>• Avoid leaving the car below 10% or at 100% for long periods.</li>
            </ul>
            <p className="mt-4 text-[11px] text-muted">General guidance — not personalised advice.</p>
          </Card>
        </div>
      </div>
    </>
  );
}
