import { ImageResponse } from 'next/og';
import { invite } from '@/config/invite';
import { themeMeta } from '@/config/themes';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** Иконка вкладки: сургучная печать в цвете темы. Рисуется один раз при сборке. */
export default function Icon() {
  const { seal, ring } = themeMeta[invite.theme].icon;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            background: seal,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: 38, height: 38, borderRadius: 19, border: `2px solid ${ring}` }} />
        </div>
      </div>
    ),
    size,
  );
}
