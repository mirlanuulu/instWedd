'use client';

import { formatEventDate } from '@/lib/invite';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';

export function Footer() {
  const invite = useInvite();
  const { t, pick } = useLocale();
  const [first, second] = invite.couple;
  const date = formatEventDate(invite.event, t);
  const { handle, url } = invite.studio;

  return (
    <footer className="mx-auto w-full max-w-sheet px-gutter pt-8 pb-[max(5rem,env(safe-area-inset-bottom))]">
      <div className="flex items-baseline justify-between gap-4 border-t border-ink pt-5">
        <p className="font-display text-md">
          {pick(first.name)} {t.hero.and} {pick(second.name)}
        </p>
        <p className="figures text-muted">{date.numeric}</p>
      </div>

      <p className="mt-12 text-muted">
        {t.footer.madeBefore}{' '}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center whitespace-nowrap text-ink-2 underline decoration-rule underline-offset-[3px] transition-colors duration-(--dur-micro) ease-out hover:text-ink"
        >
          {handle}
        </a>{' '}
        {t.footer.madeAfter}
      </p>
    </footer>
  );
}
