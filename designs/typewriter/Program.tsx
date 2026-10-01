'use client';

import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { delay } from '@/designs/shared/reveal';
import { Section } from './parts';

/** Программа — ленты одна под другой: время красным, событие машинописью. Выезжают по очереди. */
export function Program() {
  const { program } = useInvite();
  const { t, pick } = useLocale();

  return (
    <Section labelledBy="program-title" title={t.program.title}>
      <ol className="mt-6 grid gap-3">
        {program.map((item, index) => (
          <li
            key={`${item.time}-${index}`}
            data-reveal="slide"
            style={{ ...delay(index * 110), rotate: index % 2 ? '0.4deg' : '-0.4deg' }}
            className="grid grid-cols-[4.25rem_minmax(0,1fr)] gap-x-3 bg-strip px-3 py-2.5 shadow-[0_1px_2px_color-mix(in_oklch,var(--color-ink)_18%,transparent)]"
          >
            <time className="font-bold text-accent tabular-nums">{item.time}</time>
            <div>
              <h3 className="text-base font-bold uppercase">{pick(item.title)}</h3>
              {item.note && <p className="mt-0.5 text-ink-2">{pick(item.note)}</p>}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
