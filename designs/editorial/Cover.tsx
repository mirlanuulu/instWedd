'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { fireConfetti } from '@/lib/confetti';
import { formatEventDate } from '@/lib/invite';
import { useIntro } from '@/components/providers/IntroProvider';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useMusic } from '@/components/providers/MusicProvider';

/** Как перелистывается обложка: корешок слева, страница уходит за край. */
const TURN = { duration: 1000, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' };

const chars = (text: string) => Array.from(text).length;

/**
 * Обложка номера поверх приглашения. Шапка — название события во всю ширину,
 * имена — крупной дидоной, ниже анонсы: когда и где. Тап перелистывает обложку
 * и запускает музыку и салют.
 */
export function Cover() {
  const invite = useInvite();
  const { t, pick } = useLocale();
  const { phase, setPhase } = useIntro();
  const { start: startMusic } = useMusic();

  const cover = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => setHydrated(true), []);

  function open() {
    const element = cover.current;
    if (phase !== 'sealed' || !element) return;

    setPhase('opening');
    // Музыка стартует синхронно, внутри обработчика тапа: иначе браузер заблокирует звук.
    startMusic();
    fireConfetti(element);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const turn = reduced
      ? element.animate({ opacity: [1, 0] }, { duration: 300, fill: 'forwards' })
      : element.animate(
          { transform: ['perspective(1800px) rotateY(0deg)', 'perspective(1800px) rotateY(-105deg)'] },
          { ...TURN, fill: 'forwards' },
        );

    turn.finished
      .catch(() => {})
      .then(() => {
        setPhase('opened');
        setGone(true);
      });
  }

  if (gone) return null;

  const [first, second] = invite.couple;
  const title = pick(invite.event.title);
  const firstName = pick(first.name);
  const secondName = pick(second.name);
  const date = formatEventDate(invite.event, t);

  return (
    <div ref={cover} className="cover" data-intro>
      <button
        type="button"
        onClick={open}
        // Кольцо фокуса вокруг кнопки во весь экран ушло бы за края: его рисует подпись внизу.
        className="group flex h-full w-full cursor-pointer text-left outline-none"
      >
        <span className="mx-auto flex h-full w-full max-w-page flex-col px-gutter @container pt-[max(4rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <span className="block border-t-[3px] border-ink" />
          {/* Шапка подгоняется под ширину колонки: короткое название крупнее, длинное мельче. */}
          <span className="block pt-3">
            <span
              className="masthead block text-[length:min(8rem,100cqi/(var(--chars)*0.62))] text-accent"
              style={{ '--chars': chars(title) } as CSSProperties}
            >
              {title}
            </span>
          </span>
          <span className="caps mt-3 flex justify-between gap-4 border-y border-ink py-1.5">
            <span>{date.full}</span>
            <span>{pick(invite.venue.city)}</span>
          </span>

          <span
            className="my-auto block py-8 font-display text-[length:min(var(--text-display),100cqi/(var(--chars)*0.58))] leading-[0.95] font-normal"
            style={{ '--chars': Math.max(chars(firstName), chars(secondName)) } as CSSProperties}
          >
            <span className="block">{firstName}</span>
            <span className="caps my-3 block font-body text-muted">{t.hero.and}</span>
            <span className="block">{secondName}</span>
          </span>

          <span className="grid gap-1 border-t border-ink pt-3 text-md">
            <span className="font-display font-semibold">
              {date.weekday}, {date.time}
            </span>
            <span className="text-ink-2">{pick(invite.venue.name)}</span>
          </span>

          <span
            className={`caps mt-6 flex items-center justify-between border-t-[3px] border-ink pt-3 text-accent transition-opacity duration-(--dur-long) ease-out group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-ink ${
              hydrated ? '' : 'opacity-40'
            }`}
          >
            {t.intro.open}
            <svg aria-hidden="true" viewBox="0 0 28 12" className="h-3 w-7" fill="none" stroke="currentColor">
              <path d="M0 6h26M21 1l5 5-5 5" strokeWidth="1.5" />
            </svg>
          </span>
        </span>
      </button>
    </div>
  );
}
