'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { fireConfetti } from '@/lib/confetti';
import { formatEventDate } from '@/lib/invite';
import { useIntro } from '@/components/providers/IntroProvider';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useMusic } from '@/components/providers/MusicProvider';
import { TELEGRAM } from './meta';
import { Postmark } from './parts';

/** Пауза между ударом штемпеля и тем, как бланк уезжает вниз. */
const AFTER_STAMP = 650;
const SLIDE = { duration: 750, easing: 'cubic-bezier(0.7, 0, 0.84, 0)' };

/**
 * Интро: лицевая сторона телеграммы. Тап — штемпель бахает по бланку,
 * бланк вздрагивает, вылетает салют, и лист уезжает вниз, открывая приглашение.
 */
export function Telegram() {
  const invite = useInvite();
  const { t, pick } = useLocale();
  const { phase, setPhase } = useIntro();
  const { start: startMusic } = useMusic();

  const cover = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);
  const [stamped, setStamped] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => setHydrated(true), []);

  function open() {
    const element = cover.current;
    if (phase !== 'sealed' || !element) return;

    setPhase('opening');
    // Музыка стартует синхронно, внутри обработчика тапа: иначе браузер заблокирует звук.
    startMusic();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      element
        .animate({ opacity: [1, 0] }, { duration: 300, fill: 'forwards' })
        .finished.catch(() => {})
        .then(finish);
      return;
    }

    setStamped(true);
    window.setTimeout(() => {
      fireConfetti(element);
      element
        .animate({ transform: ['translateY(0)', 'translateY(105%)'] }, { ...SLIDE, fill: 'forwards' })
        .finished.catch(() => {})
        .then(finish);
    }, AFTER_STAMP);
  }

  function finish() {
    setPhase('opened');
    setGone(true);
  }

  if (gone) return null;

  const [first, second] = invite.couple;
  const date = formatEventDate(invite.event, t);
  const dayMonth = date.numeric.slice(0, 5);

  return (
    <div ref={cover} className="blank-cover" data-intro>
      <button
        type="button"
        onClick={open}
        // Кольцо фокуса вокруг кнопки во весь экран ушло бы за края: его рисует подпись внизу.
        className="group flex h-full w-full cursor-pointer text-left outline-none"
      >
        <span
          className={`mx-auto flex h-full w-full max-w-blank flex-col px-gutter pt-[max(4rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] ${
            stamped ? 'thud' : ''
          }`}
        >
          <span className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1 border-b-2 border-form pb-2">
            <span className="text-xl font-bold tracking-[0.18em] text-form">{TELEGRAM}</span>
            <span className="form-label">{pick(invite.event.title)}</span>
          </span>

          <span className="form-label mt-6">{pick(invite.venue.city)}</span>
          <span className="tape mt-2 block text-display font-bold">
            <span className="strip">{pick(first.name)}</span>
            <br />
            <span className="strip">
              {t.hero.and} {pick(second.name)}
            </span>
          </span>

          {/*
            Пока бланк не открыт, на месте штемпеля — пунктирный кружок «для отметки».
            После тапа штемпель бьёт ровно в него.
          */}
          <span className="relative my-auto flex justify-end py-6">
            {!stamped && (
              <span aria-hidden="true" className="block size-40 rounded-pill border-2 border-dashed border-rule" />
            )}
            {stamped && (
              <Postmark
                city={pick(invite.venue.city)}
                dayMonth={dayMonth}
                year={date.year}
                className="stamp-hit size-40"
                style={{ '--angle': '-14deg' } as CSSProperties}
              />
            )}
          </span>

          <span
            className={`flex items-center justify-between border-t-2 border-form pt-3 group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-form ${
              hydrated ? '' : 'opacity-40'
            }`}
          >
            <span className="strip text-md font-bold">{t.intro.open}</span>
            <span className="caret" aria-hidden="true" />
          </span>
        </span>
      </button>
    </div>
  );
}
