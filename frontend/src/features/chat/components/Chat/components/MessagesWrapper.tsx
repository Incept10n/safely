import { useChat } from '@/features/chat/store';
import type { Message } from '@/features/chat/store/types';
import {
  MessageList,
  TypingIndicator,
  Message as MessageView,
  Avatar,
} from '@chatscope/chat-ui-kit-react';

type MessageStyle = 'single' | 'first' | 'normal' | 'last' | 0 | 1 | 2 | 3;

export const MessagesWrapper = (_: { as?: typeof MessageList }) => {
  return <Messages />;
};

const Messages = () => {
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

  const activeUser = chat.contacts
    ? chat.contacts.find((user) => user.active)
    : null;

  return (
    <MessageList typingIndicator={<TypingIndicator content="Zoe is typing" />}>
      {chat.chat &&
        activeUser &&
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
              <Avatar name={activeUser.name} src={activeUser.profilePicture} />
            )}
          </MessageView>
        ))}
    </MessageList>
  );
};
