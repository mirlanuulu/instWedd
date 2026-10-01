'use client';

import { useEffect, useId } from 'react';
import { fireConfetti } from '@/lib/confetti';
import { RSVP_LIMITS } from '@/lib/rsvp';
import { useRsvpForm } from '@/lib/useRsvpForm';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Section } from './parts';

// Поле — белая лента на бланке с синей графой снизу. Фокус — кольцо outline, толщина линии не меняется.
const FIELD =
  'mt-2 min-h-12 w-full border-b-2 border-form bg-strip px-3 py-2.5 text-base text-ink placeholder:text-muted ' +
  'aria-invalid:border-accent';

const CHOICE =
  'relative flex min-h-12 cursor-pointer items-center justify-center border-2 border-form bg-strip px-3 font-bold whitespace-nowrap text-form uppercase ' +
  'transition-[background-color,color] duration-(--dur-micro) ease-out ' +
  '[@media(hover:hover)]:hover:bg-paper-2 has-checked:bg-form has-checked:text-strip ' +
  'has-focus-visible:z-(--z-raised) has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-form';

const STEP =
  'grid size-12 place-items-center border-2 border-form bg-strip text-md font-bold leading-none text-ink ' +
  'transition-[background-color,transform] duration-(--dur-micro) ease-out active:translate-y-px ' +
  '[@media(hover:hover)]:hover:bg-paper-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:translate-y-0';

const SUBMIT =
  'flex min-h-14 w-full items-center justify-center bg-accent px-6 text-md font-bold tracking-[0.12em] whitespace-nowrap text-accent-ink uppercase ' +
  'transition-[background-color,transform] duration-(--dur-micro) ease-out active:translate-y-px ' +
  '[@media(hover:hover)]:hover:bg-form disabled:cursor-not-allowed disabled:opacity-55 disabled:active:translate-y-0 ' +
  'aria-busy:cursor-progress';

export function Rsvp() {
  const { rsvp } = useInvite();
  const { t, locale } = useLocale();
  const ids = useId();
  const form = useRsvpForm({ locale, maxGuests: rsvp.maxGuests });
  const { refs, name, attending, guests, wish, invalid, status, sending, maxGuests } = form;

  // Салют тем, кто придёт: красный штемпель, синь бланка и золото.
  useEffect(() => {
    if (status === 'sent' && attending && refs.thanks.current) fireConfetti(refs.thanks.current);
  }, [status, attending, refs.thanks]);

  // Ответ принят: вместо формы — заголовок и строка текста.
  if (status === 'sent') {
    const thanks = attending ? t.rsvp.thanksYes : t.rsvp.thanksNo;
    return (
      <Section labelledBy="rsvp-title" title={thanks.title}>
        <div ref={refs.thanks} tabIndex={-1} role="status" aria-labelledby="rsvp-title" className="mt-3 outline-none">
          <p className="max-w-[45ch] text-ink-2">{thanks.text}</p>
        </div>
      </Section>
    );
  }

  return (
    <Section labelledBy="rsvp-title" title={t.rsvp.title}>
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
          <label htmlFor={`${ids}-name`} className="form-label">
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
            <p id={`${ids}-name-error`} className="mt-2 font-semibold text-accent">
              {t.rsvp.nameRequired}
            </p>
          )}
        </div>

        <fieldset aria-describedby={invalid.attending ? `${ids}-choice-error` : undefined}>
          <legend className="form-label">{t.rsvp.attendance}</legend>
          {/* Два варианта встык: у второго общая граница с первым. */}
          <div className="mt-2 grid grid-cols-2 [&>*+*]:-ml-0.5">
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
            <p id={`${ids}-choice-error`} className="mt-2 font-semibold text-accent">
              {t.rsvp.attendanceRequired}
            </p>
          )}
        </fieldset>

        {attending && (
          <div className="flex items-center justify-between gap-4">
            <span id={`${ids}-guests`} className="form-label">
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
              <output aria-live="polite" className="w-12 text-center text-xl font-bold tabular-nums">
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
          <label htmlFor={`${ids}-wish`} className="form-label">
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
          <p role="alert" className="mt-3 min-h-6 font-semibold text-accent">
            {status === 'error' ? t.rsvp.error : ''}
          </p>
        </div>
      </form>
    </Section>
  );
}
