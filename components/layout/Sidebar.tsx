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

const NAV_GROUPS = [
  {
    label: 'Main',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
      { href: '/vault', label: 'Evidence Vault', icon: Archive },
      { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Discover',
    items: [
      { href: '/resources', label: 'Resources', icon: Layers },
      { href: '/badges', label: 'Badges', icon: Award },
      { href: '/network', label: 'Network', icon: Users },
      { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
      { href: '/opportunities', label: 'Opportunities', icon: Compass },
    ],
  },
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
        collapsed ? 'w-[72px]' : 'w-[248px]'
      )}>
        {/* Logo */}
        <div className={cn('h-16 flex items-center border-b border-[var(--border)] px-5', collapsed && 'justify-center px-0')}>
          {collapsed ? (
            <div className="w-9 h-9 rounded-xl bg-[var(--brand)] flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--brand)] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">H</span>
              </div>
              <span className="label-uppercase text-[var(--text-primary)]">
                HappyWay
              </span>
            </div>
          )}
        </div>

        {/* Nav Groups */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="px-3 mb-2 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.8125rem] font-medium transition-all duration-150',
                        collapsed && 'justify-center px-0',
                        isActive
                          ? 'bg-[var(--text-primary)] text-[var(--bg)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon className={cn('w-[18px] h-[18px] flex-shrink-0', isActive && 'text-[var(--bg)]')} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-[var(--border)] p-3 space-y-0.5">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.8125rem] w-full text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all',
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
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.8125rem] w-full text-[var(--text-secondary)] hover:bg-[var(--red-bg)] hover:text-[var(--red)] transition-all',
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
              'flex items-center gap-3 px-3 py-2 rounded-xl text-[0.8125rem] w-full text-[var(--text-tertiary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all mt-1',
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-card)]/95 backdrop-blur-lg border-t border-[var(--border)] flex justify-around py-2.5 px-1">
        {NAV_GROUPS[0].items.concat(NAV_GROUPS[1].items).slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-[0.625rem] font-medium transition-colors',
                isActive ? 'text-[var(--brand)]' : 'text-[var(--text-tertiary)]'
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
