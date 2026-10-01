'use client';

import { formatEventDate } from '@/lib/invite';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Sparkle, Stage, Stars } from './parts';

/** Финал сцены: тёмный изумруд, звёзды, имена золотом и кто сделал. */
export function Footer() {
  const invite = useInvite();
  const { t, pick } = useLocale();
  const [first, second] = invite.couple;
  const date = formatEventDate(invite.event, t);
  const { handle, url } = invite.studio;

  return (
    <footer className="band band-deep relative pt-16 pb-[max(5rem,env(safe-area-inset-bottom))] text-center">
      <Stars />
      <Stage className="relative">
        <div data-reveal="pop">
          <Sparkle className="mx-auto size-8 text-gold" />
          <p className="neon mt-4 font-display text-xl">
            {pick(first.name)} {t.hero.and} {pick(second.name)}
          </p>
          <p className="mt-3 font-display text-md text-on-2 tabular-nums">{date.numeric}</p>
        </div>

        <p className="mt-10 text-on-2">
          {t.footer.madeBefore}{' '}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center font-semibold whitespace-nowrap text-gold underline decoration-2 underline-offset-[3px] transition-colors duration-(--dur-micro) ease-out hover:text-gold-2"
          >
            {handle}
          </a>{' '}
          {t.footer.madeAfter}
        </p>
      </Stage>
    </footer>
  );
}
