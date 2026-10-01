'use client';

import { useIntro } from '@/components/providers/IntroProvider';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useMusic } from '@/components/providers/MusicProvider';
import { dictionaries } from '@/locales';

/**
 * Языки текстом в правом верхнем углу колонки: «КЫР  РУС».
 * absolute, а не fixed: переключатель уезжает вместе с первым экраном.
 * Стоит поверх кальки, чтобы язык можно было выбрать до открытия.
 */
export function LanguageSwitch() {
  const { languages } = useInvite();
  const { locale, setLocale, t } = useLocale();

  if (languages.available.length < 2) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-(--z-controls) pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex w-full max-w-sheet justify-end px-gutter">
        <div role="group" aria-label={t.langSwitcher} className="pointer-events-auto -mr-3 flex">
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
                  'label flex min-h-11 min-w-11 items-center justify-center px-3 whitespace-nowrap',
                  'underline-offset-[3px] transition-[color,transform] duration-(--dur-micro) ease-out active:translate-y-px',
                  active
                    ? 'text-ink underline decoration-1'
                    : 'text-muted [@media(hover:hover)]:hover:text-ink',
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

/** Музыка: квадрат с волосяной рамкой в нижнем углу. Появляется после того, как калька снята. */
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
        'grid size-11 place-items-center border border-ink-2 bg-paper',
        'transition-[background-color,color,transform] duration-(--dur-micro) ease-out active:translate-y-px',
        playing ? 'text-ink' : 'text-muted',
        '[@media(hover:hover)]:hover:bg-paper-2',
      ].join(' ')}
    >
      <span className="music-bars" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}
