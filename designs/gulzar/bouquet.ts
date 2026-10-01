import type { Dictionary } from '@/locales';
import type { FlowerName } from './flowers';

/*
 * Сценарий «Гүлзара»: каждый раздел дарит гостю цветок, из них
 * собирается букет. Порядок здесь — порядок разделов и ячеек букета.
 */

export const BOUQUET = [
  { id: 'countdown', flower: 'headWild', title: (t: Dictionary) => t.countdown.title },
  { id: 'story', flower: 'headBlossom', title: (t: Dictionary) => t.story.title },
  { id: 'program', flower: 'headChina', title: (t: Dictionary) => t.program.title },
  { id: 'venue', flower: 'headGallica', title: (t: Dictionary) => t.venue.title },
  { id: 'dress', flower: 'headCentifolia', title: (t: Dictionary) => t.dressCode.title },
  { id: 'rsvp', flower: 'headPink', title: (t: Dictionary) => t.rsvp.title },
] as const satisfies readonly { id: string; flower: FlowerName; title: (t: Dictionary) => string }[];

export type BouquetId = (typeof BOUQUET)[number]['id'];

export const bouquetIndex = (id: BouquetId) => BOUQUET.findIndex((item) => item.id === id);
