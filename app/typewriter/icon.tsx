import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { invite } from '@/config/invite';
import { typewriterMeta } from '@/designs/typewriter/meta';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** Иконка вкладки: красный штемпель с числом дня на бланке. Рисуется при сборке. */
export default async function Icon() {
  const { paper, accent } = typewriterMeta;
  const font = await readFile(join(process.cwd(), 'assets/fonts', 'IBMPlexMono-Bold.ttf'));
  const day = invite.event.date.slice(-2);

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: paper }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            border: `5px solid ${accent}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accent,
            fontFamily: 'Mono',
            fontSize: 26,
          }}
        >
          {day}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Mono', data: font, style: 'normal', weight: 700 }] },
  );
}
