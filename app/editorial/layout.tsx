import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { invite } from '@/config/invite';
import { InviteProvider } from '@/components/providers/InviteProvider';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { editorialFontVariables } from '@/designs/editorial/fonts';
import { editorialMeta } from '@/designs/editorial/meta';
import { inviteMetadata } from '@/lib/metadata';
import '@/designs/editorial/editorial.css';

/*
 * Корневой layout стиля «Эдиториал». Свой <html>: шрифты, CSS и цвет панели
 * браузера не смешиваются с классикой. Контент — тот же заказ из /config/invite.ts.
 */

export const metadata: Metadata = inviteMetadata(invite);

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: editorialMeta.paper,
  colorScheme: 'light',
};

export default function EditorialLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={invite.languages.default} className={editorialFontVariables}>
      <body>
        <InviteProvider invite={invite}>
          <LocaleProvider>{children}</LocaleProvider>
        </InviteProvider>
      </body>
    </html>
  );
}
