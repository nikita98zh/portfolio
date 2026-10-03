'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

interface ViewportVideoProps {
  src: string;
  poster: string;
  label: string;
  className?: string;
  scrollRoot: RefObject<HTMLDivElement | null>;
}

export function ViewportVideo({ src, poster, label, className, scrollRoot }: ViewportVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const root = scrollRoot.current;
    const loadObserver = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setShouldLoad(true); },
      { root, rootMargin: '1800px 0px' }
    );
    loadObserver.observe(video);
    return () => loadObserver.disconnect();
  }, [scrollRoot]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const playObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !document.hidden && !reducedMotion.matches) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { root: scrollRoot.current, threshold: 0.01 }
    );
    const pauseWhenHidden = () => {
      if (document.hidden || reducedMotion.matches) video.pause();
      else if (visibleRef.current) video.play().catch(() => {});
    };
    playObserver.observe(video);
    document.addEventListener('visibilitychange', pauseWhenHidden);
    reducedMotion.addEventListener('change', pauseWhenHidden);
    return () => {
      playObserver.disconnect();
      video.pause();
      visibleRef.current = false;
      document.removeEventListener('visibilitychange', pauseWhenHidden);
      reducedMotion.removeEventListener('change', pauseWhenHidden);
    };
  }, [shouldLoad, scrollRoot]);

  return (
    <video
      ref={videoRef}
      className={className}
      src={shouldLoad ? src : undefined}
      poster={poster}
      preload={shouldLoad ? 'auto' : 'none'}
      loop
      muted
      playsInline
      disablePictureInPicture
      disableRemotePlayback
      aria-label={label}
      onCanPlay={(event) => {
        if (visibleRef.current && !document.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          event.currentTarget.play().catch(() => {});
        }
      }}
    />
  );
}
