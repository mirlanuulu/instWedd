'use client';

import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Section } from './Page';

/** Программа — как оглавление номера: название, отточия, время. Пометки курсивом. */
export function Program() {
  const { program } = useInvite();
  const { t, pick } = useLocale();

  return (
    <Section labelledBy="program-title" title={t.program.title}>
      <ol className="mt-6">
        {program.map((item, index) => (
          <li key={`${item.time}-${index}`} className="border-b border-rule py-4 last:border-b-0">
            <div className="flex items-end">
              <h3 className="min-w-0 font-body text-base font-semibold tracking-normal">{pick(item.title)}</h3>
              <span aria-hidden="true" className="leader" />
              <time className="figures shrink-0 font-display text-md font-semibold">{item.time}</time>
            </div>
            {item.note && <p className="mt-1 text-muted italic">{pick(item.note)}</p>}
          </li>
        ))}
      </ol>
    </Section>
  );
}
