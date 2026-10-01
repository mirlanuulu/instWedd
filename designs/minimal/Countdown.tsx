'use client';

import { useRef } from 'react';
import { twoDigits, useCountdown } from '@/lib/useCountdown';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { RollNumber } from '@/designs/shared/reveal';
import { Heading, Section, Sheet } from './Sheet';

/**
 * Дни — крупно тонкой антиквой, часы, минуты и секунды — мелкой колонкой рядом.
 * Главное число одно, остальное подробности.
 */
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
    <Section labelledBy="countdown-title" className="pt-24 pb-16">
      <Sheet>
        <div ref={root}>
          <Heading id="countdown-title">{started ? t.countdown.started : t.countdown.title}</Heading>

          {!started && (
            <dl
              role="timer"
              aria-live="off"
              className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-8 border-t border-rule pt-6"
            >
              {/* В разметке подпись идёт раньше числа, как требует dl; на экране — под числом или справа от него. */}
              <div className="row-span-3 flex flex-col-reverse self-stretch justify-start">
                <dt className="label mt-3 text-muted">{t.countdown.days(left?.days ?? 0)}</dt>
                <dd className="figures font-display text-display font-extralight">
                  <RollNumber value={left ? String(left.days) : '—'} />
                </dd>
              </div>

              {rest.map((unit) => (
                <div key={unit.key} className="flex flex-row-reverse items-baseline justify-end gap-2 py-1">
                  <dt className="w-16 text-muted">{unit.label}</dt>
                  <dd className="figures w-6 text-right font-medium">
                    <RollNumber value={unit.value} />
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </Sheet>
    </Section>
  );
}
