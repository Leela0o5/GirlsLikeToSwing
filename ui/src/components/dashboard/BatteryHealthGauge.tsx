import { useId } from 'react';

interface BatteryHealthGaugeProps {
  value: number;
  max?: number;
  /** Accessible description, e.g. "Dealer battery performance score" */
  label: string;
  size?: number;
  /** Text under the value; defaults to "/{max}" */
  caption?: string;
}

const SWEEP = 240; // degrees of arc
const START = -SWEEP / 2; // measured clockwise from 12 o'clock

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const a = polar(cx, cy, r, from);
  const b = polar(cx, cy, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y}`;
}

/** 240° arc gauge with ticks, gradient progress and an end-cap knob. */
export function BatteryHealthGauge({ value, max = 100, label, size = 240, caption }: BatteryHealthGaugeProps) {
  const gradId = useId();
  const pct = Math.max(0, Math.min(1, value / max));
  const cx = 120;
  const cy = 120;
  const r = 96;
  const stroke = 16;
  const end = START + SWEEP * pct;
  const knob = polar(cx, cy, r, end);

  const ticks = Array.from({ length: 11 }, (_, i) => START + (SWEEP * i) / 10);

  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className="relative mx-auto w-full"
      style={{ maxWidth: size }}
    >
      <svg viewBox="0 0 240 212" className="h-auto w-full" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#A8D94B" />
            <stop offset="0.55" stopColor="#23865A" />
            <stop offset="1" stopColor="#145C42" />
          </linearGradient>
        </defs>

        {ticks.map((t, i) => {
          const a = polar(cx, cy, r + 15, t);
          const b = polar(cx, cy, r + (i % 5 === 0 ? 21 : 18), t);
          return <line key={t} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#cfd6d1" strokeWidth={i % 5 === 0 ? 1.6 : 1} strokeLinecap="round" />;
        })}

        <path d={arcPath(cx, cy, r, START, START + SWEEP)} fill="none" stroke="#EEF2EE" strokeWidth={stroke} strokeLinecap="round" />
        {pct > 0 && (
          <path d={arcPath(cx, cy, r, START, end)} fill="none" stroke={`url(#${gradId})`} strokeWidth={stroke} strokeLinecap="round" />
        )}
        <circle cx={knob.x} cy={knob.y} r={11} fill="#fff" stroke="#145C42" strokeWidth={3} />
        <circle cx={knob.x} cy={knob.y} r={3.5} fill="#145C42" />

        <text x={polar(cx, cy, r, START).x} y={polar(cx, cy, r, START).y + 26} textAnchor="middle" className="fill-muted text-[10px]">
          0
        </text>
        <text x={polar(cx, cy, r, START + SWEEP).x} y={polar(cx, cy, r, START + SWEEP).y + 26} textAnchor="middle" className="fill-muted text-[10px]">
          {max}
        </text>
      </svg>

      <div className="absolute inset-x-0 top-[34%] flex flex-col items-center">
        <span className="text-[56px] font-semibold leading-none tracking-tight text-primary">{value}</span>
        <span className="mt-1 text-sm font-medium text-muted">{caption ?? `/${max}`}</span>
      </div>
    </div>
  );
}
