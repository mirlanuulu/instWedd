'use client';

import { useEffect, useRef, useState } from 'react';
import { invite } from '@/config/invite';
import { fireConfetti } from '@/lib/confetti';
import { formatEventDate } from '@/lib/invite';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Section, SectionHeading } from '@/components/ui/Section';

/** Радиус «пальца» в CSS-пикселях. */
const BRUSH = 22;
/** Доля стёртой площади, после которой слой исчезает сам. */
const REVEAL_AT = 0.6;
/**
 * Прогресс считается по грубой сетке, а не чтением пикселей:
 * getImageData на каждое движение пальца слишком дорог для бюджетного телефона.
 */
const COLS = 16;
const ROWS = 10;

interface Point {
  x: number;
  y: number;
}

function paintFoil(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, width: number, height: number) {
  const css = getComputedStyle(canvas);
  const token = (name: string) => css.getPropertyValue(name).trim() || css.color;
  const gold = token('--color-gold');
  const light = token('--color-gold-2');
  const deep = token('--color-gold-deep');

  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;

  // Диагональный перелив, как на фольге.
  const sheen = ctx.createLinearGradient(0, 0, width, height);
  sheen.addColorStop(0, deep);
  sheen.addColorStop(0.28, gold);
  sheen.addColorStop(0.5, light);
  sheen.addColorStop(0.72, gold);
  sheen.addColorStop(1, deep);
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, width, height);

  // Мелкие блёстки. Генератор с фиксированным зерном: рисунок не меняется между перерисовками.
  let seed = 11;
  const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  ctx.globalAlpha = 0.4;
  for (let i = 0; i < 320; i++) {
    ctx.fillStyle = i % 3 === 0 ? deep : light;
    ctx.fillRect(random() * width, random() * height, 1.4, 1.4);
  }
  ctx.globalAlpha = 1;
}

export function ScratchDate() {
  const { t } = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [touched, setTouched] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const date = formatEventDate(invite.event, t);

  // Дата открыта: залп конфетти из карточки.
  useEffect(() => {
    if (revealed && canvasRef.current) fireConfetti(canvasRef.current);
  }, [revealed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || revealed) return;

    const cells = new Uint8Array(COLS * ROWS);
    let cleared = 0;
    let width = 0;
    let height = 0;
    let scratching = false;
    let started = false;
    let last: Point | null = null;

    const paint = () => {
      const box = canvas.getBoundingClientRect();
      width = box.width;
      height = box.height;
      // Больше 2x не нужно: слой всё равно сотрут, а память на слабом телефоне дороже.
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      paintFoil(ctx, canvas, width, height);
    };
    paint();

    // Поворот экрана до первого касания: перерисовать под новый размер.
    const resize = new ResizeObserver(() => {
      if (!started) paint();
    });
    resize.observe(canvas);

    const pointOf = (event: PointerEvent): Point => {
      const box = canvas.getBoundingClientRect();
      return { x: event.clientX - box.left, y: event.clientY - box.top };
    };

    const markCells = ({ x, y }: Point) => {
      const cellWidth = width / COLS;
      const cellHeight = height / ROWS;
      const fromCol = Math.max(0, Math.floor((x - BRUSH) / cellWidth));
      const toCol = Math.min(COLS - 1, Math.floor((x + BRUSH) / cellWidth));
      const fromRow = Math.max(0, Math.floor((y - BRUSH) / cellHeight));
      const toRow = Math.min(ROWS - 1, Math.floor((y + BRUSH) / cellHeight));
      for (let row = fromRow; row <= toRow; row++) {
        for (let col = fromCol; col <= toCol; col++) {
          const index = row * COLS + col;
          if (cells[index]) continue;
          const dx = (col + 0.5) * cellWidth - x;
          const dy = (row + 0.5) * cellHeight - y;
          if (dx * dx + dy * dy <= BRUSH * BRUSH) {
            cells[index] = 1;
            cleared += 1;
          }
        }
      }
    };

    const erase = (from: Point, to: Point) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = BRUSH * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();

      const steps = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) / (BRUSH / 2)));
      for (let i = 0; i <= steps; i++) {
        markCells({ x: from.x + ((to.x - from.x) * i) / steps, y: from.y + ((to.y - from.y) * i) / steps });
      }
      if (cleared / cells.length >= REVEAL_AT) setRevealed(true);
    };

    const onDown = (event: PointerEvent) => {
      scratching = true;
      if (!started) {
        started = true;
        setTouched(true);
      }
      canvas.setPointerCapture(event.pointerId);
      last = pointOf(event);
      erase(last, last);
    };
    const onMove = (event: PointerEvent) => {
      if (!scratching || !last) return;
      const point = pointOf(event);
      erase(last, point);
      last = point;
    };
    const onUp = () => {
      scratching = false;
      last = null;
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    return () => {
      resize.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
    };
  }, [revealed]);

  return (
    <Section className="pt-section pb-14" labelledBy="scratch-title">
      <SectionHeading id="scratch-title" align="center">
        {t.scratch.title}
      </SectionHeading>

      <div className="relative mx-auto mt-8 aspect-[8/5] max-w-[22rem] overflow-hidden rounded-(--radius-card) border border-rule bg-paper-2">
        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
          <p className="font-display text-display text-accent lining-nums tabular-nums">{date.numeric}</p>
          <p className="mt-2 text-base text-ink-2">
            {date.weekday}, {date.time}
          </p>
        </div>

        {/* touch-none: палец по золоту стирает слой, а не прокручивает страницу. */}
        <canvas
          ref={canvasRef}
          data-scratch-layer
          aria-hidden="true"
          className={`absolute inset-0 size-full touch-none transition-opacity duration-(--dur-long) ease-out ${
            revealed ? 'pointer-events-none opacity-0' : ''
          }`}
        />

        <p
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2 text-center text-sm font-semibold tracking-[0.08em] text-ink uppercase transition-opacity duration-(--dur-short) ease-out ${
            touched || revealed ? 'opacity-0' : ''
          }`}
        >
          {t.scratch.hint}
        </p>
      </div>

      {/* Для клавиатуры, скринридера и тех, кому неудобно стирать. */}
      <div className="mt-4 flex min-h-11 justify-center">
        {!revealed && (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="min-h-11 px-3 text-sm whitespace-nowrap text-muted underline decoration-rule underline-offset-4 transition-colors duration-(--dur-micro) ease-out hover:text-ink"
          >
            {t.scratch.reveal}
          </button>
        )}
      </div>
    </Section>
  );
}
