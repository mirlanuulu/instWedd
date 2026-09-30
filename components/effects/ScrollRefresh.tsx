'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';

/**
 * Точки срабатывания по скроллу считаются от высоты страницы. Она меняется,
 * когда догружается шрифт и когда гость переключает язык: пересчитываем.
 */
export function ScrollRefresh({ active, locale }: { active: boolean; locale: string }) {
  useEffect(() => {
    if (!active) return;
    let frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    document.fonts.ready.then(() => {
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => cancelAnimationFrame(frame);
  }, [active, locale]);

  return null;
}
