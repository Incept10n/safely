import { create } from 'zustand';
import type { Action, ChatState } from './types';

export const useChat = create<ChatState & Action>((set) => ({
  chat: null,
  contacts: null,
  loadingContacts: false,
  loadingChat: false,

  setContacts: (contacts) => set(() => ({ contacts })),
  setCurrentChat: (chat) => set(() => ({ chat })),
  setLoadingContacts: (isLoading) =>
    set(() => ({ loadingContacts: isLoading })),
  setLoadingChat: (isLoading) => set(() => ({ loadingChat: isLoading })),
}));
