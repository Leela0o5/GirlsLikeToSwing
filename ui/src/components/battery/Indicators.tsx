import { BadgeCheck, Clock, ShieldX } from 'lucide-react';
import type { VerificationStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { sohTone } from '@/utils/format';
import { cn } from '@/utils/cn';

const verificationMeta: Record<VerificationStatus, { tone: 'positive' | 'warning' | 'critical'; icon: typeof BadgeCheck; hint: string }> = {
  Verified: { tone: 'positive', icon: BadgeCheck, hint: 'Assessment within the last 6 months (demo)' },
  Pending: { tone: 'warning', icon: Clock, hint: 'Assessment awaiting review (demo)' },
  Expired: { tone: 'critical', icon: ShieldX, hint: 'Assessment older than 6 months (demo)' },
};

export function VerificationBadge({ status, size = 'md' }: { status: VerificationStatus; size?: 'sm' | 'md' }) {
  const m = verificationMeta[status];
  return (
    <Badge tone={m.tone} size={size} title={m.hint}>
      <m.icon aria-hidden="true" />
      {status}
    </Badge>
  );
}

const barColor = { positive: 'bg-secondary', warning: 'bg-warn', critical: 'bg-danger', neutral: 'bg-muted' } as const;

export function SohMeter({ value, className, showLabel = true }: { value: number; className?: string; showLabel?: boolean }) {
  const tone = sohTone(value);
  // scale 70–100% so differences between healthy packs are visible
  const pct = Math.max(4, Math.min(100, ((value - 70) / 30) * 100));
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-line" role="meter" aria-label="State of health" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
        <div className={cn('h-full rounded-full', barColor[tone])} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <span className="w-10 text-right text-sm font-semibold tabular-nums text-ink">{value}%</span>}
    </div>
  );
}
