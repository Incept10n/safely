import { getMockedMessages, getMockUsers } from './mock';
import type { Message, Person } from './store/types';

export const createChatApi = () => {
  const fetchFriends = (): Promise<Person[]> => {
    return new Promise((resolve) => resolve(getMockUsers()));
  };

  const fetchMessages = (): Promise<Message[]> => {
    return new Promise((resolve) => resolve(getMockedMessages()));
  };

  return { fetchFriends, fetchMessages };
};
