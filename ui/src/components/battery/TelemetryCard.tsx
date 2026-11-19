import { useState } from 'react';
import { Thermometer } from 'lucide-react';
import type { BatteryTelemetry } from '@/types';
import { Card, CardHeader } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { DemoBadge } from '@/components/common/DemoBadge';
import { formatDateTime } from '@/utils/format';
import { cn } from '@/utils/cn';
import { TEMP_CAUTION_C, TemperatureChart, TemperatureLegend } from './TemperatureChart';
import { ModuleVoltageBars } from './ModuleVoltageBars';

type TelemetryTab = 'temperature' | 'voltage';

interface TelemetryCardProps {
  telemetry: BatteryTelemetry;
  title?: string;
  chartHeight?: number;
}

export function TelemetryCard({ telemetry: t, title = 'Temperature & Voltage', chartHeight = 220 }: TelemetryCardProps) {
  const [tab, setTab] = useState<TelemetryTab>('temperature');
  const hot = t.cellTempMaxC >= TEMP_CAUTION_C;
  const stats = [
    { label: 'Pack voltage', value: `${t.packVoltage} V` },
    { label: 'Avg cell temp', value: `${t.cellTempAvgC} °C` },
    { label: 'Max cell temp (24h)', value: `${t.cellTempMaxC} °C`, warn: hot },
    { label: 'Coolant temp', value: `${t.coolantTempC} °C` },
  ];

  return (
    <Card className="flex flex-col" aria-labelledby={`tel-${t.vehicleId}`}>
      <CardHeader
        titleId={`tel-${t.vehicleId}`}
        title={title}
        subtitle={`Last updated ${formatDateTime(t.lastUpdated)}`}
        action={<DemoBadge />}
      />
      <dl className="mb-4 grid grid-cols-2 gap-3 rounded-2xl bg-canvas px-4 py-3 text-xs sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="text-muted">{s.label}</dt>
            <dd className={cn('flex items-center gap-1 text-base font-semibold', s.warn ? 'text-danger' : 'text-ink')}>
              {s.warn && <Thermometer className="size-4" aria-label="Above caution threshold" />}
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
      <Tabs
        label="Telemetry view"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'temperature', label: 'Cell temperature (24h)' },
          { id: 'voltage', label: `Module voltage (${t.moduleVoltages.length})` },
        ]}
        className="mb-4 self-start"
      />
      <div role="tabpanel" className="flex-1">
        {tab === 'temperature' ? (
          <>
            <TemperatureChart history={t.tempHistory} height={chartHeight} />
            <TemperatureLegend />
          </>
        ) : (
          <ModuleVoltageBars modules={t.moduleVoltages} />
        )}
      </div>
    </Card>
  );
}
