import { Bad_Script, Cormorant_Garamond, Forum, Great_Vibes } from 'next/font/google';

// `subsets` задаёт только предзагрузку. Остальные подмножества, включая
// cyrillic-ext с кыргызскими ө, ү, ң, браузер догружает сам по unicode-range.
// Файл шрифта скачивается, только если им набран текст на странице.

/** Основной текст обеих тем и заголовки темы romantic. Вариативный: один файл на все веса. */
const cormorant = Cormorant_Garamond({
  subsets: ['cyrillic'],
  display: 'swap',
  variable: '--font-cormorant',
});

/** Имена пары в теме romantic. Кыргызских ө, ү, ң в нём нет. */
const greatVibes = Great_Vibes({
  subsets: ['cyrillic'],
  weight: '400',
  display: 'swap',
  variable: '--font-great-vibes',
  preload: false,
});

/** Замена Great Vibes для имён с ө, ү, ң: рукописный шрифт с полной кыргызской кириллицей. */
const badScript = Bad_Script({
  subsets: ['cyrillic'],
  weight: '400',
  display: 'swap',
  variable: '--font-bad-script',
  preload: false,
});

/** Имена и заголовки в теме national. */
const forum = Forum({
  subsets: ['cyrillic'],
  weight: '400',
  display: 'swap',
  variable: '--font-forum',
  preload: false,
});

export const fontVariables = [cormorant.variable, greatVibes.variable, badScript.variable, forum.variable].join(' ');
