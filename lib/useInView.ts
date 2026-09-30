'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * Виден ли элемент на экране. По этому флагу таймер и эффекты
 * встают на паузу, когда гость прокрутил страницу мимо них.
 */
export function useInView(ref: RefObject<Element | null>, rootMargin = '0px'): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
