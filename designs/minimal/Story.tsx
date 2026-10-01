'use client';

import Image from 'next/image';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Section, Sheet } from './Sheet';

/**
 * История — лента кадров, как контактный лист. Первый кадр стоит по левому
 * краю колонки, лента уходит за правый край экрана: видно, что её листают.
 */
export function Story() {
  const { story } = useInvite();
  const { t, pick } = useLocale();

  return (
    <Section labelledBy="story-title" className="pt-16 pb-20">
      <Sheet>
        <h2 id="story-title" className="text-xl">
          {t.story.title}
        </h2>
      </Sheet>

      {/* tabIndex: ленту можно листать стрелками с клавиатуры. */}
      <ol tabIndex={0} aria-labelledby="story-title" className="reel mt-8">
        {story.map((item, index) => (
          <li key={item.photo.src}>
            <figure>
              <div className="relative aspect-[3/4] overflow-hidden bg-paper-2">
                <Image
                  src={item.photo.src}
                  alt={pick(item.photo.alt)}
                  fill
                  sizes="(min-width: 34rem) 22rem, 78vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 pr-4">
                <span className="figures label text-muted">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 text-md">{pick(item.title)}</h3>
                <p className="mt-1 text-ink-2">{pick(item.text)}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>
    </Section>
  );
}
