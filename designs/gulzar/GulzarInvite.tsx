'use client';

import { IntroProvider } from '@/components/providers/IntroProvider';
import { Countdown } from './Countdown';
import { Credits } from './Credits';
import { DaySky } from './DaySky';
import { GardenGate } from './GardenGate';
import { Hero } from './Hero';
import { LanguageToggle } from './LanguageToggle';
import { Program } from './Program';
import { Rsvp } from './Rsvp';
import { Story } from './Story';
import { Venue } from './Venue';

/**
 * «Гүлзар»: ворота из цветов, за ними — сад. Пока гость листает, за страницей
 * проходит день тоя: от рассвета у фото пары до вечерних огней у анкеты.
 */
export function GulzarInvite() {
  return (
    <IntroProvider>
        {/* Без JavaScript ворота не открыть: приглашение показывается сразу. */}
        <noscript>
          <style>{'[data-intro]{display:none}'}</style>
        </noscript>
        <DaySky />
        <GardenGate />
        <LanguageToggle />
        <main className="g-main">
          <Hero />
          <Countdown />
          <Story />
          <Program />
          <Venue />
          <Rsvp />
        </main>
        <Credits />
    </IntroProvider>
  );
}
