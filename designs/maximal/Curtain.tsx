'use client';

import { useEffect, useRef, useState } from 'react';
import { fireConfetti } from '@/lib/confetti';
import { formatEventDate } from '@/lib/invite';
import { useIntro } from '@/components/providers/IntroProvider';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useMusic } from '@/components/providers/MusicProvider';
import { Sparkle } from './parts';

/** Как раздвигается занавес: медленно трогается, быстро уходит за края. */
const OPEN = { duration: 1300, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' };

/**
 * Интро — бархатный занавес с золотой бахромой, на нём табличка с именами.
 * Тап: табличка улетает вверх, салют, половины занавеса разъезжаются в стороны.
 */
export function Curtain() {
  const invite = useInvite();
  const { t, pick } = useLocale();
  const { phase, setPhase } = useIntro();
  const { start: startMusic } = useMusic();

  const root = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => setHydrated(true), []);

  function open() {
    const element = root.current;
    if (phase !== 'sealed' || !element) return;

    setPhase('opening');
    // Музыка стартует синхронно, внутри обработчика тапа: иначе браузер заблокирует звук.
    startMusic();

    const left = element.querySelector<HTMLElement>('.curtain-left');
    const right = element.querySelector<HTMLElement>('.curtain-right');
    const valance = element.querySelector<HTMLElement>('.valance');
    const plaque = element.querySelector<HTMLElement>('[data-plaque]');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !left || !right || !valance || !plaque) {
      element
        .animate({ opacity: [1, 0] }, { duration: 300, fill: 'forwards' })
        .finished.catch(() => {})
        .then(finish);
      return;
    }

    fireConfetti(plaque);
    plaque.animate(
      { transform: ['translateY(0) scale(1)', 'translateY(-30vh) scale(0.8)'], opacity: [1, 0] },
      { duration: 600, easing: 'cubic-bezier(0.7, 0, 0.84, 0)', fill: 'forwards' },
    );
    valance.animate({ transform: ['translateY(0)', 'translateY(-110%)'] }, { ...OPEN, delay: 500, fill: 'forwards' });
    left.animate({ transform: ['translateX(0)', 'translateX(-102%)'] }, { ...OPEN, delay: 250, fill: 'forwards' });
    right
      .animate({ transform: ['translateX(0)', 'translateX(102%)'] }, { ...OPEN, delay: 250, fill: 'forwards' })
      .finished.catch(() => {})
      .then(finish);
  }

  function finish() {
    setPhase('opened');
    setGone(true);
  }

  if (gone) return null;

  const [first, second] = invite.couple;
  const date = formatEventDate(invite.event, t);

  return (
    <div ref={root} data-intro>
      <div className="curtain curtain-left" />
      <div className="curtain curtain-right" />
      <div className="valance" />

      <button
        type="button"
        onClick={open}
        className="group fixed inset-0 z-(--z-intro) flex cursor-pointer items-center justify-center px-gutter pt-16 outline-none"
      >
        <span
          data-plaque
          className="plaque block w-full max-w-[22rem] px-6 py-7 text-center shadow-[0_1.5rem_3rem_-1rem_rgb(0_0_0/0.5)] group-focus-visible:outline-ink"
        >
          <span className="label block text-magenta">{pick(invite.event.title)}</span>
          <span className="mt-3 flex items-center justify-center gap-2 text-gold">
            <Sparkle className="size-4" />
            <Sparkle className="size-6" />
            <Sparkle className="size-4" />
          </span>
          <span className="mt-3 block font-display text-[2.6rem] leading-[1.05] text-magenta">
            {pick(first.name)}
            <span className="my-1 block text-md text-ink">{t.hero.and}</span>
            {pick(second.name)}
          </span>
          <span className="mt-4 block font-semibold text-ink">{date.full}</span>

          <span
            className={`mt-6 inline-flex min-h-12 items-center justify-center rounded-pill bg-magenta px-6 font-semibold whitespace-nowrap text-paper transition-opacity duration-(--dur-long) ease-out ${
              hydrated ? 'animate-pulse' : 'opacity-40'
            }`}
          >
            {t.intro.open}
          </span>
        </span>
      </button>
    </div>
  );
}
