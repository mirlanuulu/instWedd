'use client';

import type { CSSProperties } from 'react';
import { formatEventDate } from '@/lib/invite';
import { useIntro } from '@/components/providers/IntroProvider';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { delay, Letters } from '@/designs/shared/reveal';
import { Sheet } from './Sheet';

/**
 * Обложка: название события вверху, имена лесенкой посередине, дата внизу.
 * Никакой графики — только шрифт и поля.
 */
export function Hero() {
  const invite = useInvite();
  const { t, pick } = useLocale();
  const { phase } = useIntro();

  const [first, second] = invite.couple;
  const firstName = pick(first.name);
  const secondName = pick(second.name);
  const date = formatEventDate(invite.event, t);

  // Кегль имён подстраивается под самое длинное: оно должно встать в строку целиком.
  const nameChars = Math.max(Array.from(firstName).length, Array.from(secondName).length);

  return (
    <section className="flex min-h-svh flex-col">
      <Sheet
        data-sealed={phase === 'sealed' ? '' : undefined}
        className="settle flex flex-1 flex-col pt-[max(1rem,env(safe-area-inset-top))] pb-10 @container"
      >
        {/* Высота строки — как у переключателя языка: название стоит с ним на одной линии. */}
        <p className="label flex min-h-11 items-center text-muted">{pick(invite.event.title)}</p>

        <h1
          className="my-auto py-12 text-[length:min(var(--text-display),100cqi/(var(--name-chars)*0.62))] leading-none font-extralight tracking-[-0.02em]"
          style={{ '--name-chars': nameChars } as CSSProperties}
        >
          <span className="block">
            <Letters text={firstName} start={250} />
          </span>{' '}
          <span data-reveal="up" style={delay(600)} className="label my-5 block font-body text-muted">{t.hero.and}</span>{' '}
          <span className="block text-right">
            <Letters text={secondName} start={700} />
          </span>
        </h1>

        <div data-reveal="up" style={delay(1000)} className="grid grid-cols-[auto_minmax(0,1fr)] items-end gap-x-6 border-t border-rule pt-5">
          <p className="figures font-display text-xl font-light">
            <time dateTime={`${invite.event.date}T${invite.event.time}${invite.event.utcOffset}`}>{date.numeric}</time>
          </p>
          <p className="text-right text-muted">
            {date.weekday}
            <br />
            {date.time}
          </p>
        </div>

        <p data-reveal="up" style={delay(1150)} className="mt-6 max-w-[45ch] text-ink-2">{pick(invite.event.invitation)}</p>
      </Sheet>
    </section>
  );
}
