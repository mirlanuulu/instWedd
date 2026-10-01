'use client';

import type { CSSProperties } from 'react';
import { formatEventDate } from '@/lib/invite';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { delay, Letters } from '@/designs/shared/reveal';
import { DateBadge, Marquee, Stage, Stars } from './parts';

/**
 * Первый экран — сцена после занавеса: изумруд, мерцающие звёзды, имена
 * золотой дидоной с малиновой тенью, вращающийся значок с датой, внизу
 * бегущая строка.
 */
export function Hero() {
  const invite = useInvite();
  const { t, pick } = useLocale();
  const [first, second] = invite.couple;
  const firstName = pick(first.name);
  const secondName = pick(second.name);
  const date = formatEventDate(invite.event, t);
  const nameChars = Math.max(Array.from(firstName).length, Array.from(secondName).length);
  const ring = `${pick(invite.event.title)} ✦ ${date.numeric} ✦ `.toUpperCase();

  return (
    <section className="band band-emerald flex min-h-svh flex-col overflow-hidden">
      <Stars />
      <Stage className="relative flex flex-1 flex-col pt-[max(1rem,env(safe-area-inset-top))] pb-10 @container">
        {/* Высота строки — как у переключателя языка: название стоит с ним на одной линии. */}
        <p className="label flex min-h-11 items-center text-gold">{pick(invite.event.title)}</p>

        <h1
          className="neon my-auto pt-10 pb-6 text-[length:min(var(--text-display),100cqi/(var(--chars)*0.62))] leading-[0.95]"
          style={{ '--chars': nameChars } as CSSProperties}
        >
          <span className="block">
            <Letters text={firstName} start={200} />
          </span>{' '}
          <span
            data-reveal="pop"
            style={delay(700)}
            className="my-2 block font-body text-md font-semibold tracking-[0.2em] text-paper uppercase [text-shadow:none]"
          >
            {t.hero.and}
          </span>{' '}
          <span className="block text-right">
            <Letters text={secondName} start={800} />
          </span>
        </h1>

        <div data-reveal="up" style={delay(1200)} className="flex items-center gap-5">
          <DateBadge ring={ring} day={String(date.day)} month={t.date.monthYear(date.month - 1, date.year).split(' ')[0] ?? ''} />
          <div>
            <p className="font-display text-md text-gold">{date.weekday}</p>
            <p className="mt-1 text-on-2">{date.time}</p>
            <p className="mt-1 text-on-2">{pick(invite.venue.name)}</p>
          </div>
        </div>

        <p data-reveal="up" style={delay(1400)} className="mt-6 max-w-[45ch] text-md leading-snug">
          {pick(invite.event.invitation)}
        </p>
      </Stage>

      {/* Отступ снизу: фестоны следующей полосы не должны наезжать на бегущую строку. */}
      <div className="pb-5">
        <Marquee items={[firstName, secondName, date.numeric, pick(invite.event.title)]} />
      </div>
    </section>
  );
}
