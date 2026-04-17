'use client';

import { usePathname } from 'next/navigation';
import { getInitials } from '@/lib/utils';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/vault': 'Evidence Vault',
  '/analytics': 'Analytics',
  '/resources': 'Resources',
  '/badges': 'Badges',
  '/network': 'Network',
  '/marketplace': 'Marketplace',
  '/opportunities': 'Opportunities',
};

export function Topbar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] || 'Dashboard';
  const userName = 'Demo User';

  return (
    <header className="h-14 flex items-center justify-between px-6 md:px-8 sticky top-0 z-30 bg-[var(--bg)] border-b border-[var(--border)]">
      <span className="text-xs font-medium tracking-[0.15em] uppercase text-[var(--text-tertiary)]">{title}</span>
      <div className="flex items-center gap-4">
        <span className="hidden md:block text-xs text-[var(--text-tertiary)] font-mono">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <div className="w-7 h-7 rounded-full bg-[var(--text-primary)] text-[var(--bg)] flex items-center justify-center text-[10px] font-semibold">
          {getInitials(userName)}
        </div>
      </div>
    </header>
  );
}
