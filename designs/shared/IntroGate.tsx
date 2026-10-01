'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useIntro } from '@/components/providers/IntroProvider';

interface IntroGateProps {
  children: ReactNode;
  /** Подвал стоит рядом с <main>, а не внутри: так это ориентир страницы для скринридера. */
  footer: ReactNode;
}

/**
 * Приглашение под интро (калька, обложка, бланк — у каждого стиля своё).
 * Пока интро не снято, приглашение недоступно ни для касаний, ни для
 * клавиатуры и скринридера. Классов Tailwind здесь нет: файл общий для всех
 * стилей, а их CSS сканирует только свои папки.
 */
export function IntroGate({ children, footer }: IntroGateProps) {
  const { phase } = useIntro();
  const mainRef = useRef<HTMLElement>(null);
  // Без JavaScript интро не снять, поэтому inert ставится только после гидрации.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  // Кнопка интро исчезла: фокус переходит к приглашению, а не сбрасывается в начало документа.
  useEffect(() => {
    if (phase === 'opened') mainRef.current?.focus({ preventScroll: true });
  }, [phase]);

  return (
    <div inert={hydrated && phase !== 'opened'}>
      <main ref={mainRef} tabIndex={-1} style={{ outline: 'none' }}>
        {children}
      </main>
      {footer}
    </div>
  );
}
