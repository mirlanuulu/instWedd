import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { invite } from '@/config/invite';
import { minimalMeta } from '@/designs/minimal/meta';
import { formatEventDate } from '@/lib/invite';
import { dictionaries } from '@/locales';

/*
 * Картинка, которую WhatsApp, Telegram и Instagram показывают рядом со ссылкой
 * на /minimal. Та же композиция, что у обложки: название вверху, имена лесенкой,
 * дата под волосяной линией. Собирается из конфига при сборке.
 */

const locale = invite.languages.default;
const t = dictionaries[locale];
const [first, second] = invite.couple;

export const alt = t.meta.title(first.name[locale], second.name[locale]);
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const font = (file: string) => readFile(join(process.cwd(), 'assets/fonts', file));

/** Ширина строки имён на картинке: 1200 минус поля по 80. */
const NAMES_WIDTH = 1040;

export default async function OpengraphImage() {
  const [display, text] = await Promise.all([font('Literata-ExtraLight.ttf'), font('Geist-Medium.ttf')]);
  const { paper, ink, muted, rule } = minimalMeta;
  const date = formatEventDate(invite.event, t);

  const firstName = first.name[locale];
  const secondName = second.name[locale];
  // Как на сайте: кегль подстраивается под самое длинное имя.
  const chars = Math.max(Array.from(firstName).length, Array.from(secondName).length);
  const nameSize = Math.min(148, Math.floor(NAMES_WIDTH / (chars * 0.62)));

  const label = { fontFamily: 'Text', fontSize: 24, letterSpacing: 4, textTransform: 'uppercase', color: muted } as const;
  const name = { fontFamily: 'Display', fontSize: nameSize, lineHeight: 1, letterSpacing: -2 } as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 80px 60px',
          background: paper,
          color: ink,
        }}
      >
        <div style={label}>{invite.event.title[locale]}</div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={name}>{firstName}</div>
          <div style={{ ...label, margin: '14px 0 18px' }}>{t.hero.and}</div>
          <div style={{ ...name, alignSelf: 'flex-end' }}>{secondName}</div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            borderTop: `2px solid ${rule}`,
            paddingTop: 22,
          }}
        >
          <div style={{ fontFamily: 'Display', fontSize: 48 }}>{date.numeric}</div>
          <div style={{ fontFamily: 'Text', fontSize: 26, color: muted }}>
            {`${date.weekday}, ${date.time} · ${invite.venue.city[locale]}`}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Display', data: display, style: 'normal', weight: 200 },
        { name: 'Text', data: text, style: 'normal', weight: 500 },
      ],
    },
  );
}
