import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface CircularProgressProps {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  label: string;
  children?: ReactNode;
  className?: string;
}

/** Small ring progress indicator (e.g. appraisal completion). */
export function CircularProgress({
  value,
  size = 96,
  stroke = 7,
  color = 'var(--color-secondary)',
  trackColor = 'var(--color-line)',
  label,
  children,
  className,
}: CircularProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamped / 100)}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}
