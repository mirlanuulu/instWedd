'use client';

import Image from 'next/image';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Section } from './Page';

/**
 * История — фотоочерк: снимки чередуют ширину, как на журнальном развороте,
 * подпись под каждым набрана курсивом.
 */
export function Story() {
  const { story } = useInvite();
  const { t, pick } = useLocale();

  return (
    <Section labelledBy="story-title" title={t.story.title} className="pt-16 pb-8">
      <ol className="mt-8 space-y-12">
        {story.map((item, index) => {
          // Каждый второй снимок уже и прижат вправо: полоса не читается как столбик одинаковых карточек.
          const inset = index % 2 === 1;
          return (
            <li key={item.photo.src}>
              <figure className={inset ? 'ml-auto w-[78%]' : ''}>
                <div className={`relative overflow-hidden bg-paper-2 ${inset ? 'aspect-[4/5]' : 'aspect-[5/4]'}`}>
                  <Image
                    src={item.photo.src}
                    alt={pick(item.photo.alt)}
                    fill
                    sizes={inset ? '(min-width: 36rem) 26rem, 72vw' : '(min-width: 36rem) 33rem, 90vw'}
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 border-t border-ink pt-3">
                  <h3 className="text-md">{pick(item.title)}</h3>
                  <p className="mt-1 text-ink-2">{pick(item.text)}</p>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
