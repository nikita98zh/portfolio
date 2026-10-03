'use client';

/**
 * High-performance background asset warmer
 * Warms critical hero-level textures and waits for fonts without blocking the user.
 * Uses HTMLImageElement.decode() to prevent frame drops during first render.
 */

export async function preloadImage(src: string): Promise<HTMLImageElement | null> {
  if (typeof window === 'undefined') return null;
  const img = new Image();
  img.src = src;

  try {
    await img.decode();
  } catch {
    // Network / cache fallback: do not block ENTER
  }

  return img;
}

const CRITICAL_HERO_ASSETS = [
  '/assets/portrait.webp',
];

let preloadStarted = false;

export function warmCriticalAssets() {
  if (typeof window === 'undefined' || preloadStarted) return;
  preloadStarted = true;

  // 1. Fonts readiness (resolves when typography is rasterizable without FOUT)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.catch(() => {});
  }

  // 2. Decode critical hero textures concurrently in the background
  CRITICAL_HERO_ASSETS.forEach((src) => {
    preloadImage(src).catch(() => {});
  });
}
