import { Link, useLocation } from 'react-router-dom';
import { GitCompareArrows, X } from 'lucide-react';
import { MAX_COMPARE, buyerPrefsStore, clearCompare, getListingSync, toggleCompare } from '@/services';
import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';
import { BUYER_ROUTES } from '@/constants/routes';

export function CompareTray() {
  const { compare } = useStore(buyerPrefsStore);
  const { pathname } = useLocation();
  if (compare.length === 0 || pathname === BUYER_ROUTES.compare) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card/95 px-4 py-3 shadow-pop backdrop-blur lg:left-[264px]" role="region" aria-label="Comparison tray">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
        <span className="inline-flex size-9 items-center justify-center rounded-full bg-brand-50 text-primary" aria-hidden="true">
          <GitCompareArrows className="size-4" />
        </span>
        <p className="text-sm font-semibold text-ink">
          Compare {compare.length}/{MAX_COMPARE}
        </p>
        <ul className="flex min-w-0 flex-1 flex-wrap gap-2">
          {compare.map((id) => {
            const l = getListingSync(id);
            if (!l) return null;
            const name = `${l.vehicle.year} ${l.vehicle.make} ${l.vehicle.model}`;
            return (
              <li key={id} className="inline-flex items-center gap-1 rounded-full border border-line bg-canvas py-1 pl-3 pr-1 text-xs text-ink">
                {name}
                <button type="button" onClick={() => toggleCompare(id)} aria-label={`Remove ${name} from comparison`} className="rounded-full p-0.5 text-muted hover:bg-line hover:text-ink">
                  <X className="size-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={clearCompare}>
            Clear
          </Button>
          <Link to={BUYER_ROUTES.compare} className="inline-flex h-8 items-center rounded-full bg-primary px-4 text-xs font-medium text-white hover:bg-secondary">
            {compare.length < 2 ? 'Add one more to compare' : 'Compare now'}
          </Link>
        </div>
      </div>
    </div>
  );
}
