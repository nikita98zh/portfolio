'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isSoundEnabled, playTickSound, playReverseImplosionSound } from '@/lib/sound-fx';

// Register GSAP plugins safely on client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface MorfCaseViewProps {
  onClose?: () => void;
}

// 6 Dedicated MORF Social/Gallery items (strictly MORF soc_ assets)
const MORF_GALLERY_ITEMS = [
  {
    src: '/assets/morf/soc_1.png',
    alt: 'MORF Dogwear campaign identity visual 01',
  },
  {
    src: '/assets/morf/soc_2.png',
    alt: 'MORF Dogwear campaign identity visual 02',
  },
  {
    src: '/assets/morf/soc_3.png',
    alt: 'MORF Dogwear campaign identity visual 03',
  },
  {
    src: '/assets/morf/soc_4.png',
    alt: 'MORF Dogwear campaign identity visual 04',
  },
  {
    src: '/assets/morf/soc_5.png',
    alt: 'MORF Dogwear campaign identity visual 05',
  },
  {
    src: '/assets/morf/soc_6.png',
    alt: 'MORF Dogwear campaign identity visual 06',
  },
];

export function MorfCaseView({ onClose }: MorfCaseViewProps): React.ReactElement {
  const router = useRouter();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTopRef = useRef(0);

  // Scroll to top on mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  // Monitor scroll direction on case container: hide back button on scroll down, reveal on scroll up
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollTop = container.scrollTop;
      const diff = currentScrollTop - lastScrollTopRef.current;

      if (Math.abs(diff) < 8) return;

      if (currentScrollTop <= 35) {
        setIsNavVisible(true);
      } else if (diff > 0) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }

      lastScrollTopRef.current = currentScrollTop;
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (isSoundEnabled()) {
      playReverseImplosionSound();
    } else {
      playTickSound(140, 0.04);
    }
    if (onClose) {
      onClose();
    } else {
      router.push('/?scene=morf');
    }
  }, [onClose, router]);

  // Handle escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        playTickSound(120, 0.03);
        handleBack();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleBack]);

  // Editorial motion follows the case's own scroll container. Media loading can
  // change its height long after mount, so refresh from layout changes instead
  // of relying on fixed delays.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: '(min-width: 768px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (media) => {
        const { desktop, reduceMotion } = media.conditions ?? {};
        if (reduceMotion) return;

        const ctx = gsap.context(() => {
          const reveal = (selector: string, distance = 28) => {
            container.querySelectorAll<HTMLElement>(selector).forEach((element) => {
              gsap.from(element, {
                y: desktop ? distance : Math.min(distance, 16),
                opacity: 0,
                duration: desktop ? 0.95 : 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: element,
                  scroller: container,
                  start: 'top 88%',
                  once: true,
                },
              });
            });
          };

          gsap.from('.morf-hero-title', {
            y: desktop ? 32 : 18,
            opacity: 0,
            duration: 1.1,
            ease: 'power2.out',
            delay: 0.1,
          });

          const heroFrame = container.querySelector<HTMLElement>('.morf-hero-frame');
          if (heroFrame) {
            gsap.fromTo(
              heroFrame,
              { clipPath: desktop ? 'inset(5% 4%)' : 'inset(3% 3%)', scale: 0.98 },
              {
                clipPath: 'inset(0% 0%)',
                scale: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: heroFrame,
                  scroller: container,
                  start: 'top 82%',
                  end: 'top 15%',
                  scrub: 0.65,
                },
              }
            );
          }

          reveal('.morf-overview article', 24);
          reveal('.morf-design-copy', 28);
          reveal('.morf-design-image', 18);
          reveal('.morf-editorial-statement', 32);
          reveal('.morf-digital-screen', 30);
          reveal('.morf-coherence-copy', 28);
          reveal('.morf-mobile-copy', 24);
          if (!desktop) reveal('.morf-mobile-screen', 16);

          const portrait = container.querySelector<HTMLElement>('.morf-campaign-portrait');
          if (portrait) {
            gsap.fromTo(
              portrait,
              { clipPath: 'inset(8% 0% 8% 0%)', y: desktop ? 32 : 14 },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                y: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: portrait,
                  scroller: container,
                  start: 'top 90%',
                  end: 'top 30%',
                  scrub: 0.65,
                },
              }
            );
          }

          if (desktop) {
            const mobileScreens = container.querySelector<HTMLElement>('.morf-mobile-screens');
            const firstScreen = mobileScreens?.querySelector<HTMLElement>('.morf-mobile-screen:first-child');
            const secondScreen = mobileScreens?.querySelector<HTMLElement>('.morf-mobile-screen:last-child');
            if (mobileScreens && firstScreen && secondScreen) {
              gsap.fromTo(
                [firstScreen, secondScreen],
                { y: (index: number) => (index === 0 ? 16 : -16) },
                {
                  y: (index: number) => (index === 0 ? -16 : 16),
                  ease: 'none',
                  scrollTrigger: {
                    trigger: mobileScreens,
                    scroller: container,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.7,
                  },
                }
              );
            }
          }

          const finale = container.querySelector<HTMLElement>('.morf-sticky-grid-section');
          const gallery = container.querySelector<HTMLElement>('.morf-sticky-gallery');
          const gridItems = container.querySelectorAll<HTMLElement>('.morf-sticky-grid-item');
          const center = container.querySelector<HTMLElement>('.morf-sticky-center-content');
          const title = container.querySelector<HTMLElement>('.morf-sticky-title');
          const cta = container.querySelector<HTMLElement>('.morf-sticky-cta');

          if (finale && gallery && center && title && cta && gridItems.length === 6) {
            gsap.set(gridItems, { opacity: 0, y: desktop ? 48 : 20, clipPath: 'inset(5% 0%)' });
            gsap.set(center, { autoAlpha: 0 });
            gsap.set(title, { y: desktop ? 28 : 16, opacity: 0 });
            gsap.set(cta, { y: 12, opacity: 0 });

            gsap.timeline({
              scrollTrigger: {
                trigger: finale,
                scroller: container,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.7,
              },
            })
              .to(gridItems, {
                opacity: 1,
                y: 0,
                clipPath: 'inset(0% 0%)',
                duration: 1,
                stagger: { each: desktop ? 0.12 : 0.09, from: 'center' },
                ease: 'power2.out',
              })
              .to({}, { duration: 0.5 })
              .to(gallery, {
                opacity: 0.22,
                y: desktop ? -22 : -10,
                scale: desktop ? 0.965 : 0.98,
                duration: 1.1,
                ease: 'power1.inOut',
              })
              .to(center, { autoAlpha: 1, duration: 0.35 }, '-=0.4')
              .to(title, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, '<')
              .to(cta, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.55')
              .to({}, { duration: 0.7 });
          }
        }, container);

        return () => ctx.revert();
      }
    );

    let refreshFrame = 0;
    const refresh = () => {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const main = container.querySelector('main');
    const observer = new ResizeObserver(refresh);
    if (main) observer.observe(main);
    const media = container.querySelectorAll('img, video');
    media.forEach((element) => {
      element.addEventListener('load', refresh);
      element.addEventListener('loadedmetadata', refresh);
    });
    let disposed = false;
    document.fonts.ready.then(() => {
      if (!disposed) refresh();
    });
    refresh();

    return () => {
      disposed = true;
      observer.disconnect();
      media.forEach((element) => {
        element.removeEventListener('load', refresh);
        element.removeEventListener('loadedmetadata', refresh);
      });
      cancelAnimationFrame(refreshFrame);
      mm.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="morf-case-container"
      className="fixed inset-0 z-50 w-full h-full overflow-y-auto overflow-x-hidden bg-[var(--bg)] text-[var(--text)] font-manrope selection:bg-[var(--text)] selection:text-[var(--bg)]"
    >
      {/* Minimalist Floating Back Trigger (Flies away on scroll down, reappears on scroll up) */}
      <motion.button
        type="button"
        onClick={handleBack}
        initial={{ opacity: 1, y: 0 }}
        animate={{
          opacity: isNavVisible ? 1 : 0,
          y: isNavVisible ? 0 : -32,
          pointerEvents: isNavVisible ? 'auto' : 'none',
        }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-6 sm:top-8 sm:left-8 z-50 flex items-center gap-2.5 text-[var(--text)] font-manrope font-semibold text-xs sm:text-sm tracking-[0.22em] uppercase hover:opacity-50 transition-opacity cursor-pointer group select-none"
        aria-label="Back to overview"
      >
        <span className="text-sm transition-transform duration-200 group-hover:-translate-x-1">←</span>
        <span>BACK</span>
      </motion.button>

      <main className="flex flex-col items-center relative w-full bg-[var(--bg)]">
        {/* =========================================================================
            1. HERO TITLE STATEMENT
            ========================================================================= */}
        <header className="relative w-full max-w-[1920px] px-6 sm:px-12 lg:px-20 pt-24 sm:pt-32 lg:pt-36 pb-8 sm:pb-12">
          <h1 className="morf-hero-title font-manrope font-extralight text-[var(--text)] text-4xl sm:text-6xl md:text-7xl lg:text-[100px] xl:text-[124px] tracking-[-0.02em] leading-[1.05] sm:leading-[1.02] max-w-[1760px]">
            ONE IDEA, SHAPED ACROSS IDENTITY, CAMPAIGN AND E-COMMERCE.
          </h1>
        </header>

        {/* =========================================================================
            2. HERO VIDEO: FULL VIEWPORT WIDTH (HUD-free, seamlessly looped, muted, autoPlay)
            ========================================================================= */}
        <section className="relative w-full pb-16 sm:pb-24 lg:pb-36" aria-label="MORF campaign hero video">
          <figure className="morf-hero-frame m-0 relative w-full aspect-[4/5] sm:aspect-[1.78] overflow-hidden bg-[var(--surface-dark)]">
            <video
              className="w-full h-full object-cover"
              src="/assets/morf/main_video.mp4"
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              disablePictureInPicture
              disableRemotePlayback
              aria-label="MORF campaign scene featuring a dog and owner in an urban setting"
            />
          </figure>
        </section>

        {/* =========================================================================
            3. CHALLENGE & SOLUTION SECTION (2-Column Editorial Grid)
            ========================================================================= */}
        <section
          aria-label="Project overview"
          className="morf-overview relative w-full max-w-[1920px] px-6 sm:px-12 lg:px-20 pb-16 sm:pb-24 lg:pb-36"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 lg:gap-12 xl:gap-24 w-full">
            <article className="flex flex-col items-start gap-4 sm:gap-6">
              <h2 className="font-manrope font-normal text-[var(--text)] text-3xl sm:text-5xl lg:text-[64px] tracking-[-0.01em] leading-tight lg:leading-[64px]">
                CHALLENGE
              </h2>
              <p className="font-manrope font-extralight text-[var(--text)] text-base sm:text-lg lg:text-xl tracking-[0] leading-7 sm:leading-8 lg:leading-9">
                Most dogwear is designed by scaling the same pattern across sizes,
                overlooking how radically body proportions can differ. The challenge
                was to create a brand that treats fit as a design problem while
                still feeling relevant within contemporary fashion.
              </p>
            </article>

            <article className="flex flex-col items-start gap-4 sm:gap-6">
              <h2 className="font-manrope font-normal text-[var(--text)] text-3xl sm:text-5xl lg:text-[64px] tracking-[-0.01em] leading-tight lg:leading-[64px]">
                SOLUTION
              </h2>
              <p className="font-manrope font-extralight text-[var(--text)] text-base sm:text-lg lg:text-xl tracking-[0] leading-7 sm:leading-8 lg:leading-9">
                I built MORF around a proportional system rather than conventional
                sizing. One design adapts across three body types, while the
                identity, art direction and digital experience reinforce the same
                balance of function, clarity and fashion.
              </p>
            </article>
          </div>
        </section>

        {/* =========================================================================
            4. CAMPAIGN PORTRAIT (Right-Aligned 1-Column Portrait)
            ========================================================================= */}
        <section
          aria-label="Campaign portrait"
          className="relative w-full max-w-[1920px] px-6 sm:px-12 lg:px-20 pb-16 sm:pb-24 lg:pb-36"
        >
          <div className="flex w-full justify-end">
            <figure className="morf-campaign-portrait m-0 w-full md:w-1/2 lg:w-[868px] aspect-[0.67] overflow-hidden bg-[var(--surface-dark)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-full h-full object-cover"
                alt="MORF campaign portrait with a dog and owner"
                src="/assets/morf/women_dogs.png"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
        </section>

        {/* =========================================================================
            5. DESIGN SYSTEM SECTION
            Left: Sticky Text block (pinned on scroll, stops at end of image)
            Right: Large Showcase Image
            ========================================================================= */}
        <section
          aria-labelledby="design-system-heading"
          className="relative w-full max-w-[1920px] px-6 sm:px-12 lg:px-20 pb-16 sm:pb-24 lg:pb-36"
        >
          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16 xl:gap-24 w-full relative">
            {/* Sticky Text Block on the Left */}
            <div className="morf-design-copy w-full lg:w-[380px] xl:w-[440px] shrink-0 lg:sticky lg:top-24 self-start">
              <article className="flex flex-col items-start gap-5">
                <h2
                  id="design-system-heading"
                  className="font-manrope font-normal text-[var(--text)] text-3xl sm:text-5xl lg:text-[64px] tracking-[-0.01em] leading-tight lg:leading-[64px]"
                >
                  DESIGN
                  <br />
                  SYSTEM
                </h2>
                <p className="font-manrope font-extralight text-[var(--text)] text-base sm:text-lg lg:text-xl tracking-[0] leading-7 sm:leading-8 lg:leading-9">
                  The visual system was built to feel closer to contemporary fashion
                  than traditional pet retail. I used restrained typography, a
                  neutral palette, generous spacing and a flexible editorial grid to
                  give the product room to lead, while keeping every touchpoint
                  consistent across campaign, product and e-commerce.
                </p>
              </article>
            </div>

            {/* Design System Image on the Right */}
            <figure className="morf-design-image m-0 flex-1 w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-full h-auto object-contain"
                alt="MORF design system presentation"
                src="/assets/morf/Design System.png"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
        </section>

        {/* =========================================================================
            6. EDITORIAL TRANSITION STATEMENT (Full-Width Large Typography)
            ========================================================================= */}
        <section
          aria-label="Digital experience statement"
          className="relative w-full max-w-[1920px] px-6 sm:px-12 lg:px-20 pb-16 sm:pb-24 lg:pb-36"
        >
          <p className="morf-editorial-statement font-manrope font-extralight text-[var(--text)] text-3xl sm:text-5xl md:text-6xl lg:text-[88px] xl:text-[96px] tracking-[-0.02em] leading-[1.08] max-w-[1760px]">
            THE BRAND SYSTEM CONTINUES INTO THE DIGITAL EXPERIENCE, WHERE
            IDENTITY, HIERARCHY AND INTERACTION BECOME PART OF THE SAME LANGUAGE.
          </p>
        </section>

        {/* =========================================================================
            7. DARK DIGITAL EXPERIENCE SHOWCASE (Full-Width Bleed, HOME + PDP COAT 01)
            ========================================================================= */}
        <section
          aria-label="MORF digital experience"
          className="relative w-full bg-[#161616] text-white py-16 sm:py-24 lg:py-32 my-6 sm:my-10"
        >
          <div className="max-w-[1920px] mx-auto px-6 sm:px-12 lg:px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start justify-center">
              {/* Home Page Layout */}
              <figure className="morf-digital-screen m-0 w-full overflow-hidden bg-[#1E1E1E]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-auto aspect-[0.22] object-cover"
                  alt="MORF home page digital experience"
                  src="/assets/morf/HOME.png"
                  loading="lazy"
                  decoding="async"
                />
              </figure>

              {/* PDP Coat Layout */}
              <figure className="morf-digital-screen m-0 w-full overflow-hidden bg-[#1E1E1E]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-auto aspect-[0.32] object-cover"
                  alt="MORF coat product detail page"
                  src="/assets/morf/PDP COAT 01.png"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== window.location.origin + '/assets/morf/HOME.png') {
                      target.src = '/assets/morf/HOME.png';
                    }
                  }}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8. BRAND COHERENCE SECTION (Left: Vertical Video / mob_video.mp4, Right: Manifesto)
            ========================================================================= */}
        <section
          aria-labelledby="coherent-brand-heading"
          className="relative w-full max-w-[1920px] px-6 sm:px-12 lg:px-20 py-16 sm:py-24 lg:py-36"
        >
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12 xl:gap-16 w-full">
            {/* Left: Vertical Video (mob_video.mp4) */}
            <figure className="m-0 w-full sm:w-[423px] shrink-0 aspect-[0.57] overflow-hidden bg-[var(--surface-dark)]">
              <video
                className="w-full h-full object-cover"
                src="/assets/morf/mob_video.mp4"
                poster="/assets/morf/mob_1.png"
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                disablePictureInPicture
                disableRemotePlayback
                aria-label="MORF brand identity application"
              />
            </figure>

            {/* Right: Large Heading & Paragraph */}
            <article className="morf-coherence-copy flex flex-col flex-1 items-start gap-6 sm:gap-8">
              <h2
                id="coherent-brand-heading"
                className="font-manrope font-extralight text-[var(--text)] text-3xl sm:text-5xl md:text-6xl lg:text-[88px] xl:text-[104px] tracking-[-0.02em] leading-[1.05]"
              >
                BUILDING A BRAND THAT FEELS COHERENT BEFORE IT FEELS DECORATIVE.
              </h2>
              <p className="font-manrope font-extralight text-[var(--text)] text-base sm:text-lg lg:text-xl tracking-[0] leading-7 sm:leading-8 lg:leading-9">
                The visual system was built to feel closer to contemporary fashion
                than traditional pet retail. I used restrained typography, a neutral
                palette, generous spacing and a flexible editorial grid to give the
                product room to lead, while keeping every touchpoint consistent
                across campaign, product and e-commerce.
              </p>
            </article>
          </div>
        </section>

        {/* =========================================================================
            9. DESIGNED FOR EVERY SCREEN
            Left: 2 Mobile Screens Side-by-Side (2nd screen offset down gracefully)
            Right: Sticky Heading & Description (pinned on scroll, stops at end of screens)
            ========================================================================= */}
        <section
          aria-labelledby="every-screen-heading"
          className="relative z-10 w-full max-w-[1920px] px-6 sm:px-12 lg:px-20 pb-20 sm:pb-28 lg:pb-36 bg-[var(--bg)]"
        >
          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-12 xl:gap-20 w-full relative">
            {/* Left: 2 Mobile Screens Side-by-Side */}
            <div className="morf-mobile-screens flex flex-row items-start gap-6 sm:gap-10 lg:gap-12 w-full lg:w-[68%] xl:w-[1314px] shrink-0">
              {/* Screen 1: Top aligned */}
              <figure className="morf-mobile-screen m-0 flex-1 min-w-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-auto object-contain"
                  alt="MORF responsive mobile product experience"
                  src="/assets/morf/mob_1.png"
                  loading="lazy"
                  decoding="async"
                />
              </figure>

              {/* Screen 2: Shifted down gracefully without clipping or black background */}
              <figure className="morf-mobile-screen m-0 flex-1 min-w-0 mt-12 sm:mt-20 lg:mt-28 xl:mt-36">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-auto object-contain"
                  alt="MORF responsive screen layout"
                  src="/assets/morf/mob_2.png"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>

            {/* Right: Sticky Heading & Description */}
            <article className="morf-mobile-copy flex flex-col w-full lg:w-[32%] xl:w-[422px] items-start gap-5 lg:sticky lg:top-24 self-start pt-2 lg:pt-0">
              <h2
                id="every-screen-heading"
                className="font-manrope font-normal text-[var(--text)] text-3xl sm:text-5xl lg:text-[64px] tracking-[-0.01em] leading-tight lg:leading-[64px]"
              >
                DESIGNED FOR EVERY SCREEN
              </h2>
              <p className="font-manrope font-extralight text-[var(--text)] text-base sm:text-lg lg:text-xl tracking-[0] leading-7 sm:leading-8 lg:leading-9">
                The responsive system was designed around the way each screen is
                actually used, not by simply scaling down the desktop layout.
                Content hierarchy, navigation, spacing and interactions were
                reworked for smaller screens while keeping the same visual language.
                The result is a consistent experience across devices without forcing
                one composition to fit every format.
              </p>
            </article>
          </div>
        </section>

        {/* =========================================================================
            10. CAMPAIGN FINALE
            Six campaign images assemble, then recede behind the closing line.
            ========================================================================= */}
        <section
          className="morf-sticky-grid-section relative z-20 w-full h-[210vh] md:h-[250vh] bg-[var(--bg)] motion-reduce:h-[100dvh]"
          aria-label="MORF campaign finale and gallery"
        >
          <div className="morf-sticky-grid-wrapper sticky top-0 w-full h-screen max-h-[100dvh] overflow-hidden flex items-center justify-center relative select-none">
            {/* The campaign recedes before the final line appears. */}
            <div className="morf-sticky-center-content invisible opacity-0 motion-reduce:visible motion-reduce:opacity-100 absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
              <h2 className="morf-sticky-title font-manrope font-extralight text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[var(--text)] uppercase leading-none select-none">
                THANKS FOR WATCHING
              </h2>
              <div className="morf-sticky-cta mt-6 sm:mt-10 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="group inline-flex items-center gap-2.5 text-[var(--text)] font-manrope font-bold text-xs sm:text-sm md:text-base uppercase tracking-[0.2em] hover:opacity-50 transition-opacity cursor-pointer pointer-events-auto"
                >
                  <span className="text-sm transition-transform duration-200 group-hover:-translate-x-1">←</span>
                  <span>BACK TO OVERVIEW</span>
                </button>
              </div>
            </div>

            {/* Two columns on phones, three on wider screens; the grid fits the viewport height. */}
            <div className="morf-sticky-gallery relative z-10 w-[min(90vw,calc((100dvh-96px)*0.52))] md:w-[min(88vw,calc((100dvh-112px)*1.12),1280px)] flex items-center justify-center motion-reduce:opacity-25">
              <div className="morf-sticky-grid grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 lg:gap-6 w-full items-center justify-items-center">
                {MORF_GALLERY_ITEMS.map((item, index) => (
                  <div
                    key={`morf-gallery-item-${index}`}
                    className="morf-sticky-grid-item relative w-full aspect-[4/5] overflow-hidden bg-[var(--surface-dark)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover select-none pointer-events-none"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
