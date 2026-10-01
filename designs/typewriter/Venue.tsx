'use client';

import Image from 'next/image';
import { mapLinks } from '@/lib/invite';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { delay } from '@/designs/shared/reveal';
import { Section } from './parts';

const MAP_LINK =
  'flex min-h-12 items-center justify-between gap-3 border-2 border-form px-4 font-bold whitespace-nowrap text-form uppercase ' +
  'transition-[background-color,color,transform] duration-(--dur-micro) ease-out active:translate-y-px ' +
  '[@media(hover:hover)]:hover:bg-form [@media(hover:hover)]:hover:text-strip';

/** Место: фото в уголках, адрес на ленте, ссылки на карты — как графы бланка. */
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
      <div
        data-reveal="pop"
        className="photo-corners mt-6 bg-strip p-2.5 shadow-[0_2px_6px_color-mix(in_oklch,var(--color-ink)_22%,transparent)]"
        style={{ rotate: '-0.8deg' }}
      >
        <div className="relative aspect-[3/2] overflow-hidden bg-paper-2">
          <Image
            src={venue.photo.src}
            alt={pick(venue.photo.alt)}
            fill
            sizes="(min-width: 36rem) 32rem, 88vw"
            className="object-cover"
          />
        </div>
      </div>

      <p className="form-label mt-6">{pick(venue.city)}</p>
      <h3 className="tape mt-1 text-md">
        <span className="strip">{pick(venue.name)}</span>
      </h3>
      <address className="mt-2 text-ink-2 not-italic">{pick(venue.address)}</address>

      <div data-reveal="up" style={delay(200)} className="mt-6 grid gap-3 min-[23rem]:grid-cols-2">
        {maps.map((map) => (
          <a key={map.name} href={map.href} target="_blank" rel="noopener noreferrer" aria-label={map.label} className={MAP_LINK}>
            {map.name}
            <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor">
              <path d="M2 10 10 2M4 2h6v6" strokeWidth="1.75" />
            </svg>
          </a>
        ))}
      </div>
    </Section>
  );
}
