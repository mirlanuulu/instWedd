'use client';

import Image from 'next/image';
import { mapLinks } from '@/lib/invite';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Button } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';

export function Venue() {
  const invite = useInvite();
  const { t, pick } = useLocale();
  const { venue } = invite;
  const links = mapLinks(venue);

  return (
    <Section labelledBy="venue-title">
      <SectionHeading id="venue-title">{t.venue.title}</SectionHeading>

      <div className="relative mt-8 aspect-[3/2] overflow-hidden rounded-(--radius-card) bg-paper-2 outline-(length:--photo-frame-width) outline-offset-[5px] outline-accent-2">
        <Image
          src={venue.photo.src}
          alt={pick(venue.photo.alt)}
          fill
          sizes="(min-width: 30rem) 30rem, 100vw"
          className="object-cover"
        />
      </div>

      <h3 className="mt-8 text-lg">{pick(venue.name)}</h3>
      <address className="mt-2 text-ink-2 not-italic">
        {pick(venue.city)}, {pick(venue.address)}
      </address>

      <div className="mt-8 grid gap-3">
        <Button href={links.twoGis} target="_blank" rel="noopener noreferrer">
          {t.venue.open2gis}
        </Button>
        <Button href={links.googleMaps} target="_blank" rel="noopener noreferrer" variant="secondary">
          {t.venue.openGoogle}
        </Button>
      </div>
    </Section>
  );
}
