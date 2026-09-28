import type { Metadata } from 'next';
import { VrakCaseView } from '@/components/vrak-case-view';

export const metadata: Metadata = {
  title: 'VRAK — Energy Drink Brand & Campaign | Nikita Zhorov',
  description: 'VRAK is an energy drink brand built around Contained Chaos. Explore its packaging, characters and campaign by Nikita Zhorov.',
  alternates: { canonical: '/work/vrak' },
  openGraph: {
    type: 'article',
    url: '/work/vrak',
    title: 'VRAK — Energy Drink Brand & Campaign',
    description: 'Packaging, characters and campaign by Nikita Zhorov.',
    images: [{ url: '/assets/vrak/hand_scrolldisplay.webp', width: 2300, height: 1294, alt: 'VRAK energy drink campaign' }],
  },
  twitter: { card: 'summary_large_image', images: ['/assets/vrak/hand_scrolldisplay.webp'] },
};

export default function VrakCasePage() {
  return (
    <div className="relative w-screen h-[100dvh] bg-[var(--bg)] text-[var(--text)] overflow-hidden">
      <VrakCaseView />
    </div>
  );
}
