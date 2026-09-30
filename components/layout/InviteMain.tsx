'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useMotion } from '@/lib/motionLoader';
import { useIntro } from '@/components/providers/IntroProvider';
import { useLocale } from '@/components/providers/LocaleProvider';

interface InviteMainProps {
  children: ReactNode;
  /** Подвал стоит рядом с <main>, а не внутри: так это ориентир страницы для скринридера. */
  footer: ReactNode;
}

/**
 * Содержимое приглашения под конвертом. Пока конверт закрыт, оно недоступно
 * ни для касаний, ни для клавиатуры и скринридера.
 */
export function InviteMain({ children, footer }: InviteMainProps) {
  const { phase } = useIntro();
  const { locale } = useLocale();
  const motion = useMotion();
  const mainRef = useRef<HTMLElement>(null);
  // Без JavaScript конверт не открыть, поэтому inert ставится только после гидрации.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  // Кнопка-конверт исчезает: фокус переходит к приглашению, а не сбрасывается в начало документа.
  useEffect(() => {
    if (phase === 'opened') mainRef.current?.focus({ preventScroll: true });
  }, [phase]);

  return (
    <div inert={hydrated && phase !== 'opened'}>
      <main ref={mainRef} tabIndex={-1} className="outline-none">
        {children}
      </main>
      {footer}
      {motion && <motion.ScrollRefresh active={phase === 'opened'} locale={locale} />}
    </div>
  );
}
