import { Link } from 'react-router-dom';
import { Check, Clock4, Gauge, GitCompareArrows, Heart, MapPin } from 'lucide-react';
import type { Listing } from '@/types';
import { MAX_COMPARE, buyerPrefsStore, toggleCompare, toggleSaved } from '@/services';
import { useStore } from '@/hooks/useStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VehicleIllustration } from '@/components/common/VehicleIllustration';
import { SohMeter, VerificationBadge } from '@/components/battery';
import { BUYER_ROUTES } from '@/constants/routes';
import { formatCurrency, formatNumber } from '@/utils/format';
import { cn } from '@/utils/cn';

export function ListingCard({ listing: l }: { listing: Listing }) {
  const prefs = useStore(buyerPrefsStore);
  const v = l.vehicle;
  const name = `${v.year} ${v.make} ${v.model}`;
  const saved = prefs.saved.includes(l.id);
  const comparing = prefs.compare.includes(l.id);
  const compareFull = !comparing && prefs.compare.length >= MAX_COMPARE;

  return (
    <article className="card flex flex-col overflow-hidden" aria-labelledby={`${l.id}-name`}>
      <div className="relative bg-gradient-to-b from-canvas to-brand-50/60 px-6 pb-2 pt-9">
        <div className="absolute left-3 top-3">
          <VerificationBadge status={l.verification} size="sm" />
        </div>
        <button
          type="button"
          onClick={() => toggleSaved(l.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${name} from saved` : `Save ${name}`}
          className={cn(
            'absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full border bg-card transition-colors',
            saved ? 'border-danger/30 text-danger' : 'border-line text-muted hover:text-ink',
          )}
        >
          <Heart className={cn('size-4', saved && 'fill-current')} />
        </button>
        <VehicleIllustration className="mx-auto max-w-[230px]" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 id={`${l.id}-name`} className="truncate text-base font-semibold text-ink">
              {name}
            </h3>
            <p className="truncate text-xs text-muted">
              {v.trim} · {formatNumber(v.odometerMiles)} mi
            </p>
          </div>
          <p className="shrink-0 text-lg font-semibold text-primary">{formatCurrency(l.price)}</p>
        </div>

        <div className="mt-4">
          <p className="mb-1 text-[11px] text-muted">Battery health (SoH)</p>
          <SohMeter value={v.sohPercent} />
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-muted">
            <Gauge className="size-3.5 shrink-0" aria-hidden="true" />
            <dt className="sr-only">Estimated range</dt>
            <dd className="font-medium text-ink">{v.estRangeMiles} mi</dd>
          </div>
          <div className="flex items-center gap-1.5 text-muted">
            <Clock4 className="size-3.5 shrink-0" aria-hidden="true" />
            <dt className="sr-only">Battery life left</dt>
            <dd className="truncate font-medium text-ink">{l.estLifeRemaining}</dd>
          </div>
          <div className="flex min-w-0 items-center gap-1.5 text-muted">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            <dt className="sr-only">Location</dt>
            <dd className="truncate font-medium text-ink">{l.location.split(',')[0]}</dd>
          </div>
        </dl>

        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Highlights">
          {l.highlights.map((h) => (
            <li key={h}>
              <Badge tone="neutral" size="sm">
                {h}
              </Badge>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex gap-2 pt-5">
          <Link
            to={BUYER_ROUTES.listing(l.id)}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-full bg-primary px-3 text-xs font-medium text-white hover:bg-secondary"
          >
            View battery report
          </Link>
          <Button
            variant={comparing ? 'soft' : 'outline'}
            size="sm"
            className="h-9"
            onClick={() => toggleCompare(l.id)}
            disabled={compareFull}
            aria-pressed={comparing}
            title={compareFull ? `You can compare up to ${MAX_COMPARE} vehicles` : undefined}
          >
            {comparing ? <Check /> : <GitCompareArrows />}
            {comparing ? 'Comparing' : 'Compare'}
          </Button>
        </div>
      </div>
    </article>
  );
}
