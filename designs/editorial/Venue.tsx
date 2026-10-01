'use client';

import Image from 'next/image';
import { mapLinks } from '@/lib/invite';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Section } from './Page';

const MAP_LINK =
  'caps flex min-h-12 items-center justify-between gap-3 border border-ink px-4 whitespace-nowrap text-ink ' +
  'transition-[background-color,color,transform] duration-(--dur-micro) ease-out active:translate-y-px ' +
  '[@media(hover:hover)]:hover:bg-ink [@media(hover:hover)]:hover:text-paper';

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
      <figure className="mt-6">
        <div data-reveal="curtain" className="relative aspect-[3/2] overflow-hidden bg-paper-2">
          <Image
            src={venue.photo.src}
            // Описание снимка — в подписи под ним, alt его не повторяет.
            alt=""
            fill
            sizes="(min-width: 36rem) 33rem, 90vw"
            className="object-cover"
          />
        </div>
        <figcaption className="mt-2 text-muted italic">{pick(venue.photo.alt)}</figcaption>
      </figure>

      <h3 className="mt-6 text-md">{pick(venue.name)}</h3>
      <address className="mt-1 text-ink-2 not-italic">
        {pick(venue.city)}, {pick(venue.address)}
      </address>

      <div className="mt-6 grid gap-3 min-[23rem]:grid-cols-2">
        {maps.map((map) => (
          <a key={map.name} href={map.href} target="_blank" rel="noopener noreferrer" aria-label={map.label} className={MAP_LINK}>
            {map.name}
            <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor">
              <path d="M2 10 10 2M4 2h6v6" strokeWidth="1.25" />
            </svg>
          </a>
        ))}
      </div>
    </Section>
  );
}
