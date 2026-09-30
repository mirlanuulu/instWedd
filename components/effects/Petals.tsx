'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';
import { useInView } from '@/lib/useInView';
import { useIntroPhase } from '@/components/providers/IntroProvider';

/** Потолок из ТЗ. На узком экране лепестков меньше. */
const MAX_PETALS = 25;
/** У нижнего края лепестки растворяются, а не обрезаются границей секции. */
const FADE_ZONE = 0.16;

interface Petal {
  x: number;
  y: number;
  size: number;
  fall: number;
  sway: number;
  swaySpeed: number;
  phase: number;
  spin: number;
  angle: number;
  flip: number;
  flipSpeed: number;
  alpha: number;
  color: string;
}

/** Лепестки падают внутри ближайшего позиционированного родителя. */
export function Petals() {
  const reduced = useReducedMotion();
  const phase = useIntroPhase();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(canvasRef);

  const running = !reduced && phase === 'opened' && inView;

  // Состояние лепестков живёт между паузами: при возврате на экран они продолжают с того же места.
  const petals = useRef<Petal[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!running || !canvas || !ctx) return;

    const css = getComputedStyle(canvas);
    const colors = ['--color-petal-1', '--color-petal-2', '--color-petal-3'].map(
      (name) => css.getPropertyValue(name).trim() || css.color,
    );

    let width = 0;
    let height = 0;
    const resize = () => {
      const box = canvas.getBoundingClientRect();
      width = box.width;
      height = box.height;
      // Лепестки мягкие: 1.5x хватает, а холст на треть легче, чем при 2x.
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const spawn = (fromTop: boolean): Petal => ({
      x: Math.random() * width,
      y: fromTop ? -20 : Math.random() * height,
      size: 7 + Math.random() * 8,
      fall: 16 + Math.random() * 22,
      sway: 10 + Math.random() * 18,
      swaySpeed: 0.4 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 1.2,
      angle: Math.random() * Math.PI * 2,
      flip: Math.random() * Math.PI * 2,
      flipSpeed: 0.8 + Math.random() * 1.4,
      alpha: 0.45 + Math.random() * 0.4,
      color: colors[Math.floor(Math.random() * colors.length)] ?? css.color,
    });

    const count = Math.min(MAX_PETALS, Math.round(width / 18));
    if (petals.current.length !== count) {
      petals.current = Array.from({ length: count }, () => spawn(false));
    }

    let frame = 0;
    let last = performance.now();

    const draw = (now: number) => {
      // После паузы вкладки dt был бы огромным: лепестки не должны прыгать.
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, width, height);

      petals.current.forEach((petal, index) => {
        petal.y += petal.fall * dt;
        petal.phase += petal.swaySpeed * dt;
        petal.angle += petal.spin * dt;
        petal.flip += petal.flipSpeed * dt;
        if (petal.y > height + 20) petals.current[index] = petal = spawn(true);

        const x = petal.x + Math.sin(petal.phase) * petal.sway;
        const fade = Math.min(1, (height - petal.y) / (height * FADE_ZONE));

        ctx.save();
        ctx.translate(x, petal.y);
        ctx.rotate(petal.angle);
        // Лепесток кувыркается: сжатие по одной оси читается как поворот в воздухе.
        ctx.scale(1, 0.35 + 0.65 * Math.abs(Math.cos(petal.flip)));
        ctx.globalAlpha = petal.alpha * Math.max(0, fade);
        ctx.fillStyle = petal.color;
        ctx.beginPath();
        ctx.moveTo(0, -petal.size);
        ctx.bezierCurveTo(petal.size * 0.9, -petal.size * 0.5, petal.size * 0.7, petal.size * 0.8, 0, petal.size);
        ctx.bezierCurveTo(-petal.size * 0.7, petal.size * 0.8, -petal.size * 0.9, -petal.size * 0.5, 0, -petal.size);
        ctx.fill();
        ctx.restore();
      });

      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [running]);

  if (reduced) return null;

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />;
}
