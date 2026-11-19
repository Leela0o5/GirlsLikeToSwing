import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

const control =
  'w-full rounded-xl border border-line bg-card px-3 text-sm text-ink placeholder:text-muted/70 focus:border-secondary/60 focus:outline-none focus:ring-2 focus:ring-secondary/15';

interface FieldProps {
  label: string;
  hint?: string;
  children: (id: string) => ReactNode;
  className?: string;
}

export function Field({ label, hint, children, className }: FieldProps) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-ink">
        {label}
      </label>
      {children(id)}
      {hint && <p className="mt-1 text-[11px] text-muted">{hint}</p>}
    </div>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, 'h-10', className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(control, 'min-h-[88px] py-2', className)} {...props} />;
}

export function NativeSelect({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(control, 'h-10 cursor-pointer', className)} {...props}>
      {children}
    </select>
  );
}
