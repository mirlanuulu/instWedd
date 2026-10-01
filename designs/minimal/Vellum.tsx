'use client';

import { useEffect, useRef, useState } from 'react';
import { useIntro } from '@/components/providers/IntroProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useMusic } from '@/components/providers/MusicProvider';

/** Как поднимается лист: --dur-sheet и --ease-in-out из minimal.css. */
const LIFT = { duration: 900, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' };

/**
 * Калька поверх первого экрана. Тап по ней запускает музыку и снимает лист:
 * он уходит вверх, а имена под ним становятся резкими.
 */
export function Vellum() {
  const { t } = useLocale();
  const { phase, setPhase } = useIntro();
  const { start: startMusic } = useMusic();

  const sheet = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => setHydrated(true), []);

  function open() {
    const element = sheet.current;
    if (phase !== 'sealed' || !element) return;

    setPhase('opening');
    // Музыка стартует синхронно, внутри обработчика тапа: иначе браузер заблокирует звук.
    startMusic();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lift = reduced
      ? element.animate({ opacity: [1, 0] }, { duration: 300, fill: 'forwards' })
      : element.animate({ transform: ['translateY(0)', 'translateY(-104%)'] }, { ...LIFT, fill: 'forwards' });

    lift.finished
      .catch(() => {})
      .then(() => {
        setPhase('opened');
        setGone(true);
      });
  }

  if (gone) return null;

  return (
    <div ref={sheet} className="vellum" data-intro>
      <button
        type="button"
        onClick={open}
        // Кольцо фокуса вокруг кнопки во весь экран ушло бы за края: его рисует подпись внизу.
        className="group flex h-full w-full cursor-pointer flex-col justify-end pb-[max(2.5rem,env(safe-area-inset-bottom))] text-left outline-none"
      >
        <span className="mx-auto w-full max-w-sheet px-gutter">
          <span
            className={`flex items-center justify-between border-t border-ink-2 pt-4 transition-opacity duration-(--dur-long) ease-out group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-ink ${
              hydrated ? '' : 'opacity-40'
            }`}
          >
            <span className="label text-ink">{t.intro.open}</span>
            {/* Стрелка вверх: лист кальки поднимают. */}
            <svg aria-hidden="true" viewBox="0 0 16 24" className="h-6 w-4 text-ink" fill="none" stroke="currentColor">
              <path d="M8 23V1M1.5 7.5 8 1l6.5 6.5" strokeWidth="1" />
            </svg>
          </span>
        </span>
      </button>
    </div>
  );
}
