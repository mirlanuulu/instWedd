import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { invite } from '@/config/invite';
import { TELEGRAM, typewriterMeta } from '@/designs/typewriter/meta';
import { formatEventDate } from '@/lib/invite';
import { dictionaries } from '@/locales';

/*
 * Картинка-превью ссылки на /typewriter: телеграфный бланк. Шапка синью,
 * имена и дата на белых лентах, справа красный штемпель с датой и городом.
 */

const locale = invite.languages.default;
const t = dictionaries[locale];
const [first, second] = invite.couple;

export const alt = t.meta.title(first.name[locale], second.name[locale]);
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const font = (file: string) => readFile(join(process.cwd(), 'assets/fonts', file));

export default async function OpengraphImage() {
  const [bold, medium] = await Promise.all([font('IBMPlexMono-Bold.ttf'), font('IBMPlexMono-Medium.ttf')]);
  const { paper, strip, ink, form, accent } = typewriterMeta;
  const date = formatEventDate(invite.event, t);

  const tape = { background: strip, padding: '6px 16px', boxShadow: '0 2px 3px rgba(31, 25, 21, 0.18)' } as const;
  const names = `${first.name[locale]} ${t.hero.and} ${second.name[locale]}`.toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '52px 72px 60px',
          background: paper,
          color: ink,
          fontFamily: 'Medium',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: `4px solid ${form}`, paddingBottom: 12, color: form }}>
          <div style={{ fontFamily: 'Bold', fontSize: 44, letterSpacing: 8 }}>{TELEGRAM}</div>
          <div style={{ fontSize: 22, letterSpacing: 3 }}>{invite.event.title[locale].toUpperCase()}</div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 26, maxWidth: 760 }}>
            <div style={{ ...tape, fontFamily: 'Bold', fontSize: 56, transform: 'rotate(-1deg)' }}>{names}</div>
            <div style={{ ...tape, fontSize: 32, transform: 'rotate(0.6deg)' }}>{`${date.full}, ${date.time}`.toUpperCase()}</div>
          </div>
          <div
            style={{
              width: 230,
              height: 230,
              borderRadius: 115,
              border: `7px solid ${accent}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: accent,
              transform: 'rotate(-14deg)',
              opacity: 0.88,
            }}
          >
            <div style={{ fontSize: 24, letterSpacing: 4 }}>{invite.venue.city[locale].toUpperCase()}</div>
            <div style={{ fontFamily: 'Bold', fontSize: 50 }}>{date.numeric.slice(0, 5)}</div>
            <div style={{ fontSize: 26 }}>{String(date.year)}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Bold', data: bold, style: 'normal', weight: 700 },
        { name: 'Medium', data: medium, style: 'normal', weight: 500 },
      ],
    },
  );
}
