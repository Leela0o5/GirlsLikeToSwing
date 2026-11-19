import { CalendarClock, ChevronRight, Flame, Thermometer, Zap, type LucideIcon } from 'lucide-react';
import type { Recommendation } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { priorityTone } from '@/utils/format';
import { cn } from '@/utils/cn';

const ICONS: Record<Recommendation['icon'], LucideIcon> = {
  thermometer: Thermometer,
  zap: Zap,
  calendar: CalendarClock,
};

interface RecommendationCardProps {
  rec: Recommendation;
  /** The featured card gets the highlighted lime/green treatment */
  featured?: boolean;
  onOpen: (rec: Recommendation) => void;
}

export function RecommendationCard({ rec, featured = false, onOpen }: RecommendationCardProps) {
  const Icon = ICONS[rec.icon];
  return (
    <article
      className={cn(
        'rounded-2xl border p-4',
        featured ? 'border-lime/40 bg-gradient-to-br from-[#EEF7DD] via-brand-50 to-[#F6FBEF]' : 'border-line bg-card',
      )}
      aria-labelledby={`${rec.id}-title`}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'inline-flex size-10 shrink-0 items-center justify-center rounded-full',
            featured ? 'bg-white text-primary shadow-sm' : 'bg-canvas text-muted',
          )}
          aria-hidden="true"
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <h3 id={`${rec.id}-title`} className="text-[15px] font-semibold text-ink">
              {rec.title}
            </h3>
            <Badge tone={priorityTone(rec.priority)} size="sm">
              {rec.priority === 'High' && <Flame aria-hidden="true" />}
              {rec.priority} priority
            </Badge>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted">{rec.summary}</p>
        </div>
      </div>

      {featured && (
        <div className="mt-3 flex gap-1.5" aria-label={`${rec.affectedVehicleIds.length} vehicles affected`}>
          {Array.from({ length: 8 }, (_, i) => (
            <span
              key={i}
              className={cn('h-7 flex-1 rounded-md', i < rec.affectedVehicleIds.length ? 'bg-danger/80' : 'bg-secondary/80')}
              aria-hidden="true"
            />
          ))}
        </div>
      )}

      <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
        {rec.timeline && (
          <div className="flex items-center gap-1">
            <CalendarClock className="size-3.5" aria-hidden="true" />
            <dt className="sr-only">Timeline</dt>
            <dd>{rec.timeline}</dd>
          </div>
        )}
        {rec.impact && (
          <div className="flex items-center gap-1">
            <dt>Impact:</dt>
            <dd>{rec.impact}</dd>
          </div>
        )}
      </dl>

      <Button
        variant={featured ? 'primary' : 'soft'}
        className="mt-3 w-full"
        onClick={() => onOpen(rec)}
        aria-label={`${rec.ctaLabel}: ${rec.title}`}
      >
        {rec.ctaLabel} <ChevronRight />
      </Button>
    </article>
  );
}
