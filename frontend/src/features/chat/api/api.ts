import { chatMocks } from './mock';
import type { Message, Person } from '../store/types';
import { appConfig, randomPersonURL } from '@/shared/constants';
import type { UserId } from '@/shared/types';
import api from '@/shared/api';

import type {
  CreateChatModel,
  CreateChatResponse,
  GetConversationMessages,
  GetConversationsResponse,
  GetUserInfoResponse,
} from './types';
import { chatApiMapper } from './mapper';
import { messageParser } from './messageParser';

export const createChatApi = (currentUserId: UserId) => {
  const fetchFriends = async (): Promise<Person[]> => {
    if (appConfig.MOCK_API) {
      return await chatMocks.getUsers();
    }

    const response = await api.get<GetConversationsResponse>(
      `/api/chats?userId=${currentUserId}`,
    );

    const contacts: Person[] = [];

    if (!response.data.chats) return contacts;

    for (const chat of response.data.chats) {
      const otherUserId =
        parseInt(chat.User1) === parseInt(currentUserId)
          ? chat.User2
          : chat.User1;
      const contactInfoResponse = await api.get<GetUserInfoResponse>(
        `/api/${otherUserId}`,
      );

      const contact: Person = {
        profilePicture: randomPersonURL,
        active: false,
        chatId: chat.ID,
        name: 'user',
        uid: contactInfoResponse.data.nonce,
      };

      contacts.push(contact);
    }

    return contacts;
  };

  const fetchMessages = async (chatId: number): Promise<Message[]> => {
    if (appConfig.MOCK_API) {
      return await chatMocks.getMessages();
    }

    const response = await api.get<GetConversationMessages>(
      `/api/chat/${chatId}`,
    );

    const responseMessageToViewMessage =
      chatApiMapper.createResponseMessageToViewMessage(currentUserId);

    return messageParser
      .parse(response.data.messages)
      .map(responseMessageToViewMessage);
  };

  const getUserInfo = async (): Promise<GetUserInfoResponse> => {
    const response = await api.get<GetUserInfoResponse>(
      `/api/${currentUserId}`,
    );

    return response.data;
  };

  const createChat = async (
    createChatModel: CreateChatModel,
  ): Promise<CreateChatResponse> => {
    const response = await api.post('/api/createchat', createChatModel);

    return response.data;
  };

  return { fetchFriends, fetchMessages, getUserInfo, createChat };
};
