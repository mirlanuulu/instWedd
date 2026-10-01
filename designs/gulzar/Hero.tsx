'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import { useRef } from 'react';
import { useInvite } from '@/components/providers/InviteProvider';
import { useIntroPhase } from '@/components/providers/IntroProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { formatEventDate } from '@/lib/invite';
import { useReducedMotion } from '@/lib/motion';
import { Amp } from './Amp';
import { Butterfly, Flower, LEAVES_SIZES, type FlowerPlacement } from './Flower';
import { COUPLE_PHOTO } from './flowers';

gsap.registerPlugin(useGSAP);

/* Цветы вокруг арки — проценты обёртки арки (ширина × высота 4:5). */
const BEHIND: FlowerPlacement[] = [
  { name: 'leaves', x: -44, y: -6, w: 80, r: -22, sway: [9, 1] },
  { name: 'leaves', x: 64, y: 44, w: 72, r: 196, flip: true, sway: [10, 4] },
];

const FRONT: FlowerPlacement[] = [
  { name: 'wildSolid', x: 50, y: -5, w: 72, r: 15, sway: [7.5, 2] },
  { name: 'pinkSolid', x: -32, y: 73, w: 76, r: -8, sway: [8, 0] },
  { name: 'centifoliaSolid', x: 62, y: 86, w: 54, r: 12, flip: true, sway: [7, 3] },
];

/** Арка — min(72vw, 23rem); цветок занимает свою долю от неё (~80%, как и в воротах). */
const sizesFor = (f: FlowerPlacement) =>
  f.name === 'leaves' ? LEAVES_SIZES : `min(${Math.round(f.w * 0.58)}vw, ${Math.round(f.w * 0.23 * 16 * 0.8)}px)`;

export function Hero() {
  const invite = useInvite();
  const { pick, t } = useLocale();
  const phase = useIntroPhase();
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const date = formatEventDate(invite.event, t);
  const [first, second] = invite.couple;

  // Пока ворота закрыты, первый экран спрятан под ними; появление начинается с открытием.
  useGSAP(
    () => {
      if (reduced) return;
      if (phase === 'sealed') {
        gsap.set('[data-hero-in]', { autoAlpha: 0, y: 24 });
        gsap.set('.g-arch', { autoAlpha: 0, scale: 1.06 });
        gsap.set('.g-arch-wrap [data-flower]', { autoAlpha: 0, scale: 0.6 });
        return;
      }
      if (phase === 'opening') {
        const tl = gsap.timeline({ delay: 0.45, defaults: { ease: 'power3.out' } });
        tl.to('.g-arch', { autoAlpha: 1, scale: 1, duration: 1.4 })
          .to(
            '.g-arch-wrap [data-flower]',
            { autoAlpha: 1, scale: 1, duration: 1.1, ease: 'back.out(1.6)', stagger: 0.12 },
            0.35,
          )
          .to('[data-hero-in]', { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.2);
      }
    },
    { scope: root, dependencies: [phase, reduced] },
  );

  return (
    <header ref={root} className="g-hero">
      <p className="g-eyebrow" data-hero-in>
        {pick(invite.event.title)}
      </p>

      <div className="g-arch-wrap">
        {BEHIND.map((f) => (
          <Flower key={f.name + f.x} {...f} sizes={sizesFor(f)} />
        ))}
        <div className="g-arch">
          <Image
            src={COUPLE_PHOTO.src}
            width={COUPLE_PHOTO.w}
            height={COUPLE_PHOTO.h}
            alt={`${pick(first.name)} ${t.hero.and} ${pick(second.name)}`}
            sizes="min(72vw, 368px)"
            loading="eager"
          />
        </div>
        {FRONT.map((f) => (
          <Flower key={f.name + f.x} {...f} sizes={sizesFor(f)} />
        ))}
        <Butterfly kind="blue" x={-10} y={34} w={2.8} r={-16} wander={9} />
        <Butterfly kind="amber" x={92} y={58} w={2.6} r={20} wander={11} delay={4} flap={0.36} />
      </div>

      <h1 className="g-names g-hero-names" data-hero-in>
        {pick(first.name)}
        <Amp label={t.hero.and} />
        {pick(second.name)}
      </h1>

      <p className="g-invitation" data-hero-in>
        {pick(invite.event.invitation)}
      </p>

      <div data-hero-in>
        <div className="g-date">
          <span className="g-date-side">{date.weekday}</span>
          <span className="g-date-day">{date.day}</span>
          <span className="g-date-side">{invite.event.time}</span>
        </div>
        <p className="g-date-month">
          {t.date.months[date.month - 1]} {date.year}
        </p>
      </div>
    </header>
  );
}
