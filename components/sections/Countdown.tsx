'use client';

import { useEffect, useRef, useState } from 'react';
import { invite } from '@/config/invite';
import { eventStart } from '@/lib/invite';
import { useInView } from '@/lib/useInView';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Section, SectionHeading } from '@/components/ui/Section';
import styles from './Countdown.module.css';

const TARGET = eventStart(invite.event).getTime();

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function split(msLeft: number) {
  return {
    days: Math.floor(msLeft / DAY),
    hours: Math.floor((msLeft % DAY) / HOUR),
    minutes: Math.floor((msLeft % HOUR) / MINUTE),
    seconds: Math.floor((msLeft % MINUTE) / SECOND),
  };
}

const twoDigits = (value: number) => String(value).padStart(2, '0');

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
  const { t } = useLocale();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root);
  // На сервере «сейчас» неизвестно: до гидрации вместо цифр прочерки.
  const [now, setNow] = useState<number | null>(null);

  // Тик привязан к границе секунды и идёт, только пока таймер на экране.
  useEffect(() => {
    if (!inView) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (current < TARGET) timer = setTimeout(tick, SECOND - (current % SECOND));
    };
    tick();
    return () => clearTimeout(timer);
  }, [inView]);

  const started = now !== null && now >= TARGET;
  const left = now === null ? null : split(Math.max(0, TARGET - now));

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
