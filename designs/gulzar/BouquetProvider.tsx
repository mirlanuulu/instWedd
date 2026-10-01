'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { BOUQUET, type BouquetId } from './bouquet';

const STORAGE_KEY = 'gulzar:bouquet';

interface BouquetContextValue {
  picked: ReadonlySet<BouquetId>;
  /** Положить цветок раздела в букет (повторный вызов ничего не делает). */
  add: (id: BouquetId) => void;
  /** Счётчик добавлений — по нему букет в углу показывает подсказку. */
  lastAdded: number;
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

/** Букет, который сам собирается, пока гость листает приглашение. */
export function BouquetProvider({ children }: { children: ReactNode }) {
  const [picked, setPicked] = useState<ReadonlySet<BouquetId>>(() => new Set());
  const [lastAdded, setLastAdded] = useState(0);
  // Синхронная копия: проверки прокрутки идут чаще, чем рендер.
  const pickedNow = useRef(new Set<BouquetId>());

  useEffect(() => {
    const stored = readStored();
    if (stored.length === 0) return;
    stored.forEach((id) => pickedNow.current.add(id));
    setPicked(new Set(stored));
  }, []);

  const add = useCallback((id: BouquetId) => {
    if (pickedNow.current.has(id)) return;
    pickedNow.current.add(id);
    writeStored(pickedNow.current);
    setPicked(new Set(pickedNow.current));
    setLastAdded((n) => n + 1);
  }, []);

  const value = useMemo(() => ({ picked, add, lastAdded }), [picked, add, lastAdded]);
  return <BouquetContext.Provider value={value}>{children}</BouquetContext.Provider>;
}

export function useBouquet(): BouquetContextValue {
  const value = useContext(BouquetContext);
  if (!value) throw new Error('useBouquet нужно вызывать внутри <BouquetProvider>');
  return value;
}
