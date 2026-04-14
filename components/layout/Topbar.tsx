'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';
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
    <header className="h-16 bg-black flex items-center justify-between px-6 sticky top-0 z-30 border-t-0 border-x-0 !rounded-none border-b border-white/10">
      <h1 className="font-display text-xl text-gradient">{title}</h1>
      <div className="flex items-center gap-2">
        {/* Search Hint */}
        <button className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-muted)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-all text-xs">
          <Search className="w-3.5 h-3.5" />
          <span>Search...</span>
          <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border)] text-[0.625rem] font-mono font-medium">⌘K</kbd>
        </button>

        {/* Notifications */}
        <button
          className="relative p-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all"
          aria-label="Notifications"
        >
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--brand)] rounded-full ring-2 ring-[var(--bg-card)]" />
        </button>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-xl bg-[var(--text-primary)] text-[var(--bg)] flex items-center justify-center text-xs font-semibold shadow-sm">
          {getInitials(userName)}
        </div>
      </div>
    </header>
  );
}
