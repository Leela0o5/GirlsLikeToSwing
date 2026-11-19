import { Wrench } from 'lucide-react';
import type { ServiceRecord } from '@/types';
import { EmptyState } from '@/components/common/StateViews';
import { formatDate } from '@/utils/format';

interface ServiceHistoryTimelineProps {
  records: ServiceRecord[];
  limit?: number;
}

export function ServiceHistoryTimeline({ records, limit }: ServiceHistoryTimelineProps) {
  const shown = limit ? records.slice(0, limit) : records;
  if (shown.length === 0) return <EmptyState icon={Wrench} title="No service records yet" />;
  return (
    <ol className="relative space-y-5 border-l border-line pl-5">
      {shown.map((r) => (
        <li key={r.id} className="relative">
          <span className="absolute -left-[25px] top-1 size-2.5 rounded-full border-2 border-white bg-secondary ring-1 ring-secondary/30" aria-hidden="true" />
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <p className="text-sm font-semibold text-ink">{r.type}</p>
            <time dateTime={r.date} className="text-xs text-muted">
              {formatDate(r.date)}
            </time>
          </div>
          <p className="mt-0.5 text-xs text-muted">{r.summary}</p>
          <p className="mt-1 text-[11px] text-muted/90">
            {r.center} · {r.technician}
            {r.sohAtService !== undefined && <> · SoH at visit {r.sohAtService}%</>}
          </p>
        </li>
      ))}
    </ol>
  );
}
