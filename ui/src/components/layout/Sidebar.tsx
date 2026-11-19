import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import type { NavItem } from '@/constants/navigation';
import { usePortal } from '@/hooks/usePortal';
import { Logo } from '@/components/common/Logo';
import { cn } from '@/utils/cn';
import { PortalSwitcher } from './PortalSwitcher';

interface SidebarProps {
  /** Mobile drawer open state (ignored on lg+ where sidebar is always visible) */
  open: boolean;
  onClose: () => void;
}

function SidebarLink({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const Icon = item.icon;
  return (
    <li>
      <NavLink
        to={item.to}
        end={item.end}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors',
            isActive ? 'bg-brand-50 font-semibold text-primary' : 'text-ink/80 hover:bg-canvas hover:text-ink',
          )
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              className={cn('size-[18px] shrink-0', isActive ? 'text-primary' : 'text-muted group-hover:text-ink')}
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span className="truncate">{item.label}</span>
            {item.badge !== undefined && (
              <span
                className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold leading-5 text-white"
                aria-label={`${item.badge} items`}
              >
                {item.badge}
              </span>
            )}
          </>
        )}
      </NavLink>
    </li>
  );
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const portal = usePortal();
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-ink/40 transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        id="app-sidebar"
        aria-label="Main navigation"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r border-line bg-card transition-transform duration-200',
          'lg:translate-x-0',
          open ? 'translate-x-0 shadow-pop' : '-translate-x-full',
        )}
      >
        <div className="relative flex h-[92px] shrink-0 items-center bg-primary pl-6 pr-12 lg:pr-6">
          <Logo variant="light" tagline={portal.tagline} />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full p-1.5 text-white/80 hover:bg-white/10 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>
        {/* Accent rail, echoing the reference */}
        <span className="pointer-events-none absolute inset-y-[92px] right-[-1px] hidden w-[3px] bg-gradient-to-b from-secondary via-lime/70 to-transparent lg:block" aria-hidden="true" />

        <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-6" aria-label={`${portal.label} navigation`}>
          <p className="mb-2 px-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted/80">{portal.navSectionLabel}</p>
          <ul className="space-y-1">
            {portal.primaryNav.map((item) => (
              <SidebarLink key={item.to} item={item} onNavigate={onClose} />
            ))}
          </ul>

          <div className="mt-auto pt-6">
            <div className="mb-4 rounded-2xl border border-line bg-brand-50/60 p-3">
              <p className="mb-2 px-1 text-xs font-semibold text-primary">Preview portal</p>
              <PortalSwitcher onNavigate={onClose} />
              <p className="mt-2 px-1 text-[10.5px] leading-relaxed text-muted">Demo mode · all data is simulated.</p>
            </div>
            <div className="border-t border-line pt-4">
              <ul className="space-y-1">
                {portal.secondaryNav.map((item) => (
                  <SidebarLink key={item.to} item={item} onNavigate={onClose} />
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
