import type { ThemeName } from './types';

/**
 * То, что теме нужно вне CSS: цвет панели браузера, иконка вкладки и
 * картинка-превью ссылки. Мета-теги и генератор картинок не читают
 * CSS-переменные, поэтому здесь sRGB-копии токенов из /styles/themes.css.
 * Меняете палитру темы — обновите и эти значения.
 */
interface ThemeMeta {
  /** --base-paper */
  themeColor: string;
  /** Иконка вкладки: кружок сургуча. --theme-seal и --theme-seal-light */
  icon: { seal: string; ring: string };
  /** Картинка-превью: romantic на бумаге, national на бордовой поверхности. */
  card: { paper: string; ink: string; muted: string; accent: string; rule: string };
}

export const themeMeta: Record<ThemeName, ThemeMeta> = {
  romantic: {
    themeColor: '#f9f5ec',
    icon: { seal: '#9f3d4f', ring: '#c0626d' },
    card: { paper: '#f9f5ec', ink: '#2d1d1e', muted: '#745d5c', accent: '#9a4156', rule: '#e4cac6' },
  },
  national: {
    themeColor: '#f7f0de',
    icon: { seal: '#ca9d33', ring: '#7b4c00' },
    card: { paper: '#501019', ink: '#f3ebd5', muted: '#cdb295', accent: '#deb459', rule: '#824434' },
  },
};
