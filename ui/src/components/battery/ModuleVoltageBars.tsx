import { AlertTriangle } from 'lucide-react';
import type { ModuleVoltage } from '@/types';
import { cn } from '@/utils/cn';

/** Deviation from pack mean above which a module is flagged (demo threshold). */
const OUTLIER_V = 0.03;
const SCALE_MIN = 3.7;
const SCALE_MAX = 4.0;

export function voltageSpreadMv(modules: ModuleVoltage[]) {
  const vs = modules.map((m) => m.voltage);
  return Math.round((Math.max(...vs) - Math.min(...vs)) * 1000);
}

export function ModuleVoltageBars({ modules }: { modules: ModuleVoltage[] }) {
  const mean = modules.reduce((s, m) => s + m.voltage, 0) / modules.length;
  const spread = voltageSpreadMv(modules);
  return (
    <div>
      <p className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <span>
          Mean <span className="font-semibold text-ink">{mean.toFixed(3)} V</span>
        </span>
        <span>
          Spread <span className={cn('font-semibold', spread > 50 ? 'text-warn' : 'text-ink')}>{spread} mV</span>
        </span>
      </p>
      <ul className="space-y-2.5">
        {modules.map((m) => {
          const outlier = Math.abs(m.voltage - mean) > OUTLIER_V;
          const pct = ((m.voltage - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;
          return (
            <li key={m.module} className="flex items-center gap-3 text-sm">
              <span className="w-8 text-xs text-muted">{m.module}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
                <span className={cn('block h-full rounded-full', outlier ? 'bg-warn' : 'bg-secondary')} style={{ width: `${pct}%` }} />
              </span>
              <span className={cn('flex w-20 items-center justify-end gap-1 text-right tabular-nums', outlier ? 'font-semibold text-warn' : 'text-ink')}>
                {outlier && <AlertTriangle className="size-3.5" aria-label="Outside expected range" />}
                {m.voltage.toFixed(2)} V
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
