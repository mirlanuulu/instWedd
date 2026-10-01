import type { Locale } from '@/config/types';

/*
 * Тексты, которые есть только в «Гүлзаре»: всё про букет.
 * Общие подписи (заголовки разделов, таймер, форма) — в /locales.
 */

interface GulzarTexts {
  /** Название полоски с букетом внизу экрана. */
  bouquet: string;
  /** Для скринридера: «Собрано 2 цветка из 6». */
  collected: (n: number, total: number) => string;
  /** Над заголовком раздела: «2-гүл» / «Цветок 2 из 6». */
  flowerNo: (n: number, total: number) => string;
  pick: string;
  picked: string;
  /** Подпись ячейки букета: «Перейти к разделу „…“». */
  goTo: (title: string) => string;
}

export const GULZAR_TEXTS: Record<Locale, GulzarTexts> = {
  ky: {
    bouquet: 'Гүлдесте',
    collected: (n, total) => `${total} гүлдүн ${n} чогулду`,
    flowerNo: (n) => `${n}-гүл`,
    pick: 'Гүлдестеге кошуу',
    picked: 'Гүлдестеде',
    goTo: (title) => `«${title}» бөлүмүнө өтүү`,
  },
  ru: {
    bouquet: 'Букет',
    collected: (n, total) => `Собрано цветов: ${n} из ${total}`,
    flowerNo: (n, total) => `Цветок ${n} из ${total}`,
    pick: 'Добавить в букет',
    picked: 'В букете',
    goTo: (title) => `Перейти к разделу «${title}»`,
  },
};
