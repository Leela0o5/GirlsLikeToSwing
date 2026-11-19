import type { Valuation } from '@/types';
import { Card, CardHeader } from '@/components/ui/card';
import { SectionLink } from '@/components/common/SectionLink';
import { OWNER_ROUTES } from '@/constants/routes';
import { formatCurrency, formatDate } from '@/utils/format';

export function ValueRange({ low, mid, high }: { low: number; mid: number; high: number }) {
  const pct = ((mid - low) / Math.max(1, high - low)) * 100;
  return (
    <div>
      <p className="text-3xl font-semibold tracking-tight text-primary">{formatCurrency(mid)}</p>
      <div className="relative mt-4 h-2 rounded-full bg-gradient-to-r from-brand-100 via-secondary/60 to-brand-100" aria-hidden="true">
        <span className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-primary shadow" style={{ left: `${pct}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted">
        <span>Low {formatCurrency(low)}</span>
        <span>High {formatCurrency(high)}</span>
      </div>
    </div>
  );
}

export function ValuationSummaryCard({ valuation }: { valuation: Valuation }) {
  return (
    <Card aria-labelledby="valuation-title">
      <CardHeader
        titleId="valuation-title"
        title="Indicative Valuation"
        subtitle={`Estimated trade-in value · as of ${formatDate(valuation.asOf)}`}
        action={<SectionLink to={OWNER_ROUTES.valuation}>Details</SectionLink>}
      />
      <ValueRange low={valuation.low} mid={valuation.mid} high={valuation.high} />
      <p className="mt-4 rounded-xl bg-warn-soft px-3 py-2 text-[11px] leading-relaxed text-warn">
        Demo estimate only — not an offer or a formal appraisal.
      </p>
    </Card>
  );
}
