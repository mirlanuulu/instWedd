import { Geist, Literata } from 'next/font/google';

// В обоих шрифтах есть кыргызские ө, ү, ң (проверено по таблице символов файла).
// `subsets` задаёт только предзагрузку: cyrillic-ext с этими буквами
// браузер догружает сам по unicode-range.

/**
 * Имена, заголовки и крупные цифры. Ось opsz: на 80 px браузер берёт
 * дисплейный рисунок с тонкими засечками, на 20 px — текстовый, покрепче.
 */
const literata = Literata({
  subsets: ['cyrillic'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-literata',
});

/** Текст, подписи и форма. */
const geist = Geist({
  subsets: ['cyrillic'],
  display: 'swap',
  variable: '--font-geist',
});

export const minimalFontVariables = [literata.variable, geist.variable].join(' ');
