'use client';

import { formatEventDate } from '@/lib/invite';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Poster } from './Poster';

export function Footer() {
  const invite = useInvite();
  const { t, pick } = useLocale();
  const [first, second] = invite.couple;
  const date = formatEventDate(invite.event, t);
  const { handle, url } = invite.studio;

  return (
    <footer className="pt-14 pb-[max(5rem,env(safe-area-inset-bottom))]">
      <Poster>
        <div data-reveal="up" className="border-t-2 border-ink pt-3">
          <p className="text-xl font-bold tracking-[-0.03em]">
            {pick(first.name)} {t.hero.and} {pick(second.name)}
          </p>
          <p className="figures mt-2 text-md font-bold text-accent">{date.numeric}</p>
        </div>

        <p className="mt-10 text-muted">
          {t.footer.madeBefore}{' '}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center font-semibold whitespace-nowrap text-ink underline decoration-2 underline-offset-[3px] transition-colors duration-(--dur-micro) ease-out hover:text-accent"
          >
            {handle}
          </a>{' '}
          {t.footer.madeAfter}
        </p>
      </Poster>
    </footer>
  );
}
