'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useIntroPhase } from '@/components/providers/IntroProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { BOUQUET } from './bouquet';
import { useBouquet } from './BouquetProvider';
import { FLOWERS } from './flowers';
import { GULZAR_TEXTS } from './texts';

/** Гость начал листать: первый экран остаётся чистым, без полоски поверх даты. */
function useScrolledPastHero() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > window.innerHeight * 0.35);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return scrolled;
}

/**
 * Букет внизу экрана: шесть ячеек, по одной на раздел. Собранный цветок
 * в ячейке цветной, ещё не собранный — бледный. Ячейка ведёт к своему разделу.
 */
export function BouquetBar() {
  const { picked, registerSlot } = useBouquet();
  const phase = useIntroPhase();
  const { locale, t } = useLocale();
  const g = GULZAR_TEXTS[locale];
  const count = picked.size;
  const scrolled = useScrolledPastHero();

  return (
    <nav className="g-bar" data-shown={(phase === 'opened' && scrolled) || undefined} aria-label={g.bouquet}>
      <p className="g-bar-label">
        <span className="g-bar-name">{g.bouquet}</span>
        <span className="g-bar-count" aria-hidden>
          {count}/{BOUQUET.length}
        </span>
        <span className="sr-only">{g.collected(count, BOUQUET.length)}</span>
      </p>
      <ol className="g-bar-slots">
        {BOUQUET.map((item) => {
          const flower = FLOWERS[item.flower];
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                ref={(element) => registerSlot(item.id, element)}
                className="g-slot"
                data-filled={picked.has(item.id) || undefined}
                aria-label={g.goTo(item.title(t))}
              >
                <Image src={flower.src} width={flower.w} height={flower.h} alt="" sizes="48px" />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
