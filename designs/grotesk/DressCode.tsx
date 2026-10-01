'use client';

import type { CSSProperties } from 'react';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { delay } from '@/designs/shared/reveal';
import { Section } from './Poster';

/** Больше четырёх цветов — вторая строка сетки. */
const MAX_COLUMNS = 4;

/** Палитра вечера — модули сетки: квадрат цвета и подпись, линии между модулями. Цвета выпрыгивают по очереди. */
export function DressCode() {
  const { dressCode } = useInvite();
  const { t, pick } = useLocale();
  const columns = Math.min(dressCode.colors.length, MAX_COLUMNS);

  return (
    <Section labelledBy="dress-title" title={t.dressCode.title}>
      <ul
        className="mt-6 grid grid-cols-[repeat(var(--columns),minmax(0,1fr))] gap-0.5 border-2 border-ink bg-ink"
        style={{ '--columns': columns } as CSSProperties}
      >
        {dressCode.colors.map((color, index) => (
          <li key={color.value} className="overflow-hidden bg-paper">
            {/* Цвет — данные заказа, а не токен стиля, поэтому inline-стиль. */}
            <span
              aria-hidden="true"
              data-reveal="pop"
              className="block aspect-square"
              style={{ ...delay(index * 110), backgroundColor: color.value }}
            />
            <span className="label block px-2 py-2 [overflow-wrap:anywhere]">{pick(color.name)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 max-w-[45ch] text-ink-2">{pick(dressCode.note)}</p>
    </Section>
  );
}
