/** Round, evenly spaced axis ticks across a domain (3–7 ticks). */
export function niceTicks([min, max]: [number, number]): number[] {
  const span = max - min;
  const candidates = [0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
  const step = candidates.find((s) => span / s <= 6) ?? span / 4;
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + 1e-9; v += step) ticks.push(Math.round(v * 100) / 100);
  return ticks;
}

/** Shared chart colours (validated with the dataviz palette checker). */
export const CHART_COLORS = {
  actual: '#23865A',
  forecast: '#7FB83A',
  axis: '#737B73',
  grid: '#EEF1EE',
  reference: '#A9B2AA',
  danger: '#C8442F',
  compare: ['#23865A', '#3A6FD8', '#C2508A'],
} as const;

/** Snap a y-domain to multiples of 5 around trend data. */
export function domainFor(points: { actual: number | null; forecast: number | null }[], cap = Infinity): [number, number] {
  const values = points.flatMap((p) => [p.actual, p.forecast]).filter((n): n is number => n !== null);
  const step = Math.max(...values) > 150 ? 10 : 5;
  const lo = Math.floor((Math.min(...values) - 1) / step) * step;
  const hi = Math.min(cap, Math.ceil((Math.max(...values) + 1) / step) * step);
  return [lo, hi];
}
