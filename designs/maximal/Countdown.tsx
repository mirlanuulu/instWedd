'use client';

import { useRef } from 'react';
import { twoDigits, useCountdown } from '@/lib/useCountdown';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { delay, RollNumber } from '@/designs/shared/reveal';
import { Section } from './parts';

/** Таймер — золотые шары на малиновой полосе. Выпрыгивают по очереди, цифры крутятся, как табло. */
export function Countdown() {
  const { event } = useInvite();
  const { t } = useLocale();
  const root = useRef<HTMLDivElement>(null);
  // До гидрации left === null: вместо цифр прочерки.
  const { started, left } = useCountdown(event, root);

  const units = [
    { key: 'days', value: left ? String(left.days) : '—', label: t.countdown.days(left?.days ?? 0) },
    { key: 'hours', value: left ? twoDigits(left.hours) : '—', label: t.countdown.hours(left?.hours ?? 0) },
    { key: 'minutes', value: left ? twoDigits(left.minutes) : '—', label: t.countdown.minutes(left?.minutes ?? 0) },
    { key: 'seconds', value: left ? twoDigits(left.seconds) : '—', label: t.countdown.seconds(left?.seconds ?? 0) },
  ];

  return (
    <Section labelledBy="countdown-title" title={started ? t.countdown.started : t.countdown.title} band="magenta">
      <div ref={root}>
        {!started && (
          <dl role="timer" aria-live="off" className="mt-8 grid grid-cols-2 gap-4">
            {units.map((unit, index) => (
              // В разметке подпись идёт раньше числа, как требует dl; на экране — под ним.
              <div
                key={unit.key}
                data-reveal="pop"
                style={delay(index * 120)}
                className="mx-auto flex aspect-square w-full max-w-40 flex-col-reverse items-center justify-center rounded-pill border-4 border-gold-2 bg-gold text-ink shadow-[0.4rem_0.4rem_0_var(--color-magenta-2)]"
              >
                <dt className="label">{unit.label}</dt>
                <dd className="font-display text-[clamp(2.5rem,13vw,3.5rem)] leading-none tabular-nums">
                  <RollNumber value={unit.value} />
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </Section>
  );
}
