import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'HAPPYWAY — Build Your O-1A & EB-1 Case',
  description: 'The platform for O-1A and EB-1 visa aspirants to organize evidence, track progress, and connect with extraordinary professionals.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
