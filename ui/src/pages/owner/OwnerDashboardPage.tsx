import { useAsync } from '@/hooks/useAsync';
import { Link } from 'react-router-dom';
import { CalendarCheck } from 'lucide-react';
import type { KpiMetric } from '@/types';
import { getOwnerOverview, ownerAlertsStore, ownerAppointmentsStore } from '@/services';
import { useStore } from '@/hooks/useStore';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ErrorState } from '@/components/common/StateViews';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { SectionLink } from '@/components/common/SectionLink';
import { KpiStrip, BatteryPassportCard } from '@/components/dashboard';
import {
  AlertList,
  BatteryHealthCard,
  ChargingCard,
  ServiceHistoryTimeline,
  TelemetryCard,
  VehicleDegradationCard,
  VehicleHeroCard,
} from '@/components/battery';
import { ValuationSummaryCard } from '@/components/owner/ValuationSummaryCard';
import { summarizeTrend } from '@/components/charts/DegradationChart';
import { OWNER_ROUTES } from '@/constants/routes';
import { formatDate } from '@/utils/format';

export function OwnerDashboardPage() {
  const { data, loading, error } = useAsync(getOwnerOverview, []);
  const alerts = useStore(ownerAlertsStore);
  const appointments = useStore(ownerAppointmentsStore);

  if (error) return <ErrorState message="Unable to load your vehicle data." />;
  if (loading || !data) return <PageSkeleton />;

  const { vehicle: v, specs, telemetry, registration, charging, valuation, passport, serviceHistory, degradation } = data;
  const trend = summarizeTrend(degradation);
  const active = alerts.filter((a) => !a.acknowledged);
  const nextAppointment = appointments[0];

  const kpis: KpiMetric[] = [
    { id: 'soh', label: 'State of Health', value: String(v.sohPercent), unit: '%', icon: 'health', delta: `${trend.change} pts in 12 months`, trend: 'down', tone: 'positive' },
    { id: 'soc', label: 'State of Charge', value: String(v.socPercent), unit: '%', icon: 'soc', delta: `Charge limit ${telemetry.charging.chargeLimitPct}%`, trend: 'flat', tone: 'neutral' },
    { id: 'range', label: 'Estimated Range', value: String(v.estRangeMiles), unit: ' mi', icon: 'range', delta: `${specs.epaRangeNewMiles} mi when new`, trend: 'flat', tone: 'neutral' },
    { id: 'life', label: 'Battery Life Remaining', value: passport.estLifeRemaining.replace(' years', ''), unit: ' yrs', icon: 'life', delta: `Warranty to ${formatDate(registration.warrantyUntil)}`, trend: 'flat', tone: 'positive' },
  ];

  return (
    <>
      <h1 className="sr-only">Owner dashboard</h1>
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,400px)]">
        <div className="@container min-w-0 space-y-5">
          <KpiStrip metrics={kpis} />
          <div className="grid grid-cols-1 gap-5 @3xl:grid-cols-2">
            <BatteryHealthCard vehicle={v} lifeRemaining={passport.estLifeRemaining} />
            <TelemetryCard telemetry={telemetry} chartHeight={200} />
          </div>
          <VehicleDegradationCard vehicle={v} specs={specs} points={degradation} />
          <ChargingCard summary={charging} fastChargeShare={telemetry.charging.fastChargeShare} />
          <Card aria-labelledby="svc-title">
            <CardHeader titleId="svc-title" title="Service & Maintenance" subtitle="Recent visits" action={<SectionLink to={OWNER_ROUTES.service}>Full history</SectionLink>} />
            {nextAppointment && (
              <p className="mb-4 flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2.5 text-sm text-primary">
                <CalendarCheck className="size-4 shrink-0" aria-hidden="true" />
                Next: {nextAppointment.type} on {formatDate(nextAppointment.date)} ·{' '}
                <Badge tone={nextAppointment.status === 'Confirmed' ? 'positive' : 'warning'} size="sm">
                  {nextAppointment.status}
                </Badge>
              </p>
            )}
            <ServiceHistoryTimeline records={serviceHistory} limit={3} />
          </Card>
        </div>

        <aside className="grid min-w-0 grid-cols-1 items-start gap-5 md:grid-cols-2 xl:grid-cols-1" aria-label="Vehicle and alerts">
          <VehicleHeroCard
            vehicle={v}
            eyebrow="My registered EV"
            badges={<Badge tone="solid">{registration.plate}</Badge>}
            details={[
              { label: 'VIN', value: <span className="font-mono text-xs">{v.vin}</span> },
              { label: 'Colour', value: registration.color },
              { label: 'Registered', value: formatDate(registration.registeredOn) },
              { label: 'Owner since', value: formatDate(registration.ownerSince) },
              { label: 'Home charger', value: registration.homeCharger },
            ]}
          />
          <Card aria-labelledby="alerts-title">
            <CardHeader
              titleId="alerts-title"
              title="Battery Alerts"
              subtitle={`${active.length} active`}
              action={<SectionLink to={OWNER_ROUTES.alerts}>View all</SectionLink>}
            />
            <AlertList alerts={active.slice(0, 3)} compact />
            {active.length === 0 && (
              <p className="text-center text-xs text-muted">
                <Link to={OWNER_ROUTES.alerts} className="text-secondary hover:underline">See acknowledged alerts</Link>
              </p>
            )}
          </Card>
          <ValuationSummaryCard valuation={valuation} />
          <BatteryPassportCard passport={passport} />
        </aside>
      </div>
    </>
  );
}
