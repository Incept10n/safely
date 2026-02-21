import type { ChatState } from "./types";

export const generateDefaultChatState = (): ChatState => ({
  chat: null,
  contacts: [],
});
