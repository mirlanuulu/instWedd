import { Geologica, Yeseva_One } from 'next/font/google';

// В обоих шрифтах есть кыргызские ө, ү, ң (проверено по таблице символов файла).

/** Имена и заголовки: толстая дидона, как вывеска над сценой. Один вес. */
const yeseva = Yeseva_One({
  subsets: ['cyrillic'],
  weight: '400',
  display: 'swap',
  variable: '--font-yeseva',
});

/** Текст и подписи: мягкий гротеск, хорошо читается на цветных полосах. */
const geologica = Geologica({
  subsets: ['cyrillic'],
  display: 'swap',
  variable: '--font-geologica',
});

export const maximalFontVariables = [yeseva.variable, geologica.variable].join(' ');
