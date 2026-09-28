import type { Metadata, Viewport } from 'next';
import { Manrope, Anybody, Onest } from 'next/font/google';
import './globals.css';
import { GlobalElasticCursor } from '@/components/global-elastic-cursor';

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-manrope',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

const anybody = Anybody({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-anybody',
  weight: ['700', '800', '900'],
});

const onest = Onest({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-onest',
  weight: ['200', '300', '400', '500', '600', '700'],
});

const siteUrl = 'https://nzhorov.com';
const description = 'Portfolio of Nikita Zhorov, a web and brand designer in Germany. Selected work in digital products, brand identity and campaigns.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Nikita Zhorov — Web & Brand Designer',
  description,
  applicationName: 'Nikita Zhorov Portfolio',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Nikita Zhorov',
    title: 'Nikita Zhorov — Web & Brand Designer',
    description,
    locale: 'en_US',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Nikita Zhorov — Web & Brand Designer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nikita Zhorov — Web & Brand Designer',
    description,
    images: ['/opengraph-image'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F5F5F5',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${anybody.variable} ${onest.variable}`}>
      <body className="bg-[var(--bg)] text-[var(--text)] font-sans antialiased selection:bg-[var(--text)] selection:text-[var(--surface)]">
        <GlobalElasticCursor />
        {children}
      </body>
    </html>
  );
}
