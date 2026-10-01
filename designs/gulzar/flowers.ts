/*
 * Живописные элементы «Гүлзара». Источники — общественное достояние:
 * розы П.-Ж. Редуте («Les Roses», 1817–1824; сканы Кливлендского музея искусств, CC0),
 * «Choix des plus belles fleurs» Редуте (1827, Biodiversity Heritage Library).
 * Бумага старых листов переведена в прозрачность, краска осталась как есть.
 *
 * *-solid — плотные варианты для наложения на фото: на бумаге выглядят так же,
 * но внутри силуэта не просвечивают.
 */

export interface FlowerAsset {
  src: string;
  /** Размеры файла в пикселях: нужны next/image для пропорций. */
  w: number;
  h: number;
}

const asset = (name: string, w: number, h: number): FlowerAsset => ({ src: `/gulzar/${name}.webp`, w, h });

export const FLOWERS = {
  centifoliaMid: asset('rose-centifolia-mid', 1200, 1025),
  centifolia: asset('rose-centifolia', 1270, 795),
  centifoliaSolid: asset('rose-centifolia-solid', 1100, 688),
  pink: asset('rose-pink', 1300, 925),
  pinkSolid: asset('rose-pink-solid', 1100, 783),
  china: asset('rose-china', 1294, 1300),
  wild: asset('rose-wild', 1200, 679),
  wildSolid: asset('rose-wild-solid', 1100, 622),
  gallica: asset('rose-gallica', 1200, 883),
  leaves: asset('leaves-wild', 1300, 1154),
  blossom: asset('blossom', 968, 707),
  // Отдельные головки для букета (плотные).
  headCentifolia: asset('head-centifolia', 591, 574),
  headPink: asset('head-pink', 700, 635),
  headChina: asset('head-china', 700, 600),
  headWild: asset('head-wild', 651, 590),
  headGallica: asset('head-gallica', 700, 517),
  headBlossom: asset('head-blossom', 572, 479),
  butterflyBlue: asset('butterfly-blue', 133, 146),
  butterflyAmber: asset('butterfly-amber', 149, 161),
} as const;

export type FlowerName = keyof typeof FLOWERS;

/** Фото пары для демо: Алмаз Нуржанов, Unsplash (лицензия Unsplash), Алматы. */
export const COUPLE_PHOTO = { src: '/gulzar/couple-arch.webp', w: 1000, h: 1250 };
