'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutGrid, Archive, BarChart3, Layers, Award, Users,
  ShoppingBag, Compass, LogOut,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

import { signOut } from 'next-auth/react';

const LogoSVG = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width={size} height={size} className="flex-shrink-0">
    <polygon points="128,40 216,192 40,192" fill="var(--text-primary)" />
  </svg>
);

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
  
  return (
    <>
      <aside className={cn(
        'hidden md:flex flex-col fixed left-0 top-0 h-full z-40 border-r border-[var(--border)] transition-all bg-[var(--bg)]',
        collapsed ? 'w-[64px]' : 'w-[240px]'
      )}>
        {/* Logo */}
        <div className={cn('h-14 flex items-center border-b border-[var(--border)] px-4', collapsed && 'justify-center px-0')}>
          {collapsed ? (
            <div className="flex items-center justify-center">
              <LogoSVG size={20} />
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <LogoSVG size={20} />
              <span className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
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
                <p className="px-3 mb-2 text-xs font-medium text-[var(--text-tertiary)]">
                  {group.label}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-1.5 rounded-[var(--radius-md)] text-sm transition-colors',
                        collapsed && 'justify-center px-0 py-2',
                        isActive
                          ? 'bg-[var(--bg-muted)] text-[var(--text-primary)] font-medium'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]'
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon className={cn('w-4 h-4 flex-shrink-0', isActive && 'text-[var(--text-primary)]')} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-[var(--border)] p-3 space-y-1">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm w-full text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] transition-colors',
              collapsed && 'justify-center px-0'
            )}
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Sign out</span>}
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm w-full text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] transition-colors',
              collapsed && 'justify-center px-0'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className={cn('transition-transform', collapsed && 'rotate-180')}>
              <ChevronLeft className="w-4 h-4" />
            </span>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg)] border-t border-[var(--border)] flex justify-around py-2 px-1">
        {NAV_GROUPS[0].items.concat(NAV_GROUPS[1].items).slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-2 py-1.5 rounded text-[0.65rem] transition-colors',
                isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
              )}
            >
              <item.icon className="w-5 h-5" />
            </Link>
          );
        })}
      </nav>
    </>
  );
}
