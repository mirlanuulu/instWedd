import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { invite } from '@/config/invite';
import { InviteProvider } from '@/components/providers/InviteProvider';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { minimalFontVariables } from '@/designs/minimal/fonts';
import { minimalMeta } from '@/designs/minimal/meta';
import { inviteMetadata } from '@/lib/metadata';
import '@/designs/minimal/minimal.css';

/*
 * Корневой layout стиля «Минимализм». Свой <html>: шрифты, CSS и цвет панели
 * браузера не смешиваются с классикой. Контент — тот же заказ из /config/invite.ts.
 */

export const metadata: Metadata = inviteMetadata(invite);

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: minimalMeta.paper,
  colorScheme: 'light',
};

export default function MinimalLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={invite.languages.default} className={minimalFontVariables}>
      <body>
        <InviteProvider invite={invite}>
          <LocaleProvider>{children}</LocaleProvider>
        </InviteProvider>
      </body>
    </html>
  );
}
