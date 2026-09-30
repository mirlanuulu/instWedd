'use client';

import type { RefObject } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/motion';

/** На сколько процентов своей высоты фото смещается за время прохода через экран. */
const PARALLAX = 7;

/**
 * Параллакс фото в истории пары: слой [data-parallax] внутри рамки
 * движется медленнее страницы. Только transform.
 */
export function StoryParallax({ root }: { root: RefObject<HTMLElement | null> }) {
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((layer) => {
        gsap.fromTo(
          layer,
          { yPercent: -PARALLAX },
          {
            yPercent: PARALLAX,
            ease: 'none',
            scrollTrigger: {
              trigger: layer.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.4,
            },
          },
        );
      });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return null;
}
