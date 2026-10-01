'use client';

import { formatEventDate } from '@/lib/invite';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Blank, Postmark } from './parts';

/** Подпись телеграммы: имена отправителей, штемпель с датой и кто сделал. */
export function Footer() {
  const invite = useInvite();
  const { t, pick } = useLocale();
  const [first, second] = invite.couple;
  const date = formatEventDate(invite.event, t);
  const { handle, url } = invite.studio;

  return (
    <footer className="pt-14 pb-[max(5rem,env(safe-area-inset-bottom))]">
      <Blank>
        <div data-reveal="up" className="flex items-center justify-between gap-4 border-t-2 border-form pt-4">
          <p className="tape text-md font-bold">
            <span className="strip">
              {pick(first.name)} {t.hero.and} {pick(second.name)}
            </span>
          </p>
          <Postmark
            city={pick(invite.venue.city)}
            dayMonth={date.numeric.slice(0, 5)}
            year={date.year}
            className="size-20 shrink-0 rotate-[-10deg]"
          />
        </div>

        <p className="mt-8 text-muted">
          {t.footer.madeBefore}{' '}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center font-bold whitespace-nowrap text-form underline decoration-2 underline-offset-[3px] transition-colors duration-(--dur-micro) ease-out hover:text-accent"
          >
            {handle}
          </a>{' '}
          {t.footer.madeAfter}
        </p>
      </Blank>
    </footer>
  );
}
