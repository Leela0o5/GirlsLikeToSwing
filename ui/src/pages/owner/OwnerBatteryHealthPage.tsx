import { useAsync } from '@/hooks/useAsync';
import { getOwnerOverview } from '@/services';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { ErrorState } from '@/components/common/StateViews';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { DemoBadge } from '@/components/common/DemoBadge';
import { KeyValueList } from '@/components/common/KeyValueList';
import { BatteryHealthCard, TelemetryCard, VehicleDegradationCard } from '@/components/battery';
import { formatNumber } from '@/utils/format';
import { cn } from '@/utils/cn';

interface HealthFactor {
  label: string;
  value: string;
  ok: boolean;
  advice: string;
}

export function OwnerBatteryHealthPage() {
  const { data, loading, error } = useAsync(getOwnerOverview, []);
  if (error) return <ErrorState message="Unable to load battery health." />;
  if (loading || !data) return <PageSkeleton withSide={false} />;

  const { vehicle: v, specs, telemetry: t, passport, degradation } = data;
  const factors: HealthFactor[] = [
    { label: 'DC fast-charge share', value: `${t.charging.fastChargeShare}%`, ok: t.charging.fastChargeShare <= 30, advice: 'Keep DC fast charging below ~30% of sessions.' },
    { label: 'Average cell temperature', value: `${t.cellTempAvgC} °C`, ok: t.cellTempAvgC < 32, advice: 'Park in shade or a garage during hot weather.' },
    { label: 'Average depth of discharge', value: `${t.charging.avgDepthOfDischarge}%`, ok: t.charging.avgDepthOfDischarge <= 60, advice: 'Shallow, frequent top-ups are gentler than deep cycles.' },
    { label: 'Daily charge limit', value: `${t.charging.chargeLimitPct}%`, ok: t.charging.chargeLimitPct <= 90, advice: 'An 80–90% daily limit reduces long-term wear.' },
  ];

  return (
    <>
      <PageHeader title="Battery Health" description={`${v.year} ${v.make} ${v.model} · detailed battery condition`} actions={<DemoBadge />} />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
        <div className="min-w-0 space-y-5">
          <VehicleDegradationCard vehicle={v} specs={specs} points={degradation} height={320} />
          <TelemetryCard telemetry={t} chartHeight={260} />
        </div>
        <div className="min-w-0 space-y-5">
          <BatteryHealthCard vehicle={v} lifeRemaining={passport.estLifeRemaining} />
          <Card aria-labelledby="factors-title">
            <CardHeader titleId="factors-title" title="What’s affecting your battery" subtitle="Usage factors (demo thresholds)" />
            <ul className="space-y-3">
              {factors.map((f) => (
                <li key={f.label} className="flex gap-3">
                  {f.ok ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-secondary" aria-label="Within recommended range" />
                  ) : (
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warn" aria-label="Outside recommended range" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="flex justify-between gap-2 text-sm">
                      <span className="text-ink">{f.label}</span>
                      <span className={cn('font-semibold', f.ok ? 'text-ink' : 'text-warn')}>{f.value}</span>
                    </p>
                    <p className="text-xs text-muted">{f.advice}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          <Card aria-labelledby="pack-title">
            <CardHeader titleId="pack-title" title="Battery pack details" />
            <KeyValueList
              items={[
                { label: 'Chemistry', value: specs.chemistry.split(' (')[0] },
                { label: 'Nominal capacity', value: `${specs.batteryKwh} kWh` },
                { label: 'Usable capacity (est.)', value: `${passport.usableCapacityKwh} kWh` },
                { label: 'Charge cycles (est.)', value: formatNumber(passport.cycleCount) },
                { label: 'Pack voltage', value: `${t.packVoltage} V` },
                { label: 'Battery serial', value: <span className="font-mono text-xs">{passport.batterySerial}</span> },
              ]}
            />
          </Card>
        </div>
      </div>
    </>
  );
}
