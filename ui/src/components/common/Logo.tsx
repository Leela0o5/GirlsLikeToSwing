import { BRAND } from '@/constants/brand';
import { cn } from '@/utils/cn';

interface LogoMarkProps {
  className?: string;
}

/** Circular battery-bolt mark used in sidebar, navbar and favicon. */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 40 40" className={cn('size-10 shrink-0', className)} aria-hidden="true">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#23865A" />
          <stop offset="1" stopColor="#145C42" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="20" fill="url(#logo-g)" />
      <rect x="12" y="12.5" width="16" height="19" rx="3" fill="none" stroke="#E9F5E9" strokeWidth="2" />
      <rect x="17" y="9.5" width="6" height="3" rx="1" fill="#E9F5E9" />
      <path d="M21.2 15.5 16.5 23h3.3l-1 5 4.7-7.5h-3.3z" fill="#A8D94B" />
    </svg>
  );
}

interface LogoProps {
  variant?: 'light' | 'dark';
  showTagline?: boolean;
  tagline?: string;
  className?: string;
}

export function Logo({ variant = 'dark', showTagline = true, tagline = BRAND.tagline, className }: LogoProps) {
  const light = variant === 'light';
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <LogoMark className={light ? 'ring-2 ring-white/15 rounded-full' : undefined} />
      <div className="min-w-0 leading-tight">
        <p className={cn('truncate text-[17px] font-semibold tracking-tight', light ? 'text-white' : 'text-ink')}>
          {BRAND.name}
        </p>
        {showTagline && (
          <p className={cn('truncate text-xs', light ? 'text-white/70' : 'text-muted')}>{tagline}</p>
        )}
      </div>
    </div>
  );
}
