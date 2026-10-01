'use client';

import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { delay } from '@/designs/shared/reveal';
import { Section } from './parts';

/** Палитра вечера — почтовые марки с зубчатым краем. Выпрыгивают по очереди, наклеены вразнобой. */
export function DressCode() {
  const { dressCode } = useInvite();
  const { t, pick } = useLocale();

  return (
    <Section labelledBy="dress-title" title={t.dressCode.title}>
      <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-6">
        {dressCode.colors.map((color, index) => (
          <li key={color.value} className="flex w-[4.75rem] flex-col items-center text-center">
            <span
              aria-hidden="true"
              data-reveal="pop"
              className="postage block"
              style={{ ...delay(index * 110), rotate: index % 2 ? '4deg' : '-3deg' }}
            >
              {/* Цвет — данные заказа, а не токен стиля, поэтому inline-стиль. */}
              <span className="block size-16" style={{ backgroundColor: color.value }} />
            </span>
            <span className="mt-2 text-label leading-tight text-ink-2 uppercase">{pick(color.name)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-[45ch] text-ink-2">{pick(dressCode.note)}</p>
    </Section>
  );
}
