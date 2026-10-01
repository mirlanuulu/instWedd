'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { useInvite } from '@/components/providers/InviteProvider';
import { useIntro } from '@/components/providers/IntroProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { formatEventDate } from '@/lib/invite';
import { useReducedMotion } from '@/lib/motion';
import { Amp } from './Amp';
import { Butterfly, Flower, LEAVES_SIZES, type FlowerPlacement } from './Flower';

gsap.registerPlugin(useGSAP);

/*
 * Композиция ворот на портретной сцене (проценты сцены). Левая и правая
 * створки — разные цветы, чтобы не было зеркальной симметрии.
 * front — цветок лежит поверх карточки и прикрывает её край.
 */
const LEFT: FlowerPlacement[] = [
  { name: 'leaves', x: -38, y: -14, w: 74, r: 196, sway: [9, 2] },
  { name: 'leaves', x: -44, y: 34, w: 70, r: 100, sway: [10, 5] },
  { name: 'centifolia', x: -20, y: 1, w: 84, r: -9, sway: [8, 0] },
  { name: 'china', x: -30, y: 63, w: 74, r: 9, sway: [7.5, 3] },
  { name: 'blossom', x: -6, y: 15, w: 40, r: -18, sway: [6.5, 4], front: true },
];

const RIGHT: FlowerPlacement[] = [
  { name: 'leaves', x: 66, y: 38, w: 70, r: -80, flip: true, sway: [9.5, 5] },
  { name: 'pink', x: 36, y: -4, w: 82, r: 10, flip: true, sway: [8, 2] },
  { name: 'centifoliaMid', x: 40, y: 72, w: 74, r: 6, flip: true, sway: [8.5, 3] },
  { name: 'wild', x: 14, y: 85, w: 62, r: -6, sway: [7, 0] },
  { name: 'gallica', x: 64, y: 13, w: 42, r: -8, sway: [6.5, 1], front: true },
];

/**
 * `sizes` для цветка шириной w% сцены. Нарочно ~70% от настоящей ширины:
 * акварели хватает, а на экранах ×3 это треть веса. Листья — один размер
 * на всю страницу, чтобы файл скачался один раз.
 */
const sizesFor = (f: FlowerPlacement) => (f.name === 'leaves' ? LEAVES_SIZES : `${Math.round(f.w * 0.7)}vw`);

function Leaf({ side, front }: { side: 'left' | 'right'; front: boolean }) {
  const flowers = (side === 'left' ? LEFT : RIGHT).filter((f) => !!f.front === front);
  return (
    <div className="g-gate-leaf" data-leaf={side}>
      {flowers.map((f) => (
        <Flower key={f.name + f.x} {...f} sizes={sizesFor(f)} eager />
      ))}
    </div>
  );
}

export function GardenGate() {
  const invite = useInvite();
  const { pick, t } = useLocale();
  const { phase, setPhase } = useIntro();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const date = formatEventDate(invite.event, t);
  const [first, second] = invite.couple;

  const started = useRef(false);
  const { contextSafe } = useGSAP({ scope: root });

  const open = contextSafe(() => {
    if (started.current || phase !== 'sealed') return;
    started.current = true;
    setPhase('opening');
    const done = () => setPhase('opened');

    if (reduced) {
      gsap.to(root.current, { autoAlpha: 0, duration: 0.4, onComplete: done });
      return;
    }

    const tl = gsap.timeline({ onComplete: done, defaults: { ease: 'power3.inOut' } });
    // Карточка: короткий «нажим» и уход вверх с размытием.
    tl.to('.g-gate-card', { scale: 0.97, duration: 0.12, ease: 'power1.out' })
      .to('.g-gate-card', { y: -36, autoAlpha: 0, filter: 'blur(8px)', duration: 0.7, ease: 'power2.in' })
      // Створки расходятся, каждый цветок — со своим разлётом (глубина).
      .to('[data-leaf="left"]', { xPercent: -95, rotation: -7, duration: 1.6 }, 0.2)
      .to('[data-leaf="right"]', { xPercent: 95, rotation: 7, duration: 1.6 }, 0.2)
      .to(
        '[data-leaf] [data-flower]',
        {
          y: () => gsap.utils.random(-70, 30),
          rotation: () => gsap.utils.random(-18, 18),
          scale: () => gsap.utils.random(1.04, 1.18),
          duration: 1.6,
          stagger: { each: 0.04, from: 'random' },
        },
        0.2,
      )
      .to('[data-butterfly]', { x: () => gsap.utils.random(-160, 160), y: -420, autoAlpha: 0, duration: 1.6, ease: 'power2.in' }, 0.2)
      // Бумага ворот тает, под ней — первый экран.
      .to('.g-gate-paper', { autoAlpha: 0, duration: 0.8, ease: 'power1.inOut' }, 0.45);
  });

  if (phase === 'opened') return null;

  return (
    // Тап в любом месте открывает; для клавиатуры и скринридера — кнопка внутри.
    <div ref={root} className="g-gate" data-intro onClick={open}>
      <div className="g-gate-paper" />
      <div className="g-gate-stage">
        <Leaf side="left" front={false} />
        <Leaf side="right" front={false} />

        <div className="g-gate-card-wrap">
          <div className="g-gate-card">
            <p className="g-eyebrow">{pick(invite.event.title)}</p>
            <p className="g-names g-gate-names">
              {pick(first.name)}
              <Amp label={t.hero.and} />
              {pick(second.name)}
            </p>
            <p className="g-gate-date">{date.numeric}</p>
            <button
              type="button"
              className="g-open"
              onClick={(event) => {
                event.stopPropagation();
                open();
              }}
            >
              {t.intro.open}
            </button>
          </div>
        </div>

        <Leaf side="left" front />
        <Leaf side="right" front />

        <Butterfly kind="blue" x={46} y={11} w={2.8} r={14} wander={8} />
        <Butterfly kind="amber" x={80} y={64} w={3} r={-18} wander={10} delay={3} />
      </div>
    </div>
  );
}
