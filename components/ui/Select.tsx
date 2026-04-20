'use client';

import { cn } from '@/lib/utils';
import { forwardRef, SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={selectId} className="block text-[0.8125rem] font-semibold text-[var(--text-primary)]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'input-field appearance-none cursor-pointer',
            error && 'border-[var(--red)]',
            className
          )}
          {...props}
        >
          {placeholder && <option value="" className="bg-[var(--bg)] text-[var(--text-primary)]">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[var(--bg)] text-[var(--text-primary)]">{opt.label}</option>
          ))}
        </select>
        {error && <p className="text-xs font-medium text-[var(--red)]">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export { Select };
