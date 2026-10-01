import type { Metadata } from 'next';
import type { InviteConfig } from '@/config/types';
import { dictionaries } from '@/locales';

// Адрес сайта нужен, чтобы ссылка на картинку-превью была абсолютной.
// SITE_URL — для своего домена; на Vercel адрес проекта подставляется сам.
const siteUrl =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

/**
 * Заголовок, описание и превью ссылки. Одинаковые во всех стилях:
 * картинку-превью каждый стиль рисует свою (opengraph-image рядом с layout).
 */
export function inviteMetadata(invite: InviteConfig): Metadata {
  const locale = invite.languages.default;
  const [first, second] = invite.couple;
  const title = dictionaries[locale].meta.title(first.name[locale], second.name[locale]);
  const description = invite.event.invitation[locale];

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    openGraph: { type: 'website', title, description, locale },
    // Приглашение личное: в поиске ему делать нечего.
    robots: { index: false, follow: false },
  };
}
