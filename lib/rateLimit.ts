const WINDOW = 10 * 60_000;
const LIMIT = 5;
const MAX_KEYS = 5_000;

const hits = new Map<string, number[]>();

/**
 * Не больше LIMIT ответов с одного адреса за WINDOW.
 *
 * Счётчик живёт в памяти процесса. На Vercel у каждого экземпляра функции
 * память своя, поэтому это защита от случайного и грубого спама в чат пары,
 * а не строгий лимит.
 */
export function allowRequest(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW);
  if (recent.length >= LIMIT) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);

  // Чтобы карта не росла бесконечно, когда адресов очень много.
  if (hits.size > MAX_KEYS) {
    for (const [stored, times] of hits) {
      if (times.every((time) => now - time >= WINDOW)) hits.delete(stored);
    }
  }
  return true;
}
