'use client';

import { motion } from 'motion/react';

interface CaseBackButtonProps {
  onClick: () => void;
  variant: 'floating' | 'finale';
  visible?: boolean;
}

export function CaseBackButton({ onClick, variant, visible = true }: CaseBackButtonProps) {
  if (variant === 'finale') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="group inline-flex min-h-11 items-center gap-2.5 text-[var(--text)] font-manrope font-bold text-xs sm:text-sm md:text-base uppercase tracking-[0.2em] hover:opacity-50 transition-opacity cursor-pointer pointer-events-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--text)]"
      >
        <span aria-hidden="true" className="text-sm transition-transform duration-200 group-hover:-translate-x-1">←</span>
        <span>BACK TO OVERVIEW</span>
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -32 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      aria-label="Back to overview"
      className="fixed bottom-[max(20px,env(safe-area-inset-bottom))] left-5 lg:bottom-auto lg:top-8 lg:left-8 z-50 flex min-h-11 items-center gap-2.5 bg-[var(--bg)] px-3 text-[var(--text)] font-manrope font-semibold text-sm tracking-[0.06em] uppercase hover:opacity-50 cursor-pointer group select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text)]"
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <span aria-hidden="true" className="text-sm transition-transform duration-200 group-hover:-translate-x-1">←</span>
      <span>BACK</span>
    </motion.button>
  );
}
