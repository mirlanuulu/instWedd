'use client';

import { IntroProvider } from '@/components/providers/IntroProvider';
import { GardenGate } from './GardenGate';
import { Hero } from './Hero';
import { LanguageToggle } from './LanguageToggle';

/** «Гүлзар»: ворота из цветов, за ними — сад с фото пары. */
export function GulzarInvite() {
  return (
    <IntroProvider>
      {/* Без JavaScript ворота не открыть: приглашение показывается сразу. */}
      <noscript>
        <style>{'[data-intro]{display:none}'}</style>
      </noscript>
      <GardenGate />
      <LanguageToggle />
      <main>
        <Hero />
      </main>
    </IntroProvider>
  );
}
