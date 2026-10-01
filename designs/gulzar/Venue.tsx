'use client';

import Image from 'next/image';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { mapLinks } from '@/lib/invite';
import { GardenSection } from './GardenSection';

/** Место тоя: фото зала в золотой рамке, адрес и две карты. */
export function Venue() {
  const { venue } = useInvite();
  const { pick, t } = useLocale();
  const links = mapLinks(venue);

  return (
    <GardenSection id="venue">
      <figure className="g-venue">
        <div className="g-venue-photo">
          <Image src={venue.photo.src} alt={pick(venue.photo.alt)} fill sizes="(max-width: 34rem) 86vw, 30rem" />
        </div>
        <figcaption className="g-venue-text">
          <span className="g-venue-name">{pick(venue.name)}</span>
          <span className="g-venue-address">
            {pick(venue.address)}, {pick(venue.city)}
          </span>
        </figcaption>
      </figure>
      <div className="g-venue-links">
        <a className="g-button" href={links.twoGis} target="_blank" rel="noopener noreferrer">
          {t.venue.open2gis}
        </a>
        <a className="g-button g-button-quiet" href={links.googleMaps} target="_blank" rel="noopener noreferrer">
          {t.venue.openGoogle}
        </a>
      </div>
    </GardenSection>
  );
}
