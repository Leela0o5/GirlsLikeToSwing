import { useState } from 'react';
import { CheckCircle2, Gauge, TrendingUp } from 'lucide-react';
import type { DealerPerformance } from '@/types';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { CircularProgress } from '@/components/common/CircularProgress';
import { DemoBadge } from '@/components/common/DemoBadge';
import { BatteryHealthGauge } from './BatteryHealthGauge';

export function DealerPerformanceCard({ data }: { data: DealerPerformance }) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="@container flex flex-col" aria-labelledby="perf-title">
      <CardHeader titleId="perf-title" title="Dealer Battery Performance" subtitle="Composite score across your lots" action={<DemoBadge />} />

      <div className="flex flex-1 flex-col items-center gap-5 @md:flex-row @md:items-stretch">
        <div className="flex w-full flex-1 flex-col items-center">
          <BatteryHealthGauge value={data.score} max={data.maxScore} label="Dealer battery performance score" />
          <p className="-mt-3 flex items-center gap-1.5 text-[15px] font-semibold text-primary">
            <CheckCircle2 className="size-[18px] text-secondary" aria-hidden="true" />
            {data.grade} – {data.gradeLabel}
          </p>
          <p className="mt-1 max-w-[260px] text-center text-xs leading-relaxed text-muted">{data.summary}</p>
        </div>

        <div className="flex w-full flex-row items-center justify-center gap-4 border-t border-line pt-4 @md:w-[132px] @md:flex-col @md:border-l @md:border-t-0 @md:pl-5 @md:pt-0">
          <CircularProgress value={data.appraisalCompletion} size={96} label="Appraisal completion">
            <span className="text-xl font-semibold text-ink">{data.appraisalCompletion}%</span>
            <span className="text-[10px] text-muted">Complete</span>
          </CircularProgress>
          <p className="text-center text-xs text-muted">
            Appraisal
            <br />
            Completion
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-canvas px-4 py-2.5">
        <Button variant="link" size="sm" className="h-auto text-ink" onClick={() => setOpen(true)}>
          <Gauge className="text-muted" /> View score breakdown
        </Button>
        <p className="flex items-baseline gap-1 text-xs text-muted">
          Peak <span className="text-lg font-semibold text-primary">{data.peakScore}</span>/{data.maxScore}
        </p>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Score breakdown"
        description="How the dealer battery performance score is composed (demo data)."
        footer={<Button onClick={() => setOpen(false)}>Done</Button>}
      >
        <ul className="space-y-4">
          {data.breakdown.map((b) => (
            <li key={b.label}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-ink">{b.label}</span>
                <span className="font-semibold text-primary">{b.value}/100</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-line" role="presentation">
                <div className="h-full rounded-full bg-secondary" style={{ width: `${b.value}%` }} />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2.5 text-xs text-primary">
          <TrendingUp className="size-4 shrink-0" aria-hidden="true" />
          Improving turnaround time is the fastest path to your peak score of {data.peakScore}.
        </p>
      </Dialog>
    </Card>
  );
}
