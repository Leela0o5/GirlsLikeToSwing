import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-secondary shadow-sm',
        soft: 'bg-brand-50 text-primary hover:bg-brand-100',
        outline: 'border border-line bg-card text-ink hover:bg-canvas',
        ghost: 'text-muted hover:bg-canvas hover:text-ink',
        link: 'text-secondary hover:text-primary underline-offset-4 hover:underline px-0',
      },
      size: {
        sm: 'h-8 rounded-full px-3 text-xs',
        md: 'h-10 rounded-full px-4 text-sm',
        lg: 'h-11 rounded-full px-6 text-sm',
        icon: 'size-10 rounded-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = 'Button';
