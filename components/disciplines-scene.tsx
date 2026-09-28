'use client';

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { disciplineWorks, type DisciplineId } from '@/lib/discipline-works';
import { playTickSound } from '@/lib/sound-fx';

interface DisciplinesSceneProps {
  isActive?: boolean;
  onHoverStateChange?: (state: string | null) => void;
  isReducedMotion?: boolean;
}

interface Card {
  id: number;
  category: DisciplineId;
  imageIndex: number;
  x: number;
  y: number;
  rotation: number;
}

const cardAngles = [-1.6, 1.2, -0.8, 1.5, -1.1];

export const DisciplinesScene = memo(function DisciplinesScene({
  isActive = true,
  onHoverStateChange,
  isReducedMotion = false,
}: DisciplinesSceneProps) {
  const [activeCategory, setActiveCategory] = useState<DisciplineId>('uiux');
  const [cards, setCards] = useState<Card[]>([
    { id: 0, category: 'uiux', imageIndex: 0, x: 0, y: 0, rotation: 0 },
  ]);
  const containerRef = useRef<HTMLElement>(null);
  const hoveredCategoryRef = useRef<DisciplineId | null>(null);
  const lastSpawnPointRef = useRef<{ x: number; y: number } | null>(null);
  const lastSpawnAtRef = useRef(0);
  const nextIndexRef = useRef(1);
  const cardIdRef = useRef(0);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const cardX = useSpring(pointerX, { stiffness: 190, damping: 26, mass: 0.55 });
  const cardY = useSpring(pointerY, { stiffness: 190, damping: 26, mass: 0.55 });

  const positionFor = useCallback((event: React.PointerEvent, category: DisciplineId) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };

    const size = Math.min(430, Math.max(270, Math.min(rect.width * 0.32, rect.height * 0.48)));
    const marginX = Math.min(size / 2 + 12, rect.width / 2);
    const marginY = Math.min(size / 2 + 12, rect.height / 2);
    const desiredX = event.clientX - rect.left + (category === 'brand' ? -72 : 72);
    const desiredY = event.clientY - rect.top + (category === 'uiux' ? 70 : category === 'marketing' ? -70 : 0);
    const x = Math.max(marginX, Math.min(desiredX, rect.width - marginX));
    const y = Math.max(marginY, Math.min(desiredY, rect.height - marginY));

    return { x: x - rect.width / 2, y: y - rect.height / 2 };
  }, []);

  const selectCategory = useCallback((id: DisciplineId, event?: React.PointerEvent) => {
    const point = event && event.pointerType !== 'touch' && !isReducedMotion
      ? positionFor(event, id)
      : { x: 0, y: 0 };

    pointerX.set(point.x);
    pointerY.set(point.y);
    hoveredCategoryRef.current = event && event.pointerType !== 'touch' ? id : null;
    lastSpawnPointRef.current = event ? { x: event.clientX, y: event.clientY } : null;
    lastSpawnAtRef.current = performance.now() - 100;
    nextIndexRef.current = 1;
    setActiveCategory(id);
    setCards([{ id: ++cardIdRef.current, category: id, imageIndex: 0, ...point, rotation: 0 }]);
    onHoverStateChange?.('action');
  }, [isReducedMotion, onHoverStateChange, pointerX, pointerY, positionFor]);

  const handleHeadingMove = useCallback((event: React.PointerEvent<HTMLButtonElement>, id: DisciplineId) => {
    if (!isActive || isReducedMotion || event.pointerType === 'touch' || hoveredCategoryRef.current !== id) return;

    const point = positionFor(event, id);
    pointerX.set(point.x);
    pointerY.set(point.y);

    const previous = lastSpawnPointRef.current;
    const now = performance.now();
    if (!previous || Math.hypot(event.clientX - previous.x, event.clientY - previous.y) < 58 || now - lastSpawnAtRef.current < 80) return;

    const images = disciplineWorks.find((item) => item.id === id)?.images;
    if (!images || nextIndexRef.current >= images.length) return;

    const imageIndex = nextIndexRef.current++;
    lastSpawnPointRef.current = { x: event.clientX, y: event.clientY };
    lastSpawnAtRef.current = now;
    const frozenX = cardX.get();
    const frozenY = cardY.get();

    setCards((previousCards) => [
      ...previousCards.slice(-2).map((card, index, visible) =>
        index === visible.length - 1 ? { ...card, x: frozenX, y: frozenY } : card
      ),
      {
        id: ++cardIdRef.current,
        category: id,
        imageIndex,
        x: point.x,
        y: point.y,
        rotation: cardAngles[imageIndex % cardAngles.length],
      },
    ]);
  }, [cardX, cardY, isActive, isReducedMotion, pointerX, pointerY, positionFor]);

  const showKeyboardImage = useCallback((id: DisciplineId, step: number) => {
    const images = disciplineWorks.find((item) => item.id === id)?.images;
    if (!images) return;
    const currentCard = cards.at(-1);
    const current = currentCard?.category === id ? currentCard.imageIndex : 0;
    const next = (current + step + images.length) % images.length;
    hoveredCategoryRef.current = null;
    pointerX.set(0);
    pointerY.set(0);
    setCards([{ id: ++cardIdRef.current, category: id, imageIndex: next, x: 0, y: 0, rotation: 0 }]);
    nextIndexRef.current = Math.min(next + 1, images.length);
  }, [cards, pointerX, pointerY]);

  // Older layers fall and fade while the last card remains readable.
  useEffect(() => {
    if (cards.length <= 1) return;
    const timer = window.setTimeout(() => setCards((current) => current.slice(-1)), 760);
    return () => window.clearTimeout(timer);
  }, [cards]);

  useEffect(() => {
    if (isActive) return;
    hoveredCategoryRef.current = null;
    lastSpawnPointRef.current = null;
    pointerX.set(0);
    pointerY.set(0);
  }, [isActive, pointerX, pointerY]);

  // Preload the active set and the first image of the other categories.
  useEffect(() => {
    if (!isActive) return;
    for (const item of disciplineWorks) {
      for (const work of item.id === activeCategory ? item.images : item.images.slice(0, 1)) {
        const image = new window.Image();
        image.src = work.src;
      }
    }
  }, [isActive, activeCategory]);

  const latest = cards.at(-1);
  const activeWork = disciplineWorks.find((item) => item.id === activeCategory);

  return (
    <section
      ref={containerRef}
      id="disciplines-stage"
      aria-label="Core Disciplines: UI/UX, Brand, Marketing"
      onPointerLeave={() => {
        hoveredCategoryRef.current = null;
        lastSpawnPointRef.current = null;
        pointerX.set(0);
        pointerY.set(0);
        onHoverStateChange?.(null);
      }}
      className="relative w-full h-full min-h-screen flex items-center justify-center bg-[var(--bg)] select-none isolate overflow-hidden"
    >
      <h2 className="sr-only">Core Disciplines</h2>
      <span className="sr-only" role="status" aria-live="polite">
        {activeWork?.label}: {activeWork?.images[latest?.imageIndex ?? 0]?.alt}. Use the arrow keys to browse the work.
      </span>

      <div id="disciplines-media-stage" aria-hidden="true" className="absolute inset-0 z-10 pointer-events-none">
        <AnimatePresence initial={false}>
          {cards.map((card, index) => {
            const isLatest = index === cards.length - 1;
            const image = disciplineWorks.find((item) => item.id === card.category)?.images[card.imageIndex];
            if (!image) return null;

            return (
              <motion.div
                key={card.id}
                style={{ x: isLatest ? cardX : card.x, y: isLatest ? cardY : card.y, zIndex: card.id }}
                className="absolute left-1/2 top-1/2"
              >
                <motion.div
                  initial={isReducedMotion ? false : { opacity: 0, scale: 0.96, rotate: card.rotation * 1.4 }}
                  animate={{ opacity: isLatest ? 1 : 0, scale: isLatest ? 1 : 0.985, rotate: card.rotation, y: isLatest ? 0 : 38 }}
                  exit={isReducedMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 38, transition: { duration: 0.4 } }}
                  transition={isReducedMotion ? { duration: 0 } : { duration: isLatest ? 0.42 : 0.64, ease: [0.22, 1, 0.36, 1] }}
                  className="-translate-x-1/2 -translate-y-1/2 w-[clamp(270px,min(32vw,48vh),430px)] aspect-square overflow-hidden bg-[var(--bg)] shadow-[0_18px_44px_rgba(0,0,0,0.11)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.src} alt="" draggable={false} className="block w-full h-full object-contain" />
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="relative w-full max-w-[1720px] h-full flex flex-col justify-between px-6 sm:px-10 md:px-14 lg:px-20 pt-28 sm:pt-32 md:pt-36 pb-24 sm:pb-28 md:pb-32 z-20 pointer-events-none">
        {disciplineWorks.map((item, index) => (
          <div
            key={item.id}
            className={index === 1
              ? 'flex justify-end items-center w-full pr-0 md:pr-[4vw] lg:pr-[7vw]'
              : index === 2
                ? 'flex justify-start items-center w-full pl-0 md:pl-[6vw] lg:pl-[9vw]'
                : 'flex justify-start items-center w-full pl-0 md:pl-[3vw] lg:pl-[5vw]'}
          >
            <button
              type="button"
              id={'discipline-link-' + item.id}
              aria-pressed={activeCategory === item.id}
              onClick={() => { if (activeCategory !== item.id) selectCategory(item.id); }}
              onFocus={(event) => {
                if (event.currentTarget.matches(':focus-visible') && activeCategory !== item.id) selectCategory(item.id);
              }}
              onPointerEnter={(event) => { if (isActive && event.pointerType !== 'touch') selectCategory(item.id, event); }}
              onPointerMove={(event) => handleHeadingMove(event, item.id)}
              onPointerLeave={() => { hoveredCategoryRef.current = null; onHoverStateChange?.(null); }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                  event.preventDefault();
                  showKeyboardImage(item.id, event.key === 'ArrowRight' ? 1 : -1);
                  playTickSound(156, 0.02);
                }
              }}
              className={'relative pointer-events-auto cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text)]/40 rounded-sm transition-all ' + (index === 1 ? 'text-right' : 'text-left')}
              style={{
                opacity: activeCategory === item.id ? 1 : 0.28,
                transform: activeCategory === item.id && !isReducedMotion
                  ? 'translate3d(' + (index === 1 ? 2 : -2) + 'px, -3px, 0)'
                  : 'translate3d(0, 0, 0)',
                transition: 'opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 350ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <span
                className={'block font-extrabold uppercase text-[var(--text)] select-none tracking-[-0.04em] leading-[0.88] ' + (index === 2 ? 'text-[clamp(44px,8.8vw,150px)]' : 'text-[clamp(54px,9.8vw,168px)]')}
                style={{ fontFamily: "var(--font-manrope), 'Manrope', -apple-system, sans-serif", fontWeight: 800 }}
              >
                {item.label}
              </span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
});
