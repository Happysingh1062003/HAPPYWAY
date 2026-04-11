'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'var(--font-body), sans-serif',
            },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
