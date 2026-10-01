'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useIntro } from '@/components/providers/IntroProvider';
import { useReveal } from './reveal';

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
  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  // Без JavaScript интро не снять, поэтому inert ставится только после гидрации.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  // Эффекты появления включаются, как только интро начали снимать: первый экран
  // проигрывает своё появление, пока уходит калька, обложка или панель.
  useReveal(rootRef, phase !== 'sealed');

  // Кнопка интро исчезла: фокус переходит к приглашению, а не сбрасывается в начало документа.
  useEffect(() => {
    if (phase === 'opened') mainRef.current?.focus({ preventScroll: true });
  }, [phase]);

  return (
    <div ref={rootRef} inert={hydrated && phase !== 'opened'}>
      <main ref={mainRef} tabIndex={-1} style={{ outline: 'none' }}>
        {children}
      </main>
      {footer}
    </div>
  );
}
