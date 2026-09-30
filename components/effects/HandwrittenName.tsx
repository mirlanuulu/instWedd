'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

/**
 * Имя в виде SVG-текста, разбитого на буквы. Сам ничего не анимирует:
 * секция находит буквы по data-letter и прорисовывает их обводку по очереди.
 *
 * Длинное имя не помещается в строку при базовом кегле, поэтому компонент
 * измеряет текст и уменьшает кегль ровно настолько, чтобы имя влезло.
 */
export function HandwrittenName({ text }: { text: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const [fit, setFit] = useState(1);
  const fitRef = useRef(1);

  useEffect(() => {
    const svg = svgRef.current;
    const label = textRef.current;
    if (!svg || !label) return;

    let alive = true;
    const measure = () => {
      if (!alive) return;
      const available = svg.getBoundingClientRect().width;
      // Ширина текста пропорциональна кеглю: делим на текущий коэффициент и получаем ширину при базовом.
      const natural = label.getComputedTextLength() / fitRef.current;
      if (available === 0 || natural === 0) return;
      // 6% запаса: росчерки рукописного шрифта выходят за расчётную ширину.
      const next = Math.min(1, (available * 0.94) / natural);
      if (Math.abs(next - fitRef.current) > 0.005) {
        fitRef.current = next;
        setFit(next);
      }
    };

    // До загрузки шрифта ширина считалась бы по запасному.
    document.fonts.ready.then(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    return () => {
      alive = false;
      observer.disconnect();
    };
  }, [text]);

  return (
    <svg ref={svgRef} className="names-line" style={{ '--fit': fit } as CSSProperties} aria-hidden="true" focusable="false">
      <text ref={textRef} x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
        {Array.from(text).map((letter, index) => (
          <tspan key={`${letter}-${index}`} data-letter>
            {letter}
          </tspan>
        ))}
      </text>
    </svg>
  );
}
