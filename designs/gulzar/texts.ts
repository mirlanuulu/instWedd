import type { Locale } from '@/config/types';

/*
 * Тексты, которые есть только в «Гүлзаре»: всё про букет.
 * Общие подписи (заголовки разделов, таймер, форма) — в /locales.
 */

interface GulzarTexts {
  /** Для скринридера: «Собрано 2 цветка из 6». */
  collected: (n: number, total: number) => string;
  /** Под цветком раздела: «Гүлдестенин 2-гүлү» / «Цветок 2 в букет». */
  flowerNo: (n: number) => string;
  /** Подсказка у букета при первом цветке: зачем он собирается. */
  firstHint: string;
  /** Подсказка при следующих цветках. */
  added: (n: number, total: number) => string;
  /** Подпись букета-ссылки в углу: ведёт к ответу. */
  openBouquet: string;
  finaleTitle: string;
  finaleText: string;
  submit: string;
  thanksBouquet: string;
}

export const GULZAR_TEXTS: Record<Locale, GulzarTexts> = {
  ky: {
    collected: (n, total) => `${total} гүлдүн ${n} чогулду`,
    flowerNo: (n) => `Гүлдестенин ${n}-гүлү`,
    firstHint: 'Ар бир бөлүмдө бир гүл бар — жаштарга гүлдесте жыйналып жатат',
    added: (n, total) => `+1 гүл · ${n}/${total}`,
    openBouquet: 'Гүлдестени көрүү',
    finaleTitle: 'Сиз жыйнаган гүлдесте',
    finaleText: 'Жообуңуз менен кошо жаштарга жөнөтүлөт',
    submit: 'Гүлдесте менен жөнөтүү',
    thanksBouquet: 'Гүлдестеңиз жаштарга жетти',
  },
  ru: {
    collected: (n, total) => `Собрано цветов: ${n} из ${total}`,
    flowerNo: (n) => `Цветок ${n} в букет`,
    firstHint: 'В каждом разделе по цветку — для молодых собирается букет',
    added: (n, total) => `+1 цветок · ${n}/${total}`,
    openBouquet: 'Посмотреть букет',
    finaleTitle: 'Букет, который вы собрали',
    finaleText: 'Он уйдёт молодым вместе с вашим ответом',
    submit: 'Отправить с букетом',
    thanksBouquet: 'Ваш букет уже у молодых',
  },
};
