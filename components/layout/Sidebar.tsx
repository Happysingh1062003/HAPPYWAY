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

const LogoSVG = ({ size = 28 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width={size} height={size} className="flex-shrink-0">
    <defs>
      <radialGradient id="mainGrad" cx="35%" cy="30%" r="70%" fx="35%" fy="30%">
        <stop offset="0%" stopColor="#60A5FA"/>
        <stop offset="40%" stopColor="#2563EB"/>
        <stop offset="70%" stopColor="#1E40AF"/>
        <stop offset="100%" stopColor="#1E3A8A"/>
      </radialGradient>
      <radialGradient id="specGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.6)"/>
        <stop offset="60%" stopColor="rgba(255,255,255,0.1)"/>
        <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
      </radialGradient>
    </defs>
    <circle cx="128" cy="128" r="110" fill="url(#mainGrad)" />
    <ellipse cx="102" cy="70" rx="44" ry="33" fill="url(#specGrad)" />
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
      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden md:flex flex-col fixed left-0 top-0 h-full bg-[#050505] border-r border-white/10 z-40 transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-[248px]'
      )}>
        {/* Logo */}
        <div className={cn('h-16 flex items-center border-b border-white/10 px-5', collapsed && 'justify-center px-0')}>
          {collapsed ? (
            <div className="flex items-center justify-center">
              <LogoSVG size={28} />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center flex-shrink-0">
                <LogoSVG size={28} />
              </div>
              <span className="text-sm font-medium tracking-wider text-[var(--text-primary)]">
                HAPPYWAY
              </span>
            </div>
          )}
        </div>

        {/* Nav Groups */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="px-3 mb-2 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
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
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
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
        <div className="border-t border-white/10 p-3 space-y-0.5">
          {/* Removed theme toggle to enforce deep minimalist aesthetic */}

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-[var(--text-secondary)] hover:bg-[var(--red-bg)] hover:text-[var(--red)] transition-all',
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
              'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium w-full text-[var(--text-tertiary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all mt-1',
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-premium border-t border-white/10 flex justify-around py-2.5 px-1 !rounded-none">
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
