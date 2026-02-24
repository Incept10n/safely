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

export const Contacts = () => {
  const chat = useChat();
  const api = createChatApi();

  const handleConversationClick = async (person: Person) => {
    const messages = await api.fetchMessages();

    chat.setCurrentChat({ messages });

    chat.setContacts(
      chat.contacts.map((contact) => ({
        ...contact,
        active: contact.uid === person.uid,
      })),
    );
  };

  return (
    <Sidebar position="left">
      <Search placeholder="Search..." />
      <ConversationList loading={Boolean(!chat.contacts.length)}>
        {chat.contacts.map((person) => (
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
