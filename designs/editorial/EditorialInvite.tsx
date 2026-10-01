import { IntroProvider } from '@/components/providers/IntroProvider';
import { MusicProvider } from '@/components/providers/MusicProvider';
import { IntroGate } from '@/designs/shared/IntroGate';
import { LanguageSwitch, MusicButton } from './Controls';
import { Countdown } from './Countdown';
import { Cover } from './Cover';
import { DressCode } from './DressCode';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { Program } from './Program';
import { Rsvp } from './Rsvp';
import { Story } from './Story';
import { Venue } from './Venue';

/**
 * Стиль «Эдиториал»: приглашение как свадебный номер журнала. Обложка
 * перелистывается, внутри — полоса с линейками, буквицей и отточиями.
 */
export function EditorialInvite() {
  return (
    <MusicProvider>
      <IntroProvider>
        {/* Без JavaScript обложку не перелистнуть: номер показывается сразу. */}
        <noscript>
          <style>{'[data-intro]{display:none}'}</style>
        </noscript>

        <Cover />
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
