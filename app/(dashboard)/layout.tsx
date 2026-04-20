'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="dark" className="bg-[var(--bg)] min-h-screen text-[var(--text-primary)] flex">
      <Sidebar />
      <div className="flex-1 md:ml-[240px] transition-all duration-300 min-w-0">
        <Topbar />
        <main className="p-6 md:p-8 pb-24 md:pb-8 min-h-[calc(100vh-56px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
