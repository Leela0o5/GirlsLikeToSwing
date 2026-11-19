import type { LucideIcon } from 'lucide-react';
import type { Tone } from '@/types';
import { cn } from '@/utils/cn';

const toneClasses: Record<Tone, string> = {
  positive: 'bg-brand-50 text-primary',
  warning: 'bg-warn-soft text-warn',
  critical: 'bg-danger-soft text-danger',
  neutral: 'bg-canvas text-muted',
};

const sizeClasses = {
  sm: 'size-9 [&_svg]:size-4',
  md: 'size-11 [&_svg]:size-5',
  lg: 'size-14 [&_svg]:size-6',
} as const;

interface IconBubbleProps {
  icon: LucideIcon;
  tone?: Tone;
  size?: keyof typeof sizeClasses;
  className?: string;
}

/** Soft circular icon container used by KPI cards, recommendations and lists. */
export function IconBubble({ icon: Icon, tone = 'positive', size = 'md', className }: IconBubbleProps) {
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full', toneClasses[tone], sizeClasses[size], className)}
      aria-hidden="true"
    >
      <Icon strokeWidth={1.75} />
    </span>
  );
}
