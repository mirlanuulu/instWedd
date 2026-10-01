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

export function mapLinks(venue: Venue) {
  const { lat, lng } = venue.coords;
  return {
    twoGis: venue.links.twoGis,
    googleMaps:
      venue.links.googleMaps ?? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
  };
}
