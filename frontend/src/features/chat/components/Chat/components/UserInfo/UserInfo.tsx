import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/store';

import styles from './UserInfo.module.scss';
import { createChatApi } from '@/features/chat/api';

export const UserInfo = () => {
  const { user, setUser } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!user) return;

  const chatApi = createChatApi(user.userId);

  useEffect(() => {
    const loadUserInfo = async () => {
      const { nonce } = await chatApi.getUserInfo();

      setUser({ ...user, nonce });
    };

    loadUserInfo();
  }, []);

  const copyNonce = async () => {
    if (user.nonce) {
      await navigator.clipboard.writeText(user.nonce);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={styles.userInfo}>
      <div className={styles.avatar}>
        <img src={user.logoUrl} alt={user.name} />
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{user.name}</h3>
        <div className={styles.nonce} onClick={copyNonce}>
          <span className={styles.nonceLabel}>Your nonce:</span>
          <span className={styles.nonceValue}>{user.nonce}</span>
          <button className={styles.copyBtn}>{copied ? '✓' : '📋'}</button>
        </div>
      </div>
    </div>
  );
};
