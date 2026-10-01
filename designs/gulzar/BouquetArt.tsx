import Image from 'next/image';
import type { CSSProperties } from 'react';
import { BOUQUET, type BouquetId } from './bouquet';
import { FLOWERS } from './flowers';

/**
 * Букет из собранных цветков по общей раскладке (bouquet.ts).
 * Новый цветок распускается при появлении, уже лежавшие не шевелятся.
 */
export function BouquetArt({
  picked,
  sizes,
  className = '',
}: {
  picked: ReadonlySet<BouquetId>;
  sizes: string;
  className?: string;
}) {
  const leaves = FLOWERS.leaves;
  return (
    <span className={`g-bouquet ${className}`} aria-hidden>
      {picked.size > 0 && (
        <Image src={leaves.src} width={leaves.w} height={leaves.h} alt="" sizes={sizes} className="g-bouquet-leaves" />
      )}
      {BOUQUET.filter((item) => picked.has(item.id)).map((item) => {
        const flower = FLOWERS[item.flower];
        const { x, y, w, r, z } = item.at;
        const style = { left: `${x}%`, top: `${y}%`, width: `${w}%`, rotate: `${r}deg`, zIndex: z } as CSSProperties;
        return (
          <Image
            key={item.id}
            src={flower.src}
            width={flower.w}
            height={flower.h}
            alt=""
            sizes={sizes}
            className="g-bouquet-flower"
            style={style}
          />
        );
      })}
    </span>
  );
}
