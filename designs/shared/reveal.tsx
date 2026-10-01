'use client';

import { useEffect, useRef, type CSSProperties, type RefObject } from 'react';

/**
 * Включает эффекты появления (designs/shared/reveal.css) внутри root.
 * Пока active ложно — например, интро ещё не снято, — ничего не прячется.
 * Каждый [data-reveal] проигрывает появление один раз, когда въезжает в экран.
 */
export function useReveal(root: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const element = root.current;
    if (!active || !element) return;

    element.setAttribute('data-reveal-ready', '');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-shown', '');
          observer.unobserve(entry.target);
        }
      },
      // Срабатывает, едва элемент показался: иначе текст у нижнего края первого экрана ждал бы прокрутки.
      { threshold: 0.01 },
    );

    // Элементы, появившиеся позже (благодарность после RSVP, цифры таймера), ловит MutationObserver.
    const watch = () =>
      element.querySelectorAll('[data-reveal]:not([data-shown])').forEach((target) => observer.observe(target));
    watch();
    const mutations = new MutationObserver(watch);
    mutations.observe(element, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [root, active]);
}

/** Задержка появления для style: delay(120) → { '--d': '120ms' }. */
export const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/**
 * Слово, буквы которого вылетают по одной. Скринридер читает слово целиком,
 * буквы для него скрыты.
 */
export function Letters({ text, start = 0 }: { text: string; start?: number }) {
  // Буквы сгруппированы по словам: строка переносится между словами, а не посреди слова.
  let index = 0;
  const words = text.split(' ').map((word) =>
    Array.from(word).map((char) => ({ char, index: index++ })),
  );

  return (
    <span data-reveal="letters" style={delay(start)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((letters, wordIndex) => (
          <span key={wordIndex}>
            {wordIndex > 0 && ' '}
            <span style={{ whiteSpace: 'nowrap' }}>
              {letters.map(({ char, index: letterIndex }) => (
                <span key={letterIndex} className="reveal-letter" style={{ '--i': letterIndex } as CSSProperties}>
                  {char}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * Одна цифра табло. Помнит прежнее значение: в том рендере, где цифра сменилась,
 * старая ещё раз показывается поверх и уезжает вверх, а новая въезжает снизу.
 */
function RollDigit({ char }: { char: string }) {
  const previous = useRef(char);
  const leaving = previous.current === char ? null : previous.current;

  useEffect(() => {
    previous.current = char;
  }, [char]);

  return (
    <span className="roll-slot">
      {leaving !== null && (
        <span key={`out-${leaving}`} className="roll-out">
          {leaving}
        </span>
      )}
      <span key={`in-${char}`} className="roll-in">
        {char}
      </span>
    </span>
  );
}

/** Число, цифры которого прокручиваются при смене. Скринридеру — число целиком. */
export function RollNumber({ value }: { value: string }) {
  return (
    <>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">
        {Array.from(value).map((char, index) => (
          <RollDigit key={index} char={char} />
        ))}
      </span>
    </>
  );
}
