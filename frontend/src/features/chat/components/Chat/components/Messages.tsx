import { useChat } from '@/features/chat/store';
import type { Message } from '@/features/chat/store/types';
import {
  MessageList,
  TypingIndicator,
  Message as MessageView,
  Avatar,
} from '@chatscope/chat-ui-kit-react';
import { getActiveUser } from '../utils';

type MessageStyle = 'single' | 'first' | 'normal' | 'last' | 0 | 1 | 2 | 3;

export const Messages = () => {
  const chat = useChat();

  const calculateMessagePosition = (
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

  return (
    <MessageList typingIndicator={<TypingIndicator content="Zoe is typing" />}>
      {chat.chat &&
        chat.chat.messages.map((message, index, messageArray) => (
          <MessageView
            key={index}
            model={{
              direction: message.direction,
              message: message.message,
              position: calculateMessagePosition(
                messageArray[index - 1],
                messageArray[index],
                messageArray[index + 1],
              ),
              sender: 'Zoe',
              sentTime: '15 mins ago',
            }}
          >
            {message.direction === 'incoming' && (
              <Avatar
                name={getActiveUser(chat.contacts)?.name}
                src={getActiveUser(chat.contacts)?.profilePicture}
              />
            )}
          </MessageView>
        ))}
    </MessageList>
  );
};
