'use client';

import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { delay } from '@/designs/shared/reveal';
import { Section, Sparkle } from './parts';

/** Программа — путь по бирюзовой полосе: звёздочки-вехи на линии, время в малиновых плашках. */
export function Program() {
  const { program } = useInvite();
  const { t, pick } = useLocale();

  return (
    <Section labelledBy="program-title" title={t.program.title} band="turquoise">
      <ol className="mt-8 border-l-4 border-dotted border-ink pl-6">
        {program.map((item, index) => (
          <li key={`${item.time}-${index}`} data-reveal="slide" style={delay(index * 110)} className="relative pb-7 last:pb-0">
            <Sparkle className="absolute top-1 -left-[2.35rem] size-7 text-magenta-2" />
            <time className="inline-block rounded-pill bg-magenta px-3 py-0.5 font-display text-md text-paper tabular-nums">
              {item.time}
            </time>
            <h3 className="mt-2 font-body text-md font-semibold">{pick(item.title)}</h3>
            {item.note && <p className="mt-0.5">{pick(item.note)}</p>}
          </li>
        ))}
      </ol>
    </Section>
  );
}
