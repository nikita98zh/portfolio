import type { Metadata } from 'next';
import { MorfCaseView } from '@/components/morf/morf-case-view';

export const metadata: Metadata = {
  title: 'MORF — Brand Identity & Digital Experience | Nikita Zhorov',
  description: 'MORF is a fashion-led dogwear brand concept. Explore the visual identity, campaign and e-commerce experience designed by Nikita Zhorov.',
  alternates: { canonical: '/work/morf' },
  openGraph: {
    type: 'article',
    url: '/work/morf',
    title: 'MORF — Brand Identity & Digital Experience',
    description: 'Brand identity, campaign and e-commerce experience by Nikita Zhorov.',
    images: [{ url: '/assets/morf_preview_scrolldisplay.webp', width: 2000, height: 1601, alt: 'MORF campaign artwork' }],
  },
  twitter: { card: 'summary_large_image', images: ['/assets/morf_preview_scrolldisplay.webp'] },
};

export default function MorfCasePage() {
  return (
    <div className="relative w-screen h-[100dvh] bg-[var(--bg)] text-[var(--text)] overflow-hidden">
      <MorfCaseView />
    </div>
  );
}
