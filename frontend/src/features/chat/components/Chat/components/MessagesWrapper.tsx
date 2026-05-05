import { useChat } from '@/features/chat/store';
import {
  MessageList,
  Message as MessageView,
  Avatar,
} from '@chatscope/chat-ui-kit-react';
import { calculateMessagePosition } from './utils';
import { useAuth } from '@/features/auth/store';
import { auth } from '@/features/auth/jwt';

export const MessagesWrapper = (_: { as?: typeof MessageList }) => {
  return <Messages />;
};

const Messages = () => {
  const chat = useChat();
  const { user } = useAuth();

  const token = auth.getToken();

  if (!user || !token) return;

  const activeUser = chat.contacts
    ? chat.contacts.find((user) => user.active)
    : null;

  return (
    <MessageList>
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
