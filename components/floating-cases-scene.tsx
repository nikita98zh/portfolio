'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { motion, useTransform, type MotionValue } from 'motion/react';
import { getSceneDwellProgress } from '@/lib/cylinder-manifold';

interface FloatingCasesSceneProps {
  milestone: number;
  uMotion: MotionValue<number>;
  isActive: boolean;
  isReducedMotion: boolean;
  onOpenMorf: () => void;
  onOpenVrak: () => void;
  onHoverStateChange: (state: string | null) => void;
}

function subscribeMobile(callback: () => void) {
  const query = window.matchMedia('(max-width: 767px)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}

function getMobileSnapshot() {
  return window.matchMedia('(max-width: 767px)').matches;
}

interface CaseImageProps {
  title: 'MORF' | 'VRAK';
  imageSrc: string;
  className: string;
  rotate: MotionValue<number>;
  drift: MotionValue<string>;
  isActive: boolean;
  isReducedMotion: boolean;
  onOpen: () => void;
  onHoverStateChange: (state: string | null) => void;
}

function CaseImage({ title, imageSrc, className, rotate, drift, isActive, isReducedMotion, onOpen, onHoverStateChange }: CaseImageProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      type="button"
      aria-label={`Open ${title} case`}
      tabIndex={isActive ? 0 : -1}
      onClick={(event) => {
        if (isActive) {
          event.stopPropagation();
          onOpen();
        }
      }}
      onPointerEnter={(event) => {
        if (!isActive || event.pointerType === 'touch') return;
        setHovered(true);
        onHoverStateChange('action');
      }}
      onPointerLeave={() => {
        setHovered(false);
        onHoverStateChange(null);
      }}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{ rotate, y: drift }}
      className={`group absolute block overflow-hidden p-0 border-0 text-left bg-[var(--surface)] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--text)] shadow-[0_22px_65px_-35px_rgba(22,22,22,0.24)] ${className}`}
    >
      <motion.img
        src={imageSrc}
        alt=""
        draggable={false}
        className="block w-full h-full object-cover pointer-events-none"
        animate={{ filter: hovered ? 'blur(5px) brightness(0.94)' : 'blur(0px) brightness(1)', scale: hovered ? 1.025 : 1 }}
        transition={{ duration: isReducedMotion ? 0.1 : 0.65, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 18 }}
        transition={{ duration: isReducedMotion ? 0.1 : 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 flex items-center justify-center font-manrope font-extrabold text-white mix-blend-difference text-[clamp(54px,10vw,156px)] tracking-[-0.06em] leading-none pointer-events-none"
      >
        {title}
      </motion.span>
    </motion.button>
  );
}

export function FloatingCasesScene({ milestone, uMotion, isActive, isReducedMotion, onOpenMorf, onOpenVrak, onHoverStateChange }: FloatingCasesSceneProps) {
  const isMobile = useSyncExternalStore(subscribeMobile, getMobileSnapshot, () => false);
  const progress = useTransform(uMotion, (u) => getSceneDwellProgress(milestone, u));
  const stageY = useTransform(progress, (p) => `${-(isMobile ? 89 : 130) * p}dvh`);
  const morfRotate = useTransform(progress, [0, 1], isReducedMotion ? [0, 0] : [-2.8, 1.4]);
  const vrakRotate = useTransform(progress, [0, 1], isReducedMotion ? [0, 0] : [2.2, -1.8]);
  const morfDrift = useTransform(progress, (p) => isReducedMotion ? '0dvh' : `${-2.5 * Math.sin(p * Math.PI)}dvh`);
  const vrakDrift = useTransform(progress, (p) => isReducedMotion ? '0dvh' : `${2.8 * Math.sin(p * Math.PI)}dvh`);

  return (
    <section aria-label="Selected projects" className="relative w-full h-full overflow-hidden bg-[var(--bg)]">
      <motion.div style={{ y: stageY }} className="absolute inset-x-0 top-0 h-[220dvh] md:h-[250dvh]">
        <CaseImage
          title="MORF"
          imageSrc="/assets/morf_preview_scrolldisplay.webp"
          className="top-[20dvh] md:top-[17dvh] left-[12vw] md:left-[25vw] w-[78vw] md:w-[55vw] max-w-[1000px] aspect-[2804/2244]"
          rotate={morfRotate}
          drift={morfDrift}
          isActive={isActive}
          isReducedMotion={isReducedMotion}
          onOpen={onOpenMorf}
          onHoverStateChange={onHoverStateChange}
        />
        <CaseImage
          title="VRAK"
          imageSrc="/assets/vrak/hand_scrolldisplay.webp"
          className="top-[118dvh] md:top-[155dvh] left-[12vw] md:left-[19vw] w-[80vw] md:w-[65vw] max-w-[1150px] aspect-[16/9]"
          rotate={vrakRotate}
          drift={vrakDrift}
          isActive={isActive}
          isReducedMotion={isReducedMotion}
          onOpen={onOpenVrak}
          onHoverStateChange={onHoverStateChange}
        />
      </motion.div>
    </section>
  );
}
