import { useMemo, useState } from 'react';
import type { TrendMetric, TrendPoint, Vehicle, VehicleSpecs } from '@/types';
import { Card, CardHeader } from '@/components/ui/card';
import { Select, type SelectOption } from '@/components/ui/select';
import { ChartTableToggle, type ChartView } from '@/components/charts/ChartTableToggle';
import { DegradationChart, DegradationLegend, TrendSummary, TrendTable } from '@/components/charts/DegradationChart';
import { domainFor } from '@/utils/chart';

const OPTIONS: SelectOption<TrendMetric>[] = [
  { value: 'soh', label: 'Battery Health (SoH)' },
  { value: 'range', label: 'Estimated Range' },
  { value: 'capacity', label: 'Usable Capacity' },
];

interface VehicleDegradationCardProps {
  vehicle: Vehicle;
  specs: VehicleSpecs;
  points: TrendPoint[];
  title?: string;
  subtitle?: string;
  height?: number;
}

const scalePoint = (p: TrendPoint, k: number): TrendPoint => ({
  month: p.month,
  actual: p.actual === null ? null : Math.round(p.actual * k * 10) / 10,
  forecast: p.forecast === null ? null : Math.round(p.forecast * k * 10) / 10,
});

export function VehicleDegradationCard({
  vehicle,
  specs,
  points,
  title = 'Battery Degradation Trend',
  subtitle = 'Monthly history and simulated 12-month forecast',
  height = 280,
}: VehicleDegradationCardProps) {
  const [metric, setMetric] = useState<TrendMetric>('soh');
  const [view, setView] = useState<ChartView>('chart');

  const { data, unit } = useMemo(() => {
    if (metric === 'range') return { data: points.map((p) => scalePoint(p, vehicle.estRangeMiles / vehicle.sohPercent)), unit: ' mi' };
    if (metric === 'capacity') return { data: points.map((p) => scalePoint(p, specs.batteryKwh / 100)), unit: ' kWh' };
    return { data: points, unit: '%' };
  }, [metric, points, vehicle, specs]);

  const domain = domainFor(data, metric === 'soh' ? 100 : Infinity);
  const label = OPTIONS.find((o) => o.value === metric)!.label;

  return (
    <Card aria-labelledby={`deg-${vehicle.id}`}>
      <CardHeader
        titleId={`deg-${vehicle.id}`}
        title={title}
        subtitle={subtitle}
        action={
          <>
            <ChartTableToggle value={view} onChange={setView} />
            <Select aria-label="Select metric" prefix="Metric:" value={metric} options={OPTIONS} onValueChange={setMetric} className="w-[230px] max-sm:w-full" />
          </>
        }
      />
      <TrendSummary points={data} unit={unit} />
      {view === 'chart' ? <DegradationChart points={data} unit={unit} domain={domain} height={height} /> : <TrendTable points={data} unit={unit} label={label} height={height} />}
      <DegradationLegend />
    </Card>
  );
}
