'use client';

import { useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { delay, Letters } from '@/designs/shared/reveal';

/** Колонка сцены: на телефоне во всю ширину, на десктопе — 36rem. */
export function Stage({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className={`mx-auto w-full max-w-stage px-gutter ${className}`}>
      {children}
    </div>
  );
}

export type BandColor = 'emerald' | 'magenta' | 'cream' | 'turquoise' | 'deep';

interface SectionProps {
  labelledBy: string;
  title: string;
  band: BandColor;
  className?: string;
  children: ReactNode;
}

/**
 * Раздел — цветная полоса с фестонами сверху. Заголовок толстой дидоной,
 * буквы вылетают по одной, рядом звёздочка.
 */
export function Section({ labelledBy, title, band, className = 'pt-16 pb-20', children }: SectionProps) {
  return (
    <section aria-labelledby={labelledBy} className={`band band-${band} ${className}`}>
      <Stage>
        <h2 id={labelledBy} className="flex items-start gap-3 text-xl">
          <Sparkle className="mt-1 size-6 shrink-0 text-pop" />
          <Letters text={title} />
        </h2>
        {children}
      </Stage>
    </section>
  );
}

/** Звёздочка с четырьмя лучами. С twinkle — мерцает. */
export function Sparkle({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  );
}

/** Россыпь мерцающих звёздочек поверх блока. Положение и размер — данные, не случайность: SSR и браузер рисуют одно и то же. */
const STARS = [
  { top: '8%', left: '6%', size: 18, d: 0 },
  { top: '14%', left: '82%', size: 26, d: 600 },
  { top: '42%', left: '90%', size: 14, d: 1200 },
  { top: '58%', left: '4%', size: 22, d: 300 },
  { top: '74%', left: '70%', size: 16, d: 900 },
  { top: '88%', left: '24%', size: 20, d: 1500 },
];

export function Stars() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {STARS.map((star) => (
        <Sparkle
          key={`${star.top}-${star.left}`}
          className="twinkle absolute text-gold"
          style={{ top: star.top, left: star.left, width: star.size, height: star.size, ...delay(star.d) }}
        />
      ))}
    </span>
  );
}

/** Бегущая строка: текст повторяется, лента едет без шва. */
export function Marquee({ items }: { items: string[] }) {
  const run = (hidden: boolean) => (
    <span aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, index) => (
        <span key={index} className="flex items-center">
          <span className="px-5 whitespace-nowrap">{item}</span>
          <Sparkle className="size-4 text-gold" />
        </span>
      ))}
    </span>
  );
  return (
    <div className="marquee border-y-4 border-gold bg-magenta py-3 font-display text-md text-paper">
      <div className="marquee-track">
        {/* Вторая копия — только для непрерывности: скринридер её не читает. */}
        {run(false)}
        {run(true)}
        {run(true)}
        {run(true)}
      </div>
    </div>
  );
}

/** Значок с датой: надпись по кругу вращается, число в центре стоит. */
export function DateBadge({ ring, day, month }: { ring: string; day: string; month: string }) {
  const arc = useId();
  return (
    <span aria-hidden="true" className="relative grid size-32 shrink-0 place-items-center rounded-pill bg-gold text-ink">
      <svg viewBox="0 0 120 120" className="spin absolute inset-0">
        <defs>
          <path id={arc} d="M60 60m-48 0a48 48 0 1 1 96 0a48 48 0 1 1-96 0" />
        </defs>
        <text fill="currentColor" fontSize="10.5" fontWeight="700">
          {/* textLength растягивает надпись ровно на окружность: без шва и обрезанных букв. */}
          <textPath href={`#${arc}`} textLength="301" lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
      </svg>
      <span className="relative text-center leading-none">
        <span className="block font-display text-[2.6rem]">{day}</span>
        <span className="label block">{month}</span>
      </span>
    </span>
  );
}
