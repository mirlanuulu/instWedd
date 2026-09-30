import { LOCALES, type Person } from '@/config/types';

/** Латиница, русский алфавит и то, что бывает в именах между буквами. */
const COVERED_BY_GREAT_VIBES = /^[\p{Script=Latin}А-Яа-яЁё\s'’.-]*$/u;

/**
 * В Great Vibes, рукописном шрифте темы romantic, нет кыргызских ө, ү, ң
 * и других букв расширенной кириллицы. Браузер подставил бы их из чужого
 * шрифта прямо посреди имени.
 *
 * Поэтому, если такая буква есть хотя бы в одном имени на любом языке,
 * оба имени на всех языках набираются запасным рукописным шрифтом Bad Script.
 */
export function needsExtendedScript(couple: readonly Person[]): boolean {
  return couple.some((person) => LOCALES.some((locale) => !COVERED_BY_GREAT_VIBES.test(person.name[locale])));
}
