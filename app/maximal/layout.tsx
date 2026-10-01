import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { invite } from '@/config/invite';
import { InviteProvider } from '@/components/providers/InviteProvider';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { maximalFontVariables } from '@/designs/maximal/fonts';
import { maximalMeta } from '@/designs/maximal/meta';
import { inviteMetadata } from '@/lib/metadata';
import '@/designs/maximal/maximal.css';

/*
 * Корневой layout стиля «Максимализм». Свой <html>: шрифты, CSS и цвет панели
 * браузера не смешиваются с классикой. Контент — тот же заказ из /config/invite.ts.
 */

export const metadata: Metadata = inviteMetadata(invite);

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: maximalMeta.deep,
  colorScheme: 'dark',
};

export default function MaximalLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={invite.languages.default} className={maximalFontVariables}>
      <body>
        <InviteProvider invite={invite}>
          <LocaleProvider>{children}</LocaleProvider>
        </InviteProvider>
      </body>
    </html>
  );
}
