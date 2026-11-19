import { Clock4, Gauge, ShieldCheck } from 'lucide-react';
import type { Tone, Vehicle } from '@/types';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DemoBadge } from '@/components/common/DemoBadge';
import { CircularProgress } from '@/components/common/CircularProgress';
import { StatItem } from '@/components/common/StatItem';
import { BatteryHealthGauge } from '@/components/dashboard/BatteryHealthGauge';
import { riskTone } from '@/utils/format';

interface BatteryHealthCardProps {
  vehicle: Vehicle;
  lifeRemaining: string;
  title?: string;
  subtitle?: string;
}

function healthBand(soh: number): { label: string; tone: Tone } {
  if (soh >= 90) return { label: 'Excellent', tone: 'positive' };
  if (soh >= 85) return { label: 'Good', tone: 'positive' };
  if (soh >= 80) return { label: 'Fair', tone: 'warning' };
  return { label: 'Needs attention', tone: 'critical' };
}

const riskText: Record<Tone, string> = {
  positive: 'text-secondary',
  warning: 'text-warn',
  critical: 'text-danger',
  neutral: 'text-ink',
};

export function BatteryHealthCard({ vehicle: v, lifeRemaining, title = 'Battery Health', subtitle }: BatteryHealthCardProps) {
  const band = healthBand(v.sohPercent);
  return (
    <Card className="@container flex flex-col" aria-labelledby={`health-${v.id}`}>
      <CardHeader titleId={`health-${v.id}`} title={title} subtitle={subtitle ?? 'State of Health (SoH) and State of Charge (SoC)'} action={<DemoBadge />} />
      <div className="flex flex-1 flex-col items-center gap-5 @md:flex-row @md:items-center">
        <div className="flex w-full flex-1 flex-col items-center">
          <BatteryHealthGauge value={v.sohPercent} label="Battery state of health" caption="% SoH" size={220} />
          <Badge tone={band.tone} className="-mt-3">
            {band.label}
          </Badge>
        </div>
        <div className="flex w-full flex-col items-center gap-4 border-t border-line pt-4 @md:w-[180px] @md:border-l @md:border-t-0 @md:pl-5 @md:pt-0">
          <CircularProgress value={v.socPercent} size={92} stroke={7} color="var(--color-lime)" label="State of charge">
            <span className="text-lg font-semibold text-ink">{v.socPercent}%</span>
            <span className="text-[10px] text-muted">SoC</span>
          </CircularProgress>
          <dl className="grid w-full grid-cols-3 gap-3 @md:grid-cols-1">
            <StatItem icon={Gauge} label="Est. range" value={`${v.estRangeMiles} mi`} />
            <StatItem icon={Clock4} label="Battery life left" value={lifeRemaining} />
            <StatItem
              icon={ShieldCheck}
              label="Risk level"
              value={v.risk}
              valueClassName={riskText[riskTone(v.risk)]}
            />
          </dl>
        </div>
      </div>
    </Card>
  );
}
