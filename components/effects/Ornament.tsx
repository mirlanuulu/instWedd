'use client';

import { useRef } from 'react';
import { useMotion } from '@/lib/motionLoader';
import styles from './Ornament.module.css';

/*
 * Ою-оймо: мотив «кочкор мүйүз» (бараний рог). Рог — стебель, от которого
 * в две стороны расходятся завитки. Все узоры собраны из одной этой пары.
 */

/** Пара рогов, смотрящая вправо. Стебель начинается в точке (0, 0). */
const HORN_UP = 'M12 0C20 0 29 -4 27 -11C25.5 -16.5 16.5 -16.5 16.5 -10.5C16.5 -7 21 -6 22 -9';
const HORN_DOWN = 'M12 0C20 0 29 4 27 11C25.5 16.5 16.5 16.5 16.5 10.5C16.5 7 21 6 22 9';
const STEM = 'M0 0H12';

function HornPair({ transform }: { transform: string }) {
  return (
    <g transform={transform}>
      <path pathLength={1} d={STEM} />
      <path pathLength={1} d={HORN_UP} />
      <path pathLength={1} d={HORN_DOWN} />
    </g>
  );
}

/** Горизонтальный разделитель: ромб, рога в обе стороны и линии с наконечниками. */
function Divider() {
  return (
    <>
      <path pathLength={1} d="M120 9L131 20L120 31L109 20Z" />
      <path pathLength={1} d="M120 15L125 20L120 25L115 20Z" />
      <HornPair transform="translate(131 20)" />
      <HornPair transform="translate(109 20) scale(-1 1)" />
      <path pathLength={1} d="M166 20H222" />
      <path pathLength={1} d="M74 20H18" />
      <path pathLength={1} d="M222 20L227 15L232 20L227 25Z" />
      <path pathLength={1} d="M18 20L13 15L8 20L13 25Z" />
    </>
  );
}

/** Розетка: ромб и четыре пары рогов по сторонам света. */
function Crest() {
  return (
    <>
      <path pathLength={1} d="M60 46L74 60L60 74L46 60Z" />
      <path pathLength={1} d="M60 53L67 60L60 67L53 60Z" />
      <HornPair transform="translate(74 60)" />
      <HornPair transform="translate(60 74) rotate(90)" />
      <HornPair transform="translate(46 60) rotate(180)" />
      <HornPair transform="translate(60 46) rotate(270)" />
    </>
  );
}

const VARIANTS = {
  divider: { viewBox: '0 0 240 40', width: 240, height: 40, Shape: Divider },
  crest: { viewBox: '0 0 120 120', width: 120, height: 120, Shape: Crest },
} as const;

interface OrnamentProps {
  variant: keyof typeof VARIANTS;
  /** Цвет и размер. Узор рисуется цветом текста. */
  className?: string;
}

/**
 * Узор ою-оймо. По умолчанию нарисован целиком; когда загрузился чанк
 * с анимациями, OrnamentDraw прорисовывает его по линиям при появлении на экране.
 */
export function Ornament({ variant, className = '' }: OrnamentProps) {
  const svg = useRef<SVGSVGElement>(null);
  const motion = useMotion();
  const { viewBox, width, height, Shape } = VARIANTS[variant];

  return (
    <svg
      ref={svg}
      viewBox={viewBox}
      width={width}
      height={height}
      aria-hidden="true"
      focusable="false"
      className={`${styles.ornament} ${className}`}
    >
      <Shape />
      {motion && <motion.OrnamentDraw svg={svg} />}
    </svg>
  );
}
