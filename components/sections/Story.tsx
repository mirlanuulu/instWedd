'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { invite } from '@/config/invite';
import { useMotion } from '@/lib/motionLoader';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Section, SectionHeading } from '@/components/ui/Section';

export function Story() {
  const { t, pick } = useLocale();
  const motion = useMotion();
  const list = useRef<HTMLOListElement>(null);

  return (
    <Section className="pt-10 pb-section" labelledBy="story-title">
      <SectionHeading id="story-title">{t.story.title}</SectionHeading>

      <ol ref={list} className="mt-10 space-y-14">
        {invite.story.map((item, index) => {
          // Фото и подписи чередуют край: лента читается как разворот альбома, а не как список.
          const shifted = index % 2 === 1;
          return (
            <li key={item.photo.src} className={`flex flex-col ${shifted ? 'items-end' : 'items-start'}`}>
              <div className="relative aspect-[4/5] w-[82%] overflow-hidden rounded-(--radius-photo) bg-paper-2 outline-(length:--photo-frame-width) outline-offset-[5px] outline-accent-2">
                {/* Слой выше рамки на 20%: при сдвиге на ±7% его края не показываются. */}
                <div data-parallax className="absolute inset-x-0 -inset-y-[10%]">
                  <Image
                    src={item.photo.src}
                    alt={pick(item.photo.alt)}
                    fill
                    sizes="(min-width: 30rem) 24rem, 82vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className={`mt-6 w-[82%] ${shifted ? 'text-right' : ''}`}>
                <h3 className="text-lg">{pick(item.title)}</h3>
                <p className="mt-2 text-ink-2">{pick(item.text)}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Параллакс фото подключается, когда загрузился чанк с анимациями. */}
      {motion && <motion.StoryParallax root={list} />}
    </Section>
  );
}
