import Image from 'next/image';
import type { CSSProperties } from 'react';
import { FLOWERS, type FlowerName } from './flowers';

/** Листья на странице в нескольких местах: один `sizes`, один файл. */
export const LEAVES_SIZES = '52vw';

export interface FlowerPlacement {
  name: FlowerName;
  /** Левый верхний угол и ширина — в процентах родителя. */
  x: number;
  y: number;
  w: number;
  /** Поворот в градусах. */
  r?: number;
  /** Отразить по горизонтали. */
  flip?: boolean;
  /** Покачивание: длительность и задержка в секундах. Без них цветок неподвижен. */
  sway?: [duration: number, delay: number];
  /** Над карточкой, а не под ней. */
  front?: boolean;
}

/**
 * Цветок-акварель, расставленный по процентам родителя.
 * `sizes` — доля ширины экрана, которую цветок занимает, чтобы телефон
 * скачивал картинку нужного размера, а не исходник.
 */
export function Flower({
  name,
  x,
  y,
  w,
  r = 0,
  flip,
  sway,
  sizes,
  className = '',
  eager,
}: FlowerPlacement & { sizes: string; className?: string; eager?: boolean }) {
  const asset = FLOWERS[name];
  const style = {
    '--x': `${x}%`,
    '--y': `${y}%`,
    '--w': `${w}%`,
    '--r': `${r}deg`,
    '--flip': flip ? -1 : 1,
    ...(sway && { '--sway-dur': `${sway[0]}s`, '--sway-delay': `${-sway[1]}s` }),
  } as CSSProperties;

  return (
    <Image
      src={asset.src}
      width={asset.w}
      height={asset.h}
      alt=""
      sizes={sizes}
      loading={eager ? 'eager' : undefined}
      draggable={false}
      data-flower
      className={`g-flower ${sway ? 'g-sway' : ''} ${className}`}
      style={style}
    />
  );
}

export function Butterfly({
  kind,
  x,
  y,
  w,
  r = 0,
  flap = 0.3,
  wander = 9,
  delay = 0,
}: {
  kind: 'blue' | 'amber';
  x: number;
  y: number;
  /** Ширина в rem. */
  w: number;
  r?: number;
  /** Период взмаха и круга порхания, в секундах. */
  flap?: number;
  wander?: number;
  delay?: number;
}) {
  const asset = kind === 'blue' ? FLOWERS.butterflyBlue : FLOWERS.butterflyAmber;
  const style = {
    '--x': `${x}%`,
    '--y': `${y}%`,
    '--w': `${w}rem`,
    '--r': `${r}deg`,
    '--flap': `${flap}s`,
    '--wander': `${wander}s`,
    '--wander-delay': `${-delay}s`,
  } as CSSProperties;

  return (
    <span className="g-butterfly" style={style} data-butterfly aria-hidden>
      <Image src={asset.src} width={asset.w} height={asset.h} alt="" sizes="64px" draggable={false} />
    </span>
  );
}
