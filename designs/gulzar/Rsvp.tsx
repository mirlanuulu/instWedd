'use client';

import { useId, type Ref } from 'react';
import { SIDES } from '@/config/types';
import { useInvite } from '@/components/providers/InviteProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { RSVP_LIMITS } from '@/lib/rsvp';
import { useRsvpForm } from '@/lib/useRsvpForm';
import { GardenSection } from './GardenSection';

/** Пара вариантов-«таблеток»: радио внутри подписи, выбор не дёргает прокрутку. */
function Choice<T extends string>({
  name,
  options,
  value,
  onChange,
  label,
  firstRef,
}: {
  name: string;
  options: readonly T[];
  value: T | null;
  onChange: (option: T) => void;
  label: (option: T) => string;
  firstRef?: Ref<HTMLInputElement>;
}) {
  return (
    <div className="g-choices">
      {options.map((option, i) => (
        <label key={String(option)} className="g-choice">
          <input
            ref={i === 0 ? firstRef : undefined}
            type="radio"
            name={name}
            checked={value === option}
            onChange={() => onChange(option)}
          />
          {label(option)}
        </label>
      ))}
    </div>
  );
}

/**
 * Ответ гостя. Вопроса «приду / не смогу» нет: отправленный ответ и значит «приду».
 * Гость отмечает, чей он гость — кыз тарап или бала тарап.
 */
export function Rsvp() {
  const invite = useInvite();
  const { t, locale } = useLocale();
  const ids = useId();
  const askSide = invite.rsvp.sides.ask;
  const form = useRsvpForm({ locale, maxGuests: invite.rsvp.maxGuests, askSide, attendance: 'yes' });
  const { refs, name, side, attending, guests, wish, invalid, status, sending, maxGuests } = form;

  if (status === 'sent') {
    const thanks = t.rsvp.thanksYes;
    return (
      <GardenSection id="rsvp" flower="headPink" title={t.rsvp.title}>
        <div ref={refs.thanks} tabIndex={-1} role="status" className="g-thanks">
          <p className="g-thanks-title">{thanks.title}</p>
          <p className="g-thanks-text">{thanks.text}</p>
        </div>
      </GardenSection>
    );
  }

  return (
    <GardenSection id="rsvp" flower="headPink" title={t.rsvp.title}>
      <form noValidate onSubmit={form.submit} className="g-form">
        {/* Ловушка для спам-ботов: человек это поле не видит, сервер такие ответы отбрасывает. */}
        <input ref={refs.trap} type="text" name="rsvp_check" tabIndex={-1} autoComplete="off" aria-hidden className="sr-only" />

        <div className="g-field">
          <label htmlFor={`${ids}-name`} className="g-label">
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
            className="g-input"
          />
          {invalid.name && (
            <p id={`${ids}-name-error`} className="g-error">
              {t.rsvp.nameRequired}
            </p>
          )}
        </div>

        {askSide && (
          <fieldset className="g-field" aria-describedby={invalid.side ? `${ids}-side-error` : undefined}>
            <legend className="g-label">{t.rsvp.side.question}</legend>
            <Choice
              name={`${ids}-side`}
              options={SIDES}
              value={side}
              onChange={form.chooseSide}
              label={(option) => t.rsvp.side[option]}
              firstRef={refs.firstSide}
            />
            {invalid.side && (
              <p id={`${ids}-side-error`} className="g-error">
                {t.rsvp.side.required}
              </p>
            )}
          </fieldset>
        )}

        {/* Вопроса «приду / не смогу» нет: отправленный ответ и значит «приду». */}
        {attending && (
          <div className="g-field g-guests">
            <span id={`${ids}-guests`} className="g-label">
              {t.rsvp.guests}
            </span>
            <div role="group" aria-labelledby={`${ids}-guests`} className="g-stepper">
              <button type="button" aria-label={t.rsvp.guestsLess} disabled={guests <= 1} onClick={form.removeGuest}>
                −
              </button>
              <output aria-live="polite">{guests}</output>
              <button type="button" aria-label={t.rsvp.guestsMore} disabled={guests >= maxGuests} onClick={form.addGuest}>
                +
              </button>
            </div>
          </div>
        )}

        <div className="g-field">
          <label htmlFor={`${ids}-wish`} className="g-label">
            {t.rsvp.wish}
          </label>
          <textarea
            id={`${ids}-wish`}
            rows={3}
            maxLength={RSVP_LIMITS.wish}
            placeholder={t.rsvp.wishPlaceholder}
            value={wish}
            onChange={(event) => form.setWish(event.target.value)}
            className="g-input g-textarea"
          />
        </div>

        <div className="g-submit">
          <button type="submit" className="g-open g-open-still" aria-busy={sending} disabled={sending}>
            {sending ? t.rsvp.sending : t.rsvp.submit}
          </button>
          <p role="alert" className="g-error">
            {status === 'error' ? t.rsvp.error : ''}
          </p>
        </div>
      </form>
    </GardenSection>
  );
}
