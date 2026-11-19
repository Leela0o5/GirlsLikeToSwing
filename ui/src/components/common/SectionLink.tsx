import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function SectionLink({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-0.5 whitespace-nowrap text-xs font-semibold text-secondary hover:text-primary">
      {children} <ChevronRight className="size-3.5" aria-hidden="true" />
    </Link>
  );
}
