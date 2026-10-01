'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { delay } from '@/designs/shared/reveal';
import { Section } from './parts';

/**
 * История — фотографии, вставленные в альбомные уголки, чуть вразнобой,
 * подпись под каждой — на телеграфной ленте.
 */
export function Story() {
  const { story } = useInvite();
  const { t, pick } = useLocale();

  return (
    <Section labelledBy="story-title" title={t.story.title}>
      <ol className="mt-8 space-y-12">
        {story.map((item, index) => {
          const tilt = index % 2 ? '1.2deg' : '-1.4deg';
          return (
            <li key={item.photo.src} className={index % 2 ? 'pl-8' : 'pr-8'}>
              <figure>
                <div
                  data-reveal="pop"
                  className="photo-corners bg-strip p-2.5 shadow-[0_2px_6px_color-mix(in_oklch,var(--color-ink)_22%,transparent)]"
                  style={{ rotate: tilt }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-paper-2">
                    <Image
                      src={item.photo.src}
                      alt={pick(item.photo.alt)}
                      fill
                      sizes="(min-width: 36rem) 30rem, 85vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <figcaption className="mt-5">
                  <h3 className="tape text-md" style={{ '--tilt': '0.4deg' } as CSSProperties}>
                    <span data-reveal="up" style={delay(200)} className="strip">
                      {String(index + 1).padStart(2, '0')} · {pick(item.title)}
                    </span>
                  </h3>
                  <p className="mt-2 text-ink-2">{pick(item.text)}</p>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
