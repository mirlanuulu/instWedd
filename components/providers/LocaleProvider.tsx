'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { invite } from '@/config/invite';
import type { Locale, Localized } from '@/config/types';
import { dictionaries, type Dictionary } from '@/locales';

const STORAGE_KEY = 'invite:locale';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Тексты интерфейса на текущем языке. */
  t: Dictionary;
  /** Текст заказа из конфига на текущем языке. */
  pick: (value: Localized) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function asAvailableLocale(value: string | null): Locale | null {
  const available: readonly string[] = invite.languages.available;
  return value !== null && available.includes(value) ? (value as Locale) : null;
}

/** Встроенные браузеры Instagram и WhatsApp могут запрещать localStorage. */
function readStored(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStored(locale: Locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Выбор языка просто не переживёт перезагрузку.
  }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(invite.languages.default);

  // Первый рендер совпадает с серверным (язык по умолчанию). Выбор гостя
  // подхватывается после гидрации: ?lang= из ссылки важнее сохранённого.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    const preferred = asAvailableLocale(fromUrl) ?? asAvailableLocale(readStored());
    if (preferred) setLocaleState(preferred);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    writeStored(next);
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: dictionaries[locale],
      pick: (text) => text[locale],
    }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('useLocale must be used inside <LocaleProvider>');
  return value;
}
