'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/**
 * sealed  — конверт закрыт, ждём тапа;
 * opening — идёт анимация открытия;
 * opened  — письмо заняло экран, страница доступна.
 */
export type IntroPhase = 'sealed' | 'opening' | 'opened';

interface IntroContextValue {
  phase: IntroPhase;
  setPhase: (phase: IntroPhase) => void;
}

const IntroContext = createContext<IntroContextValue | null>(null);

export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>('sealed');

  // После перезагрузки браузер возвращает прежнюю прокрутку, а приглашение
  // всегда начинается с конверта и первого экрана.
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  // Пока конверт не открыт, страница под ним не прокручивается.
  useEffect(() => {
    if (phase === 'opened') return;
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = '';
    };
  }, [phase]);

  const value = useMemo(() => ({ phase, setPhase }), [phase]);

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

/**
 * Фаза интро для эффектов. Вне провайдера (например, на /styleguide)
 * конверта нет, и эффект считает его уже открытым.
 */
export function useIntroPhase(): IntroPhase {
  return useContext(IntroContext)?.phase ?? 'opened';
}

export function useIntro(): IntroContextValue {
  const value = useContext(IntroContext);
  if (!value) throw new Error('useIntro must be used inside <IntroProvider>');
  return value;
}
