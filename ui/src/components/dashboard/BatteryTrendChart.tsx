import { useState } from 'react';
import { Info } from 'lucide-react';
import type { TrendMetric } from '@/types';
import { getBatteryTrend } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { Card, CardHeader } from '@/components/ui/card';
import { Select, type SelectOption } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/common/StateViews';
import { ChartTableToggle, type ChartView } from '@/components/charts/ChartTableToggle';
import { DegradationChart, DegradationLegend, TrendSummary, TrendTable } from '@/components/charts/DegradationChart';

const METRIC_OPTIONS: SelectOption<TrendMetric>[] = [
  { value: 'soh', label: 'Battery Health (SoH)' },
  { value: 'range', label: 'Estimated Range' },
  { value: 'capacity', label: 'Usable Capacity' },
];

export function BatteryTrendChart() {
  const [metric, setMetric] = useState<TrendMetric>('soh');
  const [view, setView] = useState<ChartView>('chart');
  const { data: series, loading, error } = useAsync(() => getBatteryTrend(metric), [metric]);

  return (
    <Card aria-labelledby="trend-title">
      <CardHeader
        titleId="trend-title"
        title="Battery Health & Degradation Trend"
        subtitle={
          <span className="inline-flex items-center gap-1">
            Fleet average across assessed inventory <Info className="size-3" aria-label="Values are demo data" />
          </span>
        }
        action={
          <>
            <ChartTableToggle value={view} onChange={setView} />
            <Select
              aria-label="Select metric"
              prefix="Metric:"
              value={metric}
              options={METRIC_OPTIONS}
              onValueChange={setMetric}
              className="w-[230px] max-sm:w-full"
            />
          </>
        }
      />

      {series && <TrendSummary points={series.points} unit={series.unit} />}
      {error && <ErrorState message="Could not load trend data." />}
      {loading && !series && <Skeleton className="h-[300px] w-full rounded-xl" />}
      {series && view === 'table' && <TrendTable points={series.points} unit={series.unit} label={series.label} />}
      {series && view === 'chart' && <DegradationChart points={series.points} unit={series.unit} domain={series.domain} dimmed={loading} />}
      <DegradationLegend />
    </Card>
  );
}
