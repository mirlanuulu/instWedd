import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { invite } from '@/config/invite';
import { groteskMeta } from '@/designs/grotesk/meta';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** Иконка вкладки: число дня жирным гротеском на кобальтовом квадрате. Рисуется при сборке. */
export default async function Icon() {
  const { paper, accent } = groteskMeta;
  const font = await readFile(join(process.cwd(), 'assets/fonts', 'Onest-ExtraBold.ttf'));
  const day = invite.event.date.slice(-2);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: accent,
          color: paper,
          fontFamily: 'Onest',
          fontSize: 40,
          letterSpacing: -3,
        }}
      >
        {day}
      </div>
    ),
    { ...size, fonts: [{ name: 'Onest', data: font, style: 'normal', weight: 800 }] },
  );
}
