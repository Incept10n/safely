import { create } from 'zustand';
import type { Action, ChatState } from './types';
import { immer } from 'zustand/middleware/immer';

export const useChat = create<ChatState & Action>()(
  immer((set) => ({
    chat: null,
    contacts: null,
    loadingContacts: false,
    loadingChat: false,

    setContacts: (contacts) =>
      set((state) => {
        state.contacts = contacts;
      }),
    setCurrentChat: (chat) =>
      set((state) => {
        state.chat = chat;
      }),
    setLoadingContacts: (isLoading) =>
      set((state) => {
        state.loadingContacts = isLoading;
      }),
    setLoadingChat: (isLoading) =>
      set((state) => {
        state.loadingChat = isLoading;
      }),

    addMessage: (message) =>
      set((state) => {
        if (state.chat) {
          state.chat.messages.push(message);
        }
      }),
  })),
);
