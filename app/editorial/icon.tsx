import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { invite } from '@/config/invite';
import { editorialMeta } from '@/designs/editorial/meta';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** Иконка вкладки: первая буква шапки журнальным красным под чернильной линейкой. Рисуется при сборке. */
export default async function Icon() {
  const { paper, ink, accent } = editorialMeta;
  const font = await readFile(join(process.cwd(), 'assets/fonts', 'Playfair-BlackCondensed.ttf'));
  const letter = (Array.from(invite.event.title[invite.languages.default].trim())[0] ?? '').toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: paper,
          borderTop: `8px solid ${ink}`,
        }}
      >
        <div style={{ fontFamily: 'Masthead', fontSize: 54, lineHeight: 1, color: accent, marginTop: 2 }}>{letter}</div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Masthead', data: font, style: 'normal', weight: 900 }] },
  );
}
