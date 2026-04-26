import type { Nullable, Nonce, ChatId } from '@/shared/types';

export type Action = {
  setContacts: (contacts: Person[]) => void;
  setCurrentChat: (chat: Nullable<Chat>) => void;

  setLoadingContacts: (isLoading: boolean) => void;
  setLoadingChat: (isLoading: boolean) => void;
};

export type ChatState = {
  contacts: Nullable<Person[]>;
  chat: Nullable<Chat>;

  loadingContacts: boolean;
  loadingChat: boolean;
};

export type Person = {
  chatId: ChatId;
  uid: Nonce;
  name: string;
  profilePicture: string;
  active: boolean;
};

export type Chat = {
  messages: Message[];
};

export type MessageType = 'incoming' | 'outgoing';

export type Message = {
  direction: MessageType;
  message: string;
};
