'use client';

import { useEffect, useId } from 'react';
import { fireConfetti } from '@/lib/confetti';
import { SIDES } from '@/config/types';
import { RSVP_LIMITS } from '@/lib/rsvp';
import { useRsvpForm } from '@/lib/useRsvpForm';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Button } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';

const FIELD =
  'mt-1 w-full border-b border-ink-2 bg-transparent py-2 text-base text-ink placeholder:text-muted ' +
  // Фокус у поля-строки — акцентное подчёркивание двойной толщины вместо рамки вокруг.
  // Вторая линия рисуется тенью, чтобы поле не прыгало на пиксель.
  'outline-none focus:border-accent focus:shadow-[0_1px_0_0_var(--color-accent)] ' +
  'aria-invalid:border-accent';

const CHOICE =
  'relative flex min-h-12 cursor-pointer items-center justify-center rounded-(--radius-control) border border-ink-2 px-3 ' +
  'text-sm font-semibold tracking-[0.08em] whitespace-nowrap text-ink uppercase ' +
  'transition-[background-color,border-color,color,transform] duration-(--dur-micro) ease-out active:translate-y-px ' +
  'hover:bg-paper-2 has-checked:border-accent has-checked:bg-accent has-checked:text-accent-ink ' +
  'has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-focus';

const STEP =
  'grid size-11 place-items-center rounded-pill border border-ink-2 text-md leading-none text-ink ' +
  'transition-[background-color,transform] duration-(--dur-micro) ease-out hover:bg-paper-2 active:scale-95 ' +
  'disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100';

export function Rsvp() {
  const invite = useInvite();
  const { t, locale } = useLocale();
  const ids = useId();
  const askSide = invite.rsvp.sides.ask;
  const form = useRsvpForm({ locale, maxGuests: invite.rsvp.maxGuests, askSide });
  const { refs, name, side, attending, guests, wish, invalid, status, sending, maxGuests } = form;

  // Конфетти только тем, кто придёт. После отправки формы уже нет, так что attending больше не меняется.
  useEffect(() => {
    if (status === 'sent' && attending && refs.thanks.current) fireConfetti(refs.thanks.current);
  }, [status, attending, refs.thanks]);

  if (status === 'sent') {
    const thanks = attending ? t.rsvp.thanksYes : t.rsvp.thanksNo;
    return (
      <Section surface="alt" labelledBy="rsvp-title">
        <div ref={refs.thanks} tabIndex={-1} role="status" data-rsvp-thanks className="py-10 text-center outline-none">
          <h2 id="rsvp-title" className="text-xl">
            {thanks.title}
          </h2>
          <p className="mx-auto mt-4 max-w-[28ch] text-ink-2">{thanks.text}</p>
        </div>
      </Section>
    );
  }

  return (
    <Section surface="alt" labelledBy="rsvp-title">
      <SectionHeading id="rsvp-title" align="center">
        {t.rsvp.title}
      </SectionHeading>

      <form noValidate onSubmit={form.submit} className="mt-10 grid gap-8">
        {/* Ловушка для спам-ботов: человек это поле не видит и не заполняет, сервер такие ответы отбрасывает. */}
        <input
          ref={refs.trap}
          type="text"
          name="rsvp_check"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="sr-only"
        />

        <div>
          <label htmlFor={`${ids}-name`} className="text-sm text-ink-2">
            {t.rsvp.name}
          </label>
          <input
            ref={refs.name}
            id={`${ids}-name`}
            type="text"
            autoComplete="name"
            maxLength={RSVP_LIMITS.name}
            value={name}
            onChange={(event) => form.setName(event.target.value)}
            aria-invalid={invalid.name}
            aria-describedby={invalid.name ? `${ids}-name-error` : undefined}
            className={FIELD}
          />
          {invalid.name && (
            <p id={`${ids}-name-error`} className="mt-2 text-sm font-semibold text-accent">
              {t.rsvp.nameRequired}
            </p>
          )}
        </div>

        {askSide && (
          <fieldset aria-describedby={invalid.side ? `${ids}-side-error` : undefined}>
            <legend className="text-sm text-ink-2">{t.rsvp.side.question}</legend>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {SIDES.map((option, i) => (
                <label key={option} className={CHOICE}>
                  <input
                    ref={i === 0 ? refs.firstSide : undefined}
                    type="radio"
                    name={`${ids}-side`}
                    checked={side === option}
                    onChange={() => form.chooseSide(option)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                  {t.rsvp.side[option]}
                </label>
              ))}
            </div>
            {invalid.side && (
              <p id={`${ids}-side-error`} className="mt-3 text-sm font-semibold text-accent">
                {t.rsvp.side.required}
              </p>
            )}
          </fieldset>
        )}

        <fieldset aria-describedby={invalid.attending ? `${ids}-choice-error` : undefined}>
          <legend className="text-sm text-ink-2">{t.rsvp.attendance}</legend>
          {/* Варианты — полные фразы, поэтому друг под другом. */}
          <div className="mt-3 grid grid-cols-1 gap-3">
            {[true, false].map((option) => (
              <label key={String(option)} className={CHOICE}>
                {/* Радио остаётся в потоке внутри подписи: выбор не дёргает прокрутку. */}
                <input
                  ref={option ? refs.firstChoice : undefined}
                  type="radio"
                  name={`${ids}-attending`}
                  checked={attending === option}
                  onChange={() => form.choose(option)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                {option ? t.rsvp.yes : t.rsvp.no}
              </label>
            ))}
          </div>
          {invalid.attending && (
            <p id={`${ids}-choice-error`} className="mt-3 text-sm font-semibold text-accent">
              {t.rsvp.attendanceRequired}
            </p>
          )}
        </fieldset>

        {attending && (
          <div className="flex items-center justify-between gap-4">
            <span id={`${ids}-guests`} className="text-sm text-ink-2">
              {t.rsvp.guests}
            </span>
            <div role="group" aria-labelledby={`${ids}-guests`} className="flex items-center gap-3">
              <button
                type="button"
                aria-label={t.rsvp.guestsLess}
                disabled={guests <= 1}
                onClick={form.removeGuest}
                className={STEP}
              >
                −
              </button>
              <output aria-live="polite" className="w-8 text-center font-display text-lg lining-nums tabular-nums">
                {guests}
              </output>
              <button
                type="button"
                aria-label={t.rsvp.guestsMore}
                disabled={guests >= maxGuests}
                onClick={form.addGuest}
                className={STEP}
              >
                +
              </button>
            </div>
          </div>
        )}

        <div>
          <label htmlFor={`${ids}-wish`} className="text-sm text-ink-2">
            {t.rsvp.wish}
          </label>
          <textarea
            id={`${ids}-wish`}
            rows={3}
            maxLength={RSVP_LIMITS.wish}
            placeholder={t.rsvp.wishPlaceholder}
            value={wish}
            onChange={(event) => form.setWish(event.target.value)}
            className={`${FIELD} resize-none`}
          />
        </div>

        <div>
          <Button type="submit" aria-busy={sending} disabled={sending}>
            {sending ? t.rsvp.sending : t.rsvp.submit}
          </Button>
          <p role="alert" className="mt-3 min-h-6 text-center text-sm font-semibold text-accent">
            {status === 'error' ? t.rsvp.error : ''}
          </p>
        </div>
      </form>
    </Section>
  );
}
