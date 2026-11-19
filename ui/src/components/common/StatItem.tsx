import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StatItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  valueClassName?: string;
}

/** Compact icon + label + value, used inside cards (must be rendered inside a <dl>). */
export function StatItem({ icon: Icon, label, value, valueClassName }: StatItemProps) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted" strokeWidth={1.75} aria-hidden="true" />
      <div className="min-w-0">
        <dt className="truncate text-[11px] text-muted">{label}</dt>
        <dd className={cn('truncate text-sm font-semibold text-ink', valueClassName)}>{value}</dd>
      </div>
    </div>
  );
}
