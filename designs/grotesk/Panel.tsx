'use client';

import { useEffect, useRef, useState } from 'react';
import { fireConfetti } from '@/lib/confetti';
import { useIntro } from '@/components/providers/IntroProvider';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useMusic } from '@/components/providers/MusicProvider';
import { delay, RollNumber } from '@/designs/shared/reveal';

/** Панель уезжает влево, как сдвигают лист на столе. */
const WIPE = { duration: 800, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' };
/** Сколько длится «табло»: число дня набегает от 01 до нужного. */
const COUNT_UP = 1400;

const twoDigits = (value: number) => String(value).padStart(2, '0');

/**
 * Кобальтовая панель поверх плаката: число дня во всю ширину, месяц и имена.
 * При загрузке число набегает, как на табло, имена выезжают снизу.
 * Тап — салют, панель сдвигается влево, включается музыка.
 */
export function Panel() {
  const invite = useInvite();
  const { t, pick } = useLocale();
  const { phase, setPhase } = useIntro();
  const { start: startMusic } = useMusic();

  const [year = 0, month = 1, day = 1] = invite.event.date.split('-').map(Number);

  const panel = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);
  const [gone, setGone] = useState(false);
  // На сервере и без движения — сразу нужное число.
  const [shownDay, setShownDay] = useState(day);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const started = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - started) / COUNT_UP);
      // Быстро в начале, медленно у цели — как останавливается табло.
      const eased = 1 - (1 - progress) ** 3;
      setShownDay(Math.max(1, Math.round(eased * day)));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [day]);

  function open() {
    const element = panel.current;
    if (phase !== 'sealed' || !element) return;

    setPhase('opening');
    // Музыка стартует синхронно, внутри обработчика тапа: иначе браузер заблокирует звук.
    startMusic();
    fireConfetti(element);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wipe = reduced
      ? element.animate({ opacity: [1, 0] }, { duration: 300, fill: 'forwards' })
      : element.animate({ transform: ['translateX(0)', 'translateX(-101%)'] }, { ...WIPE, fill: 'forwards' });

    wipe.finished
      .catch(() => {})
      .then(() => {
        setPhase('opened');
        setGone(true);
      });
  }

  if (gone) return null;

  const [first, second] = invite.couple;

  return (
    <div ref={panel} className="panel" data-intro>
      <button
        type="button"
        onClick={open}
        // Кольцо фокуса вокруг кнопки во весь экран ушло бы за края: его рисует подпись внизу.
        className="group flex h-full w-full cursor-pointer text-left outline-none"
      >
        <span className="mx-auto flex h-full w-full max-w-poster flex-col px-gutter pt-[max(4rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] @container">
          <span className="panel-in label text-accent-2">{pick(invite.event.title)}</span>
          <span className="panel-in mt-3 block border-t-2 border-accent-ink" style={delay(100)} />
          <span className="numerals figures mt-4 block">
            <RollNumber value={twoDigits(shownDay)} />
          </span>
          <span className="panel-in mt-3 block text-md font-bold" style={delay(1300)}>
            {t.date.monthYear(month - 1, year)}
          </span>

          <span className="mt-auto block text-xl">
            <span className="panel-in block font-bold" style={delay(400)}>
              {pick(first.name)}
            </span>
            <span className="panel-in block font-bold text-accent-2" style={delay(550)}>
              {pick(second.name)}
            </span>
          </span>

          <span
            className={`panel-in label mt-8 flex items-center justify-between border-t-2 border-accent-ink pt-3 group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-accent-ink ${
              hydrated ? '' : 'opacity-40'
            }`}
            style={delay(800)}
          >
            {t.intro.open}
            {/* Стрелка подталкивает: сдвиньте панель влево. */}
            <svg aria-hidden="true" viewBox="0 0 28 12" className="nudge h-3 w-7" fill="none" stroke="currentColor">
              <path d="M28 6H2M7 1 2 6l5 5" strokeWidth="2" />
            </svg>
          </span>
        </span>
      </button>
    </div>
  );
}
