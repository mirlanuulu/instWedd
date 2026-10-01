import Image from 'next/image';
import type { ReactNode } from 'react';
import { FLOWERS, type FlowerName } from './flowers';

/** Раздел-«клумба»: над заголовком свой цветок-акварель. */
export function GardenSection({
  id,
  flower,
  title,
  children,
}: {
  id: string;
  flower: FlowerName;
  title: string;
  children: ReactNode;
}) {
  const asset = FLOWERS[flower];

  return (
    <section id={id} className="g-section" aria-labelledby={`${id}-title`}>
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
