import type { Metadata } from 'next';
import { Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HappyWay — Build Your Extraordinary Case',
  description: 'The premium platform for O-1 and EB-1 aspirants to organize evidence, track progress, and build an extraordinary visa petition.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${jetbrainsMono.variable}`} data-scroll-behavior="smooth">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
