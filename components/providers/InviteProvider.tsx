'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { InviteConfig } from '@/config/types';

const InviteContext = createContext<InviteConfig | null>(null);

/**
 * Контент приглашения для клиентских компонентов. Его кладёт корневой layout
 * каждого адреса: один заказ можно показать в разных стилях, а демо
 * событий — со своим контентом.
 */
export function InviteProvider({ invite, children }: { invite: InviteConfig; children: ReactNode }) {
  return <InviteContext.Provider value={invite}>{children}</InviteContext.Provider>;
}

export function useInvite(): InviteConfig {
  const invite = useContext(InviteContext);
  if (!invite) throw new Error('useInvite нужно вызывать внутри <InviteProvider>');
  return invite;
}
