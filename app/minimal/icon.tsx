import { ImageResponse } from 'next/og';
import { minimalMeta } from '@/designs/minimal/meta';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** Иконка вкладки: обведённое число из календаря — кольцо чернилами на картоне. Рисуется при сборке. */
export default function Icon() {
  const { paper, ink } = minimalMeta;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: paper,
        }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 20, border: `5px solid ${ink}` }} />
      </div>
    ),
    size,
  );
}
