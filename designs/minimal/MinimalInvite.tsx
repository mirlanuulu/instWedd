import { IntroProvider } from '@/components/providers/IntroProvider';
import { MusicProvider } from '@/components/providers/MusicProvider';
import { Calendar } from './Calendar';
import { LanguageSwitch, MusicButton } from './Controls';
import { Countdown } from './Countdown';
import { DressCode } from './DressCode';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { Main } from './Main';
import { Program } from './Program';
import { Rsvp } from './Rsvp';
import { Story } from './Story';
import { Vellum } from './Vellum';
import { Venue } from './Venue';

/**
 * Стиль «Минимализм»: калька над приглашением, тонкая антиква, гротеск и поля.
 * Вместо стираемой даты — календарь месяца с обведённым днём.
 */
export function MinimalInvite() {
  return (
    <MusicProvider>
      <IntroProvider>
        {/* Без JavaScript кальку не снять: приглашение показывается сразу. */}
        <noscript>
          <style>{'[data-intro]{display:none}.settle[data-sealed]{transform:none}'}</style>
        </noscript>

        <Vellum />
        <LanguageSwitch />
        <MusicButton />

        <Main footer={<Footer />}>
          <Hero />
          <Countdown />
          <Calendar />
          <Story />
          <Program />
          <Venue />
          <DressCode />
          <Rsvp />
        </Main>
      </IntroProvider>
    </MusicProvider>
  );
}
