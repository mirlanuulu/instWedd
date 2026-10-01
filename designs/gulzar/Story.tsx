'use client';

import Image from 'next/image';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { GardenSection } from './GardenSection';
import { FLOWERS } from './flowers';

/** Наклон листов гербария и цветок у каждого второго — по очереди, без случайности. */
const TILTS = [-1.4, 1.1, -0.8, 1.5];
const PRESSED = [FLOWERS.headBlossom, FLOWERS.headWild];

/** История пары — листы гербария: фото на бумажном скотче, подпись от руки. */
export function Story() {
  const { story } = useInvite();
  const { pick } = useLocale();

  return (
    <GardenSection id="story">
      <ol className="g-herbarium">
        {story.map((item, i) => {
          const pressed = i % 2 === 1 ? PRESSED[((i - 1) / 2) % PRESSED.length] : null;
          return (
            <li key={item.photo.src} className="g-sheet" style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}>
              <div className="g-sheet-photo">
                <Image src={item.photo.src} alt={pick(item.photo.alt)} fill sizes="(max-width: 34rem) 82vw, 26rem" />
                <span className="g-tape g-tape-left" aria-hidden />
                <span className="g-tape g-tape-right" aria-hidden />
              </div>
              <h3 className="g-sheet-title">{pick(item.title)}</h3>
              <p className="g-sheet-text">{pick(item.text)}</p>
              {pressed && (
                <Image
                  src={pressed.src}
                  width={pressed.w}
                  height={pressed.h}
                  alt=""
                  sizes="96px"
                  className={`g-sheet-flower ${i % 4 === 1 ? 'g-sheet-flower-right' : 'g-sheet-flower-left'}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </GardenSection>
  );
}
