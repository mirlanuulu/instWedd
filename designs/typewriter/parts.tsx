'use client';

import { useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { delay } from '@/designs/shared/reveal';

/** Колонка бланка: на телефоне во всю ширину, на десктопе — 36rem. */
export function Blank({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className={`mx-auto w-full max-w-blank px-gutter ${className}`}>
      {children}
    </div>
  );
}

interface SectionProps {
  labelledBy: string;
  title: string;
  className?: string;
  children: ReactNode;
}

/** Раздел бланка: синяя линия, заголовок печатается на ленте буква за буквой. */
export function Section({ labelledBy, title, className = 'pt-14 pb-4', children }: SectionProps) {
  return (
    <section aria-labelledby={labelledBy} className={className}>
      <Blank>
        <div className="border-t-2 border-form pt-4">
          <h2 id={labelledBy} className="text-xl">
            <Typed text={title} />
          </h2>
        </div>
        {children}
      </Blank>
    </section>
  );
}

interface TypedProps {
  text: string;
  /** Задержка до первой буквы, мс. */
  start?: number;
  /** Лента под текстом: каждая строка — белая полоска. */
  strip?: boolean;
  /** Мигающая каретка в конце. */
  caret?: boolean;
}

/**
 * Текст, который печатается на глазах: буквы появляются по одной, как удары
 * литер. Скринридер читает его целиком, буквы для него скрыты.
 */
export function Typed({ text, start = 0, strip = true, caret = false }: TypedProps) {
  return (
    <span data-reveal="type" style={delay(start)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={strip ? 'strip' : ''}>
        {Array.from(text).map((char, index) => (
          <span key={index} className="type-letter" style={{ '--i': index } as CSSProperties}>
            {char}
          </span>
        ))}
        {caret && <span className="caret" />}
      </span>
    </span>
  );
}

interface PostmarkProps {
  /** Город — по верхней дуге. */
  city: string;
  /** "29.11" — крупно в центре. */
  dayMonth: string;
  year: number;
  className?: string;
  style?: CSSProperties;
}

/** Почтовый штемпель: двойной круг, город по дуге, дата в центре. */
export function Postmark({ city, dayMonth, year, className = '', style }: PostmarkProps) {
  // Своя дуга у каждого штемпеля: на странице их несколько.
  const arc = useId();
  return (
    <svg aria-hidden="true" viewBox="0 0 120 120" className={`postmark ${className}`} style={style}>
      <defs>
        <path id={arc} d="M18 60a42 42 0 0 1 84 0" />
      </defs>
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text fill="currentColor" fontSize="11" fontWeight="700" letterSpacing="2">
        <textPath href={`#${arc}`} startOffset="50%" textAnchor="middle">
          {city.toUpperCase()}
        </textPath>
      </text>
      <text x="60" y="64" textAnchor="middle" fill="currentColor" fontSize="17" fontWeight="700">
        {dayMonth}
      </text>
      <text x="60" y="81" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="500">
        {year}
      </text>
      <path d="M8 94h104M14 102h92" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
