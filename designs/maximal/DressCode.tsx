'use client';

import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { delay } from '@/designs/shared/reveal';
import { Section } from './parts';

/** Палитра вечера — крупные круги в золотых кольцах с малиновой тенью. Выпрыгивают по очереди. */
export function DressCode() {
  const { dressCode } = useInvite();
  const { t, pick } = useLocale();

  return (
    <Section labelledBy="dress-title" title={t.dressCode.title} band="cream">
      <ul className="mt-8 flex flex-wrap gap-x-2 gap-y-6">
        {dressCode.colors.map((color, index) => (
          <li key={color.value} className="flex w-[4.5rem] flex-col items-center text-center">
            {/* Цвет — данные заказа, а не токен стиля, поэтому inline-стиль. */}
            <span
              aria-hidden="true"
              data-reveal="pop"
              className="block size-[4.25rem] rounded-pill border-4 border-gold shadow-[0_0.3rem_0_var(--color-magenta)]"
              style={{ ...delay(index * 120), backgroundColor: color.value }}
            />
            <span className="mt-2 text-label font-semibold">{pick(color.name)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-[45ch] text-on-2">{pick(dressCode.note)}</p>
    </Section>
  );
}
