import { useState } from 'react';
import { useAuth } from '@/features/auth/store';

import { createChatApi } from '@/features/chat/api';
import type { CreateChatModel } from '@/features/chat/api/types';
import { AddContactModal } from './components';

import styles from './AddContactButton.module.scss';
import { useChat } from '@/features/chat/store';

export const AddContactButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const auth = useAuth();
  const chat = useChat();

  if (!auth.user) return;

  const chatApi = createChatApi(auth.user.userId);

  const handleCreateChat = async (nonce: string) => {
    if (auth.user) {
      const createChatModel: CreateChatModel = {
        sender_id: auth.user.userId,
        nonce,
      };

      await chatApi.createChat(createChatModel);
      const newContacts = await chatApi.fetchFriends();
      chat.setContacts(newContacts);
    }
  };

  return (
    <>
      <button className={styles.button} onClick={() => setIsModalOpen(true)}>
        Add contact
      </button>

      <AddContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateChat={handleCreateChat}
      />
    </>
  );
};
