import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { invite } from '@/config/invite';
import { themeMeta } from '@/config/themes';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { fontVariables } from '@/lib/fonts';
import { needsExtendedScript } from '@/lib/names';
import { dictionaries } from '@/locales';
import './globals.css';

const defaultLocale = invite.languages.default;
const [first, second] = invite.couple;

const title = dictionaries[defaultLocale].meta.title(first.name[defaultLocale], second.name[defaultLocale]);
const description = invite.event.invitation[defaultLocale];

// Адрес сайта нужен, чтобы ссылка на картинку-превью была абсолютной.
// SITE_URL — для своего домена; на Vercel адрес проекта подставляется сам.
const siteUrl =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: { type: 'website', title, description, locale: defaultLocale },
  // Приглашение личное: в поиске ему делать нечего.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: themeMeta[invite.theme].themeColor,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={defaultLocale}
      data-theme={invite.theme}
      data-script={needsExtendedScript(invite.couple) ? 'extended' : undefined}
      className={fontVariables}
    >
      <body>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
