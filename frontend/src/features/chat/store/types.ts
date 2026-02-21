import type { Nullable, UID } from "@/shared/types";

export type Action = {};

export type ChatState = {
  contacts: Person[];
  chat: Nullable<Chat>;
};

export type Person = {
  uid: UID;
  name: string;
  profilePicture: string;
};

export type Chat = {
  messages: Message[];
};

export type MessageType = "receiving" | "sending";

export type Message = {
  messageType: MessageType;
  content: string;
};
