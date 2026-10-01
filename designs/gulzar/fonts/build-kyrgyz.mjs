// Шрифт-дополнение к Great Vibes: кыргызские ө ү ң Ө Ү Ң,
// собранные из контуров самого Great Vibes (лицензия OFL разрешает производные).
// Контуры переводятся в многоугольники, режутся и склеиваются через polygon-clipping.
import opentype from 'opentype.js';
import pc from 'polygon-clipping';
import { writeFileSync } from 'node:fs';

// node build-kyrgyz.mjs <GreatVibes-Regular.ttf> <выход.ttf>
// Зависимости ставятся разово вне проекта: npm i opentype.js polygon-clipping
const src = opentype.loadSync(process.argv[2]);
// Ручная подстройка положения штрихов: ключ → число, например { ux: 270 }.
const P = {};
const v = (k, d) => P[k] ?? d;
const STEPS = 24;

/** Контуры глифа как кольца точек, с аффинным преобразованием. */
function rings(ch, { sx = 1, sy = 1, dx = 0, dy = 0 } = {}) {
  const g = src.charToGlyph(ch);
  const t = (x, y) => [x * sx + dx, y * sy + dy];
  const out = [];
  let ring = null;
  let cur = [0, 0];
  for (const c of g.path.commands) {
    if (c.type === 'M') {
      ring = [t(c.x, c.y)];
      out.push(ring);
      cur = [c.x, c.y];
    } else if (c.type === 'L') {
      ring.push(t(c.x, c.y));
      cur = [c.x, c.y];
    } else if (c.type === 'Q') {
      for (let i = 1; i <= STEPS; i++) {
        const s = i / STEPS, r = 1 - s;
        ring.push(t(r * r * cur[0] + 2 * r * s * c.x1 + s * s * c.x, r * r * cur[1] + 2 * r * s * c.y1 + s * s * c.y));
      }
      cur = [c.x, c.y];
    } else if (c.type === 'C') {
      for (let i = 1; i <= STEPS; i++) {
        const s = i / STEPS, r = 1 - s;
        const x = r ** 3 * cur[0] + 3 * r * r * s * c.x1 + 3 * r * s * s * c.x2 + s ** 3 * c.x;
        const y = r ** 3 * cur[1] + 3 * r * r * s * c.y1 + 3 * r * s * s * c.y2 + s ** 3 * c.y;
        ring.push(t(x, y));
      }
      cur = [c.x, c.y];
    }
  }
  return out.filter((r) => r.length > 2);
}

/** Область глифа: чётно-нечётное объединение контуров (так дырки остаются дырками). */
function shape(ch, tr) {
  const rs = rings(ch, tr).map((r) => [[...r, r[0]]]);
  return rs.length > 1 ? pc.xor(...rs) : rs;
}

const box = (x1, y1, x2, y2) => [[[x1, y1], [x2, y1], [x2, y2], [x1, y2], [x1, y1]]];

/**
 * Прямая сужающаяся ножка: от точки (x, y) с шириной w вниз на длину len
 * под наклоном slope (смещение по x на единицу высоты), к концу ширина w2.
 */
function stem(x, y, w, len, slope, w2 = 10) {
  const pts = [];
  const N = 20;
  const left = [];
  const right = [];
  for (let i = 0; i <= N; i++) {
    const s = i / N;
    const cy = y - len * s;
    const cx = x - slope * len * s;
    // Плавное сужение к кончику.
    const half = (w + (w2 - w) * Math.pow(s, 1.4)) / 2;
    left.push([cx - half, cy]);
    right.push([cx + half, cy]);
  }
  // Скруглённый кончик.
  const end = [x - slope * len, y - len];
  const tip = [];
  for (let i = 1; i < 8; i++) {
    const a = Math.PI + (Math.PI * i) / 8;
    tip.push([end[0] + Math.cos(a) * (-w2 / 2), end[1] + Math.sin(a) * (w2 / 2)]);
  }
  pts.push(...left, ...tip.reverse(), ...right.reverse());
  pts.push(pts[0]);
  return [[pts]];
}

function toGlyph(name, unicode, multi, adv) {
  const path = new opentype.Path();
  for (const poly of multi) {
    for (const ring of poly) {
      ring.slice(0, -1).forEach(([x, y], i) => (i ? path.lineTo(x, y) : path.moveTo(x, y)));
      path.close();
    }
  }
  return new opentype.Glyph({ name, unicode, advanceWidth: adv, path });
}

const adv = (ch) => src.charToGlyph(ch).advanceWidth;

// ө: о + штрих дефиса поперёк.
const oe = pc.union(shape('о'), shape('-', { sx: v('obx', 0.95), sy: 0.9, dx: v('odx', -60), dy: v('ody', -40) }));
// Ө: О + длинный штрих.
const OE = pc.union(shape('О'), shape('-', { sx: v('Obx', 2.2), sy: 1.2, dx: v('Odx', -170), dy: v('Ody', 110) }));
// ү: «у» без петли хвоста и без соединительного штриха + прямая ножка,
// продолжающая правый штрих (его края замерены: при y=100 x 238–291, при y=0 x 200–254).
const exitStroke = [[[277, -80], [277, 0], [322, 50], [352, 100], [375, 150], [390, 200], [400, 300], [700, 300], [700, -80], [277, -80]]];
const ue = pc.union(
  pc.difference(pc.intersection(shape('у'), box(-200, v('ucut', 0), 600, 900)), exitStroke),
  stem(v('ux', 268), v('uy', 110), v('uw', 53), v('ulen', 400), v('uslope', 0.37), v('uw2', 10)),
);
// Ү: «У» без петли и без нижнего росчерка + ножка (правый штрих: при y=100 x 865–917, при y=0 x 832–880).
const UE = pc.union(
  pc.difference(pc.intersection(shape('У'), box(-200, v('Ucut', -60), 1300, 1000)), box(900, -300, 1300, 0)),
  stem(v('Ux', 874), v('Uy', 50), v('Uw', 50), v('Ulen', 430), v('Uslope', 0.4), v('Uw2', 12)),
);
// ң: н + хвостик-запятая у правой ножки.
const ne = pc.union(shape('н'), shape(',', { sx: v('nsx', 0.55), sy: v('nsy', 0.7), dx: v('ndx', 188), dy: v('ndy', -38) }));
// Ң: Н + хвостик.
const NE = pc.union(shape('Н'), shape(',', { sx: v('Nsx', 0.85), sy: v('Nsy', 1.05), dx: v('Ndx', 1200), dy: v('Ndy', -100) }));

const glyphs = [
  new opentype.Glyph({ name: '.notdef', advanceWidth: 500, path: new opentype.Path() }),
  toGlyph('uni04E9', 0x04e9, oe, adv('о')),
  toGlyph('uni04E8', 0x04e8, OE, adv('О')),
  toGlyph('uni04AF', 0x04af, ue, adv('у')),
  toGlyph('uni04AE', 0x04ae, UE, adv('У')),
  toGlyph('uni04A3', 0x04a3, ne, adv('н')),
  toGlyph('uni04A2', 0x04a2, NE, adv('Н')),
];

const font = new opentype.Font({
  familyName: 'Gulzar Script KG',
  styleName: 'Regular',
  unitsPerEm: src.unitsPerEm,
  ascender: src.ascender,
  descender: src.descender,
  copyright:
    'Derived from Great Vibes, Copyright 2010 The Great Vibes Pro Project Authors (https://github.com/googlefonts/great-vibes)',
  license: 'This Font Software is licensed under the SIL Open Font License, Version 1.1. https://openfontlicense.org',
  glyphs,
});
const out = process.argv[3] ?? 'GulzarScriptKG.ttf';
writeFileSync(out, Buffer.from(font.toArrayBuffer()));
console.log('записан', out);
