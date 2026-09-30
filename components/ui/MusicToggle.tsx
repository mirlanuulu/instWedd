'use client';

import { useIntro } from '@/components/providers/IntroProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useMusic } from '@/components/providers/MusicProvider';
import styles from './MusicToggle.module.css';

export function MusicToggle() {
  const { t } = useLocale();
  const { phase } = useIntro();
  const { status, toggle } = useMusic();

  // До открытия конверта музыки ещё нет: выключать нечего.
  if (phase !== 'opened' || status === 'idle') return null;

  const playing = status === 'playing';

  return (
    <button
      type="button"
      aria-pressed={playing}
      aria-label={playing ? t.music.off : t.music.on}
      onClick={toggle}
      className={[
        styles.button,
        playing ? styles.playing : '',
        'fixed right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-(--z-controls)',
        'grid size-11 place-items-center rounded-pill border border-rule bg-paper',
        'transition-[background-color,color,transform] duration-(--dur-micro) ease-out active:scale-95',
        playing ? 'text-accent' : 'text-muted',
        '[@media(hover:hover)]:hover:bg-paper-2',
      ].join(' ')}
    >
      <span className={styles.bars} aria-hidden="true">
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </span>
    </button>
  );
}
