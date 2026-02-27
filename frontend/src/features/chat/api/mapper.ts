import type { UserId } from '@/shared/types';
import type { Message, Person } from '../store/types';
import type { Conversation, ResponseMessage } from './types';

const conversationToUser = (conversation: Conversation): Person => ({
  active: false,
  name: conversation.User2,
  profilePicture: '',
  uid: conversation.ID.toString(),
});

const responseMessageToViewMessage = (
  responseMessage: ResponseMessage,
  currentUserId: UserId,
): Message => ({
  message: responseMessage.message,
  direction:
    currentUserId === responseMessage.sender.toString()
      ? 'outgoing'
      : 'incoming',
});

const createResponseMessageToViewMessage =
  (currentUserId: UserId) => (responseMessage: ResponseMessage) =>
    responseMessageToViewMessage(responseMessage, currentUserId);

export const chatApiMapper = {
  conversationToUser,
  createResponseMessageToViewMessage,
};
