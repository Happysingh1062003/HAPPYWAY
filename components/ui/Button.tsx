'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

    const variants = {
      primary: 'bg-[var(--text-primary)] text-[var(--bg)] hover:bg-[var(--text-secondary)] active:scale-[0.98] shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] dark:shadow-[0_4px_14px_0_rgba(255,255,255,0.1)]',
      secondary: 'bg-[var(--bg-card)] text-[var(--text-primary)] border-[1.5px] border-[var(--border)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-strong)] active:scale-[0.98] shadow-[var(--shadow-xs)]',
      ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] active:scale-[0.98]',
      danger: 'bg-[var(--text-primary)] text-[var(--bg)] hover:opacity-90 active:scale-[0.98]',
    };

    const sizes = {
      sm: 'px-3.5 py-1.5 text-xs rounded-[var(--radius-sm)]',
      md: 'px-5 py-2.5 text-sm rounded-[var(--radius-md)]',
      lg: 'px-7 py-3.5 text-[0.9375rem] rounded-[var(--radius-md)]',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
