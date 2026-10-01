'use client';

import { useEffect, useId } from 'react';
import { fireConfetti } from '@/lib/confetti';
import { RSVP_LIMITS } from '@/lib/rsvp';
import { useRsvpForm } from '@/lib/useRsvpForm';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Heading, Section, Sheet } from './Sheet';

const FIELD =
  'mt-1 w-full border-b border-ink-2 bg-transparent py-3 text-base text-ink placeholder:text-muted ' +
  // Фокус — двойная линия снизу вместо рамки вокруг. Вторая линия — тень, поле не прыгает на пиксель.
  'outline-none focus:border-ink focus:shadow-[0_1px_0_0_var(--color-ink)] ' +
  'aria-invalid:border-signal aria-invalid:shadow-[0_1px_0_0_var(--color-signal)]';

const CHOICE =
  'relative flex min-h-12 cursor-pointer items-center justify-center border border-ink-2 px-3 whitespace-nowrap text-ink ' +
  'transition-[background-color,color] duration-(--dur-micro) ease-out ' +
  '[@media(hover:hover)]:hover:bg-paper-2 has-checked:border-ink has-checked:bg-ink has-checked:text-paper ' +
  'has-focus-visible:z-(--z-raised) has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-ink';

const STEP =
  'grid size-11 place-items-center border border-ink-2 text-md leading-none text-ink ' +
  'transition-[background-color,transform] duration-(--dur-micro) ease-out active:translate-y-px ' +
  '[@media(hover:hover)]:hover:bg-paper-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:translate-y-0';

const SUBMIT =
  'flex min-h-12 w-full items-center justify-center bg-ink px-6 font-medium whitespace-nowrap text-paper ' +
  'transition-[background-color,transform] duration-(--dur-micro) ease-out active:translate-y-px ' +
  '[@media(hover:hover)]:hover:bg-ink-2 disabled:cursor-not-allowed disabled:opacity-55 disabled:active:translate-y-0 ' +
  'aria-busy:cursor-progress';

export function Rsvp() {
  const { rsvp } = useInvite();
  const { t, locale } = useLocale();
  const ids = useId();
  const form = useRsvpForm({ locale, maxGuests: rsvp.maxGuests });
  const { refs, name, attending, guests, wish, invalid, status, sending, maxGuests } = form;

  // Тем, кто придёт, — салют цвета шампанского.
  useEffect(() => {
    if (status === 'sent' && attending && refs.thanks.current) fireConfetti(refs.thanks.current);
  }, [status, attending, refs.thanks]);

  if (status === 'sent') {
    const thanks = attending ? t.rsvp.thanksYes : t.rsvp.thanksNo;
    return (
      <Section labelledBy="rsvp-title" className="pt-12 pb-24">
        <Sheet>
          <div ref={refs.thanks} tabIndex={-1} role="status" className="border-t border-ink pt-8 outline-none">
            <h2 id="rsvp-title" className="text-xl">
              {thanks.title}
            </h2>
            <p className="mt-3 max-w-[45ch] text-ink-2">{thanks.text}</p>
          </div>
        </Sheet>
      </Section>
    );
  }

  return (
    <Section labelledBy="rsvp-title" className="pt-12 pb-24">
      <Sheet>
        <Heading id="rsvp-title">{t.rsvp.title}</Heading>

        <form noValidate onSubmit={form.submit} className="mt-8 grid gap-8 border-t border-rule pt-8">
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
            <label htmlFor={`${ids}-name`} className="text-muted">
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
              <p id={`${ids}-name-error`} className="mt-2 font-medium text-signal">
                {t.rsvp.nameRequired}
              </p>
            )}
          </div>

          <fieldset aria-describedby={invalid.attending ? `${ids}-choice-error` : undefined}>
            <legend className="text-muted">{t.rsvp.attendance}</legend>
            {/* Два варианта встык, как один переключатель: у второго общая граница с первым. */}
            <div className="mt-3 grid grid-cols-2 [&>*+*]:-ml-px">
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
              <p id={`${ids}-choice-error`} className="mt-3 font-medium text-signal">
                {t.rsvp.attendanceRequired}
              </p>
            )}
          </fieldset>

          {attending && (
            <div className="flex items-center justify-between gap-4">
              <span id={`${ids}-guests`} className="text-muted">
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
                <output aria-live="polite" className="figures w-10 text-center font-display text-md">
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
            <label htmlFor={`${ids}-wish`} className="text-muted">
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
            <p role="alert" className="mt-3 min-h-6 font-medium text-signal">
              {status === 'error' ? t.rsvp.error : ''}
            </p>
          </div>
        </form>
      </Sheet>
    </Section>
  );
}
