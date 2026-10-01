import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { invite } from '@/config/invite';
import { InviteProvider } from '@/components/providers/InviteProvider';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { typewriterFontVariables } from '@/designs/typewriter/fonts';
import { typewriterMeta } from '@/designs/typewriter/meta';
import { inviteMetadata } from '@/lib/metadata';
import '@/designs/typewriter/typewriter.css';

/*
 * Корневой layout стиля «Машинопись». Свой <html>: шрифты, CSS и цвет панели
 * браузера не смешиваются с классикой. Контент — тот же заказ из /config/invite.ts.
 */

export const metadata: Metadata = inviteMetadata(invite);

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: typewriterMeta.paper,
  colorScheme: 'light',
};

export default function TypewriterLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={invite.languages.default} className={typewriterFontVariables}>
      <body>
        <InviteProvider invite={invite}>
          <LocaleProvider>{children}</LocaleProvider>
        </InviteProvider>
      </body>
    </html>
  );
}
