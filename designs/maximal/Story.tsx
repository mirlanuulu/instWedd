'use client';

import Image from 'next/image';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { delay } from '@/designs/shared/reveal';
import { Section } from './parts';

/** История — фото в толстых золотых рамках с малиновой подложкой, наклонены в разные стороны. */
export function Story() {
  const { story } = useInvite();
  const { t, pick } = useLocale();

  return (
    <Section labelledBy="story-title" title={t.story.title} band="cream">
      <ol className="mt-10 space-y-14">
        {story.map((item, index) => (
          <li key={item.photo.src} className={index % 2 ? 'pl-6' : 'pr-6'}>
            <div
              data-reveal="pop"
              className="frame relative aspect-[4/5] overflow-hidden bg-cream-2"
              style={{ rotate: index % 2 ? '2deg' : '-2deg' }}
            >
              <Image
                src={item.photo.src}
                alt={pick(item.photo.alt)}
                fill
                sizes="(min-width: 36rem) 30rem, 85vw"
                className="object-cover"
              />
            </div>
            <div data-reveal="up" style={delay(200)} className="mt-6">
              <span className="inline-block rounded-pill bg-magenta px-3 py-1 font-display text-paper">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-md text-magenta">{pick(item.title)}</h3>
              <p className="mt-1 text-on-2">{pick(item.text)}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
