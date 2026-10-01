import { IntroProvider } from '@/components/providers/IntroProvider';
import { MusicProvider } from '@/components/providers/MusicProvider';
import { IntroGate } from '@/designs/shared/IntroGate';
import { LanguageSwitch, MusicButton } from './Controls';
import { Countdown } from './Countdown';
import { DressCode } from './DressCode';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { Program } from './Program';
import { Rsvp } from './Rsvp';
import { Story } from './Story';
import { Telegram } from './Telegram';
import { Venue } from './Venue';

/**
 * Стиль «Машинопись»: приглашение пришло телеграммой. Текст на наклеенных
 * лентах печатается на глазах, штемпель с датой, цвета дресс-кода — марками.
 */
export function TypewriterInvite() {
  return (
    <MusicProvider>
      <IntroProvider>
        {/* Без JavaScript бланк-интро не убрать: телеграмма показывается сразу. */}
        <noscript>
          <style>{'[data-intro]{display:none}'}</style>
        </noscript>

        <Telegram />
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
