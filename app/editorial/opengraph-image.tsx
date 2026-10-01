import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { invite } from '@/config/invite';
import { editorialMeta } from '@/designs/editorial/meta';
import { formatEventDate } from '@/lib/invite';
import { dictionaries } from '@/locales';

/*
 * Картинка-превью ссылки на /editorial: обложка номера в альбомном формате.
 * Красная шапка, строка с датой и городом между линейками, имена дидоной.
 */

const locale = invite.languages.default;
const t = dictionaries[locale];
const [first, second] = invite.couple;

export const alt = t.meta.title(first.name[locale], second.name[locale]);
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const font = (file: string) => readFile(join(process.cwd(), 'assets/fonts', file));

/** Ширина колонки на картинке: 1200 минус поля по 80. */
const WIDTH = 1040;
const chars = (text: string) => Array.from(text).length;

export default async function OpengraphImage() {
  const [masthead, display, caps] = await Promise.all([
    font('Playfair-BlackCondensed.ttf'),
    font('Playfair-Display.ttf'),
    font('SourceSerif4-SemiBold.ttf'),
  ]);
  const { paper, ink, muted, accent } = editorialMeta;
  const date = formatEventDate(invite.event, t);

  const title = invite.event.title[locale].toUpperCase();
  const names = `${first.name[locale]} ${t.hero.and} ${second.name[locale]}`;
  const capsLine = { fontFamily: 'Caps', fontSize: 24, letterSpacing: 3, textTransform: 'uppercase' } as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '48px 80px 52px',
          background: paper,
          color: ink,
        }}
      >
        <div style={{ borderTop: `6px solid ${ink}` }} />
        <div
          style={{
            fontFamily: 'Masthead',
            fontSize: Math.min(170, Math.floor(WIDTH / (chars(title) * 0.66))),
            lineHeight: 1.05,
            color: accent,
            marginTop: 10,
          }}
        >
          {title}
        </div>
        <div
          style={{
            ...capsLine,
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: `2px solid ${ink}`,
            borderBottom: `2px solid ${ink}`,
            padding: '10px 0',
            marginTop: 8,
          }}
        >
          <div>{date.full}</div>
          <div>{invite.venue.city[locale]}</div>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Display',
            fontSize: Math.min(104, Math.floor(WIDTH / (chars(names) * 0.48))),
            lineHeight: 1,
          }}
        >
          {names}
        </div>
        <div style={{ ...capsLine, color: muted }}>{`${date.weekday}, ${date.time} · ${invite.venue.name[locale]}`}</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Masthead', data: masthead, style: 'normal', weight: 900 },
        { name: 'Display', data: display, style: 'normal', weight: 400 },
        { name: 'Caps', data: caps, style: 'normal', weight: 600 },
      ],
    },
  );
}
