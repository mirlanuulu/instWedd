import { IntroProvider } from '@/components/providers/IntroProvider';
import { MusicProvider } from '@/components/providers/MusicProvider';
import { IntroGate } from '@/designs/shared/IntroGate';
import { LanguageSwitch, MusicButton } from './Controls';
import { Countdown } from './Countdown';
import { DressCode } from './DressCode';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { Panel } from './Panel';
import { Program } from './Program';
import { Rsvp } from './Rsvp';
import { Story } from './Story';
import { Venue } from './Venue';

/**
 * Стиль «Гротеск»: швейцарский плакат. Один гротеск в разных весах,
 * модульная сетка, огромные цифры даты и кобальтовый акцент.
 */
export function GroteskInvite() {
  return (
    <MusicProvider>
      <IntroProvider>
        {/* Без JavaScript панель не сдвинуть: плакат показывается сразу. */}
        <noscript>
          <style>{'[data-intro]{display:none}'}</style>
        </noscript>

        <Panel />
        <LanguageSwitch />
        <MusicButton />

        <IntroGate footer={<Footer />}>
          <Hero />
          <Countdown />
          <Story />
          <Program />
          <Venue />
          <DressCode />
          <Rsvp />
        </IntroGate>
      </IntroProvider>
    </MusicProvider>
  );
}
