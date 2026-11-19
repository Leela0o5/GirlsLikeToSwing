import { Card, CardHeader } from '@/components/ui/card';
import { KeyValueList } from '@/components/common/KeyValueList';
import { BatteryHealthCard, ServiceHistoryTimeline, TelemetryCard } from '@/components/battery';
import type { VehicleBundle } from '@/services';
import { estimateLife } from '@/utils/battery';
import { formatDate } from '@/utils/format';

export function VehicleBatteryPanel({ bundle }: { bundle: VehicleBundle }) {
  const { vehicle: v, telemetry: t, serviceHistory } = bundle;
  return (
    <div className="@container space-y-5">
      <div className="grid grid-cols-1 gap-5 @3xl:grid-cols-2">
        <BatteryHealthCard vehicle={v} lifeRemaining={estimateLife(v.sohPercent)} title="Battery condition" />
        <Card aria-labelledby={`charging-${v.id}`}>
          <CardHeader titleId={`charging-${v.id}`} title="Charging information" subtitle="From last telemetry sync (demo)" />
          <KeyValueList
            items={[
              { label: 'Last charge', value: `${t.charging.lastChargeType} · ${formatDate(t.charging.lastChargeDate)}` },
              { label: 'DC fast-charge share', value: <span className={t.charging.fastChargeShare > 40 ? 'text-warn' : undefined}>{t.charging.fastChargeShare}%</span> },
              { label: 'Avg charge power', value: `${t.charging.avgChargePowerKw} kW` },
              { label: 'Avg depth of discharge', value: `${t.charging.avgDepthOfDischarge}%` },
              { label: 'Charge limit', value: `${t.charging.chargeLimitPct}%` },
              { label: 'Pack voltage', value: `${t.packVoltage} V` },
            ]}
          />
        </Card>
      </div>
      <TelemetryCard telemetry={t} chartHeight={240} />
      <Card aria-labelledby={`history-${v.id}`}>
        <CardHeader titleId={`history-${v.id}`} title="Previous service history" subtitle={`${serviceHistory.length} records (demo)`} />
        <ServiceHistoryTimeline records={serviceHistory} />
      </Card>
    </div>
  );
}
