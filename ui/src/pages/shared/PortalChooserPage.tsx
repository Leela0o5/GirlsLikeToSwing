import { Link } from 'react-router-dom';
import { ArrowRight, FlaskConical } from 'lucide-react';
import { PORTALS, PORTAL_ORDER } from '@/constants/portals';
import { getPortalUser } from '@/services';
import { Logo } from '@/components/common/Logo';
import { BRAND } from '@/constants/brand';

export function PortalChooserPage() {
  return (
    <div className="min-h-full bg-canvas">
      <header className="bg-primary">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <Logo variant="light" tagline="Choose a portal" />
          <span className="hidden items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/90 sm:inline-flex">
            <FlaskConical className="size-3.5" aria-hidden="true" /> Demo mode
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Preview a portal</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Authentication isn’t enabled yet, so pick a role to explore. You can switch any time from the sidebar or the profile menu. {BRAND.demoNotice}
        </p>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {PORTAL_ORDER.map((id) => {
            const p = PORTALS[id];
            const user = getPortalUser(id);
            const Icon = p.icon;
            return (
              <li key={id}>
                <Link to={p.basePath} className="card group flex h-full flex-col p-6 transition-shadow hover:shadow-pop">
                  <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-brand-50 text-primary">
                    <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="text-lg font-semibold text-ink">{p.tagline}</span>
                  <span className="mt-1 text-sm text-muted">{p.description}</span>
                  <span className="mt-4 text-xs text-muted">
                    Signed in as <span className="font-medium text-ink">{user.name}</span> · {user.role}
                  </span>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-secondary group-hover:text-primary">
                    Open {p.label.toLowerCase()} portal <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
