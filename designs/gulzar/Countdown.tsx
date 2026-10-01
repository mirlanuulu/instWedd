'use client';

import { useRef } from 'react';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { twoDigits, useCountdown } from '@/lib/useCountdown';
import { GardenSection } from './GardenSection';

export function Countdown() {
  const { event } = useInvite();
  const { t } = useLocale();
  const root = useRef<HTMLDivElement>(null);
  // До гидрации left === null: вместо цифр прочерки.
  const { started, left } = useCountdown(event, root);

  const units = [
    { value: left?.days, label: t.countdown.days },
    { value: left?.hours, label: t.countdown.hours },
    { value: left?.minutes, label: t.countdown.minutes },
    { value: left?.seconds, label: t.countdown.seconds },
  ];

  return (
    <GardenSection id="countdown" flower="headWild" title={t.countdown.title}>
      <div ref={root} className="g-countdown" role="timer" aria-live="off">
        {started ? (
          <p className="g-countdown-started">{t.countdown.started}</p>
        ) : (
          units.map(({ value, label }, i) => (
            <div key={i} className="g-countdown-unit">
              <span className="g-countdown-value">{value === undefined ? '—' : twoDigits(value)}</span>
              <span className="g-countdown-label">{label(value ?? 0)}</span>
            </div>
          ))
        )}
      </div>
    </GardenSection>
  );
}
