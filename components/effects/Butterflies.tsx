'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/motion';
import { useInView } from '@/lib/useInView';
import { useIntroPhase } from '@/components/providers/IntroProvider';
import styles from './Butterflies.module.css';

/** Правое крыло: шарнир на левом краю (x = 0), верхняя и нижняя лопасти. */
const WING = 'M0 30C8 6 38 -3 47 11C52 21 39 32 22 33C36 36 41 50 31 56C20 61 6 47 0 32Z';

/**
 * Крупные бабочки ближе: они быстрее и плотнее. Мелкие дальше:
 * медленнее и прозрачнее. Разница и создаёт глубину.
 */
const FLOCK = [
  { size: 36, leg: 8, flap: 0.3, opacity: 0.9, color: 'text-petal-2' },
  { size: 28, leg: 10, flap: 0.36, opacity: 0.8, color: 'text-accent-2' },
  { size: 24, leg: 11.5, flap: 0.4, opacity: 0.7, color: 'text-petal-1' },
  { size: 19, leg: 13, flap: 0.46, opacity: 0.6, color: 'text-gold-deep' },
  { size: 15, leg: 15, flap: 0.52, opacity: 0.5, color: 'text-petal-2' },
] as const;

const random = gsap.utils.random;

/** Бабочки летают внутри ближайшего позиционированного родителя. */
export function Butterflies() {
  const reduced = useReducedMotion();
  const phase = useIntroPhase();
  const layer = useRef<HTMLDivElement>(null);
  const inView = useInView(layer);
  const flights = useRef(new Map<Element, gsap.core.Tween>());

  const active = !reduced && phase === 'opened';

  useGSAP(
    (_context, contextSafe) => {
      const box = layer.current;
      if (!active || !box || !contextSafe) return;

      // Следующий отрезок пути: несколько случайных точек внутри слоя, сглаженных в кривую.
      // contextSafe: твины, созданные позже из onComplete, тоже снимутся при размонтировании.
      const fly = contextSafe((butterfly: HTMLElement, leg: number) => {
        const { width, height } = box.getBoundingClientRect();
        // Точки лежат в полосах у левого и правого края: середину с текстом
        // бабочка пересекает только на перелёте между ними.
        const path = Array.from({ length: 4 }, () => ({
          x: width * (Math.random() < 0.5 ? random(0.04, 0.26) : random(0.74, 0.96)),
          y: random(height * 0.05, height * 0.9),
        }));
        const tween = gsap.to(butterfly, {
          motionPath: { path, curviness: 1.5, autoRotate: 90 },
          duration: leg * random(0.85, 1.2),
          ease: 'sine.inOut',
          onComplete: () => fly(butterfly, leg),
        });
        flights.current.set(butterfly, tween);
      });

      gsap.utils.toArray<HTMLElement>('[data-butterfly]', box).forEach((butterfly, index) => {
        const spec = FLOCK[index];
        if (!spec) return;
        const { width, height } = box.getBoundingClientRect();
        // Влетают из-за левого или правого края.
        gsap.set(butterfly, {
          x: index % 2 ? width + spec.size : -spec.size,
          y: random(height * 0.15, height * 0.7),
        });
        gsap.to(butterfly, { opacity: spec.opacity, duration: 1.2, delay: 0.6 + index * 0.35, ease: 'none' });
        gsap.delayedCall(0.6 + index * 0.35, () => fly(butterfly, spec.leg));
      });

      const tracked = flights.current;
      return () => tracked.clear();
    },
    { scope: layer, dependencies: [active], revertOnUpdate: true },
  );

  // Слой ушёл с экрана: полёт встаёт на паузу и продолжается с того же места.
  useEffect(() => {
    flights.current.forEach((tween) => tween.paused(!inView));
  }, [inView]);

  if (reduced) return null;

  return (
    <div ref={layer} aria-hidden="true" className={`${styles.layer} ${inView ? '' : styles.paused}`}>
      {FLOCK.map((spec, index) => (
        <span
          key={index}
          data-butterfly
          className={`${styles.butterfly} ${spec.color}`}
          style={
            {
              '--size': `${spec.size}px`,
              '--flap': `${spec.flap}s`,
              '--phase': `${-index * 0.13}s`,
            } as CSSProperties
          }
        >
          <span className={styles.wings}>
            <span className={`${styles.side} ${styles.sideLeft}`}>
              <svg className={styles.wing} viewBox="0 0 50 60" preserveAspectRatio="none" focusable="false">
                <path d={WING} />
              </svg>
            </span>
            <span className={styles.side}>
              <svg className={styles.wing} viewBox="0 0 50 60" preserveAspectRatio="none" focusable="false">
                <path d={WING} />
              </svg>
            </span>
          </span>
          <span className={styles.body} />
        </span>
      ))}
    </div>
  );
}
