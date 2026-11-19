import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  value: T;
  options: SelectOption<T>[];
  onValueChange: (value: T) => void;
  prefix?: string;
}

/** Native <select> styled as a pill — keyboard/screen-reader friendly by default. */
export function Select<T extends string>({ value, options, onValueChange, prefix, className, ...props }: SelectProps<T>) {
  return (
    <div className={cn('relative inline-flex items-center', className)}>
      {prefix && (
        <span className="pointer-events-none absolute left-3.5 text-xs text-muted" aria-hidden="true">
          {prefix}
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value as T)}
        className={cn(
          'h-9 w-full cursor-pointer appearance-none rounded-full border border-line bg-canvas pr-9 text-xs font-medium text-ink hover:bg-brand-50',
          prefix ? 'pl-[4.1rem]' : 'pl-3.5',
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 size-4 text-muted" aria-hidden="true" />
    </div>
  );
}
