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

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

export type ChatProps = {
  currentUserId: UserId;
};

export const Chat: FC<ChatProps> = ({ currentUserId }) => {
  const chat = useChat();
  const api = createChatApi(currentUserId);

  useEffect(() => {
    const fetchFriends = async () => {
      chat.setLoadingContacts(true);
      const friends = await api.fetchFriends();
      chat.setLoadingContacts(false);

      chat.setContacts(friends);
    };

    fetchFriends();
  }, []);

  const activeUser = chat.contacts
    ? chat.contacts.find((user) => user.active)
    : null;

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
          <MessageInput placeholder="Type message here" />
        </ChatContainer>
      )}
    </MainContainer>
  );
};
