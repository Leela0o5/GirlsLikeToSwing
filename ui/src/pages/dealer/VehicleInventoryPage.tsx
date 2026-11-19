import { useSearchParams } from 'react-router-dom';
import { Search, SearchX, X } from 'lucide-react';
import { searchVehicles } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/common/StateViews';
import { PageHeader } from '@/components/common/PageHeader';
import { DemoBadge } from '@/components/common/DemoBadge';
import { formatNumber, riskTone, sohTone } from '@/utils/format';
import type { Vehicle } from '@/types';

const statusTone: Record<Vehicle['status'], 'positive' | 'warning' | 'neutral' | 'critical'> = {
  Assessed: 'positive',
  'In stock': 'neutral',
  'Trade-in pending': 'warning',
  'Needs attention': 'critical',
};

export function VehicleInventoryPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const debounced = useDebounce(query, 200);
  const { data, loading } = useAsync(() => searchVehicles(debounced), [debounced]);

  const setQuery = (q: string) => setParams(q ? { q } : {}, { replace: true });

  return (
    <>
      <PageHeader
        title="Vehicle Inventory"
        description="EVs on your lots with their latest (simulated) battery assessment."
        actions={<DemoBadge />}
      />
      <Card className="p-0 sm:p-0">
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-canvas px-3 sm:max-w-sm">
            <Search className="size-4 text-muted" aria-hidden="true" />
            <label htmlFor="inventory-filter" className="sr-only">
              Filter vehicles
            </label>
            <input
              id="inventory-filter"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by make, model, VIN, status…"
              className="min-w-0 flex-1 bg-transparent text-sm focus:outline-none"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear filter" className="text-muted hover:text-ink">
                <X className="size-4" />
              </button>
            )}
          </div>
          <p className="text-xs text-muted" aria-live="polite">
            {loading ? 'Loading…' : `${data?.length ?? 0} vehicles`}
          </p>
        </div>

        {loading && !data ? (
          <div className="space-y-3 p-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : data && data.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No vehicles found"
            description={`Nothing matches “${query}”. Try a make, model or VIN.`}
            action={
              <Button variant="soft" size="sm" onClick={() => setQuery('')}>
                Clear filter
              </Button>
            }
          />
        ) : (
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <caption className="sr-only">Vehicle inventory</caption>
              <thead className="bg-canvas text-xs text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Vehicle</th>
                  <th scope="col" className="px-4 py-3 font-medium">VIN</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Odometer</th>
                  <th scope="col" className="px-4 py-3 font-medium">SoH</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Est. range</th>
                  <th scope="col" className="px-4 py-3 font-medium">Risk</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className={loading ? 'opacity-50' : undefined}>
                {data?.map((v) => (
                  <tr key={v.id} className="border-t border-line hover:bg-canvas/60">
                    <th scope="row" className="px-4 py-3 font-medium text-ink">
                      {v.year} {v.make} {v.model}
                      <span className="block text-xs font-normal text-muted">{v.trim}</span>
                    </th>
                    <td className="px-4 py-3 font-mono text-xs text-muted">{v.vin}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatNumber(v.odometerMiles)} mi</td>
                    <td className="px-4 py-3">
                      <Badge tone={sohTone(v.sohPercent)} size="sm">{v.sohPercent}%</Badge>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{v.estRangeMiles} mi</td>
                    <td className="px-4 py-3">
                      <Badge tone={riskTone(v.risk)} size="sm">{v.risk}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={statusTone[v.status]} size="sm">{v.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
