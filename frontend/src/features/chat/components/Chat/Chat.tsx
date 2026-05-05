import {
  Avatar,
  ChatContainer,
  ConversationHeader,
  MainContainer,
  MessageInput,
  MessageList,
} from '@chatscope/chat-ui-kit-react';
import { useEffect, type FC } from 'react';

import { useChat } from '../../store';
import { Contacts, MessagesWrapper } from './components';
import { createChatApi } from '../../api';
import type { UserId } from '@/shared/types';
import { useWebSocket } from './hooks';

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { useAuth } from '@/features/auth/store';
import { auth } from '@/features/auth/jwt';
import type { MessageHandler } from './hooks/useWebSocket';

export type ChatProps = {
  currentUserId: UserId;
};

export const Chat: FC<ChatProps> = ({ currentUserId }) => {
  const chat = useChat();
  const api = createChatApi(currentUserId);
  const { user } = useAuth();

  const token = auth.getToken();

  if (!user || !token) return;

  const webSocketService = useWebSocket(
    import.meta.env.VITE_WS_URL,
    user.userId,
    token,
  );

  useEffect(() => {
    const fetchFriends = async () => {
      chat.setLoadingContacts(true);
      const friends = await api.fetchFriends();
      chat.setLoadingContacts(false);

      chat.setContacts(friends);
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    const handleReceiveMessage: MessageHandler = (messageBody) => {
      chat.addMessage({
        direction:
          messageBody.senderId === user.userId ? 'outgoing' : 'incoming',
        message: messageBody.content,
      });
    };

    webSocketService?.onMessageReceive(handleReceiveMessage);
  }, [webSocketService]);

  const activeUser = chat.contacts
    ? chat.contacts.find((user) => user.active)
    : null;

  const handleSendMessage = (text: string) => {
    if (webSocketService && activeUser) {
      webSocketService.sendMessage(
        text,
        activeUser.chatId.toString(),
        user.userId,
      );
    }
  };

  return (
    <MainContainer
      responsive
      style={{ width: 'calc(100vw - 16px)', height: 'calc(100vh - 16px)' }}
    >
      <Contacts />
      {chat.chat && activeUser && (
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back />
            <Avatar name={activeUser.name} src={activeUser.profilePicture} />
            <ConversationHeader.Content info={activeUser.uid} userName="User" />
          </ConversationHeader>
          <MessagesWrapper as={MessageList} />
          <MessageInput
            placeholder="Type message here"
            onSend={(_, text) => handleSendMessage(text)}
          />
        </ChatContainer>
      )}
    </MainContainer>
  );
};
