'use client';

import { useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { MobilePortfolio } from '@/components/mobile-portfolio';

const DesktopSpatialPortfolio = dynamic(
  () => import('@/components/desktop-spatial-portfolio'),
  { ssr: false }
);

function subscribe(callback: () => void) {
  const query = window.matchMedia('(max-width: 1023px), (pointer: coarse)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}

function isCompactViewport() {
  return window.matchMedia('(max-width: 1023px), (pointer: coarse)').matches;
}

export function ResponsivePortfolio() {
  // Readable content is present in the initial HTML. Load the cylinder only
  // when the viewport is wide enough to give each scene room to breathe.
  const isCompact = useSyncExternalStore(subscribe, isCompactViewport, () => true);
  return isCompact ? <MobilePortfolio /> : <DesktopSpatialPortfolio />;
}
