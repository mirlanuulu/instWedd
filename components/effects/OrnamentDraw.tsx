'use client';

import type { RefObject } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/motion';
import { useIntroPhase } from '@/components/providers/IntroProvider';

/** Узор прорисовывается по линиям, когда доходит до экрана. */
export function OrnamentDraw({ svg }: { svg: RefObject<SVGSVGElement | null> }) {
  const reduced = useReducedMotion();
  const phase = useIntroPhase();

  useGSAP(
    () => {
      const node = svg.current;
      // Пока конверт закрыт, узор под ним не виден: рисовать его рано.
      if (reduced || phase !== 'opened' || !node) return;
      // Узор уже на экране и его видели целым: стирать и рисовать заново незачем.
      if (node.getBoundingClientRect().top < window.innerHeight * 0.9 && window.scrollY > 0) return;

      const paths = gsap.utils.toArray<SVGPathElement>('path', node);
      // opacity: при нулевой длине штриха от контура не должно оставаться ничего.
      gsap.set(paths, { strokeDashoffset: 1, opacity: 0 });
      ScrollTrigger.create({
        trigger: node,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(paths, { opacity: 1, duration: 0.01, stagger: 0.07 });
          gsap.to(paths, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', stagger: 0.07 });
        },
      });
    },
    { scope: svg, dependencies: [reduced, phase], revertOnUpdate: true },
  );

  return null;
}
