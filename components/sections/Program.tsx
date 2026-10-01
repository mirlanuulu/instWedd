'use client';

import { useRef } from 'react';
import { useMotion } from '@/lib/motionLoader';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Section, SectionHeading } from '@/components/ui/Section';

export function Program() {
  const invite = useInvite();
  const { t, pick } = useLocale();
  const motion = useMotion();
  const list = useRef<HTMLOListElement>(null);

  return (
    <Section surface="alt" labelledBy="program-title">
      <SectionHeading id="program-title">{t.program.title}</SectionHeading>

      {/* Линия таймлайна — левая граница колонки с текстом; точки сидят на ней. */}
      <ol ref={list} className="mt-10">
        {invite.program.map((item, index) => {
          const isLast = index === invite.program.length - 1;
          return (
            <li key={`${item.time}-${index}`} data-program-item className="grid grid-cols-[4.25rem_minmax(0,1fr)]">
              <time className="pt-0.5 font-display text-md text-accent lining-nums tabular-nums">{item.time}</time>

              <div className={`relative border-l border-rule pl-6 ${isLast ? 'pb-1' : 'pb-9'}`}>
                <span
                  aria-hidden="true"
                  className="absolute top-2.5 -left-[5px] size-[9px] rounded-pill bg-accent ring-4 ring-paper"
                />
                <h3 className="font-body text-md font-semibold">{pick(item.title)}</h3>
                {item.note && <p className="mt-1 text-ink-2">{pick(item.note)}</p>}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Появление пунктов по скроллу подключается, когда загрузился чанк с анимациями. */}
      {motion && <motion.ProgramReveal root={list} />}
    </Section>
  );
}
