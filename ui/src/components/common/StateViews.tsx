import type { ReactNode } from 'react';
import { AlertTriangle, Inbox, type LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon: Icon = Inbox, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-10 text-center', className)}>
      <span className="mb-3 inline-flex size-12 items-center justify-center rounded-full bg-brand-50 text-secondary">
        <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <p className="text-sm font-semibold text-ink">{title}</p>
      {description && <p className="mt-1 max-w-xs text-xs text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, className }: { message: string; className?: string }) {
  return (
    <div role="alert" className={cn('flex items-center gap-2 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger', className)}>
      <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
      {message}
    </div>
  );
}
