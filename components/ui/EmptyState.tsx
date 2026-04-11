'use client';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 px-6 text-center', className)}>
      {icon && (
        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[var(--bg-muted)] text-[var(--text-tertiary)] mb-5">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-display text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] max-w-md mb-8 leading-relaxed">{description}</p>
      {action}
    </div>
  );
}
