'use client';

import { IntroProvider } from '@/components/providers/IntroProvider';
import { BouquetProvider } from './BouquetProvider';
import { CornerBouquet } from './CornerBouquet';
import { Countdown } from './Countdown';
import { DressCode } from './DressCode';
import { GardenGate } from './GardenGate';
import { Hero } from './Hero';
import { LanguageToggle } from './LanguageToggle';
import { Program } from './Program';
import { Rsvp } from './Rsvp';
import { Story } from './Story';
import { Venue } from './Venue';

/**
 * «Гүлзар»: ворота из цветов, за ними — сад. Каждый раздел дарит гостю
 * цветок, букет сам собирается в углу, а в конце уходит паре вместе с ответом.
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
          <Program />
          <Venue />
          <DressCode />
          <Rsvp />
        </main>
        <CornerBouquet />
      </BouquetProvider>
    </IntroProvider>
  );
}
