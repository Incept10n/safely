import { useState } from 'react';
import styles from './AddContactModal.module.scss';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (nonce: string) => Promise<void>;
}

export const AddContactModal = ({
  isOpen,
  onClose,
  onCreateChat,
}: AddContactModalProps) => {
  const [nonce, setNonce] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nonce.trim()) {
      setError('Please enter a nonce');
      return;
    }

    setLoading(true);
    try {
      await onCreateChat(nonce);
      setNonce('');
      onClose();
    } catch (err) {
      setError('Failed to add contact. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Add Contact</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="nonce">User's Nonce</label>
            <input
              id="nonce"
              type="text"
              value={nonce}
              onChange={(e) => setNonce(e.target.value)}
              placeholder="Enter user's nonce"
              disabled={loading}
              autoFocus
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
