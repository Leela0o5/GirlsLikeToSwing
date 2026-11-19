import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface KeyValue {
  label: string;
  value: ReactNode;
}

interface KeyValueListProps {
  items: KeyValue[];
  columns?: 1 | 2;
  className?: string;
}

export function KeyValueList({ items, columns = 1, className }: KeyValueListProps) {
  return (
    <dl className={cn('grid grid-cols-1', columns === 2 && 'sm:grid-cols-2 sm:gap-x-6', className)}>
      {items.map((it) => (
        <div key={it.label} className="flex justify-between gap-4 border-b border-line/70 py-2.5 text-sm">
          <dt className="text-muted">{it.label}</dt>
          <dd className="text-right font-medium text-ink">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}
