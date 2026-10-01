'use client';

import Image from 'next/image';
import { mapLinks } from '@/lib/invite';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { delay } from '@/designs/shared/reveal';
import { Section } from './Poster';

const MAP_LINK =
  'flex min-h-14 items-center justify-between gap-3 border-b-2 border-ink px-1 text-md font-bold whitespace-nowrap text-ink ' +
  'transition-[background-color,color,transform] duration-(--dur-micro) ease-out active:translate-y-px ' +
  '[@media(hover:hover)]:hover:bg-accent [@media(hover:hover)]:hover:text-accent-ink';

/** Место: фото, название и адрес, ссылки на карты — строками списка, как указатели. */
export function Venue() {
  const { venue } = useInvite();
  const { t, pick } = useLocale();
  const links = mapLinks(venue);

  // Видимая подпись — название сервиса, полное «Открыть в…» — для скринридера.
  const maps = [
    { href: links.twoGis, name: '2GIS', label: t.venue.open2gis },
    { href: links.googleMaps, name: 'Google Maps', label: t.venue.openGoogle },
  ];

  return (
    <Section labelledBy="venue-title" title={t.venue.title}>
      <div data-reveal="curtain" className="relative mt-6 aspect-[3/2] overflow-hidden bg-paper-2">
        <Image
          src={venue.photo.src}
          alt={pick(venue.photo.alt)}
          fill
          sizes="(min-width: 38rem) 35rem, 92vw"
          className="object-cover"
        />
      </div>

      <h3 className="mt-5 text-md">{pick(venue.name)}</h3>
      <address className="mt-1 text-ink-2 not-italic">
        {pick(venue.city)}, {pick(venue.address)}
      </address>

      <ul className="mt-5 border-t-2 border-ink">
        {maps.map((map, index) => (
          <li key={map.name} data-reveal="slide" style={delay(150 + index * 100)}>
            <a href={map.href} target="_blank" rel="noopener noreferrer" aria-label={map.label} className={MAP_LINK}>
              {map.name}
              <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor">
                <path d="M2 14 14 2M5 2h9v9" strokeWidth="2" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
