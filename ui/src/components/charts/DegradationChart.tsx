import { useId } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TrendPoint } from '@/types';
import { CHART_COLORS, niceTicks } from '@/utils/chart';
import { cn } from '@/utils/cn';

function TrendTooltip({ active, point, unit }: { active?: boolean; point?: TrendPoint; unit: string }) {
  if (!active || !point) return null;
  const isForecastOnly = point.actual === null;
  return (
    <div className="rounded-xl border border-line bg-card px-3 py-2.5 text-xs shadow-pop">
      <p className="mb-1.5 font-semibold text-ink">{point.month}</p>
      {point.actual !== null && (
        <p className="flex items-center gap-2 text-muted">
          <span className="h-0.5 w-3 rounded" style={{ background: CHART_COLORS.actual }} />
          Actual <span className="ml-auto pl-3 font-semibold text-ink">{point.actual}{unit}</span>
        </p>
      )}
      {isForecastOnly && point.forecast !== null && (
        <p className="flex items-center gap-2 text-muted">
          <span className="h-0 w-3 border-t-2 border-dashed" style={{ borderColor: CHART_COLORS.forecast }} />
          Forecast <span className="ml-auto pl-3 font-semibold text-ink">{point.forecast}{unit}</span>
        </p>
      )}
      {isForecastOnly && <p className="mt-1.5 text-[10px] text-muted">Simulated projection</p>}
    </div>
  );
}

export function DegradationLegend() {
  return (
    <div className="mt-3">
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs text-muted" aria-label="Chart legend">
        <li className="flex items-center gap-2">
          <span className="h-0.5 w-5 rounded" style={{ background: CHART_COLORS.actual }} /> Actual (historical)
        </li>
        <li className="flex items-center gap-2">
          <span className="w-5 border-t-2 border-dashed" style={{ borderColor: CHART_COLORS.forecast }} /> Forecast (simulated)
        </li>
      </ul>
      <p className="mt-2 text-center text-[11px] text-muted">Demo data. Forecast is a simulated projection, not a machine-learning prediction.</p>
    </div>
  );
}

export function summarizeTrend(points: TrendPoint[]) {
  const actuals = points.filter((p) => p.actual !== null);
  const latest = actuals.at(-1)?.actual ?? null;
  const yearAgo = actuals.at(-13)?.actual ?? null;
  const last = points.at(-1);
  const change = latest !== null && yearAgo !== null ? Math.round((latest - yearAgo) * 10) / 10 : 0;
  return { latest, change, projected: last?.forecast ?? null, projectedLabel: last?.month ?? '' };
}

export function TrendSummary({ points, unit }: { points: TrendPoint[]; unit: string }) {
  const s = summarizeTrend(points);
  return (
    <dl className="mb-4 grid grid-cols-3 gap-3 rounded-2xl bg-canvas px-4 py-3 text-xs">
      <div>
        <dt className="text-muted">Current</dt>
        <dd className="text-base font-semibold text-ink">
          {s.latest}
          {unit}
        </dd>
      </div>
      <div>
        <dt className="text-muted">12-month change</dt>
        <dd className={cn('text-base font-semibold', s.change < 0 ? 'text-warn' : 'text-secondary')}>
          {s.change > 0 ? '+' : ''}
          {s.change}
          {unit}
        </dd>
      </div>
      <div>
        <dt className="text-muted">Projected {s.projectedLabel}</dt>
        <dd className="text-base font-semibold text-ink">
          {s.projected}
          {unit}
        </dd>
      </div>
    </dl>
  );
}

export function TrendTable({ points, unit, label, height = 300 }: { points: TrendPoint[]; unit: string; label: string; height?: number }) {
  return (
    <div className="relative overflow-auto rounded-xl border border-line" style={{ height }}>
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{label} by month</caption>
        <thead className="sticky top-0 bg-canvas text-xs text-muted">
          <tr>
            <th scope="col" className="px-4 py-2 font-medium">Month</th>
            <th scope="col" className="px-4 py-2 text-right font-medium">Actual</th>
            <th scope="col" className="px-4 py-2 text-right font-medium">Forecast (simulated)</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.month} className="border-t border-line/70">
              <th scope="row" className="px-4 py-1.5 font-normal text-ink">{p.month}</th>
              <td className="px-4 py-1.5 text-right tabular-nums">{p.actual !== null ? `${p.actual}${unit}` : '—'}</td>
              <td className="px-4 py-1.5 text-right tabular-nums text-muted">
                {p.actual === null && p.forecast !== null ? `${p.forecast}${unit}` : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface DegradationChartProps {
  points: TrendPoint[];
  unit: string;
  domain: [number, number];
  height?: number;
  dimmed?: boolean;
}

export function DegradationChart({ points, unit, domain, height = 300, dimmed = false }: DegradationChartProps) {
  const gradId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const today = points.filter((p) => p.actual !== null).at(-1)?.month;
  const lastMonth = points.at(-1)?.month;
  const showPercent = unit.trim() === '%';

  return (
    <div className={cn('w-full transition-opacity', dimmed && 'opacity-40')} style={{ height }} aria-busy={dimmed}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={points} margin={{ top: 18, right: 12, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.actual} stopOpacity={0.22} />
              <stop offset="100%" stopColor={CHART_COLORS.actual} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
          {today && lastMonth && today !== lastMonth && (
            <ReferenceArea
              x1={today}
              x2={lastMonth}
              fill={CHART_COLORS.forecast}
              fillOpacity={0.07}
              label={{ value: 'Simulated forecast', position: 'insideTopRight', fill: CHART_COLORS.axis, fontSize: 11 }}
            />
          )}
          {today && (
            <ReferenceLine
              x={today}
              stroke={CHART_COLORS.reference}
              strokeDasharray="3 3"
              label={{ value: 'Today', position: 'top', fill: CHART_COLORS.axis, fontSize: 11 }}
            />
          )}
          <XAxis
            dataKey="month"
            tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#E7EBE7' }}
            interval="preserveStartEnd"
            minTickGap={28}
            tickMargin={8}
          />
          <YAxis
            domain={domain}
            ticks={niceTicks(domain)}
            tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${v}${showPercent ? '%' : ''}`}
            width={48}
          />
          <Tooltip
            cursor={{ stroke: CHART_COLORS.reference, strokeWidth: 1 }}
            content={({ active, payload }) => (
              <TrendTooltip active={active} point={payload?.[0]?.payload as TrendPoint | undefined} unit={unit} />
            )}
          />
          <Area type="monotone" dataKey="actual" stroke="none" fill={`url(#${gradId})`} connectNulls={false} isAnimationActive={false} activeDot={false} />
          <Line
            type="monotone"
            dataKey="actual"
            name="Actual"
            stroke={CHART_COLORS.actual}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2, fill: CHART_COLORS.actual }}
            connectNulls={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            name="Forecast"
            stroke={CHART_COLORS.forecast}
            strokeWidth={2}
            strokeDasharray="6 5"
            dot={false}
            activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2, fill: CHART_COLORS.forecast }}
            connectNulls={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
