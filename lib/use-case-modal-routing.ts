'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { getCaseFocusU } from '@/lib/cylinder-manifold';

interface UseCaseModalRoutingOptions {
  getCurrentU: () => number;
  onScrollToU: (u: number) => void;
}

export function useCaseModalRouting({
  getCurrentU,
  onScrollToU,
}: UseCaseModalRoutingOptions) {
  const [isVrakCaseOpen, setIsVrakCaseOpen] = useState(false);
  const [isMorfCaseOpen, setIsMorfCaseOpen] = useState(false);

  const onScrollToURef = useRef(onScrollToU);
  useEffect(() => {
    onScrollToURef.current = onScrollToU;
  }, [onScrollToU]);

  const getCurrentURef = useRef(getCurrentU);
  useEffect(() => {
    getCurrentURef.current = getCurrentU;
  }, [getCurrentU]);

  // VRAK controls
  const handleOpenVrakCase = useCallback((e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsVrakCaseOpen(true);
    try {
      window.history.pushState({ case: 'vrak' }, '', '/work/vrak');
    } catch {}
  }, []);

  const handleCloseVrakCase = useCallback(() => {
    setIsVrakCaseOpen(false);

    try {
      window.history.replaceState(null, '', '/');
    } catch {}

    // Keep the exact scroll position at which the image was opened.
  }, []);

  // MORF controls
  const handleOpenMorfCase = useCallback((e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsMorfCaseOpen(true);
    try {
      window.history.pushState({ case: 'morf' }, '', '/work/morf');
    } catch {}
  }, []);

  const handleCloseMorfCase = useCallback(() => {
    setIsMorfCaseOpen(false);

    try {
      window.history.replaceState(null, '', '/');
    } catch {}

    // Returning to the same image avoids a perceptible re-centering jump.
  }, []);

  // Sync with browser deep links
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('scene') === 'vrak' || params.get('case') === 'vrak' || window.location.pathname === '/work/vrak') {
        onScrollToURef.current(getCaseFocusU('vrak', getCurrentURef.current()));
        if (params.get('case') === 'vrak' || window.location.pathname === '/work/vrak') {
          setIsVrakCaseOpen(true);
        }
      } else if (params.get('scene') === 'morf' || params.get('case') === 'morf' || window.location.pathname === '/work/morf') {
        onScrollToURef.current(getCaseFocusU('morf', getCurrentURef.current()));
        if (params.get('case') === 'morf' || window.location.pathname === '/work/morf') {
          setIsMorfCaseOpen(true);
        }
      }
    }, 0);

    const onPopState = () => {
      if (window.location.pathname === '/work/vrak') {
        onScrollToURef.current(getCaseFocusU('vrak', getCurrentURef.current()));
        setIsVrakCaseOpen(true);
        setIsMorfCaseOpen(false);
      } else if (window.location.pathname === '/work/morf') {
        onScrollToURef.current(getCaseFocusU('morf', getCurrentURef.current()));
        setIsMorfCaseOpen(true);
        setIsVrakCaseOpen(false);
      } else {
        setIsVrakCaseOpen(false);
        setIsMorfCaseOpen(false);
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  return {
    isVrakCaseOpen,
    isMorfCaseOpen,
    isAnyCaseOpen: isVrakCaseOpen || isMorfCaseOpen,
    handleOpenVrakCase,
    handleCloseVrakCase,
    handleOpenMorfCase,
    handleCloseMorfCase,
  };
}
