'use client';

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
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
    <header className="h-14 bg-[var(--bg-card)] border-b border-[var(--border)] flex items-center justify-between px-6 sticky top-0 z-30">
      <h1 className="font-serif text-xl">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--red)] rounded-full" />
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--text-inverse)] flex items-center justify-center text-xs font-medium">
          {getInitials(userName)}
        </div>
      </div>
    </header>
  );
}
