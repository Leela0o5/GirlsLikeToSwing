import { cn } from '@/utils/cn';

/**
 * Generic EV sedan illustration (SVG placeholder — not a photo of any real
 * vehicle). Swap for a real vehicle image when an asset service exists.
 */
export function VehicleIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 110" className={cn('h-auto w-full', className)} role="img" aria-label="Illustration of an electric sedan">
      <defs>
        <linearGradient id="car-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f6f5" />
          <stop offset="0.55" stopColor="#d9dfdc" />
          <stop offset="1" stopColor="#aab4af" />
        </linearGradient>
        <linearGradient id="car-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b4a44" />
          <stop offset="1" stopColor="#1d2622" />
        </linearGradient>
        <radialGradient id="car-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#145C42" stopOpacity="0.22" />
          <stop offset="1" stopColor="#145C42" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="96" rx="108" ry="9" fill="url(#car-shadow)" />
      <path
        d="M18 78c0-9 4-15 14-18l34-10c10-12 26-22 50-22 22 0 38 7 54 20l30 6c12 3 20 9 22 18l1 8c0 4-3 7-7 7H25c-4 0-7-3-7-7z"
        fill="url(#car-body)"
        stroke="#9aa59f"
        strokeWidth="0.8"
      />
      <path d="M72 50c10-11 24-17 44-17 18 0 31 5 44 15l-4 4H76z" fill="url(#car-glass)" />
      <path d="M116 33v19" stroke="#c9d1cd" strokeWidth="2" />
      <path d="M30 70h14" stroke="#145C42" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      <path d="M200 66l14 3" stroke="#c8442f" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <path d="M60 76h130" stroke="#b5beb9" strokeWidth="0.8" />
      {[62, 180].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="84" r="15" fill="#202820" />
          <circle cx={cx} cy="84" r="9" fill="#cfd6d2" />
          <circle cx={cx} cy="84" r="3" fill="#737B73" />
        </g>
      ))}
    </svg>
  );
}
