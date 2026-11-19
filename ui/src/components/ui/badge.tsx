import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

export const badgeVariants = cva(
  'inline-flex items-center gap-1 whitespace-nowrap rounded-full font-medium [&_svg]:size-3',
  {
    variants: {
      tone: {
        positive: 'bg-brand-50 text-secondary',
        warning: 'bg-warn-soft text-warn',
        critical: 'bg-danger-soft text-danger',
        neutral: 'bg-canvas text-muted border border-line',
        solid: 'bg-primary text-white',
      },
      size: {
        sm: 'px-2 py-0.5 text-[11px]',
        md: 'px-2.5 py-1 text-xs',
      },
    },
    defaultVariants: { tone: 'positive', size: 'md' },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone, size }), className)} {...props} />;
}
