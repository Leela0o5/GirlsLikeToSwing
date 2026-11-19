import type { ReactNode } from 'react';
import { AlertOctagon, AlertTriangle, BellOff, CheckCircle2, Info } from 'lucide-react';
import type { AlertSeverity, BatteryAlert } from '@/types';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/StateViews';
import { getVehicleSync } from '@/services';
import { formatDateTime, vehicleName } from '@/utils/format';
import { cn } from '@/utils/cn';

export const severityMeta: Record<AlertSeverity, { label: string; tone: 'critical' | 'warning' | 'neutral'; icon: typeof Info; ring: string }> = {
  critical: { label: 'Critical', tone: 'critical', icon: AlertOctagon, ring: 'bg-danger-soft text-danger' },
  warning: { label: 'Warning', tone: 'warning', icon: AlertTriangle, ring: 'bg-warn-soft text-warn' },
  info: { label: 'Info', tone: 'neutral', icon: Info, ring: 'bg-canvas text-muted' },
};

export function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  const m = severityMeta[severity];
  return (
    <Badge tone={m.tone} size="sm">
      <m.icon aria-hidden="true" /> {m.label}
    </Badge>
  );
}

interface AlertListProps {
  alerts: BatteryAlert[];
  showVehicle?: boolean;
  actions?: (alert: BatteryAlert) => ReactNode;
  onSelect?: (alert: BatteryAlert) => void;
  compact?: boolean;
}

/** Battery alerts with severity icon + label (never colour alone). */
export function AlertList({ alerts, showVehicle = false, actions, onSelect, compact = false }: AlertListProps) {
  if (alerts.length === 0) {
    return <EmptyState icon={BellOff} title="No alerts" description="Nothing needs your attention right now." />;
  }
  return (
    <ul className="space-y-2.5">
      {alerts.map((a) => {
        const m = severityMeta[a.severity];
        const v = showVehicle ? getVehicleSync(a.vehicleId) : undefined;
        const body = (
          <>
            <span className={cn('inline-flex size-9 shrink-0 items-center justify-center rounded-full', a.acknowledged ? 'bg-canvas text-muted' : m.ring)} aria-hidden="true">
              <m.icon className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className={cn('text-sm font-semibold', a.acknowledged ? 'text-muted' : 'text-ink')}>{a.title}</span>
                {!compact && <SeverityBadge severity={a.severity} />}
                {a.acknowledged && (
                  <Badge tone="neutral" size="sm">
                    <CheckCircle2 aria-hidden="true" /> Acknowledged
                  </Badge>
                )}
              </span>
              <span className="mt-0.5 block text-xs text-muted">{a.detail}</span>
              <span className="mt-1 block text-[11px] text-muted/90">
                {v && <>{vehicleName(v)} · </>}
                <span className="capitalize">{a.category}</span> · {formatDateTime(a.createdAt)}
              </span>
            </span>
          </>
        );
        return (
          <li key={a.id} className={cn('@container rounded-2xl border px-3 py-3', a.acknowledged ? 'border-line bg-card' : 'border-line bg-card shadow-sm')}>
            <div className="flex flex-col gap-3 @lg:flex-row @lg:items-start">
              {onSelect ? (
                <button type="button" onClick={() => onSelect(a)} className="flex min-w-0 flex-1 gap-3 text-left" aria-label={`Open alert: ${a.title}`}>
                  {body}
                </button>
              ) : (
                <div className="flex min-w-0 flex-1 gap-3">{body}</div>
              )}
              {actions && <div className="flex shrink-0 flex-wrap gap-2 pl-12 @lg:pl-0">{actions(a)}</div>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
