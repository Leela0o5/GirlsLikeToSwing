import { useAsync } from '@/hooks/useAsync';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RotateCcw, ShieldCheck } from 'lucide-react';
import { getOwnerOverview, indicativeValue } from '@/services';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/common/StateViews';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { DemoBadge } from '@/components/common/DemoBadge';
import { ValueRange } from '@/components/owner/ValuationSummaryCard';
import { passportPath } from '@/constants/routes';
import { CHART_COLORS } from '@/utils/chart';
import { formatCurrency, formatNumber } from '@/utils/format';
import { cn } from '@/utils/cn';

function Slider({ label, value, min, max, step, onChange, format }: { label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void; format: (n: number) => string }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex justify-between text-sm">
        <span className="text-ink">{label}</span>
        <span className="font-semibold text-primary">{format(value)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[#23865A]" />
      <span className="flex justify-between text-[11px] text-muted">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </span>
    </label>
  );
}

export function OwnerValuationPage() {
  const { data, loading, error } = useAsync(getOwnerOverview, []);
  const [odometer, setOdometer] = useState<number | null>(null);
  const [soh, setSoh] = useState<number | null>(null);

  if (error) return <ErrorState message="Unable to load valuation." />;
  if (loading || !data) return <PageSkeleton />;

  const { valuation, vehicle: v, passport } = data;
  const odo = odometer ?? v.odometerMiles;
  const health = soh ?? v.sohPercent;
  const whatIf = indicativeValue(valuation, odo, health, v.odometerMiles, v.sohPercent);
  const changed = odo !== v.odometerMiles || health !== v.sohPercent;
  const maxImpact = Math.max(...valuation.factors.map((f) => Math.abs(f.impact)));

  return (
    <>
      <PageHeader title="Indicative Valuation" description={`${v.year} ${v.make} ${v.model} · battery-adjusted trade-in estimate`} actions={<DemoBadge />} />
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
        <div className="min-w-0 space-y-5">
          <Card aria-labelledby="value-title">
            <CardHeader titleId="value-title" title="Estimated trade-in value" subtitle="Low – high range based on battery health, mileage and market (demo formula)" />
            <ValueRange low={valuation.low} mid={valuation.mid} high={valuation.high} />
          </Card>

          <Card aria-labelledby="hist-title">
            <CardHeader titleId="hist-title" title="Value over the last 12 months" subtitle="Indicative mid-point (demo)" />
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={valuation.history} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#E7EBE7' }} minTickGap={20} tickMargin={8} />
                  <YAxis domain={[18000, 22000]} ticks={[18000, 19000, 20000, 21000, 22000]} tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(n: number) => `$${n / 1000}k`} width={48} />
                  <Tooltip
                    cursor={{ stroke: CHART_COLORS.reference }}
                    formatter={(n) => [formatCurrency(Number(n)), 'Indicative value']}
                    contentStyle={{ borderRadius: 12, border: '1px solid #E7EBE7', fontSize: 12 }}
                  />
                  <Line type="monotone" dataKey="value" stroke={CHART_COLORS.actual} strokeWidth={2} dot={false} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card aria-labelledby="factors-title">
            <CardHeader titleId="factors-title" title="What drives your value" subtitle="Impact on the estimate (demo)" />
            <ul className="space-y-3">
              {valuation.factors.map((f) => (
                <li key={f.label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_72px] items-center gap-3 text-sm">
                  <span className="truncate text-ink">{f.label}</span>
                  <span className="relative h-2 rounded-full bg-line" aria-hidden="true">
                    <span
                      className={cn('absolute top-0 h-full rounded-full', f.impact >= 0 ? 'left-1/2 bg-secondary' : 'right-1/2 bg-warn')}
                      style={{ width: `${(Math.abs(f.impact) / maxImpact) * 50}%` }}
                    />
                    <span className="absolute left-1/2 top-[-3px] h-[14px] w-px bg-muted/50" />
                  </span>
                  <span className={cn('text-right font-semibold tabular-nums', f.impact >= 0 ? 'text-secondary' : 'text-warn')}>
                    {f.impact >= 0 ? '+' : '−'}
                    {formatCurrency(Math.abs(f.impact))}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="min-w-0 space-y-5">
          <Card aria-labelledby="whatif-title">
            <CardHeader
              titleId="whatif-title"
              title="What-if estimate"
              subtitle="See how mileage and battery health change the value"
              action={
                changed ? (
                  <Button variant="ghost" size="sm" onClick={() => { setOdometer(null); setSoh(null); }}>
                    <RotateCcw /> Reset
                  </Button>
                ) : undefined
              }
            />
            <div className="space-y-5">
              <Slider label="Odometer" value={odo} min={20000} max={120000} step={1000} onChange={setOdometer} format={(n) => `${formatNumber(n)} mi`} />
              <Slider label="Battery health (SoH)" value={health} min={75} max={100} step={1} onChange={setSoh} format={(n) => `${n}%`} />
            </div>
            <div className="mt-5 rounded-2xl bg-canvas p-4" aria-live="polite">
              <p className="text-xs text-muted">{changed ? 'What-if estimate' : 'Current estimate'}</p>
              <p className="text-2xl font-semibold text-primary">{formatCurrency(whatIf.mid)}</p>
              <p className="text-xs text-muted">
                Range {formatCurrency(whatIf.low)} – {formatCurrency(whatIf.high)}
              </p>
            </div>
            <p className="mt-3 text-[11px] text-muted">Simple linear demo formula. Not an offer, appraisal or pricing model.</p>
          </Card>
          <Card aria-labelledby="passport-cta">
            <CardHeader titleId="passport-cta" title="Share your Battery Passport" subtitle="Buyers and dealers trust a documented battery history." />
            <Link to={passportPath('owner', passport.id)} className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-white hover:bg-secondary">
              <ShieldCheck className="size-4" aria-hidden="true" /> View Battery Passport
            </Link>
          </Card>
        </div>
      </div>
    </>
  );
}
