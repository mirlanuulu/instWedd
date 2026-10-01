'use client';

import { useEffect, useRef, useState } from 'react';
import { formatEventDate, monthGrid, WEEK_FROM_MONDAY } from '@/lib/invite';
import { useInView } from '@/lib/useInView';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Heading, Section, Sheet } from './Sheet';

/**
 * Петля вокруг числа, как обводят дату ручкой. Не идеальный круг: конец
 * заходит за начало. Без JavaScript она нарисована сразу; если при загрузке
 * календарь ещё не на экране, петля прячется и дорисовывается, когда он появится.
 */
function DateRing() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, '0px 0px -20% 0px');
  const [armed, setArmed] = useState(false);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (drawn) return;
    if (inView) {
      // Кадр с переходом нужен, чтобы браузер увидел спрятанную петлю до того, как её рисовать.
      const frame = requestAnimationFrame(() => {
        setArmed(false);
        setDrawn(true);
      });
      return () => cancelAnimationFrame(frame);
    }
    setArmed(true);
  }, [inView, drawn]);

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox="0 0 48 44"
      data-armed={armed ? '' : undefined}
      className="date-ring pointer-events-none absolute top-1/2 left-1/2 h-11 w-12 -translate-x-1/2 -translate-y-1/2 overflow-visible text-ink"
      fill="none"
      stroke="currentColor"
    >
      <path
        pathLength={1}
        strokeWidth="1"
        strokeLinecap="round"
        d="M36.5 6.5C30 1.8 17.5 1.6 10 7.6 2.6 13.5 2.4 28 9.6 35.6c7.3 7.6 21.6 7.4 29-.5 7.3-7.8 6.4-21.4-1.8-27.9-3.3-2.6-7.6-3.8-11.6-3.6"
      />
    </svg>
  );
}

/** Месяц события сеткой, день тоя обведён. Таблица: скринридер читает её как календарь. */
export function Calendar() {
  const invite = useInvite();
  const { t, pick } = useLocale();
  const { monthIndex, year, day, weeks } = monthGrid(invite.event);
  const date = formatEventDate(invite.event, t);
  const caption = t.date.monthYear(monthIndex, year);

  return (
    <Section labelledBy="calendar-title" className="pt-8 pb-16">
      <Sheet>
        <Heading id="calendar-title">{t.calendar.title}</Heading>

        <div className="mt-8 border-t border-rule pt-6">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-display text-md">{caption}</p>
            <p className="figures text-muted">{date.time}</p>
          </div>

          <table className="figures mt-6 w-full table-fixed border-collapse text-center">
            <caption className="sr-only">{caption}</caption>
            <thead>
              <tr>
                {WEEK_FROM_MONDAY.map((weekday) => (
                  <th key={weekday} scope="col" abbr={t.date.weekdays[weekday]} className="label pb-3 font-medium text-muted">
                    {t.date.weekdaysShort[weekday]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, row) => (
                <tr key={row}>
                  {week.map((number, column) =>
                    number === day ? (
                      <td key={column} className="relative h-11 font-medium text-ink">
                        {number}
                        <span className="sr-only">, {pick(invite.event.title)}</span>
                        <DateRing />
                      </td>
                    ) : (
                      <td key={column} className="h-11 text-ink-2">
                        {number ?? ''}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Sheet>
    </Section>
  );
}
