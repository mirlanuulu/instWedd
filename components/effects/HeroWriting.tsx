'use client';

import type { RefObject } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

/** Длина штриха обводки в кеглях. С запасом длиннее любого контура буквы. */
const DASH_PER_EM = 14;
/** Пауза между буквами, секунды. */
const STEP = 0.085;

interface HeroWritingProps {
  root: RefObject<HTMLElement | null>;
  /** Конверт открыт, и гость не просил убавить движение. */
  play: boolean;
  /** Сменился язык — имена другие, сцена проигрывается заново. */
  replayKey: string;
  /** Сколько букв в первом имени: союз между именами появляется, когда оно дописано. */
  firstNameLength: number;
}

/**
 * Первый экран после конверта: имена «пишутся» буква за буквой, остальное
 * проступает следом. Ничего не рисует сам, управляет разметкой секции Hero.
 */
export function HeroWriting({ root, play, replayKey, firstNameLength }: HeroWritingProps) {
  useGSAP(
    () => {
      if (!play) return;

      const letters = gsap.utils.toArray<SVGTSpanElement>('[data-letter]');
      const [sample] = letters;
      if (!sample) return;
      const dash = parseFloat(getComputedStyle(sample).fontSize) * DASH_PER_EM;

      // Обводка невидима до своей очереди: штрих нулевой длины оставил бы точку в начале контура.
      gsap.set(letters, { strokeDasharray: dash, strokeDashoffset: dash, strokeOpacity: 0, fillOpacity: 0 });

      gsap
        .timeline({ defaults: { ease: 'power2.out' } })
        .from('[data-reveal="lead"]', { opacity: 0, y: 12, duration: 0.6 }, 0)
        // Обводка каждой буквы, следом заливка, затем обводка гаснет: остаётся обычный текст.
        .to(letters, { strokeOpacity: 1, duration: 0.05, ease: 'none', stagger: STEP }, 0.2)
        .to(letters, { strokeDashoffset: 0, duration: 1.2, ease: 'power1.inOut', stagger: STEP }, 0.2)
        .to(letters, { fillOpacity: 1, duration: 0.5, stagger: STEP }, 0.7)
        .to(letters, { strokeOpacity: 0, duration: 0.4, stagger: STEP }, 1.1)
        .from('[data-reveal="and"]', { opacity: 0, duration: 0.5 }, 0.2 + STEP * firstNameLength)
        .from('[data-reveal="rest"]', { opacity: 0, y: 12, duration: 0.7, stagger: 0.12 }, '-=0.9')
        .set(letters, { clearProps: 'strokeDasharray,strokeDashoffset' });
    },
    { scope: root, dependencies: [play, replayKey, firstNameLength], revertOnUpdate: true },
  );

  return null;
}
