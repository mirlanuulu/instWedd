'use client';

const PIECES = 70;
const DURATION = 2600;
const GRAVITY = 900;
const TOKENS = ['--color-accent', '--color-gold', '--color-gold-2', '--color-accent-2', '--color-petal-1'];

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  angle: number;
  spin: number;
  flip: number;
  flipSpeed: number;
  color: string;
}

/**
 * Один залп конфетти из центра элемента. Холст создаётся на время залпа
 * и убирается сам, так что в покое эффект ничего не стоит.
 */
export function fireConfetti(source: Element) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const origin = source.getBoundingClientRect();
  const css = getComputedStyle(source);
  const colors = TOKENS.map((name) => css.getPropertyValue(name).trim()).filter(Boolean);
  if (colors.length === 0) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: getComputedStyle(document.documentElement).getPropertyValue('--z-controls').trim(),
  });
  document.body.appendChild(canvas);
  ctx.scale(ratio, ratio);

  const centerX = origin.left + origin.width / 2;
  const centerY = origin.top + origin.height / 2;

  const pieces: Piece[] = Array.from({ length: PIECES }, () => {
    // Веер вверх: от 200° до 340°, где 270° — строго вверх.
    const direction = ((200 + Math.random() * 140) * Math.PI) / 180;
    const speed = 260 + Math.random() * 420;
    return {
      x: centerX + (Math.random() - 0.5) * origin.width * 0.5,
      y: centerY,
      vx: Math.cos(direction) * speed,
      vy: Math.sin(direction) * speed,
      width: 5 + Math.random() * 5,
      height: 8 + Math.random() * 6,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 10,
      flip: Math.random() * Math.PI * 2,
      flipSpeed: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)] ?? 'currentColor',
    };
  });

  const started = performance.now();
  let last = started;

  const draw = (now: number) => {
    const elapsed = now - started;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    ctx.clearRect(0, 0, width, height);
    // Последняя треть залпа гаснет целиком.
    const fade = Math.min(1, (DURATION - elapsed) / (DURATION * 0.33));

    for (const piece of pieces) {
      piece.vy += GRAVITY * dt;
      // Сопротивление воздуха: бумажки быстро теряют разгон и дальше планируют.
      piece.vx *= 1 - 1.8 * dt;
      piece.vy *= 1 - 0.9 * dt;
      piece.x += piece.vx * dt;
      piece.y += piece.vy * dt;
      piece.angle += piece.spin * dt;
      piece.flip += piece.flipSpeed * dt;

      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.angle);
      ctx.scale(1, Math.cos(piece.flip));
      ctx.globalAlpha = Math.max(0, fade);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
      ctx.restore();
    }

    if (elapsed < DURATION) requestAnimationFrame(draw);
    else canvas.remove();
  };
  requestAnimationFrame(draw);
}
