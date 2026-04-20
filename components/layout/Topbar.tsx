'use client';

import { usePathname } from 'next/navigation';
import { getInitials } from '@/lib/utils';
import { Search, Bell } from 'lucide-react';
import Link from 'next/link';

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
    <header className="h-14 flex items-center justify-between px-6 sticky top-0 z-30 bg-[var(--bg)] border-b border-[var(--border)]">
      <div className="flex items-center gap-3">
        <span className="text-sm text-[var(--text-tertiary)]">HappySingh106</span>
        <span className="text-[var(--text-tertiary)]">\</span>
        <span className="text-sm font-semibold text-[var(--text-primary)]">{title}</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Command Palette Trigger */}
        <button className="hidden md:flex items-center justify-between w-48 px-2 py-1.5 rounded-[var(--radius-sm)] bg-[var(--bg)] border border-[var(--border-strong)] text-[var(--text-tertiary)] hover:border-[var(--text-primary)] transition-colors text-xs">
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search...</span>
          </div>
          <kbd className="text-[10px] uppercase font-medium bg-[var(--bg-muted)] px-1 rounded">Ctrl K</kbd>
        </button>

        {/* User Avatar */}
        <div className="w-7 h-7 rounded-full bg-[var(--text-primary)] text-[var(--bg)] flex items-center justify-center text-[10px] font-semibold cursor-pointer">
          {getInitials(userName)}
        </div>
      </div>
    </header>
  );
}
