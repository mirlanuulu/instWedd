'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { invite } from '@/config/invite';
import { fireConfetti } from '@/lib/confetti';
import { RSVP_LIMITS, type RsvpPayload } from '@/lib/rsvp';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Button } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';

type Status = 'idle' | 'sending' | 'error' | 'sent';

const REQUEST_TIMEOUT = 15_000;

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
  const { t, locale } = useLocale();
  const ids = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const firstChoiceRef = useRef<HTMLInputElement>(null);
  const thanksRef = useRef<HTMLDivElement>(null);
  const trapRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guests, setGuests] = useState(1);
  const [wish, setWish] = useState('');
  const [invalid, setInvalid] = useState({ name: false, attending: false });
  const [status, setStatus] = useState<Status>('idle');

  const { maxGuests } = invite.rsvp;
  const sending = status === 'sending';

  // Форму сменил экран благодарности: фокус переходит на него, чтобы его прочитал скринридер.
  useEffect(() => {
    if (status !== 'sent' || !thanksRef.current) return;
    thanksRef.current.focus({ preventScroll: true });
    // Конфетти только тем, кто придёт.
    if (attending) fireConfetti(thanksRef.current);
    // После отправки формы уже нет, так что attending больше не меняется.
  }, [status, attending]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (sending) return;

    const problems = { name: name.trim() === '', attending: attending === null };
    setInvalid(problems);
    if (problems.name) return nameRef.current?.focus();
    if (problems.attending || attending === null) return firstChoiceRef.current?.focus();

    const payload: RsvpPayload = { name: name.trim(), attending, guests: attending ? guests : 0, wish: wish.trim(), locale };

    setStatus('sending');
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, trap: trapRef.current?.value ?? '' }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      if (!response.ok) throw new Error(`RSVP failed: ${response.status}`);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    const thanks = attending ? t.rsvp.thanksYes : t.rsvp.thanksNo;
    return (
      <Section surface="alt" labelledBy="rsvp-title">
        <div ref={thanksRef} tabIndex={-1} role="status" data-rsvp-thanks className="py-10 text-center outline-none">
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

      <form noValidate onSubmit={submit} className="mt-10 grid gap-8">
        {/* Ловушка для спам-ботов: человек это поле не видит и не заполняет, сервер такие ответы отбрасывает. */}
        <input
          ref={trapRef}
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
            ref={nameRef}
            id={`${ids}-name`}
            type="text"
            autoComplete="name"
            maxLength={RSVP_LIMITS.name}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (invalid.name) setInvalid((current) => ({ ...current, name: false }));
            }}
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

        <fieldset aria-describedby={invalid.attending ? `${ids}-choice-error` : undefined}>
          <legend className="text-sm text-ink-2">{t.rsvp.attendance}</legend>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {[true, false].map((option) => (
              <label key={String(option)} className={CHOICE}>
                {/* Радио остаётся в потоке внутри подписи: выбор не дёргает прокрутку. */}
                <input
                  ref={option ? firstChoiceRef : undefined}
                  type="radio"
                  name={`${ids}-attending`}
                  checked={attending === option}
                  onChange={() => {
                    setAttending(option);
                    setInvalid((current) => ({ ...current, attending: false }));
                  }}
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
                onClick={() => setGuests((count) => Math.max(1, count - 1))}
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
                onClick={() => setGuests((count) => Math.min(maxGuests, count + 1))}
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
            onChange={(event) => setWish(event.target.value)}
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
