'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { invite } from '@/config/invite';

/** idle — музыка ещё не запускалась, файл не загружен. */
export type MusicStatus = 'idle' | 'playing' | 'paused';

interface MusicContextValue {
  status: MusicStatus;
  /** Первый запуск. Вызывать из обработчика тапа, иначе браузер заблокирует звук. */
  start: () => void;
  toggle: () => void;
}

const FADE_IN = 2;
const FADE_TOGGLE = 0.4;

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeFrame = useRef(0);
  // Намерение гостя. Отличается от фактического состояния, пока вкладка свёрнута.
  const wantsMusic = useRef(false);
  const [status, setStatus] = useState<MusicStatus>('idle');

  // Плавная смена громкости. Без GSAP: он грузится отдельным чанком и к первому
  // тапу может быть ещё не готов, а музыка должна стартовать сразу.
  // iOS игнорирует audio.volume: там музыка включается сразу на полной громкости.
  const fadeTo = useCallback((volume: number, duration: number, onComplete?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    cancelAnimationFrame(fadeFrame.current);

    const from = audio.volume;
    const startedAt = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / (duration * 1000));
      audio.volume = Math.min(1, Math.max(0, from + (volume - from) * progress));
      if (progress < 1) fadeFrame.current = requestAnimationFrame(step);
      else onComplete?.();
    };
    fadeFrame.current = requestAnimationFrame(step);
  }, []);

  const play = useCallback(
    (fade: number) => {
      // Файл запрашивается только здесь: в вес первой загрузки музыка не входит.
      let audio = audioRef.current;
      if (!audio) {
        audio = new Audio(invite.music.src);
        audio.loop = true;
        audio.volume = 0;
        audioRef.current = audio;
      }
      wantsMusic.current = true;
      setStatus('playing');
      audio
        .play()
        .then(() => fadeTo(invite.music.volume, fade))
        .catch(() => {
          wantsMusic.current = false;
          setStatus('paused');
        });
    },
    [fadeTo],
  );

  const start = useCallback(() => {
    if (!audioRef.current) play(FADE_IN);
  }, [play]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (wantsMusic.current && audio) {
      wantsMusic.current = false;
      setStatus('paused');
      fadeTo(0, FADE_TOGGLE, () => audio.pause());
    } else {
      play(FADE_TOGGLE);
    }
  }, [fadeTo, play]);

  // Гость свернул браузер или ушёл в другое приложение: музыка не должна играть в фоне.
  useEffect(() => {
    const onVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden) {
        audio.pause();
      } else if (wantsMusic.current) {
        audio.play().catch(() => {
          wantsMusic.current = false;
          setStatus('paused');
        });
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      cancelAnimationFrame(fadeFrame.current);
      audioRef.current?.pause();
    };
  }, []);

  const value = useMemo(() => ({ status, start, toggle }), [status, start, toggle]);

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic(): MusicContextValue {
  const value = useContext(MusicContext);
  if (!value) throw new Error('useMusic must be used inside <MusicProvider>');
  return value;
}
