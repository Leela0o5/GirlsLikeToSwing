import { useRef, type KeyboardEvent } from 'react';
import { cn } from '@/utils/cn';

export interface TabItem<T extends string> {
  id: T;
  label: string;
  count?: number;
}

interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}

export function Tabs<T extends string>({ tabs, value, onChange, label, className }: TabsProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (index + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div role="tablist" aria-label={label} className={cn('inline-flex max-w-full flex-wrap gap-1 rounded-full border border-line bg-canvas p-1', className)}>
      {tabs.map((t, i) => {
        const selected = t.id === value;
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              selected ? 'bg-card text-primary shadow-sm' : 'text-muted hover:text-ink',
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={cn('rounded-full px-1.5 text-[10px] leading-4', selected ? 'bg-brand-50 text-primary' : 'bg-line text-muted')}>
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
