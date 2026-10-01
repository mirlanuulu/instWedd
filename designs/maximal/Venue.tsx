'use client';

import Image from 'next/image';
import { mapLinks } from '@/lib/invite';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { delay } from '@/designs/shared/reveal';
import { Section } from './parts';

const MAP_LINK =
  'flex min-h-12 items-center justify-center gap-2 rounded-pill bg-gold px-4 font-semibold whitespace-nowrap text-ink ' +
  'shadow-[0.25rem_0.25rem_0_var(--color-magenta)] transition-[transform,box-shadow] duration-(--dur-micro) ease-out ' +
  'active:translate-x-1 active:translate-y-1 active:shadow-none [@media(hover:hover)]:hover:-translate-y-0.5';

/** Место: фото в золотой рамке, адрес, ссылки на карты — золотые кнопки-пилюли. */
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
    <Section labelledBy="venue-title" title={t.venue.title} band="emerald">
      <div data-reveal="pop" className="frame relative mt-8 aspect-[3/2] overflow-hidden bg-emerald-2">
        <Image
          src={venue.photo.src}
          alt={pick(venue.photo.alt)}
          fill
          sizes="(min-width: 36rem) 32rem, 88vw"
          className="object-cover"
        />
      </div>

      <h3 className="mt-8 text-md text-gold">{pick(venue.name)}</h3>
      <address className="mt-1 text-on-2 not-italic">
        {pick(venue.city)}, {pick(venue.address)}
      </address>

      <div data-reveal="up" style={delay(200)} className="mt-6 grid gap-4 min-[26rem]:grid-cols-2">
        {maps.map((map) => (
          <a key={map.name} href={map.href} target="_blank" rel="noopener noreferrer" aria-label={map.label} className={MAP_LINK}>
            {map.name}
            <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor">
              <path d="M2 10 10 2M4 2h6v6" strokeWidth="2" />
            </svg>
          </a>
        ))}
      </div>
    </Section>
  );
}
