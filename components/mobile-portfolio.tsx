'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const disciplines = [
  { title: 'UI / UX', image: '/assets/work_uiux.webp' },
  { title: 'BRAND', image: '/assets/work_brand.webp' },
  { title: 'MARKETING', image: '/assets/work_marketing.webp' },
];

export function MobilePortfolio() {
  useEffect(() => {
    const selectedCase = new URLSearchParams(window.location.search).get('scene');
    if (selectedCase === 'morf' || selectedCase === 'vrak') {
      requestAnimationFrame(() => document.getElementById('work')?.scrollIntoView());
    }
  }, []);

  return (
    <main id="mobile-portfolio" className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-manrope">
      <header className="relative z-10 flex items-center justify-between px-5 pt-[max(22px,env(safe-area-inset-top))] pb-5 sm:px-10">
        <a href="#top" aria-label="Nikita Zhorov — back to top" className="inline-flex min-h-11 items-center text-[15px] font-extrabold tracking-[-0.04em]">NIKITA.Z</a>
        <a href="#work" className="inline-flex min-h-11 items-center text-[13px] font-semibold underline underline-offset-4">Selected work</a>
      </header>

      <section id="top" aria-labelledby="mobile-hero-heading" className="px-5 sm:px-10">
        <h1 id="mobile-hero-heading" className="max-w-[16ch] pt-7 pb-9 text-[clamp(39px,9.8vw,76px)] leading-[0.98] tracking-[-0.055em] font-extrabold uppercase text-balance">
          Product should not stop at the interface.
        </h1>
        <div className="relative mx-auto w-full max-w-[680px] aspect-[1/1.03] overflow-hidden bg-[var(--bg)]">
          <Image src="/assets/portrait-crop.webp" alt="Portrait of Nikita Zhorov" fill priority sizes="(max-width: 640px) calc(100vw - 40px), 680px" className="object-contain object-center" />
        </div>
        <p className="max-w-[24ch] ml-auto pt-8 pb-20 text-[clamp(25px,6vw,43px)] leading-[1.12] tracking-[-0.04em] font-extrabold uppercase text-pretty">
          The same idea should live through identity and campaign.
        </p>
      </section>

      <section id="approach" aria-label="Design and brand approach" className="py-20 sm:py-28 bg-[var(--surface)]">
        <div className="px-5 sm:px-10">
          <h2 className="text-[clamp(58px,18vw,130px)] leading-[0.86] tracking-[-0.07em] font-extrabold">DESIGN</h2>
          <div className="max-w-[37ch] ml-auto mt-12 space-y-6 text-[17px] leading-[1.55] font-normal sm:text-xl">
            <p>When a brief arrives, I ask what the business needs to explain, what people come looking for, and what already makes the brand recognisable.</p>
            <p>I work out the structure before polishing the screens. If a layout, type choice or interaction does not make the message clearer, I reconsider it.</p>
            <p>A website and a campaign are often seen by the same person. I build them with a shared voice, so the brand feels familiar wherever they meet it.</p>
          </div>
          <p aria-hidden="true" className="mt-16 text-right text-[clamp(58px,18vw,130px)] leading-[0.86] tracking-[-0.07em] font-extrabold">BRAND</p>
        </div>
      </section>

      <section id="disciplines" aria-labelledby="disciplines-heading" className="px-5 py-20 sm:px-10 sm:py-28">
        <h2 id="disciplines-heading" className="sr-only">What I do</h2>
        <div className="space-y-14">
          {disciplines.map(({ title, image }, index) => (
            <div key={title} className="relative">
              <h3 className="relative z-10 mb-4 text-[clamp(46px,14vw,86px)] leading-[0.95] tracking-[-0.065em] font-extrabold">{title}</h3>
              <div className={`mobile-reveal w-[82%] max-w-[680px] overflow-hidden ${index === 1 ? 'ml-auto' : ''}`}>
                <Image src={image} alt={`${title} design work by Nikita Zhorov`} width={1122} height={1402} sizes="(max-width: 640px) 82vw, 680px" className="h-auto w-full object-cover" loading="lazy" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="work" aria-labelledby="work-heading" className="px-5 pt-20 pb-24 sm:px-10 bg-[var(--surface)] scroll-mt-5">
        <h2 id="work-heading" className="mb-12 text-[clamp(48px,13vw,92px)] leading-[0.91] tracking-[-0.06em] font-extrabold uppercase">Selected<br />work</h2>
        <div className="space-y-16">
          <Link href="/work/morf" className="group block focus-visible:outline-offset-8" aria-label="View MORF case study">
            <div className="mobile-reveal overflow-hidden aspect-[2804/2244] bg-[var(--border)]">
              <Image src="/assets/morf_preview_scrolldisplay.webp" alt="MORF fashion brand campaign" width={2000} height={1601} sizes="(max-width: 640px) calc(100vw - 40px), 900px" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transform-none" loading="lazy" />
            </div>
            <div className="mt-4 flex items-end justify-between gap-4"><span className="text-[clamp(40px,12vw,74px)] leading-none tracking-[-0.06em] font-extrabold">MORF</span><span className="pb-1 text-sm">Brand / Digital ↗</span></div>
          </Link>
          <Link href="/work/vrak" className="group block focus-visible:outline-offset-8" aria-label="View VRAK case study">
            <div className="mobile-reveal overflow-hidden aspect-video bg-[var(--border)]">
              <Image src="/assets/vrak/hand_scrolldisplay.webp" alt="VRAK beverage brand campaign" width={2300} height={1294} sizes="(max-width: 640px) calc(100vw - 40px), 900px" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transform-none" loading="lazy" />
            </div>
            <div className="mt-4 flex items-end justify-between gap-4"><span className="text-[clamp(40px,12vw,74px)] leading-none tracking-[-0.06em] font-extrabold">VRAK</span><span className="pb-1 text-sm">Brand / Campaign ↗</span></div>
          </Link>
        </div>
      </section>

      <section id="contact" aria-label="Contact Nikita Zhorov" className="min-h-[70svh] flex flex-col justify-end px-5 pt-24 pb-[max(40px,env(safe-area-inset-bottom))] sm:px-10">
        <h2 className="mb-8 text-[clamp(58px,16vw,116px)] leading-[0.9] tracking-[-0.065em] font-extrabold uppercase">LET’S<br />TALK.</h2>
        <a href="mailto:nikita98zh@gmail.com" className="inline-block w-fit max-w-full break-all text-[clamp(19px,5.5vw,32px)] font-bold tracking-[-0.045em] underline underline-offset-4">nikita98zh@gmail.com</a>
        <nav aria-label="Professional profiles" className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm font-semibold">
          <a className="min-h-11 inline-flex items-center" href="https://www.linkedin.com/in/nzhorov/" target="_blank" rel="noopener noreferrer">LINKEDIN ↗</a>
        </nav>
      </section>
    </main>
  );
}
