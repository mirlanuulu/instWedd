'use client';

import { useLocale } from '@/components/providers/LocaleProvider';

/** Подпись к фото огней: лицензия CC BY 2.0 требует указать автора. */
export function Credits() {
  const { locale } = useLocale();
  const label = locale === 'ky' ? 'Жарыктардын сүрөтү' : 'Фото огней';
  return (
    <footer className="g-credits">
      {label}:{' '}
      <a href="https://commons.wikimedia.org/wiki/File:Bokeh_lights_by_Henry_S%C3%B6derlund.jpg" target="_blank" rel="noopener noreferrer">
        Henry Söderlund
      </a>
      ,{' '}
      <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener noreferrer">
        CC BY 2.0
      </a>
    </footer>
  );
}
