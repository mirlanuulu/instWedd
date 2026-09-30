import { invite } from '@/config/invite';
import { LOCALES, type Locale } from '@/config/types';

export const RSVP_LIMITS = {
  name: 80,
  wish: 500,
} as const;

export interface RsvpPayload {
  name: string;
  attending: boolean;
  /** Сколько человек придёт, считая отвечающего. При отказе 0. */
  guests: number;
  wish: string;
  /** Язык, на котором гость заполнял форму. */
  locale: Locale;
}

/**
 * Проверка ответа гостя. Работает и в форме, и на сервере:
 * сервер не доверяет тому, что пришло из браузера.
 */
export function parseRsvp(input: unknown): RsvpPayload | null {
  if (typeof input !== 'object' || input === null) return null;
  const data = input as Record<string, unknown>;

  const name = typeof data.name === 'string' ? data.name.trim() : '';
  if (!name || name.length > RSVP_LIMITS.name) return null;

  if (typeof data.attending !== 'boolean') return null;

  const wish = typeof data.wish === 'string' ? data.wish.trim() : '';
  if (wish.length > RSVP_LIMITS.wish) return null;

  const locale = LOCALES.find((code) => code === data.locale);
  if (!locale) return null;

  let guests = 0;
  if (data.attending) {
    if (typeof data.guests !== 'number' || !Number.isInteger(data.guests)) return null;
    if (data.guests < 1 || data.guests > invite.rsvp.maxGuests) return null;
    guests = data.guests;
  }

  return { name, attending: data.attending, guests, wish, locale };
}
