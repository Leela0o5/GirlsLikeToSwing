import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import type { Recommendation } from '@/types';
import { getVehiclesByIds } from '@/services';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { EmptyState } from '@/components/common/StateViews';
import { ROUTES } from '@/constants/routes';
import { riskTone, sohTone, vehicleName } from '@/utils/format';
import { RecommendationCard } from './RecommendationCard';

interface ActionLink {
  to: string;
  label: string;
}

function RecommendationDialog({ rec, onClose, actionLink }: { rec: Recommendation | null; onClose: () => void; actionLink: ActionLink }) {
  const vehicles = rec ? getVehiclesByIds(rec.affectedVehicleIds) : [];
  return (
    <Dialog
      open={rec !== null}
      onClose={onClose}
      title={rec?.title}
      description={rec ? `${rec.priority} priority${rec.timeline ? ` · ${rec.timeline}` : ''} · Simulated recommendation` : undefined}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Link to={actionLink.to} onClick={onClose} className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-white hover:bg-secondary">
            {actionLink.label}
          </Link>
        </>
      }
    >
      {rec && (
        <div className="space-y-5">
          <p className="text-sm text-ink">{rec.summary}</p>
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Affected vehicles</h3>
            <ul className="divide-y divide-line rounded-xl border border-line">
              {vehicles.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{vehicleName(v)}</p>
                    <p className="truncate text-xs text-muted">VIN {v.vin}</p>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <Badge tone={sohTone(v.sohPercent)} size="sm">SoH {v.sohPercent}%</Badge>
                    <Badge tone={riskTone(v.risk)} size="sm">{v.risk} risk</Badge>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Suggested next steps</h3>
            <ol className="space-y-2">
              {rec.steps.map((s, i) => (
                <li key={s} className="flex gap-3 text-sm text-ink">
                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] font-semibold text-primary">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </section>
          <p className="rounded-xl bg-warn-soft px-3 py-2 text-xs text-warn">
            Rule-based demo recommendation. No machine-learning model is producing these results yet.
          </p>
        </div>
      )}
    </Dialog>
  );
}

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
  title?: string;
  subtitle?: string;
  badgeLabel?: string;
  actionLink?: ActionLink;
}

export function RecommendationsPanel({
  recommendations,
  title = 'Next Best Battery Action',
  subtitle = 'Simulated AI-style recommendations',
  badgeLabel = 'AI Insight',
  actionLink = { to: ROUTES.service, label: 'Go to Service & Maintenance' },
}: RecommendationsPanelProps) {
  const [active, setActive] = useState<Recommendation | null>(null);

  return (
    <Card aria-labelledby="nba-title">
      <CardHeader
        titleId="nba-title"
        title={title}
        subtitle={subtitle}
        icon={
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-lime/60 to-brand-50 text-primary" aria-hidden="true">
            <Sparkles className="size-5" strokeWidth={1.75} />
          </span>
        }
        action={<Badge tone="solid">{badgeLabel}</Badge>}
      />
      {recommendations.length === 0 ? (
        <EmptyState title="No actions right now" description="Your inventory looks healthy. New recommendations will appear here." />
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <RecommendationCard key={rec.id} rec={rec} featured={i === 0} onOpen={setActive} />
          ))}
        </div>
      )}
      <RecommendationDialog rec={active} onClose={() => setActive(null)} actionLink={actionLink} />
    </Card>
  );
}
