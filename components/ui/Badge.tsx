'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'green' | 'amber' | 'red' | 'blue' | 'accent' | 'muted';
  pill?: boolean;
  className?: string;
}

export function Badge({ children, variant = 'default', pill = false, className }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--bg-muted)] text-[var(--text-primary)] border-[var(--border)]',
    green: 'bg-[var(--green-bg)] text-[var(--green)] border-[var(--green-bg)]',
    amber: 'bg-[var(--amber-bg)] text-[var(--amber)] border-[var(--amber-bg)]',
    red: 'bg-[var(--red-bg)] text-[var(--red)] border-[var(--red-bg)]',
    blue: 'bg-[var(--blue-bg)] text-[var(--blue)] border-[var(--blue-bg)]',
    accent: 'bg-[var(--brand-soft)] text-[var(--brand)] border-[var(--brand-soft)]',
    muted: 'bg-[var(--bg-muted)] text-[var(--text-secondary)] border-[var(--border)]',
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
