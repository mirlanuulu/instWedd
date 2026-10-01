'use client';

import type { CSSProperties } from 'react';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Heading, Section, Sheet } from './Sheet';

/** Больше четырёх цветов — вторая строка: в узкой колонке подписи иначе не встанут. */
const MAX_COLUMNS = 4;

/** Палитра вечера — одна полоса из цветов встык, как в брендбуке. Подписи под каждым цветом. */
export function DressCode() {
  const { dressCode } = useInvite();
  const { t, pick } = useLocale();
  const columns = Math.min(dressCode.colors.length, MAX_COLUMNS);

  return (
    <Section labelledBy="dress-title" className="pt-8 pb-20">
      <Sheet>
        <Heading id="dress-title">{t.dressCode.title}</Heading>

        <ul
          className="mt-8 grid grid-cols-[repeat(var(--columns),minmax(0,1fr))] gap-y-6"
          style={{ '--columns': columns } as CSSProperties}
        >
          {dressCode.colors.map((color) => (
            <li key={color.value}>
              {/*
                Цвет — данные заказа, а не токен стиля, поэтому inline-стиль.
                Тень в полпикселя с каждой стороны: между соседними цветами выходит одна волосяная линия.
              */}
              <span
                aria-hidden="true"
                className="block h-24 shadow-[0_0_0_0.5px_var(--color-rule)]"
                style={{ backgroundColor: color.value }}
              />
              <span className="mt-3 block pr-2 text-label text-ink-2">
                {pick(color.name)}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-[45ch] text-ink-2">{pick(dressCode.note)}</p>
      </Sheet>
    </Section>
  );
}
