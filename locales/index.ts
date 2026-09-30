import type { Locale } from '@/config/types';
import { ky } from './ky';
import { ru } from './ru';
import type { Dictionary } from './types';

export const dictionaries: Record<Locale, Dictionary> = { ky, ru };

export type { Dictionary };
