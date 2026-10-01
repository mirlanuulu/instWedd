'use client';

import { formatEventDate } from '@/lib/invite';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { delay, Letters } from '@/designs/shared/reveal';
import { Poster } from './Poster';

const twoDigits = (value: number) => String(value).padStart(2, '0');

/**
 * Первый экран — плакат: число и месяц огромным гротеском по модульной сетке,
 * рядом мелкой колонкой год, день недели и время, внизу имена.
 *
 * Открытие: прочерчивается сетка, цифры выезжают снизу из-под кромки,
 * буквы имён вылетают по одной.
 */
export function Hero() {
  const invite = useInvite();
  const { t, pick } = useLocale();
  const [first, second] = invite.couple;
  const date = formatEventDate(invite.event, t);

  return (
    <section className="flex min-h-svh flex-col">
      <Poster className="flex flex-1 flex-col pt-[max(1rem,env(safe-area-inset-top))] pb-10">
        {/* Высота строки — как у переключателя языка: название стоит с ним на одной линии. */}
        <p className="label flex min-h-11 items-center">{pick(invite.event.title)}</p>

        <div data-reveal="lines" className="grid-lines mt-3 border-t-2 border-ink pt-4 @container">
          <time
            dateTime={`${invite.event.date}T${invite.event.time}${invite.event.utcOffset}`}
            className="grid grid-cols-[auto_minmax(0,1fr)] items-end gap-x-[4cqi] gap-y-[3cqi]"
          >
            <span data-reveal="mask" style={delay(150)} className="numerals text-accent">
              <span>{twoDigits(date.day)}</span>
            </span>
            <span data-reveal="up" style={delay(500)} className="label pb-[1cqi]">
              {date.weekday}
            </span>
            <span data-reveal="mask" style={delay(300)} className="numerals">
              <span>{twoDigits(date.month)}</span>
            </span>
            <span data-reveal="up" style={delay(650)} className="label pb-[1cqi]">
              {date.year}
              <br />
              {date.time}
            </span>
          </time>
        </div>

        <h1 className="mt-auto pt-12 text-display">
          <span className="block">
            <Letters text={pick(first.name)} start={700} />
          </span>{' '}
          <span data-reveal="up" style={delay(1000)} className="block text-md font-bold tracking-normal text-accent">
            {t.hero.and}
          </span>{' '}
          <span className="block">
            <Letters text={pick(second.name)} start={1100} />
          </span>
        </h1>

        <p data-reveal="up" style={delay(1400)} className="mt-6 max-w-[45ch] border-t-2 border-ink pt-3 text-ink-2">{pick(invite.event.invitation)}</p>
      </Poster>
    </section>
  );
}
