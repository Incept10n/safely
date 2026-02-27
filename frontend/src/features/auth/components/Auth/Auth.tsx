import type { ComponentType, FC } from 'react';
import { useAuth } from '../../store/store';
import { jwtService } from '../../jwt';
import type { UserId } from '@/shared/types';

type ChatLike = {
  currentUserId: UserId;
};

export type AuthProps = {
  ComponentOnAuth: ComponentType<ChatLike>;
};

export const Auth: FC<AuthProps> = ({ ComponentOnAuth }) => {
  const authState = useAuth();

  if (jwtService.isLoggedIn()) {
    // get user info and set user
  }

  if (!authState.user) {
    return <div>authorization page</div>;
  }

  return <ComponentOnAuth currentUserId={authState.user.userId} />;
};
