import type { Message } from '@/features/chat/store/types';

export type MessageStyle =
  | 'single'
  | 'first'
  | 'normal'
  | 'last'
  | 0
  | 1
  | 2
  | 3;

export const calculateMessagePosition = (
  previousMessage: Message,
  currentMessage: Message,
  nextMessage: Message,
): MessageStyle => {
  if (
    (!previousMessage ||
      currentMessage.direction !== previousMessage.direction) &&
    (!nextMessage || currentMessage.direction !== nextMessage.direction)
  ) {
    return 'single';
  }

  if (
    (!previousMessage ||
      currentMessage.direction !== previousMessage.direction) &&
    nextMessage &&
    currentMessage.direction === nextMessage.direction
  ) {
    return 'first';
  }

  if (
    previousMessage &&
    currentMessage.direction === previousMessage.direction &&
    nextMessage &&
    currentMessage.direction !== nextMessage.direction
  ) {
    return 'last';
  }

  return 'normal';
};
