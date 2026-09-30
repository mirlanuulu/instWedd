'use client';

import { invite } from '@/config/invite';
import { dictionaries } from '@/locales';
import { useLocale } from '@/components/providers/LocaleProvider';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();
  const { available } = invite.languages;

  if (available.length < 2) return null;

  return (
    <div
      role="group"
      aria-label={t.langSwitcher}
      // absolute, а не fixed: переключатель живёт в углу первого экрана и уезжает вместе с ним,
      // а не висит поверх секций. Пока конверт закрыт, страница не скроллится и он остаётся на месте.
      className="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))] z-(--z-controls) flex rounded-pill border border-rule bg-paper p-0.5"
    >
      {available.map((code) => {
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
              'min-h-10 min-w-12 rounded-pill px-3 text-xs font-semibold tracking-[0.08em] whitespace-nowrap uppercase',
              'transition-[background-color,color,transform] duration-(--dur-micro) ease-out',
              'active:scale-95',
              active
                ? 'bg-accent text-accent-ink'
                : 'text-ink-2 [@media(hover:hover)]:hover:bg-paper-2 [@media(hover:hover)]:hover:text-ink',
            ].join(' ')}
          >
            {dictionaries[code].langLabel}
          </button>
        );
      })}
    </div>
  );
}
