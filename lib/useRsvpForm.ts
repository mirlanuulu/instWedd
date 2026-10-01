'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { SIDES, type Locale, type Side } from '@/config/types';
import type { RsvpPayload } from './rsvp';

export type RsvpStatus = 'idle' | 'sending' | 'error' | 'sent';

const REQUEST_TIMEOUT = 15_000;

interface RsvpFormOptions {
  locale: Locale;
  maxGuests: number;
  /** Спрашивать, чей гость: кыз тарап или бала тарап. */
  askSide: boolean;
  /** Сколько цветов гость собрал в букет — уходит паре вместе с ответом. */
  flowers?: number;
  /**
   * 'ask' — гость выбирает «приду / не смогу»; 'yes' — вопроса нет,
   * отправленный ответ и значит «приду».
   */
  attendance?: 'ask' | 'yes';
}

/** Сторона из ссылки: каждая сторона может разослать свою (?tarap=kyz / ?tarap=bala). */
function sideFromUrl(): Side | null {
  const value = new URLSearchParams(window.location.search).get('tarap');
  return SIDES.find((code) => code === value) ?? null;
}

/**
 * Состояние и отправка формы RSVP. Логика общая для всех стилей,
 * вёрстка у каждого своя: refs из хука вешаются на поля формы.
 */
export function useRsvpForm({ locale, maxGuests, askSide, flowers, attendance = 'ask' }: RsvpFormOptions) {
  const nameRef = useRef<HTMLInputElement>(null);
  const firstChoiceRef = useRef<HTMLInputElement>(null);
  const firstSideRef = useRef<HTMLInputElement>(null);
  const thanksRef = useRef<HTMLDivElement>(null);
  const trapRef = useRef<HTMLInputElement>(null);

  const [name, setNameValue] = useState('');
  const [attending, setAttending] = useState<boolean | null>(attendance === 'yes' ? true : null);
  const [side, setSideValue] = useState<Side | null>(null);
  const [guests, setGuests] = useState(1);
  const [wish, setWish] = useState('');
  const [invalid, setInvalid] = useState({ name: false, side: false, attending: false });
  const [status, setStatus] = useState<RsvpStatus>('idle');

  const sending = status === 'sending';

  // Форму сменил экран благодарности: фокус переходит на него, чтобы его прочитал скринридер.
  useEffect(() => {
    if (status === 'sent') thanksRef.current?.focus({ preventScroll: true });
  }, [status]);

  // Сторона из ссылки подставляется после гидрации: на сервере адреса нет.
  useEffect(() => {
    if (askSide) setSideValue(sideFromUrl());
  }, [askSide]);

  function chooseSide(value: Side) {
    setSideValue(value);
    setInvalid((current) => ({ ...current, side: false }));
  }

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

    const problems = { name: name.trim() === '', side: askSide && side === null, attending: attending === null };
    setInvalid(problems);
    if (problems.name) return nameRef.current?.focus();
    if (problems.side) return firstSideRef.current?.focus();
    if (problems.attending || attending === null) return firstChoiceRef.current?.focus();

    const payload: RsvpPayload = {
      name: name.trim(),
      attending,
      guests: attending ? guests : 0,
      wish: wish.trim(),
      locale,
      side: askSide ? side : null,
      ...(flowers !== undefined && { flowers }),
    };

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
    refs: { name: nameRef, firstChoice: firstChoiceRef, firstSide: firstSideRef, thanks: thanksRef, trap: trapRef },
    name,
    side,
    attending,
    guests,
    wish,
    invalid,
    status,
    sending,
    maxGuests,
    setName,
    chooseSide,
    choose,
    setWish,
    addGuest,
    removeGuest,
    submit,
  };
}
