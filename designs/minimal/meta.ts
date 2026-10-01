/**
 * Цвета минимализма вне CSS: панель браузера, иконка вкладки и картинка-превью.
 * Мета-теги и генератор картинок не читают CSS-переменные, поэтому здесь
 * sRGB-копии токенов из designs/minimal/minimal.css. Меняете палитру —
 * обновите и их.
 */
export const minimalMeta = {
  /** --color-paper */
  paper: '#f9f7f3',
  /** --color-ink */
  ink: '#1d1a17',
  /** --color-muted */
  muted: '#66635e',
  /** --color-rule */
  rule: '#d3d1cd',
} as const;
