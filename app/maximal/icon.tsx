import { ImageResponse } from 'next/og';
import { maximalMeta } from '@/designs/maximal/meta';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** Иконка вкладки: золотая звезда на изумрудном круге с малиновым кольцом. Рисуется при сборке. */
export default function Icon() {
  const { emerald, magenta, gold } = maximalMeta;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 32,
          background: emerald,
          border: `5px solid ${magenta}`,
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24">
          <path fill={gold} d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
        </svg>
      </div>
    ),
    size,
  );
}
