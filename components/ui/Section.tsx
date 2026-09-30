import type { ReactNode } from 'react';
import { invite } from '@/config/invite';
import { Ornament } from '@/components/effects/Ornament';

interface SectionProps {
  /** alt — контрастная поверхность темы: пудровая в romantic, бордовая в national. */
  surface?: 'base' | 'alt';
  /** Вертикальные отступы. У соседних секций они намеренно разные. */
  className?: string;
  labelledBy?: string;
  children: ReactNode;
}

/** Полоса во всю ширину экрана с колонкой приглашения внутри. */
export function Section({ surface = 'base', className = 'py-section', labelledBy, children }: SectionProps) {
  return (
    <section
      data-surface={surface === 'alt' ? 'alt' : undefined}
      aria-labelledby={labelledBy}
      className={`px-gutter ${className}`}
    >
      <div className="mx-auto max-w-invite">{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  id: string;
  align?: 'start' | 'center';
  children: ReactNode;
}

/** Заголовок секции. В теме national под ним прорисовывается орнамент. */
export function SectionHeading({ id, align = 'start', children }: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <>
      <h2 id={id} className={`text-xl ${centered ? 'text-center' : ''}`}>
        {children}
      </h2>
      {invite.theme === 'national' && (
        <Ornament
          variant="divider"
          className={`mt-4 h-7 w-auto text-accent-2 ${centered ? 'mx-auto' : '-ml-1.5'}`}
        />
      )}
    </>
  );
}
