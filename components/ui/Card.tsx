'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  hover?: boolean;
  glass?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, padding = 'md', hover = true, glass = false, onClick }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div
      className={cn(
        glass ? 'glass-premium' : 'card',
        paddings[padding],
        hover && 'hover:border-[var(--border-strong)] transition-all duration-300',
        !hover && '!transform-none !shadow-[var(--shadow-sm)]',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
