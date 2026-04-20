'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'green' | 'amber' | 'red' | 'blue' | 'accent' | 'muted';
  pill?: boolean;
  className?: string;
  dot?: boolean;
}

export function Badge({ children, variant = 'default', pill = false, className, dot = false }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border)]',
    green: 'bg-[var(--bg-card)] text-[var(--green)] border-[var(--border)]',
    amber: 'bg-[var(--bg-card)] text-[var(--amber)] border-[var(--border)]',
    red: 'bg-[var(--bg-card)] text-[var(--red)] border-[var(--border)]',
    blue: 'bg-[var(--bg-card)] text-[var(--blue)] border-[var(--border)]',
    accent: 'bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border)]', // Flattened to neutral
    muted: 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border)]',
  };

  const dotColors = {
    default: 'bg-[var(--text-primary)]',
    green: 'bg-[var(--green)]',
    amber: 'bg-[var(--amber)]',
    red: 'bg-[var(--red)]',
    blue: 'bg-[var(--blue)]',
    accent: 'bg-[var(--text-primary)]',
    muted: 'bg-[var(--text-tertiary)]',
  };

  return (
    <span className={cn(
      pill ? 'badge-pill' : 'badge',
      variants[variant],
      className
    )}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
}
