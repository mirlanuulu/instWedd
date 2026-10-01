'use client';

import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { dictionaries } from '@/locales';

/** Переключатель языка в углу первого экрана; виден и поверх ворот. */
export function LanguageToggle() {
  const { languages } = useInvite();
  const { locale, setLocale, t } = useLocale();
  if (languages.available.length < 2) return null;

  return (
    <div role="group" aria-label={t.langSwitcher} className="g-lang">
      {languages.available.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={code === locale}
          aria-label={dictionaries[code].langName}
          onClick={() => setLocale(code)}
        >
          {dictionaries[code].langLabel}
        </button>
      ))}
    </div>
  );
}
