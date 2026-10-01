import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { invite } from '@/config/invite';
import { groteskMeta } from '@/designs/grotesk/meta';
import { formatEventDate } from '@/lib/invite';
import { dictionaries } from '@/locales';

/*
 * Картинка-превью ссылки на /grotesk: плакат в альбомном формате.
 * Слева огромные число и месяц, справа имена и время, сверху линейка.
 */

const locale = invite.languages.default;
const t = dictionaries[locale];
const [first, second] = invite.couple;

export const alt = t.meta.title(first.name[locale], second.name[locale]);
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const font = (file: string) => readFile(join(process.cwd(), 'assets/fonts', file));
const twoDigits = (value: number) => String(value).padStart(2, '0');

export default async function OpengraphImage() {
  const [bold, semi] = await Promise.all([font('Onest-ExtraBold.ttf'), font('Onest-SemiBold.ttf')]);
  const { paper, ink, muted, accent } = groteskMeta;
  const date = formatEventDate(invite.event, t);

  const numerals = { fontFamily: 'Bold', fontSize: 250, lineHeight: 0.8, letterSpacing: -16 } as const;
  const label = { fontFamily: 'Semi', fontSize: 26 } as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '48px 72px 56px',
          background: paper,
          color: ink,
        }}
      >
        <div style={{ ...label, display: 'flex', justifyContent: 'space-between', borderBottom: `4px solid ${ink}`, paddingBottom: 14 }}>
          <div>{invite.event.title[locale]}</div>
          <div>{invite.venue.city[locale]}</div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 56 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ ...numerals, color: accent }}>{twoDigits(date.day)}</div>
            <div style={numerals}>{twoDigits(date.month)}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 6 }}>
            <div style={{ fontFamily: 'Bold', fontSize: 72, lineHeight: 1, letterSpacing: -2 }}>{first.name[locale]}</div>
            <div style={{ fontFamily: 'Bold', fontSize: 72, lineHeight: 1, letterSpacing: -2, color: accent }}>
              {second.name[locale]}
            </div>
            <div style={{ ...label, color: muted, marginTop: 24 }}>{`${date.year} · ${date.weekday}, ${date.time}`}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Bold', data: bold, style: 'normal', weight: 800 },
        { name: 'Semi', data: semi, style: 'normal', weight: 600 },
      ],
    },
  );
}
