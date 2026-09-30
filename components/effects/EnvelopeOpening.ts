import { gsap } from '@/lib/gsap';

/*
 * Раскадровка открытия конверта, секунды от тапа. Вся сцена около 2.6 с.
 * Анимируются только transform и opacity.
 */
const T = {
  crack: 0.08, // печать продавлена, появляется трещина
  split: 0.1, // половины расходятся
  fall: 0.26, // и падают
  flap: 0.4, // клапан поднимается
  flapDuration: 0.65,
  rise: 0.95, // письмо выезжает из конверта
  riseDuration: 0.55,
  zoom: 1.5, // письмо растёт на весь экран
  zoomDuration: 0.75,
  reveal: 2.2, // письмо растворяется в первом экране
  revealDuration: 0.4,
} as const;

interface Callbacks {
  /** Письмо закрыло экран: под ним можно показывать первый экран. */
  onReveal: () => void;
  /** Сцена закончилась, интро можно убрать из DOM. */
  onDone: () => void;
}

/**
 * Проигрывает открытие конверта. Части сцены находит по data-part внутри intro.
 * Возвращает таймлайн или null, если разметка не та и играть нечего.
 */
export function playEnvelopeOpening(intro: HTMLElement, { onReveal, onDone }: Callbacks): gsap.core.Timeline | null {
  const select = gsap.utils.selector(intro);
  const part = (name: string) => select(`[data-part="${name}"]`);
  const [envelope] = part('envelope');
  const [letter] = part('letter');
  const [seal] = part('seal');
  if (!envelope || !letter || !seal) return null;

  const envelopeBox = envelope.getBoundingClientRect();
  const letterBox = letter.getBoundingClientRect();
  const sealBox = seal.getBoundingClientRect();
  const viewport = { width: window.innerWidth, height: window.innerHeight };

  // Письмо поднимается, пока его нижний край не выйдет из кармана.
  const rise = letterBox.bottom - envelopeBox.top + 6;
  // Затем встаёт по центру и растёт, пока не закроет экран целиком.
  const cover = Math.max(viewport.width / letterBox.width, viewport.height / letterBox.height) * 1.04;
  const toCenter = {
    x: viewport.width / 2 - (letterBox.left + letterBox.width / 2),
    y: viewport.height / 2 - (letterBox.top + letterBox.height / 2),
  };
  const fall = viewport.height - sealBox.top + sealBox.height;

  const flap = part('flap');
  const sealLeft = part('seal-left');
  const sealRight = part('seal-right');

  return (
    gsap
      .timeline({ defaults: { ease: 'power2.inOut' } })

      // Печать: нажатие, трещина, половины расходятся и падают.
      .to(part('seal-body'), { scale: 0.94, duration: T.crack, ease: 'power1.out' }, 0)
      .set(part('seal-crack'), { opacity: 1 }, T.crack)
      .set(part('seal-crack'), { opacity: 0 }, T.split + 0.04)
      .to(sealLeft, { x: -5, rotation: -7, transformOrigin: '30% 50%', duration: 0.16, ease: 'power2.out' }, T.split)
      .to(sealRight, { x: 5, rotation: 6, transformOrigin: '70% 50%', duration: 0.16, ease: 'power2.out' }, T.split)
      .to(part('seal-shadow'), { opacity: 0, duration: 0.16, ease: 'none' }, T.split)
      .to(sealLeft, { x: -30, y: fall, rotation: -60, duration: 0.55, ease: 'power2.in' }, T.fall)
      .to(sealRight, { x: 36, y: fall, rotation: 75, duration: 0.6, ease: 'power2.in' }, T.fall + 0.04)

      // Клапан. На середине поворота он виден с ребра: в этот момент уходит под письмо.
      .to(part('flap-shadow'), { opacity: 0, duration: 0.2, ease: 'none' }, T.flap)
      .to(flap, { rotationX: 180, duration: T.flapDuration }, T.flap)
      .set(flap, { zIndex: 2 }, T.flap + T.flapDuration / 2)

      // Письмо выезжает вверх. Выйдя из кармана, оно оказывается поверх конверта.
      .to(letter, { y: -rise, duration: T.riseDuration }, T.rise)
      .set(letter, { zIndex: 8 }, T.zoom)

      // Письмо занимает экран, конверт уходит вниз.
      .to(letter, { x: toCenter.x, y: toCenter.y, scale: cover, duration: T.zoomDuration, ease: 'power3.inOut' }, T.zoom)
      .to(part('letter-detail'), { opacity: 0, duration: 0.3, ease: 'none' }, T.zoom + 0.05)
      .to(select('[data-envelope-body]'), { y: 28, opacity: 0, duration: 0.4, ease: 'power1.in' }, T.zoom)

      // Экран теперь цвета бумаги, как и первый экран под ним: интро растворяется.
      .add(onReveal, T.reveal)
      .to(intro, { opacity: 0, duration: T.revealDuration, ease: 'power1.out' }, T.reveal)
      .add(onDone)
  );
}
