import { Link } from 'react-router-dom';
import { Construction, type LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/common/PageHeader';
import { ROUTES } from '@/constants/routes';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  /** Planned capabilities, shown so teammates know what belongs here */
  planned?: string[];
}

/** Honest "not built yet" page for routes that exist in navigation. */
export function PlaceholderPage({ title, description, icon: Icon = Construction, planned = [] }: PlaceholderPageProps) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <Card className="flex flex-col items-center px-6 py-14 text-center">
        <span className="mb-4 inline-flex size-14 items-center justify-center rounded-full bg-brand-50 text-primary">
          <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <h2 className="text-lg font-semibold text-ink">This section is coming soon</h2>
        <p className="mt-1 max-w-md text-sm text-muted">
          {title} is not implemented yet. The navigation and route are in place so this page can be built independently.
        </p>
        {planned.length > 0 && (
          <ul className="mt-6 grid w-full max-w-md gap-2 text-left text-sm">
            {planned.map((p) => (
              <li key={p} className="flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-ink">
                <span className="size-1.5 rounded-full bg-secondary" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        )}
        <Link to={ROUTES.dashboard} className="mt-6 text-sm font-medium text-secondary hover:text-primary">
          ← Back to dashboard
        </Link>
      </Card>
    </>
  );
}
