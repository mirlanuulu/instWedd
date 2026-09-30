export const LOCALES = ['ky', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];

export const THEMES = ['romantic', 'national'] as const;
export type ThemeName = (typeof THEMES)[number];

/** Текст заказа на обоих языках. */
export type Localized = Record<Locale, string>;

export interface Photo {
  /** Путь от /public, например "/photos/story-1.jpg". */
  src: string;
  alt: Localized;
}

export interface Person {
  name: Localized;
}

export interface EventInfo {
  /** Как называется событие: «Свадебный той», «Кыз узатуу». */
  title: Localized;
  /** Дата в формате ГГГГ-ММ-ДД, по местному времени события. */
  date: `${number}-${number}-${number}`;
  /** Начало в формате ЧЧ:ММ, по местному времени события. */
  time: `${number}:${number}`;
  /** Смещение часового пояса места события. Бишкек: "+06:00". */
  utcOffset: `${'+' | '-'}${number}:${number}`;
  /** Короткая фраза-приглашение под именами. */
  invitation: Localized;
}

export interface Venue {
  name: Localized;
  address: Localized;
  city: Localized;
  coords: { lat: number; lng: number };
  links: {
    twoGis: string;
    /** Если не задано, ссылка строится по координатам. */
    googleMaps?: string;
  };
  photo: Photo;
}

export interface ProgramItem {
  /** ЧЧ:ММ */
  time: string;
  title: Localized;
  note?: Localized;
}

export interface StoryItem {
  photo: Photo;
  title: Localized;
  text: Localized;
}

export interface DressCode {
  note: Localized;
  colors: Array<{
    name: Localized;
    /** Любой CSS-цвет: это данные заказа, а не токен темы. */
    value: string;
  }>;
}

export interface Music {
  /** Путь от /public. Файл загружается только после тапа по конверту. */
  src: string;
  /** Громкость после fade-in, от 0 до 1. */
  volume: number;
}

export interface Rsvp {
  /** Чат или канал, куда бот присылает ответы гостей. */
  telegramChatId: string;
  /** Верхняя граница поля «количество гостей». */
  maxGuests: number;
}

export interface Studio {
  /** Подпись в футере, например "@toi.invite". */
  handle: string;
  url: string;
}

export interface InviteConfig {
  theme: ThemeName;
  languages: {
    /** Один язык в списке — переключатель не показывается. */
    available: readonly [Locale, ...Locale[]];
    default: Locale;
  };
  /** В том порядке, в котором имена стоят в приглашении. */
  couple: readonly [Person, Person];
  event: EventInfo;
  venue: Venue;
  program: ProgramItem[];
  story: StoryItem[];
  dressCode: DressCode;
  music: Music;
  rsvp: Rsvp;
  studio: Studio;
}
