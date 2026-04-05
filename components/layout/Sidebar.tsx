'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutGrid, Archive, BarChart3, Layers, Award, Users,
  ShoppingBag, Compass, LogOut, Moon, Sun,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { signOut } from 'next-auth/react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/vault', label: 'Evidence Vault', icon: Archive },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/resources', label: 'Resources', icon: Layers },
  { href: '/badges', label: 'Badges', icon: Award },
  { href: '/network', label: 'Network', icon: Users },
  { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { href: '/opportunities', label: 'Opportunities', icon: Compass },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden md:flex flex-col fixed left-0 top-0 h-full bg-[var(--bg-card)] border-r border-[var(--border)] z-40 transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}>
        {/* Logo */}
        <div className={cn('h-14 flex items-center border-b border-[var(--border)] px-4', collapsed && 'justify-center')}>
          {collapsed ? (
            <span className="font-serif text-lg font-bold">E</span>
          ) : (
            <span className="text-xs font-medium tracking-[0.15em] uppercase text-[var(--text-primary)]">
              HappyWay
            </span>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  collapsed && 'justify-center px-0',
                  isActive
                    ? 'bg-[var(--accent)] text-[var(--text-inverse)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-[var(--border)] p-2 space-y-0.5">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all',
              collapsed && 'justify-center px-0'
            )}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            {!collapsed && <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>}
          </button>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--red)] transition-all',
              collapsed && 'justify-center px-0'
            )}
            aria-label="Sign out"
          >
            <LogOut className="w-[18px] h-[18px]" />
            {!collapsed && <span>Sign out</span>}
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full text-[var(--text-tertiary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all',
              collapsed && 'justify-center px-0'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span className="text-xs">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-card)] border-t border-[var(--border)] flex justify-around py-2 px-1">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs transition-colors',
                isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="truncate max-w-[56px]">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
