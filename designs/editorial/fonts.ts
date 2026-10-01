import { Playfair, Source_Serif_4 } from 'next/font/google';

// В обоих шрифтах есть кыргызские ө, ү, ң (проверено по таблице символов файла).
// `subsets` задаёт только предзагрузку: cyrillic-ext браузер догружает сам.

/**
 * Шапка, имена и заголовки. Ось opsz до 1200: на крупном кегле браузер берёт
 * дисплейный рисунок с волосяными засечками, как у журнальных дидон.
 * Ось wdth — узкая шапка обложки.
 */
const playfair = Playfair({
  subsets: ['cyrillic'],
  axes: ['opsz', 'wdth'],
  display: 'swap',
  variable: '--font-playfair',
});

/** Текст полосы. Курсив — только для подписей к фото и пометок в программе. */
const sourceSerif = Source_Serif_4({
  subsets: ['cyrillic'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-source-serif',
});

export const editorialFontVariables = [playfair.variable, sourceSerif.variable].join(' ');
