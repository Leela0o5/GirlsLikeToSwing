import { BarChart3, Table2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export type ChartView = 'chart' | 'table';

/** Chart ⇄ table switch, so every chart has an accessible tabular view. */
export function ChartTableToggle({ value, onChange }: { value: ChartView; onChange: (v: ChartView) => void }) {
  return (
    <div role="group" aria-label="View as" className="hidden rounded-full border border-line bg-canvas p-0.5 sm:flex">
      {(['chart', 'table'] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          aria-pressed={value === v}
          aria-label={v === 'chart' ? 'Chart view' : 'Table view'}
          className={cn('rounded-full p-1.5 text-muted', value === v && 'bg-card text-primary shadow-sm')}
        >
          {v === 'chart' ? <BarChart3 className="size-4" /> : <Table2 className="size-4" />}
        </button>
      ))}
    </div>
  );
}
