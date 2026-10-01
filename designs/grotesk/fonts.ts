import { Onest } from 'next/font/google';

/**
 * Единственный шрифт стиля — в этом и решение: швейцарский плакат держится
 * на одном гротеске в разных весах. Кыргызские ө, ү, ң в Onest есть
 * (проверено по таблице символов файла).
 */
const onest = Onest({
  subsets: ['cyrillic'],
  display: 'swap',
  variable: '--font-onest',
});

export const groteskFontVariables = onest.variable;
