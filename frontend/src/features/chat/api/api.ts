import axios from 'axios';

import { chatMocks } from './mock';
import type { Message, Person } from '../store/types';
import { appConfig } from '@/shared/constants';
import type { UserId } from '@/shared/types';
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

    const response = await axios.get<GetConversationsResponse>(
      `/api/chats?userId=${currentUserId}`,
    );

    return response.data.chats.map(chatApiMapper.conversationToUser);
  };

  const fetchMessages = async (chatId: string): Promise<Message[]> => {
    if (appConfig.MOCK_API) {
      return await chatMocks.getMessages();
    }

    const response = await axios.get<GetConversationMessages>(
      `/api/chat/${chatId}`,
    );

    const responseMessageToViewMessage =
      chatApiMapper.createResponseMessageToViewMessage(currentUserId);

    return messageParser
      .parse(response.data.messages)
      .map(responseMessageToViewMessage);
  };

  const getUserInfo = async (): Promise<GetUserInfoResponse> => {
    const response = await axios.get<GetUserInfoResponse>(
      `/api/${currentUserId}`,
    );

    return response.data;
  };

  const createChat = async (
    createChatModel: CreateChatModel,
  ): Promise<CreateChatResponse> => {
    const response = await axios.post('/api/createchat', createChatModel);

    return response.data;
  };

  return { fetchFriends, fetchMessages, getUserInfo, createChat };
};
