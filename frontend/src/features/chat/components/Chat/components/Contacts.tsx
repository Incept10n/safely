import { useAuth } from '@/features/auth/store';
import { createChatApi } from '@/features/chat/api';
import { useChat } from '@/features/chat/store';
import type { Person } from '@/features/chat/store/types';
import {
  Avatar,
  Conversation,
  ConversationList,
  Search,
  Sidebar,
} from '@chatscope/chat-ui-kit-react';
import { AddContactButton } from './AddContactButton';
import { UserInfo } from './UserInfo';

export const Contacts = () => {
  const chat = useChat();
  const { user } = useAuth();
  const api = createChatApi(user?.userId || '');

  const handleConversationClick = async (person: Person) => {
    const messages = await api.fetchMessages(person.chatId);

    chat.setCurrentChat({ messages });

    if (chat.contacts) {
      chat.setContacts(
        chat.contacts.map((contact) => ({
          ...contact,
          active: contact.uid === person.uid,
        })),
      );
    }
  };

  return (
    <Sidebar position="left">
      <UserInfo />
      <Search placeholder="Search..." />
      <AddContactButton />
      <ConversationList loading={chat.loadingContacts}>
        {chat.contacts &&
          chat.contacts.map((person) => (
            <Conversation
              active={person.active}
              info={person.uid}
              name={person.name}
              onClick={() => handleConversationClick(person)}
            >
              <Avatar
                name="Patrik"
                src={person.profilePicture}
                status="invisible"
              />
            </Conversation>
          ))}
      </ConversationList>
    </Sidebar>
  );
};
