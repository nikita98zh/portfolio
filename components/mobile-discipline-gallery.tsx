'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { disciplineWorks } from '@/lib/discipline-works';

type Discipline = (typeof disciplineWorks)[number];

export function MobileDisciplineGallery({ item, alignRight = false }: { item: Discipline; alignRight?: boolean }) {
  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const suppressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const work = item.images[index];

  useEffect(() => {
    const next = new window.Image();
    next.src = item.images[(index + 1) % item.images.length].src;
  }, [index, item]);

  useEffect(() => () => {
    if (suppressTimer.current) clearTimeout(suppressTimer.current);
  }, []);

  const change = (step: number) => setIndex((current) => (current + step + item.images.length) % item.images.length);

  return (
    <div className="relative">
      <h3 className="relative z-10 mb-4 text-[clamp(46px,14vw,86px)] leading-[0.95] tracking-[-0.065em] font-extrabold">
        {item.mobileLabel}
      </h3>
      <span className="sr-only" role="status" aria-live="polite">{work.alt}</span>
      <div className={'w-full max-w-[680px] ' + (alignRight ? 'ml-auto' : '')}>
        <button
          type="button"
          aria-label={'Show next ' + item.mobileLabel + ' work'}
          className="mobile-reveal relative block w-full aspect-square overflow-hidden bg-[var(--bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--text)]"
          style={{ touchAction: 'pan-y' }}
          onTouchStart={(event) => {
            touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
          }}
          onTouchEnd={(event) => {
            const start = touchStart.current;
            touchStart.current = null;
            if (!start) return;
            const dx = event.changedTouches[0].clientX - start.x;
            const dy = event.changedTouches[0].clientY - start.y;
            if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
            suppressClick.current = true;
            if (suppressTimer.current) clearTimeout(suppressTimer.current);
            suppressTimer.current = setTimeout(() => { suppressClick.current = false; }, 400);
            change(dx < 0 ? 1 : -1);
          }}
          onClick={() => {
            if (suppressClick.current) {
              suppressClick.current = false;
              return;
            }
            change(1);
          }}
        >
          <AnimatePresence initial={false}>
            <motion.span
              key={work.src}
              className="absolute inset-0 block"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.24, ease: 'easeOut' }}
            >
              <Image
                src={work.src}
                alt={work.alt}
                fill
                unoptimized
                sizes="(max-width: 640px) calc(100vw - 40px), 680px"
                loading="lazy"
                className="object-contain"
                draggable={false}
              />
            </motion.span>
          </AnimatePresence>
        </button>
        <div className="mt-2 flex justify-end gap-1">
          <button
            type="button"
            onClick={() => change(-1)}
            aria-label={'Previous ' + item.mobileLabel + ' work'}
            className="flex size-11 items-center justify-center text-2xl font-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--text)]"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => change(1)}
            aria-label={'Next ' + item.mobileLabel + ' work'}
            className="flex size-11 items-center justify-center text-2xl font-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--text)]"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
