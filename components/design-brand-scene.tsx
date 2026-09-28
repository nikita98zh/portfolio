'use client';

import React, { useSyncExternalStore } from 'react';
import { motion, useTransform, type MotionValue } from 'motion/react';
import { getSceneDwellProgress } from '@/lib/cylinder-manifold';

interface DesignBrandSceneProps {
  milestone: number;
  uMotion: MotionValue<number>;
  isReducedMotion: boolean;
}

const COPY = [
  'When a brief arrives, I ask what the business needs to explain, what people come looking for, and what already makes the brand recognisable.',
  'I work out the structure before polishing the screens. If a layout, type choice or interaction does not make the message clearer, I reconsider it.',
  'A website and a campaign are often seen by the same person. I build them with a shared voice, so the brand feels familiar wherever they meet it.',
];

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const range = (value: number, from: number, to: number) => clamp((value - from) / (to - from));

function subscribeMobile(callback: () => void) {
  const query = window.matchMedia('(max-width: 767px)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}

function getMobileSnapshot() {
  return window.matchMedia('(max-width: 767px)').matches;
}

export function DesignBrandScene({ milestone, uMotion, isReducedMotion }: DesignBrandSceneProps) {
  const isMobile = useSyncExternalStore(subscribeMobile, getMobileSnapshot, () => false);
  const progress = useTransform(uMotion, (u) => getSceneDwellProgress(milestone, u));

  // Each paragraph pauses in the reading zone before the stage moves on.
  const stageY = useTransform(progress, (p) => {
    const travel = isMobile ? 100 : 140;
    const stops = isMobile ? [0, 16, 48, 80, 100] : [0, 22, 70, 112, 140];
    const movement = p < 0.31 ? stops[0]
      : p < 0.37 ? stops[0] + (stops[1] - stops[0]) * range(p, 0.31, 0.37)
      : p < 0.49 ? stops[1]
      : p < 0.55 ? stops[1] + (stops[2] - stops[1]) * range(p, 0.49, 0.55)
      : p < 0.64 ? stops[2]
      : p < 0.69 ? stops[2] + (stops[3] - stops[2]) * range(p, 0.64, 0.69)
      : p < 0.77 ? stops[3]
      : stops[3] + (travel - stops[3]) * range(p, 0.77, 0.86);
    return `${-movement}dvh`;
  });
  const topBar = useTransform(progress, (p) => range(p, 0.02, 0.19));
  const topTitle = useTransform(progress, (p) => `inset(0 ${100 * (1 - range(p, 0.20, 0.31))}% 0 0)`);
  const bottomBar = useTransform(progress, (p) => range(p, 0.77, 0.88));
  const bottomTitle = useTransform(progress, (p) => `inset(0 ${100 * (1 - range(p, 0.89, 0.99))}% 0 0)`);
  const lineDraw = useTransform(progress, (p) => isReducedMotion ? Number(p >= 0.32) : range(p, 0.32, 0.76));

  const firstOpacity = useTransform(progress, (p) => isReducedMotion ? Number(p >= 0.34) : range(p, 0.34, 0.39));
  const secondOpacity = useTransform(progress, (p) => isReducedMotion ? Number(p >= 0.52) : range(p, 0.52, 0.57));
  const thirdOpacity = useTransform(progress, (p) => isReducedMotion ? Number(p >= 0.66) : range(p, 0.66, 0.71));
  const firstY = useTransform(progress, (p) => isReducedMotion ? 0 : 20 * (1 - range(p, 0.34, 0.40)));
  const secondY = useTransform(progress, (p) => isReducedMotion ? 0 : 20 * (1 - range(p, 0.52, 0.58)));
  const thirdY = useTransform(progress, (p) => isReducedMotion ? 0 : 20 * (1 - range(p, 0.66, 0.72)));
  const firstClip = useTransform(progress, (p) => isReducedMotion ? 'none' : `inset(${100 * (1 - range(p, 0.34, 0.40))}% 0 0 0)`);
  const secondClip = useTransform(progress, (p) => isReducedMotion ? 'none' : `inset(${100 * (1 - range(p, 0.52, 0.58))}% 0 0 0)`);
  const thirdClip = useTransform(progress, (p) => isReducedMotion ? 'none' : `inset(${100 * (1 - range(p, 0.66, 0.72))}% 0 0 0)`);

  return (
    <section aria-label="Design and brand approach" className="relative w-full h-full overflow-hidden bg-[var(--bg)] select-text">
      <motion.div style={{ y: stageY }} className="absolute inset-x-0 top-0 h-[210dvh] md:h-[240dvh]">
        <div className="absolute top-[18dvh] left-0 w-[82vw] md:w-[74vw] h-[max(15dvh,9vw)] min-h-[106px] max-h-[178px]">
          <motion.div style={{ scaleX: topBar, transformOrigin: 'left center' }} className="absolute inset-0 bg-[var(--text)]" />
          <motion.h2 style={{ clipPath: topTitle }} className="relative h-full flex items-center justify-end pr-[5vw] font-manrope font-extrabold text-[var(--bg)] text-[clamp(48px,9vw,158px)] tracking-[-0.055em] leading-none uppercase whitespace-nowrap">
            DESIGN
          </motion.h2>
        </div>

        <svg
          aria-hidden="true"
          viewBox={isMobile ? '0 0 1000 1600' : '0 0 1000 2000'}
          preserveAspectRatio="none"
          className="absolute top-0 left-0 w-full h-[160dvh] md:h-[200dvh] pointer-events-none overflow-visible"
        >
          <motion.path
            d={isMobile
              ? 'M 760 290 C 835 390, 930 455, 875 590 S 930 740, 865 865 C 800 1010, 940 1110, 875 1250 S 815 1390, 865 1450'
              : 'M 520 290 C 585 440, 415 530, 470 690 S 610 920, 505 1080 C 395 1250, 575 1415, 520 1570 S 445 1770, 530 1900'}
            fill="none"
            stroke="var(--text)"
            strokeWidth={isMobile ? 2.4 : 1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: lineDraw }}
          />
        </svg>

        <motion.p style={{ opacity: firstOpacity, y: firstY, clipPath: firstClip }} className="absolute top-[56dvh] md:top-[66dvh] left-[7vw] w-[72vw] md:w-[28vw] max-w-[430px] font-manrope font-light text-[clamp(15px,1.22vw,20px)] leading-[1.6] text-[var(--text)]">
          {COPY[0]}
        </motion.p>
        <motion.p style={{ opacity: secondOpacity, y: secondY, clipPath: secondClip }} className="absolute top-[87dvh] md:top-[110dvh] left-[7vw] md:left-auto md:right-[6vw] w-[72vw] md:w-[28vw] max-w-[430px] font-manrope font-light text-[clamp(15px,1.22vw,20px)] leading-[1.6] text-[var(--text)]">
          {COPY[1]}
        </motion.p>
        <motion.p style={{ opacity: thirdOpacity, y: thirdY, clipPath: thirdClip }} className="absolute top-[118dvh] md:top-[153dvh] left-[7vw] w-[72vw] md:w-[28vw] max-w-[430px] font-manrope font-light text-[clamp(15px,1.22vw,20px)] leading-[1.6] text-[var(--text)]">
          {COPY[2]}
        </motion.p>

        <div className="absolute top-[145dvh] md:top-[190dvh] right-0 w-[82vw] md:w-[74vw] h-[max(15dvh,9vw)] min-h-[106px] max-h-[178px]">
          <motion.div style={{ scaleX: bottomBar, transformOrigin: 'right center' }} className="absolute inset-0 bg-[var(--text)]" />
          <motion.h2 style={{ clipPath: bottomTitle }} className="relative h-full flex items-center justify-start pl-[5vw] font-manrope font-extrabold text-[var(--bg)] text-[clamp(48px,9vw,158px)] tracking-[-0.055em] leading-none uppercase whitespace-nowrap">
            BRAND
          </motion.h2>
        </div>
      </motion.div>
    </section>
  );
}
