import Image from 'next/image';
import type { ReactNode } from 'react';
import { FLOWERS, type FlowerName } from './flowers';

/**
 * Раздел-«клумба»: над заголовком свой цветок-акварель.
 * tone="dusk" — раздел лежит на вечернем небе, текст вокруг него светлый.
 */
export function GardenSection({
  id,
  flower,
  title,
  tone,
  children,
}: {
  id: string;
  flower: FlowerName;
  title: string;
  tone?: 'dusk';
  children: ReactNode;
}) {
  const asset = FLOWERS[flower];

  return (
    <section id={id} className={tone ? `g-section g-${tone}` : 'g-section'} aria-labelledby={`${id}-title`}>
      <div className="g-section-head">
        <Image src={asset.src} width={asset.w} height={asset.h} alt="" sizes="136px" className="g-section-flower" />
        <h2 id={`${id}-title`} className="g-section-title">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
