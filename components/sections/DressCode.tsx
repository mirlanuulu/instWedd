'use client';

import { invite } from '@/config/invite';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Section, SectionHeading } from '@/components/ui/Section';

export function DressCode() {
  const { t, pick } = useLocale();
  const { colors, note } = invite.dressCode;

  return (
    <Section className="pt-6 pb-section" labelledBy="dress-title">
      <div className="border-t border-rule pt-14">
        <SectionHeading id="dress-title" align="center">
          {t.dressCode.title}
        </SectionHeading>

        <ul className="mt-9 flex flex-wrap justify-center gap-x-5 gap-y-6">
          {colors.map((color) => (
            <li key={color.value} className="flex w-16 flex-col items-center text-center">
              {/* Цвет — данные заказа из конфига, а не токен темы, поэтому inline-стиль. */}
              <span
                aria-hidden="true"
                className="block size-14 rounded-pill border border-rule"
                style={{ backgroundColor: color.value }}
              />
              <span className="mt-2 text-xs text-ink-2">{pick(color.name)}</span>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-8 max-w-[30ch] text-center text-ink-2">{pick(note)}</p>
      </div>
    </Section>
  );
}
