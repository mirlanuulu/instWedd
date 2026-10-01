'use client';

import { useRef } from 'react';
import { twoDigits, useCountdown } from '@/lib/useCountdown';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Section } from './Page';

/** Таймер как цифра номера: дни — огромной дидоной, остальное — строкой под линейкой. */
export function Countdown() {
  const { event } = useInvite();
  const { t } = useLocale();
  const root = useRef<HTMLDivElement>(null);
  // До гидрации left === null: вместо цифр прочерки.
  const { started, left } = useCountdown(event, root);

  const rest = [
    { key: 'hours', value: left ? twoDigits(left.hours) : '—', label: t.countdown.hours(left?.hours ?? 0) },
    { key: 'minutes', value: left ? twoDigits(left.minutes) : '—', label: t.countdown.minutes(left?.minutes ?? 0) },
    { key: 'seconds', value: left ? twoDigits(left.seconds) : '—', label: t.countdown.seconds(left?.seconds ?? 0) },
  ];

  return (
    <Section labelledBy="countdown-title" title={started ? t.countdown.started : t.countdown.title}>
      <div ref={root}>
        {!started && (
          <dl role="timer" aria-live="off" className="mt-6">
            {/* В разметке подпись идёт раньше числа, как требует dl; на экране — после него. */}
            <div className="flex flex-row-reverse items-baseline justify-end gap-3">
              <dt className="caps text-muted">{t.countdown.days(left?.days ?? 0)}</dt>
              <dd className="figures font-display text-display leading-none font-black">{left ? left.days : '—'}</dd>
            </div>
            <div className="mt-6 grid grid-cols-3 divide-x divide-rule border-t border-ink">
              {rest.map((unit) => (
                <div key={unit.key} className="flex flex-col-reverse px-3 pt-3 first:pl-0">
                  <dt className="caps text-muted">{unit.label}</dt>
                  <dd className="figures font-display text-md font-semibold">{unit.value}</dd>
                </div>
              ))}
            </div>
          </dl>
        )}
      </div>
    </Section>
  );
}
