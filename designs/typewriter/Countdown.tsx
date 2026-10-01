'use client';

import { useRef } from 'react';
import { twoDigits, useCountdown } from '@/lib/useCountdown';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { delay, RollNumber } from '@/designs/shared/reveal';
import { Section } from './parts';

/** Таймер — четыре ленты с цифрами, как счётчик на телеграфе. Цифры крутятся, как табло. */
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
    <Section labelledBy="countdown-title" title={started ? t.countdown.started : t.countdown.title}>
      <div ref={root}>
        {!started && (
          <dl role="timer" aria-live="off" className="mt-6 grid grid-cols-2 gap-3">
            {units.map((unit, index) => (
              // В разметке подпись идёт раньше числа, как требует dl; на экране — под ним.
              <div
                key={unit.key}
                data-reveal="pop"
                style={{ ...delay(index * 100), rotate: index % 2 ? '0.8deg' : '-0.8deg' }}
                className="flex flex-col-reverse bg-strip px-4 py-3 shadow-[0_1px_2px_color-mix(in_oklch,var(--color-ink)_20%,transparent)]"
              >
                <dt className="form-label mt-1">{unit.label}</dt>
                <dd className={`text-display font-bold tabular-nums ${index === 0 ? 'text-accent' : ''}`}>
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
