'use client';

import { invite } from '@/config/invite';
import { formatEventDate } from '@/lib/invite';
import { useLocale } from '@/components/providers/LocaleProvider';

export function Footer() {
  const { t, pick } = useLocale();
  const [first, second] = invite.couple;
  const date = formatEventDate(invite.event, t);
  const { handle, url } = invite.studio;

  return (
    <footer className="px-gutter pt-14 pb-[max(5rem,env(safe-area-inset-bottom))] text-center">
      <p className="text-md text-ink">
        {pick(first.name)} {t.hero.and} {pick(second.name)}
      </p>
      <p className="mt-1 text-sm text-muted lining-nums tabular-nums">{date.numeric}</p>

      <p className="mt-10 text-xs text-muted">
        {t.footer.madeBefore}{' '}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center whitespace-nowrap text-ink-2 underline decoration-rule underline-offset-4 transition-colors duration-(--dur-micro) ease-out hover:text-accent"
        >
          {handle}
        </a>{' '}
        {t.footer.madeAfter}
      </p>
    </footer>
  );
}
