import { allowRequest } from '@/lib/rateLimit';
import { parseRsvp } from '@/lib/rsvp';
import { formatRsvpMessage, sendTelegramMessage, telegramTarget } from '@/lib/telegram';

/** Ответ гостя — несколько коротких полей. Всё, что заметно больше, не форма. */
const MAX_BODY = 4_096;

type Failure = 'forbidden' | 'too_large' | 'invalid' | 'rate_limited' | 'not_configured' | 'delivery_failed';

function fail(error: Failure, status: number) {
  return Response.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  // Форму отправляет только сама страница приглашения, а не чужой сайт.
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (origin && host && URL.canParse(origin) && new URL(origin).host !== host) {
    return fail('forbidden', 403);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY) return fail('too_large', 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail('invalid', 400);
  }

  // Поле-ловушка скрыто от людей. Заполнил — значит бот: отвечаем «принято» и ничего не шлём.
  if (typeof body === 'object' && body !== null && 'trap' in body && body.trap) {
    return Response.json({ ok: true });
  }

  const rsvp = parseRsvp(body);
  if (!rsvp) return fail('invalid', 400);

  const address = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!allowRequest(address)) return fail('rate_limited', 429);

  const target = telegramTarget(rsvp.side);
  if (!target) {
    console.error('[rsvp] Бот не настроен: нужен TELEGRAM_BOT_TOKEN и chat_id (TELEGRAM_CHAT_ID или rsvp.telegramChatId в конфиге).');
    return fail('not_configured', 503);
  }

  try {
    await sendTelegramMessage(target, formatRsvpMessage(rsvp));
  } catch (error) {
    console.error('[rsvp]', error instanceof Error ? error.message : error);
    return fail('delivery_failed', 502);
  }

  return Response.json({ ok: true });
}
