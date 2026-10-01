'use client';

import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Section } from './Page';

/** Палитра вечера — круглые выкраски, как цветовой указатель в модном номере. */
export function DressCode() {
  const { dressCode } = useInvite();
  const { t, pick } = useLocale();

  return (
    <Section labelledBy="dress-title" title={t.dressCode.title}>
      <p className="mt-4 text-ink-2">{pick(dressCode.note)}</p>
      <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-5">
        {dressCode.colors.map((color) => (
          <li key={color.value} className="flex w-20 flex-col items-center text-center">
            {/* Цвет — данные заказа, а не токен стиля, поэтому inline-стиль. */}
            <span
              aria-hidden="true"
              className="block size-14 rounded-pill border border-rule"
              style={{ backgroundColor: color.value }}
            />
            <span className="mt-2 text-muted italic">{pick(color.name)}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
