'use client';

import Image from 'next/image';
import { useEffect, useRef, type ReactNode } from 'react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { BOUQUET, bouquetIndex, type BouquetId } from './bouquet';
import { useBouquet } from './BouquetProvider';
import { FLOWERS } from './flowers';
import { GULZAR_TEXTS } from './texts';

/** Раздел считается «пройденным», когда его верх поднялся выше этой доли экрана. */
const REACHED = 0.4;

/**
 * Раздел-«клумба»: свой цветок и заголовок. Когда гость доходит до раздела,
 * цветок сам ложится в букет в углу экрана — без кнопок и лишних действий.
 */
export function GardenSection({
  id,
  children,
  className = '',
}: {
  id: BouquetId;
  children: ReactNode;
  className?: string;
}) {
  const { locale, t } = useLocale();
  const g = GULZAR_TEXTS[locale];
  const { picked, add } = useBouquet();
  const root = useRef<HTMLElement>(null);
  const index = bouquetIndex(id);
  const item = BOUQUET[index]!;
  const flower = FLOWERS[item.flower];
  const inBouquet = picked.has(id);

  // Проверка по прокрутке, а не IntersectionObserver: при прыжке по ссылке
  // раздел не «пересекает» край экрана, а цветок всё равно должен лечь в букет.
  useEffect(() => {
    if (inBouquet) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      const top = root.current?.getBoundingClientRect().top;
      if (top !== undefined && top < window.innerHeight * REACHED) add(id);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [id, add, inBouquet]);

  return (
    <section id={id} ref={root} className={`g-section ${className}`} aria-labelledby={`${id}-title`}>
      <div className="g-section-head">
        <Image src={flower.src} width={flower.w} height={flower.h} alt="" sizes="136px" className="g-section-flower" />
        <p className="g-eyebrow">{g.flowerNo(index + 1)}</p>
        <h2 id={`${id}-title`} className="g-section-title">
          {item.title(t)}
        </h2>
      </div>
      {children}
    </section>
  );
}
