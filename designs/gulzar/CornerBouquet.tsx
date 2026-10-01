'use client';

import { useEffect, useRef, useState } from 'react';
import { useIntroPhase } from '@/components/providers/IntroProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { BouquetArt } from './BouquetArt';
import { BOUQUET } from './bouquet';
import { useBouquet } from './BouquetProvider';
import { GULZAR_TEXTS } from './texts';

const FIRST_HINT_MS = 4500;
const HINT_MS = 2200;

/** Финал с большим букетом уже на экране — маленький в углу не нужен. */
function useFinaleInView() {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const update = () => {
      const finale = document.getElementById('rsvp');
      setInView(!!finale && finale.getBoundingClientRect().top < window.innerHeight * 0.75);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return inView;
}

/**
 * Маленький букет в углу экрана. Растёт сам, пока гость листает; при новом
 * цветке рядом ненадолго появляется подсказка. Тап ведёт к ответу, где букет
 * показан целиком.
 */
export function CornerBouquet() {
  const { picked, lastAdded } = useBouquet();
  const phase = useIntroPhase();
  const finale = useFinaleInView();
  const { locale } = useLocale();
  const g = GULZAR_TEXTS[locale];
  const [hint, setHint] = useState<{ first: boolean; count: number } | null>(null);
  const count = picked.size;

  // Подсказка — на само добавление цветка. Первая объясняет, зачем букет,
  // и дочитывается до конца, даже если следом лёг ещё цветок.
  const firstUntil = useRef(0);
  useEffect(() => {
    if (lastAdded === 0) return;
    const now = Date.now();
    const first = picked.size === 1 || now < firstUntil.current;
    if (picked.size === 1) firstUntil.current = now + FIRST_HINT_MS;
    setHint({ first, count: picked.size });
    const timer = window.setTimeout(() => setHint(null), first ? firstUntil.current - now : HINT_MS);
    return () => window.clearTimeout(timer);
    // picked читается в момент добавления; следить за ним отдельно не нужно.
  }, [lastAdded]);

  const shown = phase === 'opened' && count > 0 && !finale;
  const hintText = hint && (hint.first ? g.firstHint : g.added(hint.count, BOUQUET.length));

  return (
    <div className="g-posy" data-shown={shown || undefined}>
      <p className="g-posy-hint" data-shown={(shown && hint !== null) || undefined} role="status">
        {hintText}
      </p>
      <a href="#rsvp" className="g-posy-button" aria-label={`${g.openBouquet}. ${g.collected(count, BOUQUET.length)}`}>
        <BouquetArt picked={picked} sizes="64px" />
        <span className="g-posy-count" aria-hidden>
          {count}/{BOUQUET.length}
        </span>
      </a>
    </div>
  );
}
