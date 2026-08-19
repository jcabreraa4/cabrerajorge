import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Analytics } from '@vercel/analytics/next';

import { Toaster } from '@workspace/ui/components/toast';
import { TooltipProvider } from '@workspace/ui/components/tooltip';
import '@workspace/ui/globals.css';
import { cn } from '@workspace/ui/lib/utils';

import { ThemeProvider } from '@/components/providers/theme-provider';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans'
});

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: 'Jorge Cabrera',
  description: 'Jorge Cabrera',
  icons: {
    icon: '/icon.webp'
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('antialiased', fontMono.variable, 'font-sans', geist.variable)}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            {children}
            <Analytics />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
