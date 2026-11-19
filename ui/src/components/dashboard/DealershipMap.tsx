import { useMemo, useState } from 'react';
import { Clock, MapPin } from 'lucide-react';
import type { DealershipLocation } from '@/types';
import { Card, CardHeader } from '@/components/ui/card';
import { cn } from '@/utils/cn';

const statusMeta: Record<DealershipLocation['status'], { label: string; dot: string }> = {
  online: { label: 'Online', dot: 'bg-secondary' },
  syncing: { label: 'Syncing', dot: 'bg-warn' },
  offline: { label: 'Offline', dot: 'bg-danger' },
};

/** Decorative, deterministic street-map illustration (no map API). */
function MapBackdrop() {
  // Deterministic pseudo-random vehicle dots
  const dots = useMemo(
    () => Array.from({ length: 26 }, (_, i) => ({ x: (i * 73 + 31) % 400, y: (i * 47 + 19) % 230 })),
    [],
  );
  return (
    <svg viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden="true">
      <rect width="400" height="230" fill="#EDF5EC" />
      {/* parks */}
      <path d="M20 150c30-12 60-8 80 10s10 50-30 52-70-40-50-62z" fill="#DCEDD8" />
      <path d="M250 18c34-6 64 8 70 30s-26 32-58 26-46-50-12-56z" fill="#DCEDD8" />
      {/* river */}
      <path d="M-10 196C60 170 110 205 170 186s80-70 150-64 70 30 100 22" fill="none" stroke="#CFE6E3" strokeWidth="12" strokeLinecap="round" />
      {/* major roads */}
      <g fill="none" stroke="#ffffff" strokeLinecap="round">
        <path d="M-10 60C80 70 160 40 240 66s120 20 180 6" strokeWidth="7" />
        <path d="M120 -10c-8 70 18 140 4 250" strokeWidth="7" />
        <path d="M-10 128C90 120 200 132 410 112" strokeWidth="5" />
        <path d="M250 -10c20 80-10 150 30 250" strokeWidth="5" />
        <path d="M30 -10c10 60 60 110 50 250" strokeWidth="3" />
        <path d="M180 -10c-10 50 50 90 30 250" strokeWidth="3" />
        <path d="M-10 20h420M-10 92c140 10 280-8 420 4M-10 170c120-6 260 10 420-6" strokeWidth="2" />
        <path d="M330 -10c-20 90 10 170-10 250M60 -10v250M290 -10l20 250" strokeWidth="2" />
      </g>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={i % 4 === 0 ? 2.6 : 1.8} fill="#145C42" opacity={i % 3 === 0 ? 0.55 : 0.3} />
      ))}
    </svg>
  );
}

function Marker({ loc, selected, onSelect }: { loc: DealershipLocation; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${loc.name}, ${loc.city}`}
      aria-pressed={selected}
      className="group absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
    >
      <span className={cn('relative flex items-center justify-center rounded-full', loc.isHub ? 'size-12' : 'size-9')}>
        <svg className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
          <circle cx="50%" cy="50%" r="45%" className="animate-pulse-ring" fill="#23865A" opacity="0.35" />
        </svg>
        <span className="absolute inset-0 rounded-full bg-secondary/20" />
        <span
          className={cn(
            'relative flex items-center justify-center rounded-full border-2 border-white font-semibold text-white shadow-md transition-transform group-hover:scale-110',
            loc.isHub ? 'size-8 text-[8px]' : 'size-5',
            selected ? 'bg-primary ring-4 ring-lime/70' : 'bg-secondary',
          )}
        >
          {loc.isHub ? loc.code.replace('SAG-', 'S') : null}
        </span>
      </span>
    </button>
  );
}

export function DealershipMap({ locations }: { locations: DealershipLocation[] }) {
  const [selectedId, setSelectedId] = useState(locations[0]?.id);
  const selected = locations.find((l) => l.id === selectedId);
  const online = locations.filter((l) => l.status === 'online').length;

  return (
    <Card className="flex flex-col" aria-labelledby="map-title">
      <CardHeader
        titleId="map-title"
        title="Dealership Locations"
        subtitle="Illustrative map · positions not to scale"
        action={
          <p className="hidden items-center gap-2 text-xs text-muted sm:flex">
            <Clock className="size-3.5" aria-hidden="true" /> Live view
            <span className="h-3 w-px bg-line" />
            {locations.length} locations
          </p>
        }
      />

      <div className="relative min-h-[220px] flex-1 overflow-hidden rounded-2xl border border-line">
        <MapBackdrop />
        {locations.map((loc) => (
          <Marker key={loc.id} loc={loc} selected={loc.id === selectedId} onSelect={() => setSelectedId(loc.id)} />
        ))}

        {/* Overlay list (sm+) */}
        <div className="absolute right-3 top-3 hidden w-[40%] max-w-[190px] rounded-xl bg-primary/95 p-3 text-white shadow-pop backdrop-blur sm:block">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/70">Dealership Locations</p>
          <ul className="space-y-1">
            {locations.map((loc) => (
              <li key={loc.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(loc.id)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-1.5 py-1 text-left text-xs hover:bg-white/10',
                    loc.id === selectedId && 'bg-white/15',
                  )}
                >
                  <span className="inline-flex size-4 items-center justify-center rounded-full bg-lime/90 text-primary">
                    <MapPin className="size-2.5" aria-hidden="true" />
                  </span>
                  <span className="font-medium">{loc.code}</span>
                  <span className={cn('ml-auto size-1.5 rounded-full', statusMeta[loc.status].dot)} title={statusMeta[loc.status].label} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Compact list for small screens */}
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
        {locations.map((loc) => (
          <li key={loc.id}>
            <button
              type="button"
              onClick={() => setSelectedId(loc.id)}
              className={cn(
                'w-full rounded-xl border px-3 py-2 text-left text-xs',
                loc.id === selectedId ? 'border-secondary bg-brand-50 text-primary' : 'border-line text-ink',
              )}
            >
              <span className="font-semibold">{loc.code}</span>
              <span className="block truncate text-muted">{loc.city}</span>
            </button>
          </li>
        ))}
      </ul>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="flex items-center gap-2 font-medium text-ink">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-secondary opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex size-2.5 rounded-full bg-secondary" />
          </span>
          Live
          <span className="text-xs font-normal text-muted">
            · {online}/{locations.length} online
          </span>
        </span>
        {selected && (
          <span className="min-w-0 truncate text-xs text-muted" aria-live="polite">
            <span className="font-medium text-ink">{selected.name}</span> · {selected.city} · {selected.vehiclesOnLot} EVs ·{' '}
            {statusMeta[selected.status].label}
          </span>
        )}
      </footer>
    </Card>
  );
}
