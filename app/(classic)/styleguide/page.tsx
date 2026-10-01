import { notFound } from 'next/navigation';
import { invite } from '@/config/invite';
import { THEMES, type ThemeName } from '@/config/types';
import { Ornament } from '@/components/effects/Ornament';
import { dictionaries } from '@/locales';

const SURFACES = ['base', 'alt'] as const;

// Классы перечислены целиком: Tailwind находит их по тексту исходника.
const SWATCHES = [
  { token: 'paper', className: 'bg-paper' },
  { token: 'paper-2', className: 'bg-paper-2' },
  { token: 'rule', className: 'bg-rule' },
  { token: 'muted', className: 'bg-muted' },
  { token: 'ink-2', className: 'bg-ink-2' },
  { token: 'ink', className: 'bg-ink' },
  { token: 'accent', className: 'bg-accent' },
  { token: 'accent-2', className: 'bg-accent-2' },
  { token: 'gold-2', className: 'bg-gold-2' },
  { token: 'gold', className: 'bg-gold' },
  { token: 'gold-deep', className: 'bg-gold-deep' },
  { token: 'focus', className: 'bg-focus' },
] as const;

function Specimen({ theme, surface }: { theme: ThemeName; surface: (typeof SURFACES)[number] }) {
  const [first, second] = invite.couple;
  const { ky, ru } = dictionaries;

  return (
    <section data-theme={theme} data-surface={surface} className="px-gutter py-10">
      <p className="text-xs tracking-[0.14em] text-muted uppercase">
        {theme} · {surface}
      </p>

      <p className="names mt-4">
        {first.name.ky} <span className="text-accent">&amp;</span> {second.name.ky}
      </p>

      {/* Имена с ө, ү, ң. В romantic для них включается Bad Script (см. lib/names.ts): здесь он задан явно. */}
      <p
        className="names mt-2 text-lg text-ink-2"
        style={theme === 'romantic' ? { fontFamily: 'var(--font-bad-script), cursive' } : undefined}
      >
        Өмүрбек, Гүлзат, Жаңыл
      </p>

      <h2 className="mt-6 text-xl">{ky.program.title}</h2>
      <h3 className="mt-2 text-lg">{ru.venue.title}</h3>

      <p className="mt-4">{invite.event.invitation.ky}</p>
      <p className="mt-2 text-ink-2">Өмүр, үмүт, жаңы күн — ө, ү, ң тамгалары.</p>
      <p className="mt-2 text-sm text-muted">
        {ru.date.full(29, 10, 2026)} · {ky.date.full(29, 10, 2026)}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <span className="rounded-pill bg-accent px-5 py-2.5 text-sm font-semibold tracking-[0.06em] whitespace-nowrap text-accent-ink uppercase">
          {ky.rsvp.yes}
        </span>
        <span className="rounded-pill border border-rule px-5 py-2.5 text-sm font-semibold tracking-[0.06em] whitespace-nowrap text-ink uppercase">
          {ky.rsvp.no}
        </span>
        <span className="self-center text-sm text-accent underline underline-offset-4">
          {ky.venue.open2gis}
        </span>
      </div>

      {theme === 'national' && (
        <div className="mt-8 flex items-center gap-6 text-accent-2">
          <Ornament variant="crest" className="size-20" />
          <Ornament variant="divider" className="h-8 w-auto" />
        </div>
      )}

      <ul className="mt-8 grid grid-cols-4 gap-x-3 gap-y-4">
        {SWATCHES.map(({ token, className }) => (
          <li key={token} className="min-w-0">
            <span className={`block h-10 rounded-sm border border-rule ${className}`} />
            <span className="mt-1 block truncate text-xs text-muted">{token}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Палитры и шрифты обеих тем на одном экране. Только для разработки. */
export default function StyleguidePage() {
  if (process.env.NODE_ENV === 'production') notFound();

  return (
    <main className="grid sm:grid-cols-2">
      {THEMES.map((theme) => (
        <div key={theme} className="min-w-0">
          {SURFACES.map((surface) => (
            <Specimen key={surface} theme={theme} surface={surface} />
          ))}
        </div>
      ))}
    </main>
  );
}
