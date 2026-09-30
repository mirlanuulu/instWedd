'use client';

import { useEffect, useState } from 'react';

/*
 * GSAP с плагинами и все эффекты на нём собраны в один чанк
 * (components/effects/motion.ts) и в первую загрузку не входят:
 * до тапа по конверту анимировать нечего. Чанк подгружается
 * по первому касанию или после короткого простоя, что наступит раньше.
 */

type MotionModule = typeof import('@/components/effects/motion');

/** Простой после гидрации, через который чанк грузится сам. */
const IDLE_DELAY = 2000;
const WAKE_EVENTS = ['pointerdown', 'touchstart', 'keydown'] as const;

let pending: Promise<MotionModule> | null = null;
let scheduled = false;

// Исполняется, когда чанк загружен, кто бы ни начал загрузку.
let announce: (loaded: MotionModule) => void = () => {};
const ready = new Promise<MotionModule>((resolve) => {
  announce = resolve;
});

/** Загружает чанк с эффектами. Повторные вызовы возвращают ту же загрузку. */
export function loadMotion(): Promise<MotionModule> {
  if (!pending) {
    pending = import('@/components/effects/motion');
    pending.then(announce, () => {
      // Сеть пропала: следующий вызов попробует ещё раз.
      pending = null;
    });
  }
  return pending;
}

function scheduleMotion() {
  if (scheduled) return;
  scheduled = true;

  const start = () => {
    window.clearTimeout(timer);
    WAKE_EVENTS.forEach((name) => window.removeEventListener(name, start, true));
    // Без сети эффектов не будет, но страница остаётся рабочей.
    loadMotion().catch(() => {});
  };
  const timer = window.setTimeout(start, IDLE_DELAY);
  WAKE_EVENTS.forEach((name) => window.addEventListener(name, start, { capture: true, passive: true }));
}

/** Модуль эффектов, когда он загрузился. До этого null: компонент просто остаётся статичным. */
export function useMotion(): MotionModule | null {
  const [motion, setMotion] = useState<MotionModule | null>(null);

  useEffect(() => {
    let alive = true;
    scheduleMotion();
    ready.then((loaded) => {
      if (alive) setMotion(loaded);
    });
    return () => {
      alive = false;
    };
  }, []);

  return motion;
}
