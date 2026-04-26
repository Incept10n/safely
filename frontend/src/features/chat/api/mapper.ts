import type { UserId } from '@/shared/types';
import type { Message } from '../store/types';
import type { ResponseMessage } from './types';

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
  createResponseMessageToViewMessage,
};
