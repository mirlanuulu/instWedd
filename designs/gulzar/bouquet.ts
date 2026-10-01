import type { Dictionary } from '@/locales';
import type { FlowerName } from './flowers';

/*
 * Сценарий «Гүлзара»: каждый раздел дарит гостю цветок, и пока гость листает,
 * в углу сам собирается букет. В конце он уходит паре вместе с ответом.
 * Порядок здесь — порядок разделов.
 *
 * at — место цветка в букете, в процентах квадрата букета (x, y — левый
 * верхний угол, w — ширина), r — поворот, z — слой. Одна раскладка и для
 * маленького букета в углу, и для большого в финале.
 */

export const BOUQUET = [
  {
    id: 'countdown',
    flower: 'headWild',
    title: (t: Dictionary) => t.countdown.title,
    at: { x: 50, y: 6, w: 44, r: 12, z: 4 },
  },
  {
    id: 'story',
    flower: 'headBlossom',
    title: (t: Dictionary) => t.story.title,
    at: { x: 28, y: -4, w: 46, r: 0, z: 3 },
  },
  {
    id: 'program',
    flower: 'headChina',
    title: (t: Dictionary) => t.program.title,
    at: { x: 4, y: 8, w: 46, r: -8, z: 4 },
  },
  {
    id: 'venue',
    flower: 'headGallica',
    title: (t: Dictionary) => t.venue.title,
    at: { x: 54, y: 34, w: 46, r: 10, z: 5 },
  },
  {
    id: 'dress',
    flower: 'headCentifolia',
    title: (t: Dictionary) => t.dressCode.title,
    at: { x: 0, y: 36, w: 46, r: -12, z: 5 },
  },
  {
    id: 'rsvp',
    flower: 'headPink',
    title: (t: Dictionary) => t.rsvp.title,
    at: { x: 25, y: 33, w: 52, r: 0, z: 6 },
  },
] as const satisfies readonly {
  id: string;
  flower: FlowerName;
  title: (t: Dictionary) => string;
  at: { x: number; y: number; w: number; r: number; z: number };
}[];

export type BouquetId = (typeof BOUQUET)[number]['id'];

export const bouquetIndex = (id: BouquetId) => BOUQUET.findIndex((item) => item.id === id);
