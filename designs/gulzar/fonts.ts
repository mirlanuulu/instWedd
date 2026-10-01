import { Cormorant_Garamond, Great_Vibes } from 'next/font/google';
import localFont from 'next/font/local';

/** Текст и заголовки: высокий контраст, мягкие засечки. Вариативный, все веса в одном файле. */
const cormorant = Cormorant_Garamond({
  subsets: ['cyrillic'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-gulzar-serif',
});

/*
 * Имена — каллиграфия Great Vibes. В нём нет кыргызских ө, ү, ң, поэтому
 * без запасного шрифта-«похожего»: иначе браузер взял бы эти буквы из Arial.
 * Недостающие буквы берутся из дополнения ниже.
 */
const greatVibes = Great_Vibes({
  subsets: ['cyrillic'],
  weight: '400',
  display: 'swap',
  variable: '--font-gulzar-script',
  adjustFontFallback: false,
  fallback: [],
});

/**
 * Дополнение к Great Vibes: ө ү ң Ө Ү Ң, собранные из штрихов самого Great Vibes.
 * Скачивается, только если такие буквы есть на странице. Как собран — fonts/README.md.
 */
const scriptKyrgyz = localFont({
  src: './fonts/GulzarScriptKG.ttf',
  display: 'swap',
  variable: '--font-gulzar-script-kg',
  adjustFontFallback: false,
  fallback: [],
  declarations: [{ prop: 'unicode-range', value: 'U+04A2-04A3, U+04AE-04AF, U+04E8-04E9' }],
});

export const gulzarFontVariables = [cormorant.variable, greatVibes.variable, scriptKyrgyz.variable].join(' ');
