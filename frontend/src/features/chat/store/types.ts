import type { Nullable, UID } from '@/shared/types';

export type Action = {
  setContacts: (contacts: Person[]) => void;
  setCurrentChat: (chat: Nullable<Chat>) => void;
};

export type ChatState = {
  contacts: Person[];
  chat: Nullable<Chat>;
};

export type Person = {
  uid: UID;
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
