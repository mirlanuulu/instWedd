'use client';

import type { CSSProperties } from 'react';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { GardenSection } from './GardenSection';

/** Дресс-код: цвета вечера — ленты с вырезом на конце, как у букета. */
export function DressCode() {
  const { dressCode } = useInvite();
  const { pick } = useLocale();

  return (
    <GardenSection id="dress">
      <p className="g-dress-note">{pick(dressCode.note)}</p>
      <ul className="g-ribbons">
        {dressCode.colors.map((color) => (
          <li key={color.value} className="g-ribbon-item">
            {/* Цвет — данные заказа, поэтому задаётся прямо из конфига. */}
            <span className="g-ribbon" style={{ '--ribbon': color.value } as CSSProperties} aria-hidden />
            <span className="g-ribbon-name">{pick(color.name)}</span>
          </li>
        ))}
      </ul>
    </GardenSection>
  );
}
