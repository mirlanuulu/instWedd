'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Locale } from '@/config/types';
import type { RsvpPayload } from './rsvp';

export type RsvpStatus = 'idle' | 'sending' | 'error' | 'sent';

const REQUEST_TIMEOUT = 15_000;

interface RsvpFormOptions {
  locale: Locale;
  maxGuests: number;
}

/**
 * Состояние и отправка формы RSVP. Логика общая для всех стилей,
 * вёрстка у каждого своя: refs из хука вешаются на поля формы.
 */
export function useRsvpForm({ locale, maxGuests }: RsvpFormOptions) {
  const nameRef = useRef<HTMLInputElement>(null);
  const firstChoiceRef = useRef<HTMLInputElement>(null);
  const thanksRef = useRef<HTMLDivElement>(null);
  const trapRef = useRef<HTMLInputElement>(null);

  const [name, setNameValue] = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guests, setGuests] = useState(1);
  const [wish, setWish] = useState('');
  const [invalid, setInvalid] = useState({ name: false, attending: false });
  const [status, setStatus] = useState<RsvpStatus>('idle');

  const sending = status === 'sending';

  // Форму сменил экран благодарности: фокус переходит на него, чтобы его прочитал скринридер.
  useEffect(() => {
    if (status === 'sent') thanksRef.current?.focus({ preventScroll: true });
  }, [status]);

  function setName(value: string) {
    setNameValue(value);
    if (invalid.name) setInvalid((current) => ({ ...current, name: false }));
  }

  function choose(option: boolean) {
    setAttending(option);
    setInvalid((current) => ({ ...current, attending: false }));
  }

  const addGuest = () => setGuests((count) => Math.min(maxGuests, count + 1));
  const removeGuest = () => setGuests((count) => Math.max(1, count - 1));

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

  return {
    refs: { name: nameRef, firstChoice: firstChoiceRef, thanks: thanksRef, trap: trapRef },
    name,
    attending,
    guests,
    wish,
    invalid,
    status,
    sending,
    maxGuests,
    setName,
    choose,
    setWish,
    addGuest,
    removeGuest,
    submit,
  };
}
