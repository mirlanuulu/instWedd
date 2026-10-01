import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { invite } from '@/config/invite';
import { themeMeta } from '@/config/themes';
import { InviteProvider } from '@/components/providers/InviteProvider';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { fontVariables } from '@/lib/fonts';
import { inviteMetadata } from '@/lib/metadata';
import { needsExtendedScript } from '@/lib/names';
import './globals.css';

/*
 * Корневой layout классической версии (конверт, темы romantic и national).
 * У каждого стиля свой корневой layout: свои шрифты, CSS и цвет панели браузера.
 */

export const metadata: Metadata = inviteMetadata(invite);

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: themeMeta[invite.theme].themeColor,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={invite.languages.default}
      data-theme={invite.theme}
      data-script={needsExtendedScript(invite.couple) ? 'extended' : undefined}
      className={fontVariables}
    >
      <body>
        <InviteProvider invite={invite}>
          <LocaleProvider>{children}</LocaleProvider>
        </InviteProvider>
      </body>
    </html>
  );
}
