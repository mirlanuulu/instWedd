import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { invite } from '@/config/invite';
import { themeMeta } from '@/config/themes';
import { formatEventDate } from '@/lib/invite';
import { needsExtendedScript } from '@/lib/names';
import { dictionaries } from '@/locales';

/*
 * Картинка, которую WhatsApp, Telegram и Instagram показывают рядом со ссылкой.
 * Собирается из конфига один раз при сборке: имена, дата, город.
 */

const locale = invite.languages.default;
const t = dictionaries[locale];
const [first, second] = invite.couple;

export const alt = t.meta.title(first.name[locale], second.name[locale]);
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const romantic = invite.theme === 'romantic';
const extended = needsExtendedScript(invite.couple);

// Те же шрифты, что на сайте, но в TTF: генератор картинок не читает woff2.
const namesFile = !romantic ? 'Forum-Regular.ttf' : extended ? 'BadScript-Regular.ttf' : 'GreatVibes-Regular.ttf';
const font = (file: string) => readFile(join(process.cwd(), 'assets/fonts', file));

export default async function OpengraphImage() {
  const [namesFont, textFont] = await Promise.all([font(namesFile), font('CormorantGaramond-Medium.ttf')]);
  const { paper, ink, muted, accent, rule } = themeMeta[invite.theme].card;
  const date = formatEventDate(invite.event, t);

  const nameStyle = {
    fontFamily: 'Names',
    fontSize: romantic ? (extended ? 100 : 138) : 104,
    // У Bad Script длинные выносные элементы: строкам нужно больше воздуха.
    lineHeight: romantic && extended ? 1.35 : 1.1,
    letterSpacing: romantic ? 0 : 8,
    textTransform: romantic ? 'none' : 'uppercase',
  } as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          padding: 28,
          background: paper,
          color: ink,
          fontFamily: 'Text',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${rule}`,
          }}
        >
          <div style={{ fontSize: 30, letterSpacing: 7, textTransform: 'uppercase', color: muted }}>
            {invite.event.title[locale]}
          </div>
          <div style={{ ...nameStyle, marginTop: 22 }}>{first.name[locale]}</div>
          <div style={{ fontSize: 40, color: accent }}>{t.hero.and}</div>
          <div style={nameStyle}>{second.name[locale]}</div>
          {/*
            Одна строка, а не три узла: генератор принимает в блоке без flex только один текстовый узел.
            Дата словами: цифры у Cormorant старостильные, и в «29.11.2026» единицы читались бы как «II».
          */}
          <div style={{ marginTop: 26, fontSize: 40 }}>{`${date.full} · ${invite.venue.city[locale]}`}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Names', data: namesFont, style: 'normal', weight: 400 },
        { name: 'Text', data: textFont, style: 'normal', weight: 500 },
      ],
    },
  );
}
