'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isSoundEnabled, playTickSound, playReverseImplosionSound } from '@/lib/sound-fx';
import { ViewportVideo } from '@/components/viewport-video';
import { CaseBackButton } from '@/components/case-back-button';

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
    src: '/assets/morf/soc_1.webp',
    alt: 'MORF Dogwear campaign identity visual 01',
  },
  {
    src: '/assets/morf/soc_2.webp',
    alt: 'MORF Dogwear campaign identity visual 02',
  },
  {
    src: '/assets/morf/soc_3.webp',
    alt: 'MORF Dogwear campaign identity visual 03',
  },
  {
    src: '/assets/morf/soc_4.webp',
    alt: 'MORF Dogwear campaign identity visual 04',
  },
  {
    src: '/assets/morf/soc_5.webp',
    alt: 'MORF Dogwear campaign identity visual 05',
  },
  {
    src: '/assets/morf/soc_6.webp',
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
        mobile: '(max-width: 767px)',
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
          const digitalScreens = container.querySelectorAll<HTMLElement>('.morf-digital-screen');
          if (digitalScreens.length) {
            gsap.from(digitalScreens, {
              y: desktop ? 28 : 14,
              opacity: 0,
              clipPath: 'inset(5% 0 0 0)',
              duration: desktop ? 1 : 0.7,
              stagger: desktop ? 0.16 : 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: digitalScreens[0],
                scroller: container,
                start: 'top 88%',
                once: true,
              },
            });
          }
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

          // Keep the GSAP sequence in sync with VRAK; only the campaign images differ.
          const stickySection = container.querySelector('.morf-sticky-grid-section');
          const stickyWrapper = container.querySelector('.morf-sticky-grid-wrapper');
          const gridContainer = container.querySelector('.morf-sticky-grid');
          const gridItems = gsap.utils.toArray<HTMLElement>('.morf-sticky-grid-item');
          const centerContent = container.querySelector('.morf-sticky-center-content');
          const centerTitle = container.querySelector('.morf-sticky-title');
          const centerButton = container.querySelector('.morf-sticky-cta');

          if (stickySection && stickyWrapper && gridContainer && gridItems.length === 6) {
            // Distribute 6 items into 3 columns:
            // Col 0 (left): items 0 & 3
            // Col 1 (center): items 1 & 4
            // Col 2 (right): items 2 & 5
            const col0 = [gridItems[0], gridItems[3]];
            const col1 = [gridItems[1], gridItems[4]];
            const col2 = [gridItems[2], gridItems[5]];

            const isMobile = window.innerWidth < 768;
            const initialDy = window.innerHeight * 1.35;
            const targetScale = isMobile ? 1.6 : 1.95;
            const xOffset = isMobile ? 44 : 54;
            const yOffset = isMobile ? 48 : 58;

            // Initial setup:
            // Even columns (0 and 2) start from above the viewport (-initialDy)
            // Odd column (1, center) starts from below the viewport (+initialDy)
            gsap.set([col0, col2], { y: -initialDy, opacity: 0.95 });
            gsap.set(col1, { y: initialDy, opacity: 0.95 });
            gsap.set(gridContainer, { scale: 1, transformOrigin: 'center center' });

            // Center content initial state
            if (centerContent) {
              gsap.set(centerContent, { opacity: 0, pointerEvents: 'none' });
            }
            if (centerTitle) {
              gsap.set(centerTitle, { y: 35, opacity: 0 });
            }
            if (centerButton) {
              gsap.set(centerButton, { y: 20, opacity: 0 });
            }

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: stickySection,
                scroller: container,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.8,
              },
            });

            // Phase 1: Grid Reveal (Columns slide in to assemble the 3x2 grid)
            tl.to(
              col0,
              {
                y: 0,
                opacity: 1,
                stagger: 0.08,
                duration: 1.5,
                ease: 'power2.out',
              },
              'reveal'
            );

            tl.to(
              col2,
              {
                y: 0,
                opacity: 1,
                stagger: 0.08,
                duration: 1.5,
                ease: 'power2.out',
              },
              'reveal'
            );

            tl.to(
              col1,
              {
                y: 0,
                opacity: 1,
                stagger: 0.08,
                duration: 1.5,
                ease: 'power2.out',
              },
              'reveal'
            );

            // Phase 2: Settle / brief pause where user sees full grid
            tl.to({}, { duration: 0.4 });

            // Phase 3: Grid Zoom & Aperture Expansion
            tl.to(
              gridContainer,
              {
                scale: targetScale,
                duration: 1.8,
                ease: 'power2.inOut',
              },
              'zoom'
            );

            tl.to(
              col0,
              {
                xPercent: -xOffset,
                duration: 1.8,
                ease: 'power2.inOut',
              },
              'zoom'
            );

            tl.to(
              col2,
              {
                xPercent: xOffset,
                duration: 1.8,
                ease: 'power2.inOut',
              },
              'zoom'
            );

            // In center column: top item moves UP, bottom item moves DOWN
            tl.to(
              col1[0],
              {
                yPercent: -yOffset,
                duration: 1.8,
                ease: 'power2.inOut',
              },
              'zoom'
            );

            tl.to(
              col1[1],
              {
                yPercent: yOffset,
                duration: 1.8,
                ease: 'power2.inOut',
              },
              'zoom'
            );

            // Soften background images so center text has immaculate readability
            tl.to(
              gridItems,
              {
                opacity: 0.42,
                duration: 1.2,
                ease: 'power1.out',
              },
              'zoom+=0.4'
            );

            // Phase 4: Center Content Reveal ("THANKS FOR WATCHING")
            if (centerContent) {
              tl.to(
                centerContent,
                {
                  opacity: 1,
                  pointerEvents: 'auto',
                  duration: 0.2,
                },
                'zoom+=0.7'
              );
            }

            if (centerTitle) {
              tl.to(
                centerTitle,
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.8,
                  ease: 'power3.out',
                },
                'zoom+=0.8'
              );
            }

            if (centerButton) {
              tl.to(
                centerButton,
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.7,
                  ease: 'power3.out',
                },
                'zoom+=0.95'
              );
            }

            // Phase 5: Holding phase at the end
            tl.to({}, { duration: 1.2 });
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
      <CaseBackButton variant="floating" onClick={handleBack} visible={isNavVisible} />

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
            <ViewportVideo
              className="w-full h-full object-cover"
              src="/assets/morf/main_video.mp4"
              poster="/assets/morf/main_video-poster.webp"
              scrollRoot={containerRef}
              label="MORF campaign scene featuring a dog and owner in an urban setting"
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
                src="/assets/morf/women_dogs.webp"
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
                src="/assets/morf/Design System.webp"
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
                  src="/assets/morf/HOME.webp"
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
                  src="/assets/morf/PDP COAT 01.webp"
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
              <ViewportVideo
                className="w-full h-full object-cover"
                src="/assets/morf/mob_video.mp4"
                poster="/assets/morf/mob_1.webp"
                scrollRoot={containerRef}
                label="MORF brand identity application"
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
                  src="/assets/morf/mob_1.webp"
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
                  src="/assets/morf/mob_2.webp"
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
            10. STICKY GRID APERTURE FINALE (same motion as VRAK)
            Six MORF campaign images part to reveal the closing line.
            ========================================================================= */}
        <section
          className="morf-sticky-grid-section relative z-20 w-full h-[380vh] bg-[var(--bg)] motion-reduce:h-[100dvh]"
          aria-label="MORF campaign finale and gallery"
        >
          <div className="morf-sticky-grid-wrapper sticky top-0 w-full h-[100dvh] overflow-hidden flex items-center justify-center relative select-none">
            {/* Center content appears in the aperture created by the parting images. */}
            <div className="morf-sticky-center-content absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
              <h2 className="morf-sticky-title font-manrope font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[var(--text)] uppercase leading-none select-none">
                THANKS FOR WATCHING
              </h2>
              <div className="morf-sticky-cta mt-6 sm:mt-10 flex flex-col sm:flex-row items-center gap-3">
                <CaseBackButton variant="finale" onClick={handleBack} />
              </div>
            </div>

            {/* Same three-column gallery layout as VRAK. */}
            <div className="morf-sticky-gallery relative z-10 w-[96vw] sm:w-[94vw] lg:w-[92vw] max-w-[1280px] 2xl:max-w-[1400px] flex items-center justify-center motion-reduce:opacity-0">
              <div className="morf-sticky-grid grid grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8 w-full items-center justify-items-center will-change-transform">
                {MORF_GALLERY_ITEMS.map((item, index) => (
                  <div
                    key={`morf-gallery-item-${index}`}
                    className="morf-sticky-grid-item relative w-full aspect-[4/5] overflow-hidden bg-[var(--surface-dark)] will-change-transform shadow-2xl"
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
