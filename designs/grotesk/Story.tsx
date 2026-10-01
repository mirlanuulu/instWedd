'use client';

import Image from 'next/image';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { delay } from '@/designs/shared/reveal';
import { Section } from './Poster';

/** История — модули сетки: фото на две колонки из пяти, текст на три. Фото открываются занавесом. */
export function Story() {
  const { story } = useInvite();
  const { t, pick } = useLocale();

  return (
    <Section labelledBy="story-title" title={t.story.title}>
      <ol className="mt-6">
        {story.map((item, index) => (
          <li
            key={item.photo.src}
            className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-x-4 border-t border-rule py-4 first:border-t-0 first:pt-0"
          >
            <div data-reveal="curtain" className="relative aspect-[3/4] overflow-hidden bg-paper-2">
              <Image
                src={item.photo.src}
                alt={pick(item.photo.alt)}
                fill
                sizes="(min-width: 38rem) 14rem, 38vw"
                className="object-cover"
              />
            </div>
            <div data-reveal="up" style={delay(200)}>
              <span className="figures label text-accent">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="mt-1 text-md">{pick(item.title)}</h3>
              <p className="mt-2 text-ink-2">{pick(item.text)}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
