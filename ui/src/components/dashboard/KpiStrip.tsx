import type { KpiMetric } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';
import { MetricCard } from './MetricCard';

/**
 * One wide card holding the KPI row, divided like the reference layout.
 * Uses container queries so it adapts to its column, not the viewport.
 */
export function KpiStrip({ metrics }: { metrics: KpiMetric[] }) {
  return (
    <div className="@container">
      <section aria-label="Key metrics" className="card grid grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-4">
        {metrics.map((m, i) => (
          <MetricCard
            key={m.id}
            metric={m}
            bare
            className={cn(
              'border-line px-5 py-5 @3xl:gap-3 @3xl:px-4',
              i > 0 && 'border-t',
              i === 1 && '@lg:border-t-0 @lg:border-l',
              i === 2 && '@3xl:border-t-0 @3xl:border-l',
              i === 3 && '@lg:border-l @3xl:border-t-0',
            )}
          />
        ))}
      </section>
    </div>
  );
}

export function KpiStripSkeleton() {
  return (
    <div className="@container">
      <div className="card grid grid-cols-1 gap-6 p-5 @lg:grid-cols-2 @3xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="size-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
