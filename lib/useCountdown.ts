'use client';

import { useEffect, useState, type RefObject } from 'react';
import type { EventInfo } from '@/config/types';
import { eventStart } from './invite';
import { useInView } from './useInView';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function split(msLeft: number): TimeLeft {
  return {
    days: Math.floor(msLeft / DAY),
    hours: Math.floor((msLeft % DAY) / HOUR),
    minutes: Math.floor((msLeft % HOUR) / MINUTE),
    seconds: Math.floor((msLeft % MINUTE) / SECOND),
  };
}

export const twoDigits = (value: number) => String(value).padStart(2, '0');

/**
 * Обратный отсчёт до начала события. Логика общая для всех стилей,
 * вёрстка у каждого своя.
 *
 * Тик привязан к границе секунды и идёт, только пока root на экране.
 * На сервере «сейчас» неизвестно: до гидрации left равен null.
 */
export function useCountdown(event: EventInfo, root: RefObject<Element | null>) {
  const target = eventStart(event).getTime();
  const inView = useInView(root);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (current < target) timer = setTimeout(tick, SECOND - (current % SECOND));
    };
    tick();
    return () => clearTimeout(timer);
  }, [inView, target]);

  return {
    started: now !== null && now >= target,
    left: now === null ? null : split(Math.max(0, target - now)),
  };
}
