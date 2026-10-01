'use client';

import { formatEventDate } from '@/lib/invite';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Page } from './Page';

/** Выходные данные номера: имена, дата и кто сделал. */
export function Footer() {
  const invite = useInvite();
  const { t, pick } = useLocale();
  const [first, second] = invite.couple;
  const date = formatEventDate(invite.event, t);
  const { handle, url } = invite.studio;

  return (
    <footer className="pt-16 pb-[max(5rem,env(safe-area-inset-bottom))]">
      <Page>
        <div className="border-t-[3px] border-ink">
          <div className="mt-0.5 border-t border-ink" />
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <p className="font-display text-md font-bold">
            {pick(first.name)} {t.hero.and} {pick(second.name)}
          </p>
          <p className="figures caps text-muted">{date.numeric}</p>
        </div>

        <p className="mt-10 text-muted">
          {t.footer.madeBefore}{' '}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center whitespace-nowrap text-ink-2 underline decoration-rule underline-offset-[3px] transition-colors duration-(--dur-micro) ease-out hover:text-accent"
          >
            {handle}
          </a>{' '}
          {t.footer.madeAfter}
        </p>
      </Page>
    </footer>
  );
}
