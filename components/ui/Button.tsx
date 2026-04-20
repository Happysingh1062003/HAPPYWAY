'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-[var(--text-primary)] text-[var(--bg)] hover:bg-[var(--text-secondary)] border border-transparent',
      secondary: 'bg-[var(--bg)] text-[var(--text-primary)] border border-[var(--border-strong)] hover:bg-[var(--bg-muted)]',
      ghost: 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] border border-transparent',
      danger: 'bg-[var(--bg)] text-[var(--red)] border border-[var(--border-strong)] hover:border-[var(--red)]',
      accent: 'bg-[var(--blue)] text-white hover:bg-[var(--accent-hover)] border border-transparent',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-[var(--radius-md)]',
      md: 'px-4 py-2 text-sm rounded-[var(--radius-md)]',
      lg: 'px-6 py-3 text-sm rounded-[var(--radius-lg)] h-12',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-3 h-3 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
