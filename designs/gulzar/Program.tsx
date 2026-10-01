'use client';

import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { GardenSection } from './GardenSection';

/** Программа дня: время крупно, рядом — что происходит. */
export function Program() {
  const { program } = useInvite();
  const { pick } = useLocale();

  return (
    <GardenSection id="program">
      <ol className="g-program">
        {program.map((item) => (
          <li key={item.time + item.title.ru} className="g-program-item">
            <span className="g-program-time">{item.time}</span>
            <span className="g-program-what">
              <span className="g-program-title">{pick(item.title)}</span>
              {item.note && <span className="g-program-note">{pick(item.note)}</span>}
            </span>
          </li>
        ))}
      </ol>
    </GardenSection>
  );
}
