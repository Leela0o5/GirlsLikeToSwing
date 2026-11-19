import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BadgeDollarSign,
  BatteryCharging,
  BatteryFull,
  Bell,
  CarFront,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock4,
  Gauge,
  PlugZap,
  Repeat2,
  Store,
  Thermometer,
  type LucideIcon,
} from 'lucide-react';
import type { KpiIcon, KpiMetric, Tone, Trend } from '@/types';
import { IconBubble } from '@/components/common/IconBubble';
import { cn } from '@/utils/cn';

const ICONS: Record<KpiIcon, LucideIcon> = {
  assessed: CarFront,
  health: BatteryFull,
  tradein: Repeat2,
  attention: AlertTriangle,
  soc: BatteryCharging,
  range: Gauge,
  life: Clock4,
  temperature: Thermometer,
  tickets: ClipboardList,
  inspection: ClipboardCheck,
  alert: Bell,
  completed: CheckCircle2,
  listings: Store,
  verified: BadgeCheck,
  value: BadgeDollarSign,
  charging: PlugZap,
};

const TREND_ICONS: Record<Trend, LucideIcon> = { up: ArrowUpRight, down: ArrowDownRight, flat: ArrowRight };

const deltaColor: Record<Tone, string> = {
  positive: 'text-secondary',
  warning: 'text-warn',
  critical: 'text-danger',
  neutral: 'text-muted',
};

interface MetricCardProps {
  metric: KpiMetric;
  /** When true, renders without its own card chrome (for use inside KpiStrip) */
  bare?: boolean;
  className?: string;
}

/** Single KPI: icon bubble, label, large value and a comparison line. */
export function MetricCard({ metric, bare = false, className }: MetricCardProps) {
  const TrendIcon = TREND_ICONS[metric.trend];
  return (
    <article
      aria-label={metric.label}
      className={cn('flex min-w-0 items-center gap-4', !bare && 'card p-5', className)}
    >
      <IconBubble
        icon={ICONS[metric.icon]}
        tone={metric.tone === 'warning' || metric.tone === 'critical' ? metric.tone : 'positive'}
        size="lg"
        className="@3xl:size-11 @3xl:[&_svg]:size-5"
      />
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-[13px] leading-snug text-muted">{metric.label}</h3>
        <p className="mt-0.5 flex items-baseline gap-0.5 text-[28px] font-semibold leading-tight tracking-tight text-ink">
          {metric.value}
          {metric.unit && <span className="text-lg font-medium text-ink/70">{metric.unit}</span>}
        </p>
        <p className={cn('mt-0.5 flex items-start gap-1 text-xs leading-snug', deltaColor[metric.tone])}>
          <TrendIcon className="mt-px size-3.5 shrink-0" aria-hidden="true" />
          <span>{metric.delta}</span>
        </p>
      </div>
    </article>
  );
}
