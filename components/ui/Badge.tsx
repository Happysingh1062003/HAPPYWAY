'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'green' | 'amber' | 'red' | 'blue' | 'muted';
  pill?: boolean;
  className?: string;
}

export function Badge({ children, variant = 'default', pill = false, className }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--bg-muted)] text-[var(--text-primary)]',
    green: 'bg-[var(--green-bg)] text-[var(--green)]',
    amber: 'bg-[var(--amber-bg)] text-[var(--amber)]',
    red: 'bg-[var(--red-bg)] text-[var(--red)]',
    blue: 'bg-[var(--blue-bg)] text-[var(--blue)]',
    muted: 'bg-[var(--bg-muted)] text-[var(--text-secondary)]',
  };

  return (
    <span className={cn(
      pill ? 'badge-pill' : 'badge',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
