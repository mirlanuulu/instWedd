import type { Dictionary } from './types';

const MONTHS = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
] as const;

/** Над календарём месяц стоит сам по себе, в именительном падеже. */
const MONTHS_STANDALONE = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
] as const;

/** 1 день, 2 дня, 5 дней. */
function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

export const ru: Dictionary = {
  langLabel: 'Рус',
  langName: 'Русский',
  langSwitcher: 'Язык приглашения',

  meta: {
    title: (first, second) => `${first} и ${second} — приглашение на той`,
  },

  intro: {
    tap: 'Нажмите',
    open: 'Открыть приглашение',
  },

  hero: {
    and: 'и',
  },

  date: {
    full: (day, monthIndex, year) => `${day} ${MONTHS[monthIndex]} ${year}`,
    weekdays: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
    weekdaysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    monthYear: (monthIndex, year) => `${MONTHS_STANDALONE[monthIndex]} ${year}`,
    time: (time) => `в ${time}`,
  },

  calendar: { title: 'Сохраните дату' },

  countdown: {
    title: 'До тоя осталось',
    days: (n) => plural(n, 'день', 'дня', 'дней'),
    hours: (n) => plural(n, 'час', 'часа', 'часов'),
    minutes: (n) => plural(n, 'минута', 'минуты', 'минут'),
    seconds: (n) => plural(n, 'секунда', 'секунды', 'секунд'),
    started: 'Той начался',
  },

  scratch: {
    title: 'Сотрите, чтобы узнать дату',
    hint: 'Проведите пальцем по золоту',
    reveal: 'Показать дату',
  },

  story: { title: 'Наша история' },
  program: { title: 'Программа дня' },

  venue: {
    title: 'Где будет той',
    open2gis: 'Открыть в 2GIS',
    openGoogle: 'Открыть в Google Maps',
  },

  dressCode: { title: 'Дресс-код' },

  rsvp: {
    title: 'Вы придёте?',
    name: 'Ваше имя',
    guests: 'Сколько вас будет',
    guestsLess: 'Меньше гостей',
    guestsMore: 'Больше гостей',
    attendance: 'Ваш ответ',
    attendanceRequired: 'Отметьте, придёте ли вы',
    yes: 'Приду',
    no: 'Не смогу',
    wish: 'Пожелание',
    wishPlaceholder: 'Пара тёплых слов для молодых',
    submit: 'Отправить',
    sending: 'Отправляем…',
    nameRequired: 'Напишите имя, чтобы мы знали, от кого ответ',
    error: 'Не получилось отправить. Попробуйте ещё раз чуть позже.',
    thanksYes: {
      title: 'Спасибо! Ждём вас',
      text: 'Ваш ответ у нас. До встречи на тое.',
    },
    thanksNo: {
      title: 'Спасибо, что сообщили',
      text: 'Жаль, что не получится. Будем рады увидеться в другой раз.',
    },
  },

  footer: {
    madeBefore: 'Сделано в',
    madeAfter: '',
  },

  music: {
    on: 'Включить музыку',
    off: 'Выключить музыку',
  },

  telegram: {
    yes: 'придёт',
    no: 'не сможет прийти',
    guests: 'Гостей',
    wish: 'Пожелание',
    language: 'язык формы',
  },
};
