import type { HTMLAttributes, ReactNode } from 'react';

/** Колонка приглашения: на телефоне во всю ширину, на десктопе — шириной с открытку. */
export function Sheet({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className={`mx-auto w-full max-w-sheet px-gutter ${className}`}>
      {children}
    </div>
  );
}

interface SectionProps {
  labelledBy: string;
  /** Отступы у секций разные: ритм страницы неровный намеренно. */
  className?: string;
  children: ReactNode;
}

export function Section({ labelledBy, className = 'py-20', children }: SectionProps) {
  return (
    <section aria-labelledby={labelledBy} className={className}>
      {children}
    </section>
  );
}

/** Заголовок секции: тонкая антиква, по левому краю, без надстрочных меток. */
export function Heading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="text-xl">
      {children}
    </h2>
  );
}
