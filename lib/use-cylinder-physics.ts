'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useMotionValue } from 'motion/react';
import { evaluateSurface, getDwellCenterU, getSceneIndex, TOTAL_SCENES } from '@/lib/cylinder-manifold';
import { playTickSound } from '@/lib/sound-fx';

interface UseCylinderPhysicsOptions {
  isAnyCaseOpen: boolean;
  isReducedMotion?: boolean;
}

export function useCylinderPhysics({ isAnyCaseOpen, isReducedMotion = false }: UseCylinderPhysicsOptions) {
  const cylinderPosMotion = useMotionValue(0);
  const portraitProgressMotion = useMotionValue(0);
  const fragmentsRotationMotion = useMotionValue(0);
  const uMotion = useMotionValue(0);
  const [centerMilestone, setCenterMilestone] = useState(0);
  const isAnyCaseOpenRef = useRef(isAnyCaseOpen);
  const targetURef = useRef(0);
  const currentURef = useRef(0);
  const velocityURef = useRef(0);
  const dragStartYRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const touchHistoryRef = useRef<Array<{ y: number; t: number }>>([]);
  const lastFrameTimeRef = useRef<number | null>(null);

  useEffect(() => {
    isAnyCaseOpenRef.current = isAnyCaseOpen;
    if (isAnyCaseOpen) {
      velocityURef.current = 0;
      targetURef.current = currentURef.current;
    }
  }, [isAnyCaseOpen]);

  useEffect(() => {
    let animationFrame = 0;
    const tick = (time: number) => {
      const previousTime = lastFrameTimeRef.current ?? time;
      const deltaSeconds = Math.min(0.05, Math.max(0.001, (time - previousTime) / 1000));
      lastFrameTimeRef.current = time;

      if (!isAnyCaseOpenRef.current) {
        if (!isReducedMotion && Math.abs(velocityURef.current) > 0.00004) {
          targetURef.current += velocityURef.current * deltaSeconds * 60;
          velocityURef.current *= Math.pow(0.08, deltaSeconds);
        } else {
          velocityURef.current = 0;
        }

        const difference = targetURef.current - currentURef.current;
        const response = isReducedMotion ? 18 : 8.5;
        const follow = 1 - Math.exp(-response * deltaSeconds);
        if (Math.abs(difference) > 0.00004) currentURef.current += difference * follow;

        const surface = evaluateSurface(currentURef.current);
        cylinderPosMotion.set(surface.cylinderPos);
        portraitProgressMotion.set(surface.portraitProgress);
        fragmentsRotationMotion.set(surface.fragmentsRotation);
        uMotion.set(currentURef.current);

        setCenterMilestone((previous) => {
          if (previous === surface.activeMilestone) return previous;
          const sceneIndex = getSceneIndex(surface.activeMilestone);
          playTickSound(115 + sceneIndex * 10, 0.018);
          return surface.activeMilestone;
        });
      }
      animationFrame = requestAnimationFrame(tick);
    };
    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [cylinderPosMotion, portraitProgressMotion, fragmentsRotationMotion, uMotion, isReducedMotion]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (isAnyCaseOpenRef.current) return;
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * window.innerHeight : event.deltaY;
      if (Math.abs(delta) < 0.2) return;
      event.preventDefault();
      const step = Math.max(-0.18, Math.min(0.18, delta * 0.00115));
      targetURef.current += step;
      if (!isReducedMotion) {
        velocityURef.current = Math.max(-0.012, Math.min(0.012, velocityURef.current + step * 0.025));
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isReducedMotion]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        isAnyCaseOpenRef.current || event.altKey || event.ctrlKey || event.metaKey ||
        (event.target as HTMLElement)?.closest('input, textarea, select, button, a, [contenteditable="true"]')
      ) return;
      const direction = event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ' ? 1 : event.key === 'ArrowUp' || event.key === 'PageUp' ? -1 : 0;
      if (direction) {
        event.preventDefault();
        const distance = event.key === 'PageDown' || event.key === 'PageUp' || event.key === ' ' ? 0.8 : 0.24;
        targetURef.current += direction * distance;
        velocityURef.current = 0;
      } else if (event.key === 'Home') {
        event.preventDefault();
        const milestone = evaluateSurface(currentURef.current).activeMilestone;
        targetURef.current = getDwellCenterU(Math.round(milestone / TOTAL_SCENES) * TOTAL_SCENES);
        velocityURef.current = 0;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const beginDrag = useCallback((y: number, target: EventTarget | null) => {
    if (isAnyCaseOpenRef.current || (target as HTMLElement)?.closest('a, button, [data-carousel-drag]')) return;
    dragStartYRef.current = y;
    isDraggingRef.current = true;
    velocityURef.current = 0;
    touchHistoryRef.current = [{ y, t: performance.now() }];
  }, []);

  const moveDrag = useCallback((y: number) => {
    if (!isDraggingRef.current || dragStartYRef.current === null) return;
    const delta = dragStartYRef.current - y;
    dragStartYRef.current = y;
    touchHistoryRef.current.push({ y, t: performance.now() });
    if (touchHistoryRef.current.length > 5) touchHistoryRef.current.shift();
    targetURef.current += (delta / window.innerHeight) * (isReducedMotion ? 2.2 : 2.6);
  }, [isReducedMotion]);

  const endDrag = useCallback(() => {
    if (!isDraggingRef.current) return;
    const history = touchHistoryRef.current;
    if (!isReducedMotion && history.length >= 2) {
      const first = history[0];
      const last = history[history.length - 1];
      const velocity = (first.y - last.y) / Math.max(16, last.t - first.t);
      velocityURef.current = Math.max(-0.018, Math.min(0.018, velocity * 0.018));
    }
    isDraggingRef.current = false;
    dragStartYRef.current = null;
    touchHistoryRef.current = [];
  }, [isReducedMotion]);

  const cancelDrag = useCallback(() => {
    isDraggingRef.current = false;
    dragStartYRef.current = null;
    touchHistoryRef.current = [];
    velocityURef.current = 0;
  }, []);

  useEffect(() => {
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('blur', cancelDrag);
    return () => {
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('blur', cancelDrag);
    };
  }, [endDrag, cancelDrag]);

  const handleClickPeeking = useCallback((milestone: number) => {
    if (!isAnyCaseOpenRef.current) {
      targetURef.current = getDwellCenterU(milestone);
      velocityURef.current = 0;
    }
  }, []);

  const handleReturnToHero = useCallback(() => {
    const milestone = evaluateSurface(currentURef.current).activeMilestone;
    targetURef.current = getDwellCenterU(Math.round(milestone / TOTAL_SCENES) * TOTAL_SCENES);
    velocityURef.current = 0;
  }, []);

  const scrollToU = useCallback((u: number) => {
    targetURef.current = u;
    currentURef.current = u;
    velocityURef.current = 0;
    const surface = evaluateSurface(u);
    cylinderPosMotion.set(surface.cylinderPos);
    portraitProgressMotion.set(surface.portraitProgress);
    fragmentsRotationMotion.set(surface.fragmentsRotation);
    uMotion.set(u);
    setCenterMilestone(surface.activeMilestone);
  }, [cylinderPosMotion, portraitProgressMotion, fragmentsRotationMotion, uMotion]);

  return {
    uMotion, cylinderPosMotion, portraitProgressMotion, fragmentsRotationMotion,
    centerMilestone, targetURef, currentURef, handleClickPeeking, handleReturnToHero, scrollToU,
    dragHandlers: {
      onMouseDown: (event: React.MouseEvent) => { if (event.button === 0) beginDrag(event.clientY, event.target); },
      onMouseMove: (event: React.MouseEvent) => moveDrag(event.clientY),
      onMouseUp: endDrag,
      onTouchStart: (event: React.TouchEvent) => beginDrag(event.touches[0].clientY, event.target),
      onTouchMove: (event: React.TouchEvent) => moveDrag(event.touches[0].clientY),
      onTouchEnd: endDrag,
      onTouchCancel: cancelDrag,
    },
  };
}
