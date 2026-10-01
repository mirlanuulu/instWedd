'use client';

import { useEffect, useRef } from 'react';
import { twoDigits, useCountdown } from '@/lib/useCountdown';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Section, SectionHeading } from '@/components/ui/Section';
import styles from './Countdown.module.css';

/**
 * Одна цифра. Помнит прежнее значение: в том рендере, где цифра сменилась,
 * старая ещё раз показывается поверх и уезжает, а новая въезжает на её место.
 */
function Digit({ char }: { char: string }) {
  const previous = useRef(char);
  const leaving = previous.current === char ? null : previous.current;

  useEffect(() => {
    previous.current = char;
  }, [char]);

  return (
    <span className={styles.slot}>
      {leaving !== null && (
        <span key={`out-${leaving}`} className={styles.out}>
          {leaving}
        </span>
      )}
      <span key={`in-${char}`} className={styles.in}>
        {char}
      </span>
    </span>
  );
}

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
    <Section surface="alt" className="py-12" labelledBy="countdown-title">
      <div ref={root}>
        <SectionHeading id="countdown-title" align="center">
          {started ? t.countdown.started : t.countdown.title}
        </SectionHeading>

        {!started && (
          <dl role="timer" aria-live="off" className="mt-8 grid grid-cols-4 divide-x divide-rule">
            {units.map((unit) => (
              <div key={unit.key} className="flex min-w-0 flex-col-reverse items-center px-1">
                <dt className="mt-2 text-xs tracking-[0.06em] text-muted">{unit.label}</dt>
                <dd className="font-display text-xl text-accent lining-nums tabular-nums">
                  {/* Скринридеру — число целиком, глазам — цифры по окошкам. */}
                  <span data-countdown-value className="sr-only">
                    {unit.value}
                  </span>
                  <span aria-hidden="true">
                    {Array.from(unit.value).map((char, index) => (
                      <Digit key={index} char={char} />
                    ))}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </Section>
  );
}
