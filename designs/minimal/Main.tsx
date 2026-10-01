'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useIntro } from '@/components/providers/IntroProvider';

interface MainProps {
  children: ReactNode;
  /** Подвал стоит рядом с <main>, а не внутри: так это ориентир страницы для скринридера. */
  footer: ReactNode;
}

/**
 * Приглашение под калькой. Пока лист лежит, оно недоступно ни для касаний,
 * ни для клавиатуры и скринридера.
 */
export function Main({ children, footer }: MainProps) {
  const { phase } = useIntro();
  const mainRef = useRef<HTMLElement>(null);
  // Без JavaScript кальку не снять, поэтому inert ставится только после гидрации.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  // Кнопка-калька исчезла: фокус переходит к приглашению, а не сбрасывается в начало документа.
  useEffect(() => {
    if (phase === 'opened') mainRef.current?.focus({ preventScroll: true });
  }, [phase]);

  return (
    <div inert={hydrated && phase !== 'opened'}>
      <main ref={mainRef} tabIndex={-1} className="outline-none">
        {children}
      </main>
      {footer}
    </div>
  );
}
