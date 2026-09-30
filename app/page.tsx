import { EnvelopeIntro } from '@/components/intro/EnvelopeIntro';
import { InviteMain } from '@/components/layout/InviteMain';
import { IntroProvider } from '@/components/providers/IntroProvider';
import { MusicProvider } from '@/components/providers/MusicProvider';
import { Countdown } from '@/components/sections/Countdown';
import { DressCode } from '@/components/sections/DressCode';
import { Footer } from '@/components/sections/Footer';
import { Hero } from '@/components/sections/Hero';
import { Program } from '@/components/sections/Program';
import { Rsvp } from '@/components/sections/Rsvp';
import { ScratchDate } from '@/components/sections/ScratchDate';
import { Story } from '@/components/sections/Story';
import { Venue } from '@/components/sections/Venue';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { MusicToggle } from '@/components/ui/MusicToggle';

export default function InvitePage() {
  return (
    <MusicProvider>
      <IntroProvider>
        {/* Без JavaScript конверт не открыть: приглашение показывается сразу. */}
        <noscript>
          <style>{'[data-intro]{display:none}'}</style>
        </noscript>

        <EnvelopeIntro />
        <LanguageSwitcher />
        <MusicToggle />

        <InviteMain footer={<Footer />}>
          <Hero />
          <Countdown />
          <ScratchDate />
          <Story />
          <Program />
          <Venue />
          <DressCode />
          <Rsvp />
        </InviteMain>
      </IntroProvider>
    </MusicProvider>
  );
}
