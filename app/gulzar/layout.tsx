import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { invite } from '@/config/invite';
import { InviteProvider } from '@/components/providers/InviteProvider';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { gulzarFontVariables } from '@/designs/gulzar/fonts';
import { gulzarMeta } from '@/designs/gulzar/meta';
import { inviteMetadata } from '@/lib/metadata';
import '@/designs/gulzar/gulzar.css';

/*
 * Корневой layout версии «Гүлзар». Свой <html>: шрифты, CSS и цвет панели
 * браузера не смешиваются с классикой. Контент — тот же заказ из /config/invite.ts.
 */

export const metadata: Metadata = inviteMetadata(invite);

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: gulzarMeta.paper,
  colorScheme: 'light',
};

export default function GulzarLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={invite.languages.default} className={gulzarFontVariables}>
      <body>
        <InviteProvider invite={invite}>
          <LocaleProvider>{children}</LocaleProvider>
        </InviteProvider>
      </body>
    </html>
  );
}
