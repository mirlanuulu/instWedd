import { invite } from '@/config/invite';
import { dictionaries } from '@/locales';
import type { RsvpPayload } from './rsvp';

const DEFAULT_API = 'https://api.telegram.org';
const TIMEOUT = 8_000;

/** Гость пишет что угодно, а сообщение уходит в HTML-разметке Telegram. */
function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Текст сообщения для пары. Подписи на основном языке приглашения,
 * а имя и пожелание гостя остаются как он их написал.
 */
export function formatRsvpMessage(rsvp: RsvpPayload): string {
  const locale = invite.languages.default;
  const t = dictionaries[locale];
  const [first, second] = invite.couple;

  const lines = [
    `${rsvp.attending ? '✅' : '❌'} <b>${escapeHtml(rsvp.name)}</b> — ${rsvp.attending ? t.telegram.yes : t.telegram.no}`,
  ];
  if (rsvp.attending) lines.push(`${t.telegram.guests}: ${rsvp.guests}`);
  if (rsvp.wish) lines.push(`${t.telegram.wish}: ${escapeHtml(rsvp.wish)}`);

  // Подпись с именами пары: один бот может обслуживать несколько приглашений.
  lines.push(
    '',
    `<i>${escapeHtml(first.name[locale])} ${t.hero.and} ${escapeHtml(second.name[locale])} · ${t.telegram.language}: ${dictionaries[rsvp.locale].langName}</i>`,
  );
  return lines.join('\n');
}

export interface TelegramTarget {
  token: string;
  chatId: string;
}

/** Куда отправлять. null, если бот не настроен. */
export function telegramTarget(): TelegramTarget | null {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  // Переменная окружения важнее конфига: так chat_id можно не хранить в репозитории.
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim() || invite.rsvp.telegramChatId.trim();
  return token && chatId ? { token, chatId } : null;
}

/**
 * Отправляет сообщение через Bot API. Бросает ошибку с описанием от Telegram.
 * Токен стоит в адресе запроса, поэтому адрес в ошибки и логи не попадает.
 */
export async function sendTelegramMessage({ token, chatId }: TelegramTarget, text: string): Promise<void> {
  const base = process.env.TELEGRAM_API_BASE?.trim() || DEFAULT_API;

  let response: Response;
  try {
    response = await fetch(`${base}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        link_preview_options: { is_disabled: true },
      }),
      signal: AbortSignal.timeout(TIMEOUT),
    });
  } catch (cause) {
    const reason = cause instanceof Error ? cause.name : 'unknown';
    throw new Error(`Telegram не ответил (${reason})`);
  }

  const result = (await response.json().catch(() => null)) as { ok?: boolean; description?: string } | null;
  if (!response.ok || !result?.ok) {
    throw new Error(`Telegram отклонил сообщение: ${response.status} ${result?.description ?? ''}`.trim());
  }
}
