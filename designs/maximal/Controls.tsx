'use client';

import { useIntro } from '@/components/providers/IntroProvider';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useMusic } from '@/components/providers/MusicProvider';
import { dictionaries } from '@/locales';

/**
 * Языки — пилюля в правом верхнем углу, активный язык залит золотом.
 * absolute, а не fixed: уезжает вместе с первым экраном. Стоит поверх занавеса.
 */
export function LanguageSwitch() {
  const { languages } = useInvite();
  const { locale, setLocale, t } = useLocale();

  if (languages.available.length < 2) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-(--z-controls) pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex w-full max-w-stage justify-end px-gutter">
        <div role="group" aria-label={t.langSwitcher} className="pointer-events-auto flex rounded-pill border-2 border-gold bg-emerald-2 p-0.5">
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
                  'label flex min-h-10 min-w-12 items-center justify-center rounded-pill px-3 whitespace-nowrap',
                  'transition-[background-color,color,transform] duration-(--dur-micro) ease-out active:translate-y-px',
                  active ? 'bg-gold text-ink' : 'text-paper [@media(hover:hover)]:hover:text-gold',
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

/** Музыка: золотой круг. Появляется, когда занавес раздвинулся. */
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
        'grid size-12 place-items-center rounded-pill border-2 border-gold shadow-[0.2rem_0.2rem_0_var(--color-magenta)]',
        'transition-[background-color,color,transform] duration-(--dur-micro) ease-out active:translate-y-px',
        playing ? 'bg-gold text-ink' : 'bg-emerald-2 text-gold',
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
