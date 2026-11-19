import { Link } from 'react-router-dom';
import { PORTALS, PORTAL_ORDER } from '@/constants/portals';
import { usePortal } from '@/hooks/usePortal';
import { cn } from '@/utils/cn';

interface PortalSwitcherProps {
  onNavigate?: () => void;
  variant?: 'grid' | 'list';
}

/**
 * Demo-only role switcher. Replaces login so all four portals can be previewed.
 * Remove (or gate behind a dev flag) once authentication decides the role.
 */
export function PortalSwitcher({ onNavigate, variant = 'grid' }: PortalSwitcherProps) {
  const current = usePortal();
  return (
    <nav aria-label="Preview portal">
      <ul className={cn(variant === 'grid' ? 'grid grid-cols-2 gap-1.5' : 'space-y-0.5')}>
        {PORTAL_ORDER.map((id) => {
          const p = PORTALS[id];
          const Icon = p.icon;
          const active = current.id === id;
          return (
            <li key={id}>
              <Link
                to={p.basePath}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 text-xs font-medium transition-colors',
                  variant === 'grid' ? 'rounded-xl border px-2.5 py-2' : 'rounded-lg px-4 py-2 text-sm font-normal',
                  active
                    ? variant === 'grid'
                      ? 'border-secondary bg-card text-primary shadow-sm'
                      : 'bg-brand-50 font-medium text-primary'
                    : variant === 'grid'
                      ? 'border-transparent text-muted hover:bg-card hover:text-ink'
                      : 'text-ink hover:bg-canvas',
                )}
              >
                <Icon className={cn('size-4 shrink-0', active ? 'text-secondary' : 'text-muted')} aria-hidden="true" />
                {p.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
