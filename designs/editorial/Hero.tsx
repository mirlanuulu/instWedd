'use client';

import type { CSSProperties } from 'react';
import { formatEventDate } from '@/lib/invite';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { delay, Letters } from '@/designs/shared/reveal';
import { Page } from './Page';

/**
 * Первая полоса под обложкой: рубрика, двойная линейка, имена заголовком,
 * приглашение с буквицей и строка с датой и временем.
 */
export function Hero() {
  const invite = useInvite();
  const { t, pick } = useLocale();
  const [first, second] = invite.couple;
  const firstName = pick(first.name);
  const secondName = pick(second.name);
  const date = formatEventDate(invite.event, t);
  const nameChars = Math.max(Array.from(firstName).length, Array.from(secondName).length);

  return (
    <section className="pt-[max(1rem,env(safe-area-inset-top))] pb-12">
      <Page className="@container">
        {/* Высота строки — как у переключателя языка: рубрика стоит с ним на одной линии. */}
        <p className="caps flex min-h-11 items-center text-accent">{pick(invite.event.title)}</p>
        <div className="mt-2 border-t-[3px] border-ink">
          <div className="mt-0.5 border-t border-ink" />
        </div>

        <h1
          className="mt-10 text-[length:min(var(--text-display),100cqi/(var(--name-chars)*0.6))] leading-[0.95] font-black tracking-[-0.02em]"
          style={{ '--name-chars': nameChars } as CSSProperties}
        >
          <span className="block">
            <Letters text={firstName} start={350} />
          </span>{' '}
          <span data-reveal="up" style={delay(700)} className="caps my-3 block font-body font-semibold tracking-[0.08em] text-muted">{t.hero.and}</span>{' '}
          <span className="block">
            <Letters text={secondName} start={800} />
          </span>
        </h1>

        <p data-reveal="up" style={delay(1100)} className="drop-cap mt-10 text-md leading-[1.45]">{pick(invite.event.invitation)}</p>

        {/* Дата словами в одну строку, день и время — капителями под ней: в две колонки «29-ноябры» рвался по дефису. */}
        <div data-reveal="up" style={delay(1250)} className="mt-10 border-y border-ink py-4">
          <p className="font-display text-md font-semibold">
            <time dateTime={`${invite.event.date}T${invite.event.time}${invite.event.utcOffset}`}>{date.full}</time>
          </p>
          <p className="caps mt-1 text-ink-2">
            {date.weekday}, {date.time}
          </p>
        </div>
      </Page>
    </section>
  );
}
