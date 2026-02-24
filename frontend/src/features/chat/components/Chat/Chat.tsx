import {
  Avatar,
  ChatContainer,
  ConversationHeader,
  MainContainer,
  MessageInput,
  MessageList,
} from '@chatscope/chat-ui-kit-react';
import { useEffect } from 'react';

import { useChat } from '../../store';
import { createChatApi } from '../../api';
import { Contacts, Messages } from './components';
import { getActiveUser } from './utils';

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const MessagesWrapper = (props: { as?: typeof MessageList }) => {
  return <Messages />;
};

export const Chat = () => {
  const chat = useChat();
  const api = createChatApi();

  useEffect(() => {
    const fetchFriends = async () => {
      const friends = await api.fetchFriends();

      chat.setContacts(friends);
    };

    fetchFriends();
  }, []);

  return (
    <MainContainer
      responsive
      style={{ width: 'calc(100vw - 16px)', height: 'calc(100vh - 16px)' }}
    >
      <Contacts />
      {chat.chat && (
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back />
            <Avatar
              name={getActiveUser(chat.contacts)?.name}
              src={getActiveUser(chat.contacts)?.profilePicture}
            />
            <ConversationHeader.Content
              info="Active 10 mins ago"
              userName="Zoe"
            />
          </ConversationHeader>
          <MessagesWrapper as={MessageList} />
          <MessageInput placeholder="Type message here" />
        </ChatContainer>
      )}
    </MainContainer>
  );
};
