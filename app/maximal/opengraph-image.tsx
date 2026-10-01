import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { invite } from '@/config/invite';
import { maximalMeta } from '@/designs/maximal/meta';
import { formatEventDate } from '@/lib/invite';
import { dictionaries } from '@/locales';

/*
 * Картинка-превью ссылки на /maximal: изумрудная сцена, малиновые кулисы по краям,
 * имена золотом с малиновой тенью, золотой круг с датой и звёзды.
 */

const locale = invite.languages.default;
const t = dictionaries[locale];
const [first, second] = invite.couple;

export const alt = t.meta.title(first.name[locale], second.name[locale]);
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const font = (file: string) => readFile(join(process.cwd(), 'assets/fonts', file));

const STAR = 'M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z';
const STARS = [
  { x: 210, y: 70, s: 34 },
  { x: 940, y: 90, s: 26 },
  { x: 880, y: 520, s: 40 },
  { x: 260, y: 520, s: 22 },
];

export default async function OpengraphImage() {
  const [display, text] = await Promise.all([font('YesevaOne-Regular.ttf'), font('Geologica-SemiBold.ttf')]);
  const { deep, emerald, magenta, gold, paper } = maximalMeta;
  const date = formatEventDate(invite.event, t);

  const curtain = `repeating-linear-gradient(90deg, #6c0043 0px, ${magenta} 18px, #b4127a 26px, ${magenta} 34px, #6c0043 52px)`;
  const name = { fontFamily: 'Display', fontSize: 104, lineHeight: 1, color: gold, textShadow: `5px 5px 0 ${magenta}` } as const;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: emerald, color: paper, position: 'relative' }}>
        <div style={{ width: 110, height: '100%', backgroundImage: curtain }} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 64px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: 'Text', fontSize: 24, letterSpacing: 4, color: gold }}>
              {invite.event.title[locale].toUpperCase()}
            </div>
            <div style={{ ...name, marginTop: 18 }}>{first.name[locale]}</div>
            <div style={{ fontFamily: 'Text', fontSize: 30, letterSpacing: 6, margin: '10px 0' }}>{t.hero.and.toUpperCase()}</div>
            <div style={name}>{second.name[locale]}</div>
          </div>
          <div
            style={{
              width: 230,
              height: 230,
              borderRadius: 115,
              background: gold,
              border: `8px solid ${paper}`,
              boxShadow: `10px 10px 0 ${magenta}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: deep,
            }}
          >
            <div style={{ fontFamily: 'Display', fontSize: 96, lineHeight: 1 }}>{String(date.day)}</div>
            <div style={{ fontFamily: 'Text', fontSize: 24, letterSpacing: 2 }}>
              {t.date.monthYear(date.month - 1, date.year).toUpperCase()}
            </div>
          </div>
        </div>
        <div style={{ width: 110, height: '100%', backgroundImage: curtain }} />
        {STARS.map((star) => (
          <svg
            key={`${star.x}-${star.y}`}
            width={star.s}
            height={star.s}
            viewBox="0 0 24 24"
            style={{ position: 'absolute', left: star.x, top: star.y }}
          >
            <path fill={gold} d={STAR} />
          </svg>
        ))}
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Display', data: display, style: 'normal', weight: 400 },
        { name: 'Text', data: text, style: 'normal', weight: 600 },
      ],
    },
  );
}
