import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ChargingSummary, WeeklyCharging } from '@/types';
import { Card, CardHeader } from '@/components/ui/card';
import { DemoBadge } from '@/components/common/DemoBadge';
import { ChartTableToggle, type ChartView } from '@/components/charts/ChartTableToggle';
import { CHART_COLORS } from '@/utils/chart';
import { cn } from '@/utils/cn';

function ChargeTooltip({ active, row }: { active?: boolean; row?: WeeklyCharging }) {
  if (!active || !row) return null;
  return (
    <div className="rounded-xl border border-line bg-card px-3 py-2.5 text-xs shadow-pop">
      <p className="mb-1.5 font-semibold text-ink">Week of {row.week}</p>
      <p className="flex justify-between gap-6 text-muted">AC (home/work) <span className="font-semibold text-ink">{row.ac} kWh</span></p>
      <p className="flex justify-between gap-6 text-muted">DC fast <span className="font-semibold text-ink">{row.dc} kWh</span></p>
      <p className="mt-1 flex justify-between gap-6 text-muted">Driven <span className="font-semibold text-ink">{row.miles} mi</span></p>
    </div>
  );
}

export function ChargingChart({ weekly, height = 220 }: { weekly: WeeklyCharging[]; height?: number }) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={weekly} margin={{ top: 8, right: 8, left: -14, bottom: 0 }} barCategoryGap="28%">
          <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis dataKey="week" tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#E7EBE7' }} tickMargin={8} />
          <YAxis tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} tickLine={false} axisLine={false} width={44} tickFormatter={(v: number) => `${v}`} />
          <Tooltip cursor={{ fill: 'rgba(35,134,90,0.06)' }} content={({ active, payload }) => <ChargeTooltip active={active} row={payload?.[0]?.payload as WeeklyCharging | undefined} />} />
          <Bar dataKey="ac" stackId="e" fill={CHART_COLORS.actual} stroke="#fff" strokeWidth={2} isAnimationActive={false} />
          <Bar dataKey="dc" stackId="e" fill={CHART_COLORS.forecast} stroke="#fff" strokeWidth={2} radius={[4, 4, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChargingTable({ weekly }: { weekly: WeeklyCharging[] }) {
  return (
    <div className="relative max-h-[240px] overflow-auto rounded-xl border border-line">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Weekly charging energy</caption>
        <thead className="sticky top-0 bg-canvas text-xs text-muted">
          <tr>
            <th scope="col" className="px-4 py-2 font-medium">Week</th>
            <th scope="col" className="px-4 py-2 text-right font-medium">AC kWh</th>
            <th scope="col" className="px-4 py-2 text-right font-medium">DC kWh</th>
            <th scope="col" className="px-4 py-2 text-right font-medium">Miles</th>
          </tr>
        </thead>
        <tbody>
          {weekly.map((w) => (
            <tr key={w.week} className="border-t border-line/70">
              <th scope="row" className="px-4 py-1.5 font-normal">{w.week}</th>
              <td className="px-4 py-1.5 text-right tabular-nums">{w.ac}</td>
              <td className="px-4 py-1.5 text-right tabular-nums">{w.dc}</td>
              <td className="px-4 py-1.5 text-right tabular-nums">{w.miles}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ChargingLegend() {
  return (
    <ul className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-muted" aria-label="Chart legend">
      <li className="flex items-center gap-2">
        <span className="size-3 rounded-sm" style={{ background: CHART_COLORS.actual }} /> AC charging (home/work)
      </li>
      <li className="flex items-center gap-2">
        <span className="size-3 rounded-sm" style={{ background: CHART_COLORS.forecast }} /> DC fast charging
      </li>
    </ul>
  );
}

interface ChargingCardProps {
  summary: ChargingSummary;
  fastChargeShare: number;
}

export function ChargingCard({ summary, fastChargeShare }: ChargingCardProps) {
  const [view, setView] = useState<ChartView>('chart');
  const miles = summary.weekly.slice(-4).reduce((s, w) => s + w.miles, 0);
  const stats = [
    { label: 'Energy (4 wks)', value: `${summary.monthEnergyKwh} kWh` },
    { label: 'Miles driven (4 wks)', value: miles.toLocaleString('en-US') },
    { label: 'Efficiency', value: `${summary.efficiencyMiPerKwh} mi/kWh` },
    { label: 'DC fast-charge share', value: `${fastChargeShare}%`, warn: fastChargeShare > 30 },
  ];
  return (
    <Card aria-labelledby="charging-title">
      <CardHeader
        titleId="charging-title"
        title="Charging & Usage"
        subtitle={`${summary.monthSessions} sessions in the last 4 weeks · ${summary.homeChargingShare}% home/work charging`}
        action={
          <>
            <ChartTableToggle value={view} onChange={setView} />
            <DemoBadge />
          </>
        }
      />
      <dl className="mb-4 grid grid-cols-2 gap-3 rounded-2xl bg-canvas px-4 py-3 text-xs sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="text-muted">{s.label}</dt>
            <dd className={cn('text-base font-semibold', s.warn ? 'text-warn' : 'text-ink')}>{s.value}</dd>
          </div>
        ))}
      </dl>
      {view === 'chart' ? <ChargingChart weekly={summary.weekly} /> : <ChargingTable weekly={summary.weekly} />}
      <ChargingLegend />
    </Card>
  );
}
