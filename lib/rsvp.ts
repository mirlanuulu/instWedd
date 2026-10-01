import { invite } from '@/config/invite';
import { LOCALES, SIDES, type Locale, type Side } from '@/config/types';

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
  /** Чей гость. null, если в заказе стороны не спрашиваются. */
  side: Side | null;
  /** Сколько цветов гость собрал в букет (версии с букетом). */
  flowers?: number;
}

/** Больше цветов в букете ни в одной версии нет. */
const MAX_FLOWERS = 12;

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

  let side: Side | null = null;
  if (invite.rsvp.sides.ask) {
    side = SIDES.find((code) => code === data.side) ?? null;
    if (!side) return null;
  }

  let flowers: number | undefined;
  if (data.flowers !== undefined) {
    if (typeof data.flowers !== 'number' || !Number.isInteger(data.flowers)) return null;
    if (data.flowers < 0 || data.flowers > MAX_FLOWERS) return null;
    flowers = data.flowers;
  }

  return { name, attending: data.attending, guests, wish, locale, side, ...(flowers !== undefined && { flowers }) };
}
