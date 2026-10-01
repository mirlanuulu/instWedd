import type { EventInfo, Venue } from '@/config/types';
import type { Dictionary } from '@/locales';

/** Момент начала события. Не зависит от часового пояса гостя. */
export function eventStart(event: EventInfo): Date {
  return new Date(`${event.date}T${event.time}:00${event.utcOffset}`);
}

/**
 * Дата события словами. Части берутся прямо из строки конфига, поэтому
 * гость из другого пояса увидит ту же дату, что и на месте события.
 */
export function formatEventDate(event: EventInfo, t: Dictionary) {
  const [year = 0, month = 1, day = 1] = event.date.split('-').map(Number);
  const weekdayIndex = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

  return {
    day,
    month,
    year,
    /** "29.11.2026" — читается одинаково на обоих языках. */
    numeric: [day, month].map((part) => String(part).padStart(2, '0')).join('.') + `.${year}`,
    full: t.date.full(day, month - 1, year),
    weekday: t.date.weekdays[weekdayIndex] ?? '',
    time: t.date.time(event.time),
  };
}

/** Порядок дней в шапке календаря: с понедельника. Числа — индексы Date.getDay(). */
export const WEEK_FROM_MONDAY = [1, 2, 3, 4, 5, 6, 0] as const;

/**
 * Месяц события сеткой для календаря: недели с понедельника,
 * пустые клетки до первого и после последнего числа — null.
 */
export function monthGrid(event: EventInfo) {
  const [year = 0, month = 1, day = 1] = event.date.split('-').map(Number);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  // getUTCDay: воскресенье = 0. Сдвиг, чтобы неделя начиналась с понедельника.
  const lead = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;

  const cells: Array<number | null> = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: Array<Array<number | null>> = [];
  for (let start = 0; start < cells.length; start += 7) weeks.push(cells.slice(start, start + 7));

  return { year, monthIndex: month - 1, day, weeks };
}

export function mapLinks(venue: Venue) {
  const { lat, lng } = venue.coords;
  return {
    twoGis: venue.links.twoGis,
    googleMaps:
      venue.links.googleMaps ?? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
  };
}
