import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, CircleHelp, Settings, ShieldAlert } from 'lucide-react';
import { getPortalUser } from '@/services';
import { useClickOutside } from '@/hooks/useClickOutside';
import { usePortal } from '@/hooks/usePortal';
import { cn } from '@/utils/cn';
import { PortalSwitcher } from './PortalSwitcher';

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary text-sm font-semibold text-white ring-2 ring-white shadow-card',
        className,
      )}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function ProfileMenu() {
  const portal = usePortal();
  const user = getPortalUser(portal.id);
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);

  const links = [
    { to: `${portal.basePath}/settings`, label: 'Account settings', icon: Settings },
    { to: `${portal.basePath}/help`, label: 'Help Center', icon: CircleHelp },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Open profile menu for ${user.name}`}
        className="flex items-center gap-3 rounded-full py-1 pl-1 pr-2 hover:bg-card"
      >
        <Avatar initials={user.initials} />
        <span className="hidden whitespace-nowrap text-left leading-tight lg:block">
          <span className="block text-sm font-semibold text-ink">{user.name}</span>
          <span className="block text-xs text-muted">{user.dealership}</span>
        </span>
        <ChevronDown className={cn('hidden size-4 text-muted transition-transform lg:block', open && 'rotate-180')} />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 top-[calc(100%+8px)] z-40 w-72 overflow-hidden rounded-2xl border border-line bg-card shadow-pop">
          <div className="flex items-center gap-3 border-b border-line px-4 py-4">
            <Avatar initials={user.initials} className="size-10" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
              <p className="truncate text-xs text-muted">
                {user.role} · {user.dealership}
              </p>
            </div>
          </div>
          <ul className="py-1.5">
            {links.map(({ to, label, icon: Icon }) => (
              <li key={label}>
                <Link role="menuitem" to={to} onClick={close} className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-canvas">
                  <Icon className="size-4 text-muted" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-line py-2">
            <p className="px-4 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted">Switch portal (demo)</p>
            <PortalSwitcher variant="list" onNavigate={close} />
          </div>
          <p className="flex items-start gap-2 border-t border-line bg-canvas/60 px-4 py-3 text-[11px] leading-relaxed text-muted">
            <ShieldAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            Sign-in is not enabled in this demo build.
          </p>
        </div>
      )}
    </div>
  );
}
