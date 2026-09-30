'use client';

import type { RefObject } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/motion';

/**
 * Пункты программы [data-program-item] проступают по мере прокрутки, по одному
 * разу. Пришедшие на экран вместе идут лесенкой.
 */
export function ProgramReveal({ root }: { root: RefObject<HTMLElement | null> }) {
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      // Пункт, до которого гость уже докрутил, прятать поздно: он остаётся как есть.
      const items = gsap.utils
        .toArray<HTMLElement>('[data-program-item]')
        .filter((item) => item.getBoundingClientRect().top > window.innerHeight * 0.86);

      gsap.set(items, { opacity: 0, y: 24 });
      ScrollTrigger.batch(items, {
        start: 'top 86%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.14 }),
      });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return null;
}
