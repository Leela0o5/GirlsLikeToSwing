import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn('card p-5 sm:p-6', className)} {...props} />;
}

interface CardHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  titleId?: string;
  className?: string;
}

export function CardHeader({ title, subtitle, icon, action, titleId, className }: CardHeaderProps) {
  return (
    <header className={cn('mb-4 flex flex-wrap items-start justify-between gap-3', className)}>
      <div className="flex min-w-0 flex-1 basis-48 items-center gap-3">
        {icon}
        <div className="min-w-0">
          <h2 id={titleId} className="text-[17px] font-semibold leading-snug tracking-tight text-balance text-ink">
            {title}
          </h2>
          {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex max-w-full shrink-0 flex-wrap items-center gap-2">{action}</div>}
    </header>
  );
}
