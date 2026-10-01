import { IntroProvider } from '@/components/providers/IntroProvider';
import { MusicProvider } from '@/components/providers/MusicProvider';
import { IntroGate } from '@/designs/shared/IntroGate';
import { LanguageSwitch, MusicButton } from './Controls';
import { Countdown } from './Countdown';
import { Curtain } from './Curtain';
import { DressCode } from './DressCode';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { Program } from './Program';
import { Rsvp } from './Rsvp';
import { Story } from './Story';
import { Venue } from './Venue';

/**
 * Стиль «Максимализм»: той как праздник на сцене. Бархатный занавес, цветные
 * полосы с фестонами, золото, звёзды, бегущая строка и салют.
 */
export function MaximalInvite() {
  return (
    <MusicProvider>
      <IntroProvider>
        {/* Без JavaScript занавес не раздвинуть: сцена показывается сразу. */}
        <noscript>
          <style>{'[data-intro]{display:none}'}</style>
        </noscript>

        <Curtain />
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
