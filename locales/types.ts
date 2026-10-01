/**
 * Тексты интерфейса шаблона. От заказа к заказу не меняются:
 * всё, что относится к конкретной паре, лежит в /config/invite.ts.
 */
export interface Dictionary {
  /** Подпись в переключателе языка. */
  langLabel: string;
  /** Полное название языка для скринридера. */
  langName: string;
  langSwitcher: string;

  meta: {
    title: (first: string, second: string) => string;
  };

  intro: {
    tap: string;
    open: string;
  };

  hero: {
    /** Союз между именами. */
    and: string;
  };

  date: {
    /** "29 ноября 2026" / "2026-жылдын 29-ноябры" */
    full: (day: number, monthIndex: number, year: number) => string;
    /** Название месяца отдельно, без числа: «ноябрь». Январь = 0. */
    months: readonly string[];
    /** Воскресенье = 0. */
    weekdays: readonly [string, string, string, string, string, string, string];
    time: (time: string) => string;
  };

  countdown: {
    title: string;
    days: (n: number) => string;
    hours: (n: number) => string;
    minutes: (n: number) => string;
    seconds: (n: number) => string;
    started: string;
  };

  scratch: {
    title: string;
    hint: string;
    /** Для скринридера и клавиатуры: открыть дату без стирания. */
    reveal: string;
  };

  story: { title: string };
  program: { title: string };

  venue: {
    title: string;
    open2gis: string;
    openGoogle: string;
  };

  dressCode: { title: string };

  rsvp: {
    title: string;
    name: string;
    guests: string;
    guestsLess: string;
    guestsMore: string;
    attendance: string;
    attendanceRequired: string;
    yes: string;
    no: string;
    wish: string;
    wishPlaceholder: string;
    submit: string;
    sending: string;
    nameRequired: string;
    error: string;
    /** Чей гость: кыз тарап или бала тарап. */
    side: { question: string; kyz: string; bala: string; required: string };
    thanksYes: { title: string; text: string };
    thanksNo: { title: string; text: string };
  };

  footer: {
    /** Текст до и после ссылки на студию: порядок слов в языках разный. */
    madeBefore: string;
    madeAfter: string;
  };

  music: {
    on: string;
    off: string;
  };

  /** Подписи в сообщении, которое бот присылает паре. */
  telegram: {
    yes: string;
    no: string;
    guests: string;
    wish: string;
    language: string;
    /** Сторона первой строкой сообщения. */
    sides: { kyz: string; bala: string };
  };
}
