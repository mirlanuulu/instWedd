'use client';

import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { delay } from '@/designs/shared/reveal';
import { Section } from './Poster';

/** Программа — расписание: время крупно кобальтом в левой колонке, события справа. Строки выезжают по очереди. */
export function Program() {
  const { program } = useInvite();
  const { t, pick } = useLocale();

  return (
    <Section labelledBy="program-title" title={t.program.title}>
      <ol className="mt-6">
        {program.map((item, index) => (
          <li
            key={`${item.time}-${index}`}
            data-reveal="slide"
            style={delay(index * 80)}
            className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-3 border-t border-rule py-4 first:border-t-0 first:pt-0"
          >
            <time className="figures text-md font-extrabold tracking-[-0.02em] text-accent">{item.time}</time>
            <div>
              <h3 className="text-base font-bold tracking-normal">{pick(item.title)}</h3>
              {item.note && <p className="mt-0.5 text-muted">{pick(item.note)}</p>}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
