import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TemperaturePoint } from '@/types';
import { CHART_COLORS, niceTicks } from '@/utils/chart';

export const TEMP_CAUTION_C = 40;

function TempTooltip({ active, point }: { active?: boolean; point?: TemperaturePoint }) {
  if (!active || !point) return null;
  return (
    <div className="rounded-xl border border-line bg-card px-3 py-2.5 text-xs shadow-pop">
      <p className="mb-1.5 font-semibold text-ink">{point.time}</p>
      <p className="flex justify-between gap-6 text-muted">Max <span className="font-semibold text-ink">{point.max} °C</span></p>
      <p className="flex justify-between gap-6 text-muted">Average <span className="font-semibold text-ink">{point.avg} °C</span></p>
      <p className="flex justify-between gap-6 text-muted">Min <span className="font-semibold text-ink">{point.min} °C</span></p>
    </div>
  );
}

export function TemperatureChart({ history, height = 220 }: { history: TemperaturePoint[]; height?: number }) {
  const lo = Math.floor(Math.min(...history.map((h) => h.min)) / 5) * 5 - 5;
  const hi = Math.max(TEMP_CAUTION_C + 5, Math.ceil(Math.max(...history.map((h) => h.max)) / 5) * 5 + 5);
  const domain: [number, number] = [lo, hi];

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={history} margin={{ top: 14, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis dataKey="time" tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#E7EBE7' }} interval={5} tickMargin={8} />
          <YAxis domain={domain} ticks={niceTicks(domain)} tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `${v}°`} width={44} />
          <ReferenceLine
            y={TEMP_CAUTION_C}
            stroke={CHART_COLORS.danger}
            strokeDasharray="4 4"
            label={{ value: `${TEMP_CAUTION_C} °C caution`, position: 'insideTopRight', fill: CHART_COLORS.danger, fontSize: 11 }}
          />
          <Tooltip
            cursor={{ stroke: CHART_COLORS.reference, strokeWidth: 1 }}
            content={({ active, payload }) => <TempTooltip active={active} point={payload?.[0]?.payload as TemperaturePoint | undefined} />}
          />
          <Area type="monotone" dataKey={(d: TemperaturePoint) => [d.min, d.max]} stroke="none" fill={CHART_COLORS.actual} fillOpacity={0.14} isAnimationActive={false} activeDot={false} />
          <Line type="monotone" dataKey="avg" stroke={CHART_COLORS.actual} strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2, fill: CHART_COLORS.actual }} isAnimationActive={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TemperatureLegend() {
  return (
    <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-muted" aria-label="Chart legend">
      <li className="flex items-center gap-2">
        <span className="h-0.5 w-5 rounded" style={{ background: CHART_COLORS.actual }} /> Average cell temp
      </li>
      <li className="flex items-center gap-2">
        <span className="h-3 w-5 rounded-sm" style={{ background: CHART_COLORS.actual, opacity: 0.18 }} /> Min–max range
      </li>
      <li className="flex items-center gap-2">
        <span className="w-5 border-t-2 border-dashed" style={{ borderColor: CHART_COLORS.danger }} /> Caution threshold
      </li>
    </ul>
  );
}
