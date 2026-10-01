'use client';

import gsap from 'gsap';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '@/lib/motion';
import { BOUQUET, type BouquetId } from './bouquet';

const STORAGE_KEY = 'gulzar:bouquet';

interface BouquetContextValue {
  picked: ReadonlySet<BouquetId>;
  /**
   * Положить цветок раздела в букет. Если передана картинка цветка и она на экране,
   * её копия перелетает в ячейку; иначе ячейка просто наполняется.
   */
  pick: (id: BouquetId, from?: HTMLElement | null) => void;
  registerSlot: (id: BouquetId, element: HTMLElement | null) => void;
}

const BouquetContext = createContext<BouquetContextValue | null>(null);

const isBouquetId = (value: unknown): value is BouquetId => BOUQUET.some((item) => item.id === value);

/** Встроенные браузеры Instagram и WhatsApp могут запрещать localStorage. */
function readStored(): BouquetId[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isBouquetId) : [];
  } catch {
    return [];
  }
}

function writeStored(ids: Iterable<BouquetId>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // Букет просто не переживёт перезагрузку.
  }
}

/** Полёт копии цветка в ячейку: дугой вверх и вниз, с лёгким поворотом. */
function fly(from: HTMLElement, to: HTMLElement, onDone: () => void) {
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const clone = from.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  clone.setAttribute('aria-hidden', 'true');
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${a.left}px`,
    top: `${a.top}px`,
    width: `${a.width}px`,
    height: `${a.height}px`,
    margin: '0',
    zIndex: '60',
    pointerEvents: 'none',
  });
  document.body.append(clone);
  // Цветок сорван с клумбы: на месте пусто, потом там мягко проявляется новый.
  gsap.set(from, { autoAlpha: 0 });

  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const lift = Math.min(90, Math.max(30, a.height * 0.5));

  gsap
    .timeline({
      onComplete: () => {
        clone.remove();
        onDone();
        gsap.to(from, { autoAlpha: 1, duration: 0.8, delay: 0.2, ease: 'power1.out' });
      },
    })
    .to(clone, { x: dx, duration: 0.95, ease: 'power1.inOut' }, 0)
    .to(clone, { y: -lift, duration: 0.35, ease: 'power1.out' }, 0)
    .to(clone, { y: dy, duration: 0.6, ease: 'power2.in' }, 0.35)
    .to(clone, { scale: (b.width * 0.9) / a.width, duration: 0.95, ease: 'power1.in' }, 0)
    .to(clone, { rotation: -18, duration: 0.45, ease: 'sine.out' }, 0)
    .to(clone, { rotation: 0, duration: 0.5, ease: 'sine.in' }, 0.45);
}

export function BouquetProvider({ children }: { children: ReactNode }) {
  const [picked, setPicked] = useState<ReadonlySet<BouquetId>>(() => new Set());
  // Синхронная копия: два быстрых тапа не запустят два полёта.
  const pickedNow = useRef(new Set<BouquetId>());
  const slots = useRef(new Map<BouquetId, HTMLElement>());
  const reduced = useReducedMotion();

  useEffect(() => {
    const stored = readStored();
    if (stored.length === 0) return;
    stored.forEach((id) => pickedNow.current.add(id));
    setPicked(new Set(stored));
  }, []);

  const pick = useCallback(
    (id: BouquetId, from?: HTMLElement | null) => {
      if (pickedNow.current.has(id)) return;
      pickedNow.current.add(id);
      writeStored(pickedNow.current);
      const add = () => setPicked((previous) => new Set(previous).add(id));

      const slot = slots.current.get(id);
      const box = from?.getBoundingClientRect();
      const visible = box && box.bottom > 0 && box.top < window.innerHeight;
      if (reduced || !from || !slot || !visible) return add();
      fly(from, slot, add);
    },
    [reduced],
  );

  const registerSlot = useCallback((id: BouquetId, element: HTMLElement | null) => {
    if (element) slots.current.set(id, element);
    else slots.current.delete(id);
  }, []);

  const value = useMemo(() => ({ picked, pick, registerSlot }), [picked, pick, registerSlot]);
  return <BouquetContext.Provider value={value}>{children}</BouquetContext.Provider>;
}

export function useBouquet(): BouquetContextValue {
  const value = useContext(BouquetContext);
  if (!value) throw new Error('useBouquet нужно вызывать внутри <BouquetProvider>');
  return value;
}
