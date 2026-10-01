'use client';

import type { CSSProperties } from 'react';
import { formatEventDate } from '@/lib/invite';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { TELEGRAM } from './meta';
import { Blank, Postmark, Typed } from './parts';

/**
 * Первый экран — сама телеграмма: шапка бланка, графы с названием и днём недели,
 * текст на лентах печатается на глазах, в углу — штемпель с датой.
 */
export function Hero() {
  const invite = useInvite();
  const { t, pick } = useLocale();
  const [first, second] = invite.couple;
  const date = formatEventDate(invite.event, t);
  const names = `${pick(first.name)} ${t.hero.and} ${pick(second.name)}`;

  return (
    <section className="pt-[max(1rem,env(safe-area-inset-top))] pb-10">
      <Blank>
        {/* Высота строки — как у переключателя языка: шапка стоит с ним на одной линии. */}
        <p className="flex min-h-11 items-center text-md font-bold tracking-[0.18em] text-form">{TELEGRAM}</p>
        <div className="mt-2 border-t-2 border-form" />

        <div className="relative mt-6">
          <p className="form-label">{pick(invite.event.title)}</p>
          <h1 className="tape mt-2 text-display" style={{ '--tilt': '-0.6deg' } as CSSProperties}>
            <Typed text={names} start={300} />
          </h1>

          <Postmark
            city={pick(invite.venue.city)}
            dayMonth={date.numeric.slice(0, 5)}
            year={date.year}
            className="pointer-events-none absolute -top-10 -right-3 size-24 rotate-[12deg] opacity-80"
          />
        </div>

        <p className="form-label mt-8">{date.weekday}</p>
        <p className="tape mt-1 text-md font-bold" style={{ '--tilt': '0.3deg' } as CSSProperties}>
          <Typed text={`${date.full}, ${date.time}`} start={1100} />
        </p>

        <p className="tape mt-8" style={{ '--tilt': '-0.3deg' } as CSSProperties}>
          <Typed text={pick(invite.event.invitation)} start={2300} caret />
        </p>
      </Blank>
    </section>
  );
}
