import type { Nonce, UserId } from '@/shared/types';

// docs on message string
// this is json string that needs to be parsed like this
// [
//   {
//     sender: number
//     message: string
//     timestamp: iso format string
//   }
// ]
export type ResponseMessages = string;
export type ResponseMessageArray = ResponseMessage[];
export type ResponseMessage = {
  sender: number;
  message: string;
  timestamp: string;
};

export type Conversation = {
  ID: number;
  User1: UserId;
  User2: UserId;
};

export type GetConversationsResponse = {
  status: 'success';
  chats: Conversation[];
};

export type CreateChatResponse = {
  nonce: Nonce;
  sender_id: UserId;
};

export type GetUserInfoResponse = {
  status: string;
  nonce: string;
  user_id: UserId;
};

export type GetConversationMessages = {
  status: 'success';
  chat_id: string;
  user1: UserId;
  user2: UserId;
  messages: ResponseMessages;
};

export type CreateChatModel = {
  nonce: Nonce;
  sender_id: UserId;
};
