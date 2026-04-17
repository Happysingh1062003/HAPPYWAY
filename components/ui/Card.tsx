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

export function Card({ children, className, padding = 'md', hover = false, glass = false, onClick }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6 md:p-8',
  };

  return (
    <div
      className={cn(
        'rounded-none border-b border-[var(--border)]',
        paddings[padding],
        hover && 'hover:bg-[var(--bg-hover)] transition-colors duration-200 cursor-pointer',
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
