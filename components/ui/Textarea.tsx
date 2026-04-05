'use client';

import { cn } from '@/lib/utils';
import { forwardRef, TextareaHTMLAttributes, useState } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxChars?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, maxChars, id, value, onChange, ...props }, ref) => {
    const [charCount, setCharCount] = useState((value as string)?.length || 0);
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-[var(--text-primary)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'input-field min-h-[100px] resize-y',
            error && 'border-[var(--red)]',
            className
          )}
          value={value}
          onChange={handleChange}
          maxLength={maxChars}
          {...props}
        />
        <div className="flex justify-between">
          {error && <p className="text-xs text-[var(--red)]">{error}</p>}
          {maxChars && (
            <p className={cn(
              'text-xs ml-auto',
              charCount > maxChars * 0.9 ? 'text-[var(--amber)]' : 'text-[var(--text-tertiary)]'
            )}>
              {charCount}/{maxChars}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export { Textarea };
