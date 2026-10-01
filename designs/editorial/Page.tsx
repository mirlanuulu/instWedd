import type { HTMLAttributes, ReactNode } from 'react';

/** Колонка номера: на телефоне во всю ширину, на десктопе — шириной журнальной полосы. */
export function Page({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className={`mx-auto w-full max-w-page px-gutter ${className}`}>
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
 * Рубрика номера: толстая линейка во всю колонку и заголовок под ней.
 * Линейки, а не пустоты, отделяют материалы друг от друга — как в журнале.
 * При появлении по заголовку пробегает красная шторка.
 */
export function Section({ labelledBy, title, className = 'pt-16 pb-4', children }: SectionProps) {
  return (
    <section aria-labelledby={labelledBy} className={className}>
      <Page>
        <div className="border-t-[3px] border-ink pt-4">
          <h2 id={labelledBy} className="text-xl">
            <span data-reveal="bar">{title}</span>
          </h2>
        </div>
        {children}
      </Page>
    </section>
  );
}
