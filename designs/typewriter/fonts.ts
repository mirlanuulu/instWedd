import { IBM_Plex_Mono } from 'next/font/google';

/**
 * Единственный шрифт стиля — машинопись. Кыргызские ө, ү, ң в IBM Plex Mono
 * есть (проверено по таблице символов файла). Шрифт не вариативный,
 * поэтому веса перечислены.
 */
const plexMono = IBM_Plex_Mono({
  subsets: ['cyrillic'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-plex-mono',
});

export const typewriterFontVariables = plexMono.variable;
