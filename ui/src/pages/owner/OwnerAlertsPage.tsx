import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import type { BatteryAlert } from '@/types';
import { acknowledgeOwnerAlert, ownerAlertsStore } from '@/services';
import { useInitialLoading, useStore } from '@/hooks/useStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Tabs } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { DemoBadge } from '@/components/common/DemoBadge';
import { AlertList, SeverityBadge } from '@/components/battery';
import { OWNER_ROUTES } from '@/constants/routes';
import { formatDateTime } from '@/utils/format';

type AlertFilter = 'active' | 'acknowledged' | 'all';

const matchesFilter: Record<AlertFilter, (a: BatteryAlert) => boolean> = {
  active: (a) => !a.acknowledged,
  acknowledged: (a) => a.acknowledged,
  all: () => true,
};

export function OwnerAlertsPage() {
  const alerts = useStore(ownerAlertsStore);
  const loading = useInitialLoading();
  const [filter, setFilter] = useState<AlertFilter>('active');
  const [pending, setPending] = useState<string | null>(null);
  const [selected, setSelected] = useState<BatteryAlert | null>(null);

  const acknowledge = async (id: string) => {
    setPending(id);
    await acknowledgeOwnerAlert(id);
    setPending(null);
    setSelected((s) => (s && s.id === id ? { ...s, acknowledged: true } : s));
  };

  const shown = alerts.filter(matchesFilter[filter]);
  const activeCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <>
      <PageHeader title="Battery Alerts" description="Health, temperature and charging alerts for your EV." actions={<DemoBadge />} />
      <Card>
        <Tabs
          label="Filter alerts"
          value={filter}
          onChange={setFilter}
          className="mb-4"
          tabs={[
            { id: 'active', label: 'Active', count: activeCount },
            { id: 'acknowledged', label: 'Acknowledged', count: alerts.length - activeCount },
            { id: 'all', label: 'All', count: alerts.length },
          ]}
        />
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <AlertList
            alerts={shown}
            onSelect={setSelected}
            actions={(a) => (
              <>
                <Button variant="outline" size="sm" onClick={() => setSelected(a)}>
                  Details
                </Button>
                {!a.acknowledged && (
                  <Button variant="soft" size="sm" onClick={() => acknowledge(a.id)} disabled={pending === a.id}>
                    {pending === a.id ? <Loader2 className="animate-spin" /> : <Check />} Acknowledge
                  </Button>
                )}
              </>
            )}
          />
        )}
      </Card>

      <Dialog
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.title}
        description={selected ? `${formatDateTime(selected.createdAt)} · simulated alert` : undefined}
        footer={
          <>
            <Link to={OWNER_ROUTES.service} className="inline-flex h-10 items-center rounded-full border border-line bg-card px-4 text-sm font-medium text-ink hover:bg-canvas">
              Book a service
            </Link>
            {selected && !selected.acknowledged && (
              <Button onClick={() => acknowledge(selected.id)} disabled={pending === selected.id}>
                {pending === selected.id ? <Loader2 className="animate-spin" /> : <Check />} Acknowledge
              </Button>
            )}
          </>
        }
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <SeverityBadge severity={selected.severity} />
            <p className="text-ink">{selected.detail}</p>
            <div className="rounded-xl bg-brand-50 px-3 py-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Recommended action</p>
              <p className="mt-1 text-ink">{selected.recommendation}</p>
            </div>
            <p className="text-xs text-muted">Alert generated from demo data — no live vehicle connection.</p>
          </div>
        )}
      </Dialog>
    </>
  );
}
