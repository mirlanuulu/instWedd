import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { invite } from '@/config/invite';
import { InviteProvider } from '@/components/providers/InviteProvider';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { groteskFontVariables } from '@/designs/grotesk/fonts';
import { groteskMeta } from '@/designs/grotesk/meta';
import { inviteMetadata } from '@/lib/metadata';
import '@/designs/grotesk/grotesk.css';

/*
 * Корневой layout стиля «Гротеск». Свой <html>: шрифты, CSS и цвет панели
 * браузера не смешиваются с классикой. Контент — тот же заказ из /config/invite.ts.
 */

export const metadata: Metadata = inviteMetadata(invite);

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: groteskMeta.paper,
  colorScheme: 'light',
};

export default function GroteskLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={invite.languages.default} className={groteskFontVariables}>
      <body>
        <InviteProvider invite={invite}>
          <LocaleProvider>{children}</LocaleProvider>
        </InviteProvider>
      </body>
    </html>
  );
}
