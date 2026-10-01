'use client';

import { useEffect, useId } from 'react';
import { fireConfetti } from '@/lib/confetti';
import { RSVP_LIMITS } from '@/lib/rsvp';
import { useRsvpForm } from '@/lib/useRsvpForm';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Section } from './parts';

// Поле — кремовая пилюля в золотом кольце. Фокус — кольцо outline, толщина рамки не меняется.
const FIELD =
  'mt-2 min-h-12 w-full rounded-md border-2 border-gold bg-paper px-4 py-2.5 text-base text-ink placeholder:text-ink-2 ' +
  'aria-invalid:border-signal';

const CHOICE =
  'relative flex min-h-12 cursor-pointer items-center justify-center rounded-pill border-2 border-gold px-3 font-semibold whitespace-nowrap text-paper ' +
  'transition-[background-color,color] duration-(--dur-micro) ease-out ' +
  '[@media(hover:hover)]:hover:bg-magenta-2 has-checked:bg-gold has-checked:text-ink ' +
  'has-focus-visible:z-(--z-raised) has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-gold';

const STEP =
  'grid size-12 place-items-center rounded-pill border-2 border-gold text-md font-bold leading-none text-paper ' +
  'transition-[background-color,transform] duration-(--dur-micro) ease-out active:translate-y-px ' +
  '[@media(hover:hover)]:hover:bg-magenta-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:translate-y-0';

const SUBMIT =
  'flex min-h-14 w-full items-center justify-center rounded-pill bg-gold px-6 font-display text-md whitespace-nowrap text-ink ' +
  'transition-[background-color,transform] duration-(--dur-micro) ease-out active:translate-y-px ' +
  'shadow-[0.3rem_0.3rem_0_var(--color-magenta-2)] [@media(hover:hover)]:hover:bg-gold-2 disabled:cursor-not-allowed disabled:opacity-55 disabled:active:translate-y-0 ' +
  'aria-busy:cursor-progress';

export function Rsvp() {
  const { rsvp } = useInvite();
  const { t, locale } = useLocale();
  const ids = useId();
  const form = useRsvpForm({ locale, maxGuests: rsvp.maxGuests });
  const { refs, name, attending, guests, wish, invalid, status, sending, maxGuests } = form;

  // Салют тем, кто придёт: малина, бирюза и золото.
  useEffect(() => {
    if (status === 'sent' && attending && refs.thanks.current) fireConfetti(refs.thanks.current);
  }, [status, attending, refs.thanks]);

  // Ответ принят: вместо формы — заголовок и строка текста.
  if (status === 'sent') {
    const thanks = attending ? t.rsvp.thanksYes : t.rsvp.thanksNo;
    return (
      <Section labelledBy="rsvp-title" title={thanks.title} band="magenta">
        <div ref={refs.thanks} tabIndex={-1} role="status" aria-labelledby="rsvp-title" className="mt-3 outline-none">
          <p className="max-w-[45ch] text-on-2">{thanks.text}</p>
        </div>
      </Section>
    );
  }

  return (
    <Section labelledBy="rsvp-title" title={t.rsvp.title} band="magenta">
      <form noValidate onSubmit={form.submit} className="mt-6 grid gap-7">
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
          <label htmlFor={`${ids}-name`} className="label">
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
            <p id={`${ids}-name-error`} className="mt-2 font-semibold text-signal">
              {t.rsvp.nameRequired}
            </p>
          )}
        </div>

        <fieldset aria-describedby={invalid.attending ? `${ids}-choice-error` : undefined}>
          <legend className="label">{t.rsvp.attendance}</legend>
          {/* Два варианта встык: у второго общая граница с первым. */}
          <div className="mt-2 grid grid-cols-2 gap-3">
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
            <p id={`${ids}-choice-error`} className="mt-2 font-semibold text-signal">
              {t.rsvp.attendanceRequired}
            </p>
          )}
        </fieldset>

        {attending && (
          <div className="flex items-center justify-between gap-4">
            <span id={`${ids}-guests`} className="label">
              {t.rsvp.guests}
            </span>
            <div role="group" aria-labelledby={`${ids}-guests`} className="flex items-center">
              <button
                type="button"
                aria-label={t.rsvp.guestsLess}
                disabled={guests <= 1}
                onClick={form.removeGuest}
                className={STEP}
              >
                −
              </button>
              <output aria-live="polite" className="w-12 text-center font-display text-xl tabular-nums">
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
          <label htmlFor={`${ids}-wish`} className="label">
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
          <button type="submit" aria-busy={sending} disabled={sending} className={SUBMIT}>
            {sending ? t.rsvp.sending : t.rsvp.submit}
          </button>
          <p role="alert" className="mt-3 min-h-6 font-semibold text-signal">
            {status === 'error' ? t.rsvp.error : ''}
          </p>
        </div>
      </form>
    </Section>
  );
}
