'use client';

import Image from 'next/image';
import { useEffect, useRef, type ReactNode } from 'react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { BOUQUET, bouquetIndex, type BouquetId } from './bouquet';
import { useBouquet } from './BouquetProvider';
import { FLOWERS } from './flowers';
import { GULZAR_TEXTS } from './texts';

/**
 * Раздел-«клумба»: свой цветок, номер цветка, заголовок и кнопка
 * «в букет». Если гость прокрутил раздел, не нажав, цветок сам ложится в букет.
 */
export function GardenSection({ id, children }: { id: BouquetId; children: ReactNode }) {
  const { locale, t } = useLocale();
  const g = GULZAR_TEXTS[locale];
  const { picked, pick } = useBouquet();
  const root = useRef<HTMLElement>(null);
  const flowerRef = useRef<HTMLImageElement>(null);
  const index = bouquetIndex(id);
  const item = BOUQUET[index]!;
  const flower = FLOWERS[item.flower];
  const inBouquet = picked.has(id);

  // Раздел целиком ушёл за верх экрана — значит, прочитан. Проверка по прокрутке,
  // а не IntersectionObserver: при прыжке по ссылке раздел не «пересекает» край экрана.
  useEffect(() => {
    if (inBouquet) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      if ((root.current?.getBoundingClientRect().bottom ?? 1) < 0) pick(id);
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
  }, [id, pick, inBouquet]);

  return (
    <section id={id} ref={root} className="g-section" aria-labelledby={`${id}-title`}>
      <div className="g-section-head">
        <Image
          ref={flowerRef}
          src={flower.src}
          width={flower.w}
          height={flower.h}
          alt=""
          sizes="160px"
          className="g-section-flower"
        />
        <p className="g-eyebrow">{g.flowerNo(index + 1, BOUQUET.length)}</p>
        <h2 id={`${id}-title`} className="g-section-title">
          {item.title(t)}
        </h2>
        <button
          type="button"
          className="g-pick"
          aria-pressed={inBouquet}
          onClick={() => pick(id, flowerRef.current)}
        >
          {inBouquet ? `✓ ${g.picked}` : g.pick}
        </button>
      </div>
      {children}
    </section>
  );
}
