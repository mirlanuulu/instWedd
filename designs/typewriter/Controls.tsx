'use client';

import { useIntro } from '@/components/providers/IntroProvider';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useMusic } from '@/components/providers/MusicProvider';
import { dictionaries } from '@/locales';

/**
 * Языки — две ленточки в правом верхнем углу бланка, активная залита синью.
 * absolute, а не fixed: уезжает вместе с первым экраном. Стоит поверх бланка-интро.
 */
export function LanguageSwitch() {
  const { languages } = useInvite();
  const { locale, setLocale, t } = useLocale();

  if (languages.available.length < 2) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-(--z-controls) pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex w-full max-w-blank justify-end px-gutter">
        <div role="group" aria-label={t.langSwitcher} className="pointer-events-auto flex border-2 border-form bg-strip">
          {languages.available.map((code) => {
            const active = code === locale;
            return (
              <button
                key={code}
                type="button"
                lang={code}
                aria-pressed={active}
                aria-label={dictionaries[code].langName}
                onClick={() => setLocale(code)}
                className={[
                  'form-label flex min-h-10 min-w-12 items-center justify-center px-3 whitespace-nowrap',
                  'transition-[background-color,color,transform] duration-(--dur-micro) ease-out active:translate-y-px',
                  active ? 'bg-form text-strip' : '[@media(hover:hover)]:hover:bg-paper-2',
                ].join(' ')}
              >
                {dictionaries[code].langLabel}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Музыка: квадрат с синей рамкой бланка. Появляется, когда бланк-интро уехал. */
export function MusicButton() {
  const { t } = useLocale();
  const { phase } = useIntro();
  const { status, toggle } = useMusic();

  if (phase !== 'opened' || status === 'idle') return null;

  const playing = status === 'playing';

  return (
    <button
      type="button"
      aria-pressed={playing}
      aria-label={playing ? t.music.off : t.music.on}
      data-playing={playing ? '' : undefined}
      onClick={toggle}
      className={[
        'fixed right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-(--z-controls)',
        'grid size-12 place-items-center border-2 border-form',
        'transition-[background-color,color,transform] duration-(--dur-micro) ease-out active:translate-y-px',
        playing ? 'bg-accent text-accent-ink' : 'bg-strip text-form',
      ].join(' ')}
    >
      <span className="music-bars" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}
