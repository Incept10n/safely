import { create } from "zustand";

import type { Action, ChatState } from "./types";
import { generateDefaultChatState } from "./utils";

export const useChat = create<ChatState, Action>((set) => ({
  chat: generateDefaultChatState(),
}));
