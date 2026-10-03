'use client';

import React, { useRef, memo } from 'react';
import { PortraitPressureCanvas } from './portrait-pressure-canvas';

interface ManifestoTransitionSceneProps {
  progress?: number;
  onHoverStateChange?: (state: string | null) => void;
  isReducedMotion?: boolean;
}

// Statement 1: 4 uniform lines for the massive 3x Extra Black architectural headline
const STATEMENT_1_LINES = [
  'PRODUCT',
  'SHOULD NOT',
  'STOP AT THE',
  'INTERFACE.',
];

// Statement 2: secondary statement revealed on the right as photo glides to the left
const STATEMENT_2_LINES = [
  'THE SAME IDEA SHOULD LIVE',
  'THROUGH IDENTITY AND CAMPAIGN.',
];

export const ManifestoTransitionScene = memo(function ManifestoTransitionScene({
  progress = 0,
  onHoverStateChange,
  isReducedMotion = false,
}: ManifestoTransitionSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  if (isReducedMotion) {
    return (
      <section className="flex h-full min-h-screen w-full items-center gap-8 overflow-hidden bg-[var(--bg)] px-8 lg:px-16">
        <div className="relative z-10 w-[55%]">
          <h1 className="max-w-[12ch] font-manrope text-[clamp(42px,5vw,96px)] font-extrabold uppercase leading-[0.98] tracking-[-0.05em]">
            Product should not stop at the interface.
          </h1>
          <p className="mt-8 max-w-[30ch] font-manrope text-[clamp(20px,2vw,36px)] font-bold uppercase leading-[1.12] tracking-[-0.04em]">
            The same idea should live through identity and campaign.
          </p>
        </div>
        <div className="w-[45%] self-stretch">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/portrait.webp" alt="Nikita Zhorov" className="h-full w-full object-contain object-center" />
        </div>
      </section>
    );
  }

  // ============================================================
  // SCROLL MOTION ENGINE
  // - Phase 1 (0.00 – 0.65): Photo glides smoothly from RIGHT to LEFT across the screen.
  // - As the photo slides under Statement 1, the letters overlapping the photo
  //   INVERT to pure white in real-time via mix-blend-difference.
  // - Statement 2 is revealed on the right in the space vacated by the photo.
  // - Fully reversible forward and backward on scroll.
  // - Zero mouse-cursor 3D tilt.
  // ============================================================
  const slideT = Math.max(0, Math.min(1, (progress - 0.04) / 0.62));
  const easedSlide = isReducedMotion ? 0 : slideT * slideT * (3 - 2 * slideT);
  const photoTranslateX = `${-easedSlide * 48}vw`;

  // Give the first thought time to land before the second one takes focus.
  const stmt1T = Math.max(0, Math.min(1, (progress - 0.64) / 0.18));
  const stmt1Opacity = isReducedMotion ? 1 : 1 - stmt1T * 0.88;
  const stmt1Y = isReducedMotion ? 0 : -stmt1T * 18;

  // The portrait must clear the right column before this line becomes readable.
  const stmt2T = Math.max(0, Math.min(1, (progress - 0.47) / 0.20));
  const stmt2Opacity = stmt2T;
  const stmt2Y = isReducedMotion ? 0 : (1 - stmt2T) * 24;

  return (
    <div
      ref={containerRef}
      id="manifesto-transition-stage"
      className="relative w-full h-full min-h-screen overflow-hidden select-text pointer-events-auto bg-[var(--bg)] isolate"
    >
      {/* ============================================================
          STATEMENT 2: SECONDARY REVEAL ON THE RIGHT
          Fades in on the right side as the photo glides to the left
          ============================================================ */}
      <div
        id="statement-2-stage"
        style={{
          opacity: stmt2Opacity,
          transform: `translate3d(0, ${stmt2Y}px, 0)`,
          pointerEvents: stmt2Opacity > 0.4 ? 'auto' : 'none',
        }}
        className="absolute top-0 right-0 bottom-0 h-full w-full md:w-[48vw] lg:w-[46vw] xl:w-[44vw] z-10 flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-18 select-none"
      >
        <p
          className="font-manrope text-[clamp(22px,3vw,54px)] leading-[1.10] tracking-[-0.035em] text-[var(--text)] uppercase font-extrabold"
          style={{
            fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
            fontWeight: 800,
          }}
        >
          {STATEMENT_2_LINES[0]}
          <br />
          {STATEMENT_2_LINES[1]}
        </p>
      </div>

      {/* ============================================================
          PORTRAIT STAGE: GLIDES FROM RIGHT TO LEFT ON SCROLL
          Strictly pinned to top and bottom edges (h-full)
          Slides smoothly across screen along with scroll scrub
          ============================================================ */}
      <div
        id="portrait-stage"
        style={{
          transform: `translate3d(${photoTranslateX}, 0, 0)`,
          willChange: 'transform',
        }}
        className="absolute top-0 right-0 bottom-0 h-full w-full md:w-[50vw] lg:w-[52vw] xl:w-[54vw] z-10 pointer-events-auto select-none flex items-end justify-end overflow-hidden"
      >
        <PortraitPressureCanvas
          imageSrc="/assets/portrait.webp"
          altText="Nikita Zhorov"
          isReducedMotion={isReducedMotion}
          className="w-full h-full"
        />
      </div>

      {/* ============================================================
          STATEMENT 1: EXTRA BLACK MASSIVE HEADLINE WITH REAL-TIME INVERSION
          Sits at z-20 with mix-blend-difference text-white.
          Letters over the light background render deep black.
          Letters overlapping the dark portrait render pure white (|255 - 15| = 240).
          ============================================================ */}
      <div
        id="statement-1-stage"
        style={{
          opacity: stmt1Opacity,
          transform: `translate3d(0, ${stmt1Y}px, 0)`,
        }}
        className="absolute inset-0 w-full h-full z-20 flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-18 xl:px-24 pointer-events-none mix-blend-difference"
      >
        <h1
          aria-label="Product should not stop at the interface."
          className="font-manrope text-white select-none uppercase max-w-full font-extrabold"
          style={{
            fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
            fontWeight: 800,
          }}
        >
          {STATEMENT_1_LINES.map((line, idx) => (
            <span
              key={`stmt1-line-${idx}`}
              className="block text-[clamp(52px,8.4vw,165px)] leading-[0.84] tracking-[-0.045em] whitespace-nowrap"
            >
              {line}
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
});
