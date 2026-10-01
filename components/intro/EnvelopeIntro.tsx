'use client';

import { useEffect, useRef, useState } from 'react';
import { loadMotion } from '@/lib/motionLoader';
import { useIntro } from '@/components/providers/IntroProvider';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useMusic } from '@/components/providers/MusicProvider';
import { WaxSeal } from './WaxSeal';
import styles from './EnvelopeIntro.module.css';

function initialOf(name: string): string {
  return (Array.from(name.trim())[0] ?? '').toUpperCase();
}

export function EnvelopeIntro() {
  const invite = useInvite();
  const { t, pick } = useLocale();
  const { phase, setPhase } = useIntro();
  const { start: startMusic } = useMusic();

  const root = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const [hydrated, setHydrated] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => setHydrated(true), []);

  // Размонтирование посреди сцены: таймлайн не должен доигрывать по удалённым узлам.
  const timeline = useRef<{ kill: () => void } | null>(null);
  useEffect(() => () => timeline.current?.kill(), []);

  async function open() {
    const intro = root.current;
    if (started.current || !intro) return;
    started.current = true;

    setPhase('opening');
    // Музыка стартует синхронно, внутри обработчика тапа: иначе браузер заблокирует звук.
    startMusic();

    // Без анимации: интро просто гаснет. Так же, если сцену проиграть не удалось.
    const fadeOut = () => {
      setPhase('opened');
      intro
        .animate({ opacity: [1, 0] }, { duration: 300, fill: 'forwards' })
        .finished.catch(() => {})
        .then(() => setFinished(true));
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return fadeOut();

    try {
      // Обычно чанк с GSAP уже загружен по простою или по самому этому касанию.
      const { playEnvelopeOpening } = await loadMotion();
      timeline.current = playEnvelopeOpening(intro, {
        onReveal: () => setPhase('opened'),
        onDone: () => setFinished(true),
      });
      if (!timeline.current) fadeOut();
    } catch {
      fadeOut();
    }
  }

  if (finished) return null;

  const [first, second] = invite.couple;
  const firstName = pick(first.name);
  const secondName = pick(second.name);

  return (
    <div ref={root} className={styles.intro} data-intro data-phase={phase}>
      <button
        type="button"
        className={styles.trigger}
        data-ready={hydrated && phase === 'sealed'}
        onClick={open}
      >
        <span className={styles.envelope} data-part="envelope" aria-hidden="true">
          <span className={styles.shadow} data-envelope-body />
          <span className={styles.back} data-envelope-body />

          <span className={styles.flap} data-part="flap" data-envelope-body>
            <span className={`${styles.flapFace} ${styles.flapFront}`} />
            <span className={`${styles.flapFace} ${styles.flapBack}`} />
          </span>

          <span className={styles.letter} data-part="letter">
            <span className={styles.letterEdge} data-part="letter-detail" />
            <span className={styles.letterInner} data-part="letter-detail">
              <span className={`names ${styles.letterNames}`}>{firstName}</span>
              <span className={styles.letterAnd}>{t.hero.and}</span>
              <span className={`names ${styles.letterNames}`}>{secondName}</span>
            </span>
          </span>

          <span className={styles.pocket} data-envelope-body />
          <span className={styles.pocketBottom} data-envelope-body />
          <span className={styles.flapShadow} data-part="flap-shadow" />

          <WaxSeal
            initials={[initialOf(firstName), initialOf(secondName)]}
            pulsing={hydrated && phase === 'sealed'}
          />
        </span>

        {/* Имя кнопки для скринридера начинается с видимой подписи: так её находит и голосовое управление. */}
        <span className={styles.caption}>{t.intro.tap}</span>
        <span className="sr-only">. {t.intro.open}</span>
      </button>
    </div>
  );
}
