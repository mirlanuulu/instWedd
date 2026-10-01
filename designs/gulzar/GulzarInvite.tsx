'use client';

import { IntroProvider } from '@/components/providers/IntroProvider';
import { BouquetBar } from './BouquetBar';
import { BouquetProvider } from './BouquetProvider';
import { Countdown } from './Countdown';
import { GardenGate } from './GardenGate';
import { Hero } from './Hero';
import { LanguageToggle } from './LanguageToggle';
import { Story } from './Story';

/**
 * «Гүлзар»: ворота из цветов, за ними — сад. Каждый раздел дарит гостю
 * цветок, к ответу на приглашение он подходит с собранным букетом.
 */
export function GulzarInvite() {
  return (
    <IntroProvider>
      <BouquetProvider>
        {/* Без JavaScript ворота не открыть: приглашение показывается сразу. */}
        <noscript>
          <style>{'[data-intro]{display:none}'}</style>
        </noscript>
        <GardenGate />
        <LanguageToggle />
        <main className="g-main">
          <Hero />
          <Countdown />
          <Story />
        </main>
        <BouquetBar />
      </BouquetProvider>
    </IntroProvider>
  );
}
