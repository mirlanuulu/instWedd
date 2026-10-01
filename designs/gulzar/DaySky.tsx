'use client';

import { useEffect } from 'react';

/*
 * «День в саду»: пока гость листает, за страницей проходит день тоя.
 * Рассвет у фото пары, светлый день у истории, золотой час у программы,
 * закат у места и вечер с огнями гирлянды у анкеты.
 *
 * Каждому разделу — своё небо; между разделами цвета плавно смешиваются
 * по положению прокрутки. Цвета — OKLCH: [светлота %, насыщенность, тон].
 */

type Lch = readonly [number, number, number];

interface Sky {
  top: Lch;
  bottom: Lch;
  /** Свечение «солнца»: цвет, место (в % экрана) и сила. */
  glow: Lch;
  gx: number;
  gy: number;
  ga: number;
  /** Огни гирлянды, 0…1. */
  lights: number;
}

const SKIES: { anchor: string; sky: Sky }[] = [
  {
    anchor: 'top',
    sky: { top: [93, 0.035, 25], bottom: [97, 0.014, 75], glow: [92, 0.08, 40], gx: 15, gy: 0, ga: 0.55, lights: 0 },
  },
  {
    anchor: 'countdown',
    sky: { top: [96.5, 0.02, 70], bottom: [97.5, 0.012, 85], glow: [97, 0.06, 90], gx: 70, gy: -5, ga: 0.5, lights: 0 },
  },
  {
    anchor: 'story',
    sky: { top: [98, 0.012, 95], bottom: [97, 0.016, 115], glow: [99, 0.05, 95], gx: 50, gy: -10, ga: 0.6, lights: 0 },
  },
  {
    anchor: 'program',
    sky: { top: [92, 0.055, 75], bottom: [94, 0.04, 60], glow: [88, 0.12, 70], gx: 85, gy: 20, ga: 0.6, lights: 0 },
  },
  {
    anchor: 'venue',
    sky: { top: [84, 0.07, 35], bottom: [88, 0.06, 55], glow: [80, 0.13, 45], gx: 80, gy: 60, ga: 0.55, lights: 0 },
  },
  {
    anchor: 'rsvp',
    sky: { top: [27, 0.05, 330], bottom: [21, 0.04, 300], glow: [42, 0.08, 40], gx: 50, gy: 105, ga: 0.3, lights: 1 },
  },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Тон — по короткой дуге: 35° → 330° идёт через красный, а не через зелёный. */
function lerpHue(a: number, b: number, t: number) {
  const d = ((b - a + 540) % 360) - 180;
  return (a + d * t + 360) % 360;
}

const mix = (a: Lch, b: Lch, t: number) =>
  `oklch(${lerp(a[0], b[0], t).toFixed(2)}% ${lerp(a[1], b[1], t).toFixed(3)} ${lerpHue(a[2], b[2], t).toFixed(1)})`;

/** Плавный вход и выход перехода: небо не «щёлкает» на границе разделов. */
const ease = (t: number) => t * t * (3 - 2 * t);

export function DaySky() {
  useEffect(() => {
    let frame = 0;

    const paint = () => {
      frame = 0;
      const vh = window.innerHeight;
      const focus = window.scrollY + vh * 0.5;
      // Небо держит цвет раздела, пока гость его читает: от заголовка раздела
      // почти до его конца. Меняется только в промежутке
      // между разделами — поэтому вечер наступает в «сумерках», а не поверх места.
      const ranges = SKIES.map(({ anchor, sky }) => {
        const node = document.getElementById(anchor);
        if (!node) return null;
        const head = node.querySelector('.g-section-head') ?? node;
        const start = head.getBoundingClientRect().top + window.scrollY;
        const end = Math.max(start, node.getBoundingClientRect().bottom + window.scrollY - vh * 0.2);
        return { start, end, sky };
      }).filter((r): r is { start: number; end: number; sky: Sky } => r !== null);
      if (ranges.length === 0) return;

      let a = ranges[0]!.sky;
      let b = a;
      let t = 0;
      for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i]!;
        const next = ranges[i + 1];
        a = b = range.sky;
        t = 0;
        if (focus <= range.end || !next) break;
        if (focus < next.start) {
          b = next.sky;
          t = ease((focus - range.end) / (next.start - range.end));
          break;
        }
      }

      // На корне документа: цвет неба нужен и разделам, а не только фону.
      const style = document.documentElement.style;
      style.setProperty('--sky-top', mix(a.top, b.top, t));
      style.setProperty('--sky-bottom', mix(a.bottom, b.bottom, t));
      style.setProperty('--glow', mix(a.glow, b.glow, t));
      style.setProperty('--gx', `${lerp(a.gx, b.gx, t).toFixed(1)}%`);
      style.setProperty('--gy', `${lerp(a.gy, b.gy, t).toFixed(1)}%`);
      style.setProperty('--ga', lerp(a.ga, b.ga, t).toFixed(3));
      style.setProperty('--lights', lerp(a.lights, b.lights, t).toFixed(3));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="g-sky" aria-hidden>
      <div className="g-sky-glow" />
      <div className="g-sky-lights" />
    </div>
  );
}
