'use client';

import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { delay } from '@/designs/shared/reveal';
import { Heading, Section, Sheet } from './Sheet';

/** Программа — таблица в две колонки: время и что происходит. Строки делят волосяные линии. */
export function Program() {
  const { program } = useInvite();
  const { t, pick } = useLocale();

  return (
    <Section labelledBy="program-title" className="pt-12 pb-16">
      <Sheet>
        <Heading id="program-title">{t.program.title}</Heading>

        <ol className="mt-8 border-t border-rule">
          {program.map((item, index) => (
            <li
              key={`${item.time}-${index}`}
              data-reveal="slide"
              style={delay(index * 90)}
              className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 border-b border-rule py-5"
            >
              <time className="figures font-medium">{item.time}</time>
              <div>
                <h3 className="font-body text-base font-medium">{pick(item.title)}</h3>
                {item.note && <p className="mt-0.5 text-muted">{pick(item.note)}</p>}
              </div>
            </li>
          ))}
        </ol>
      </Sheet>
    </Section>
  );
}
