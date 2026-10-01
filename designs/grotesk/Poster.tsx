import type { HTMLAttributes, ReactNode } from 'react';

/** Колонка плаката: на телефоне во всю ширину, на десктопе — 38rem. */
export function Poster({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className={`mx-auto w-full max-w-poster px-gutter ${className}`}>
      {children}
    </div>
  );
}

interface SectionProps {
  labelledBy: string;
  title: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * Блок плаката: двухпиксельная линейка и крупный жирный заголовок по левому краю.
 * При появлении по заголовку пробегает кобальтовая шторка и открывает текст.
 */
export function Section({ labelledBy, title, className = 'pt-14 pb-6', children }: SectionProps) {
  return (
    <section aria-labelledby={labelledBy} className={className}>
      <Poster>
        <div className="border-t-2 border-ink pt-3">
          <h2 id={labelledBy} className="text-xl">
            <span data-reveal="bar">{title}</span>
          </h2>
        </div>
        {children}
      </Poster>
    </section>
  );
}
