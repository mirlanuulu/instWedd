'use client';

import { useRef } from 'react';
import { invite } from '@/config/invite';
import { formatEventDate } from '@/lib/invite';
import { useReducedMotion } from '@/lib/motion';
import { useMotion } from '@/lib/motionLoader';
import { HandwrittenName } from '@/components/effects/HandwrittenName';
import { Ornament } from '@/components/effects/Ornament';
import { Petals } from '@/components/effects/Petals';
import { useIntro } from '@/components/providers/IntroProvider';
import { useLocale } from '@/components/providers/LocaleProvider';

const romantic = invite.theme === 'romantic';

export function Hero() {
  const { t, pick, locale } = useLocale();
  const { phase } = useIntro();
  const reduced = useReducedMotion();
  const motion = useMotion();
  const root = useRef<HTMLElement>(null);

  const [first, second] = invite.couple;
  const firstName = pick(first.name);
  const secondName = pick(second.name);
  const date = formatEventDate(invite.event, t);

  return (
    <section
      ref={root}
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-gutter py-section text-center"
    >
      {romantic && <Petals />}

      <div className="relative mx-auto flex w-full max-w-invite flex-col items-center">
        {!romantic && (
          <div data-reveal="lead">
            <Ornament variant="crest" className="mb-6 size-16 text-accent-2" />
          </div>
        )}

        <p data-reveal="lead" className="text-sm tracking-[0.14em] text-muted uppercase">
          {pick(invite.event.title)}
        </p>

        <h1 className="names mt-6 w-full">
          <span className="sr-only">
            {firstName} {t.hero.and} {secondName}
          </span>
          <HandwrittenName text={firstName} />
          <span
            data-reveal="and"
            aria-hidden="true"
            className="my-1 block font-body text-md tracking-normal text-accent normal-case"
          >
            {t.hero.and}
          </span>
          <HandwrittenName text={secondName} />
        </h1>

        <p data-reveal="rest" className="mt-8 text-md text-ink">
          <time dateTime={`${invite.event.date}T${invite.event.time}${invite.event.utcOffset}`}>{date.full}</time>
        </p>
        <p data-reveal="rest" className="mt-1 text-base text-muted">
          {date.weekday}, {date.time}
        </p>

        <p data-reveal="rest" className="mt-8 max-w-[28ch] text-base text-ink-2">
          {pick(invite.event.invitation)}
        </p>
      </div>

      {/* Анимации первого экрана живут в отдельном чанке и подключаются, когда он загрузился. */}
      {motion && (
        <>
          <motion.HeroWriting
            root={root}
            play={phase === 'opened' && !reduced}
            replayKey={locale}
            firstNameLength={Array.from(firstName).length}
          />
          {romantic && <motion.Butterflies />}
        </>
      )}
    </section>
  );
}
