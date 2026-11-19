import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { GitCompareArrows, Plus, Trophy, X } from 'lucide-react';
import type { Listing } from '@/types';
import { MAX_COMPARE, buyerPrefsStore, clearCompare, getAllListingsSync, getListingSync, getSohHistory, toggleCompare } from '@/services';
import { useStore } from '@/hooks/useStore';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NativeSelect } from '@/components/ui/field';
import { EmptyState } from '@/components/common/StateViews';
import { PageHeader } from '@/components/common/PageHeader';
import { DemoBadge } from '@/components/common/DemoBadge';
import { SohMeter, VerificationBadge } from '@/components/battery';
import { BUYER_ROUTES } from '@/constants/routes';
import { CHART_COLORS, niceTicks } from '@/utils/chart';
import { formatCurrency, formatDate, formatNumber } from '@/utils/format';
import { cn } from '@/utils/cn';

interface Row {
  label: string;
  render: (l: Listing) => ReactNode;
  /** numeric value + direction used to mark the best vehicle */
  score?: (l: Listing) => number;
  better?: 'high' | 'low';
}

const rows: Row[] = [
  { label: 'Price', render: (l) => formatCurrency(l.price), score: (l) => l.price, better: 'low' },
  { label: 'Battery health (SoH)', render: (l) => <SohMeter value={l.vehicle.sohPercent} className="min-w-[140px]" />, score: (l) => l.vehicle.sohPercent, better: 'high' },
  { label: 'State of charge (SoC)', render: (l) => `${l.vehicle.socPercent}%` },
  { label: 'Estimated range', render: (l) => `${l.vehicle.estRangeMiles} mi`, score: (l) => l.vehicle.estRangeMiles, better: 'high' },
  { label: 'Mileage', render: (l) => `${formatNumber(l.vehicle.odometerMiles)} mi`, score: (l) => l.vehicle.odometerMiles, better: 'low' },
  { label: 'Year', render: (l) => l.vehicle.year, score: (l) => l.vehicle.year, better: 'high' },
  { label: 'Battery capacity', render: (l) => `${l.specs.batteryKwh} kWh`, score: (l) => l.specs.batteryKwh, better: 'high' },
  { label: 'Est. usable capacity', render: (l) => `${Math.round(l.specs.batteryKwh * l.vehicle.sohPercent) / 100} kWh`, score: (l) => l.specs.batteryKwh * l.vehicle.sohPercent, better: 'high' },
  { label: 'Battery life left', render: (l) => l.estLifeRemaining },
  { label: 'Max DC charging', render: (l) => `${l.specs.maxDcChargeKw} kW`, score: (l) => l.specs.maxDcChargeKw, better: 'high' },
  { label: 'Risk level', render: (l) => l.vehicle.risk },
  { label: 'Verification', render: (l) => <VerificationBadge status={l.verification} size="sm" /> },
  { label: 'Assessed on', render: (l) => formatDate(l.assessedOn) },
  { label: 'Est. trade-in value', render: (l) => formatCurrency(l.estTradeInValue), score: (l) => l.estTradeInValue, better: 'high' },
];

function bestId(row: Row, list: Listing[]): string | null {
  if (!row.score || list.length < 2) return null;
  const sorted = [...list].sort((a, b) => (row.better === 'low' ? row.score!(a) - row.score!(b) : row.score!(b) - row.score!(a)));
  return row.score(sorted[0]) === row.score(sorted[1]) ? null : sorted[0].id;
}

function SohHistoryChart({ list }: { list: Listing[] }) {
  const series = list.map((l) => ({ id: l.id, points: getSohHistory(l.vehicle) }));
  const data = series[0].points.map((p, i) => {
    const row: Record<string, string | number> = { month: p.month };
    series.forEach((s) => (row[s.id] = s.points[i].actual!));
    return row;
  });
  const values = series.flatMap((s) => s.points.map((p) => p.actual!));
  const domain: [number, number] = [Math.floor((Math.min(...values) - 1) / 5) * 5, Math.min(100, Math.ceil((Math.max(...values) + 1) / 5) * 5)];
  const name = (id: string) => {
    const l = list.find((x) => x.id === id)!;
    return `${l.vehicle.year} ${l.vehicle.model}`;
  };

  return (
    <>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#E7EBE7' }} minTickGap={28} tickMargin={8} />
            <YAxis domain={domain} ticks={niceTicks(domain)} tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(n: number) => `${n}%`} width={48} />
            <Tooltip
              cursor={{ stroke: CHART_COLORS.reference }}
              formatter={(value, key) => [`${value}%`, name(String(key))]}
              contentStyle={{ borderRadius: 12, border: '1px solid #E7EBE7', fontSize: 12 }}
            />
            {series.map((s, i) => (
              <Line key={s.id} type="monotone" dataKey={s.id} stroke={CHART_COLORS.compare[i]} strokeWidth={2} dot={false} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} isAnimationActive={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-muted" aria-label="Chart legend">
        {series.map((s, i) => (
          <li key={s.id} className="flex items-center gap-2">
            <span className="h-0.5 w-5 rounded" style={{ background: CHART_COLORS.compare[i] }} />
            {name(s.id)} · now {list[i].vehicle.sohPercent}%
          </li>
        ))}
      </ul>
      <p className="mt-2 text-center text-[11px] text-muted">Historical SoH, demo data.</p>
    </>
  );
}

export function BuyerComparePage() {
  const { compare } = useStore(buyerPrefsStore);
  const list = compare.map(getListingSync).filter((l): l is Listing => Boolean(l));
  const available = getAllListingsSync().filter((l) => !compare.includes(l.id));

  const addPicker = list.length < MAX_COMPARE && (
    <NativeSelect
      aria-label="Add a vehicle to compare"
      value=""
      onChange={(e) => e.target.value && toggleCompare(e.target.value)}
      className="h-9 max-w-xs rounded-full bg-canvas text-xs"
    >
      <option value="">+ Add a vehicle…</option>
      {available.map((l) => (
        <option key={l.id} value={l.id}>
          {l.vehicle.year} {l.vehicle.make} {l.vehicle.model} · SoH {l.vehicle.sohPercent}%
        </option>
      ))}
    </NativeSelect>
  );

  return (
    <>
      <PageHeader
        title="Compare Battery Health"
        description={`Side-by-side battery and vehicle comparison (up to ${MAX_COMPARE}).`}
        actions={
          <>
            {addPicker}
            {list.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCompare}>
                Clear all
              </Button>
            )}
          </>
        }
      />

      {list.length < 2 ? (
        <Card>
          <EmptyState
            icon={GitCompareArrows}
            title={list.length === 0 ? 'Nothing to compare yet' : 'Add one more vehicle'}
            description="Pick vehicles with the Compare button on any listing, or use the selector above."
            action={
              <Link to={BUYER_ROUTES.explore} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-medium text-white hover:bg-secondary">
                <Plus className="size-4" aria-hidden="true" /> Browse listings
              </Link>
            }
          />
        </Card>
      ) : (
        <div className="space-y-5">
          <Card className="p-0 sm:p-0">
            <div className="relative overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <caption className="sr-only">Vehicle comparison</caption>
                <thead>
                  <tr className="align-top">
                    <th scope="col" className="w-48 px-5 py-4 text-xs font-medium text-muted">
                      <DemoBadge />
                    </th>
                    {list.map((l, i) => (
                      <th key={l.id} scope="col" className="px-5 py-4 font-normal">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="mb-1 block h-1 w-8 rounded-full" style={{ background: CHART_COLORS.compare[i] }} aria-hidden="true" />
                            <Link to={BUYER_ROUTES.listing(l.id)} className="text-sm font-semibold text-ink hover:text-primary">
                              {l.vehicle.year} {l.vehicle.make} {l.vehicle.model}
                            </Link>
                            <p className="text-xs text-muted">{l.vehicle.trim}</p>
                          </div>
                          <button type="button" onClick={() => toggleCompare(l.id)} aria-label={`Remove ${l.vehicle.model} from comparison`} className="rounded-full p-1 text-muted hover:bg-canvas hover:text-ink">
                            <X className="size-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const best = bestId(row, list);
                    return (
                      <tr key={row.label} className="border-t border-line">
                        <th scope="row" className="px-5 py-3 text-xs font-medium text-muted">{row.label}</th>
                        {list.map((l) => (
                          <td key={l.id} className={cn('px-5 py-3 text-ink', best === l.id && 'bg-brand-50/60')}>
                            <span className="flex items-center gap-2">
                              {row.render(l)}
                              {best === l.id && (
                                <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-secondary">
                                  <Trophy className="size-3" aria-hidden="true" /> Best
                                </span>
                              )}
                            </span>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
          <Card aria-labelledby="soh-compare-title">
            <CardHeader titleId="soh-compare-title" title="Battery health over time" subtitle="Actual SoH history for each vehicle" />
            <SohHistoryChart list={list} />
          </Card>
        </div>
      )}
    </>
  );
}
